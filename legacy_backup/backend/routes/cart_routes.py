"""
Cart routes for Aleesa Ethnic Wear
"""
from fastapi import APIRouter, HTTPException, Request, Response, Depends
from datetime import datetime, timezone
from typing import Optional
import uuid

from models import CartItemInput, CartResponse, Cart, CartItem
from auth import get_current_user, get_session_id

router = APIRouter(prefix="/cart", tags=["Cart"])


def get_db(request: Request):
    return request.app.state.db


async def get_or_create_cart(db, user_id: Optional[str], session_id: str) -> dict:
    """Get existing cart or create new one"""
    cart = None
    
    if user_id:
        cart = await db.carts.find_one({"user_id": user_id}, {"_id": 0})
    
    if not cart and session_id:
        cart = await db.carts.find_one({"session_id": session_id, "user_id": None}, {"_id": 0})
    
    if not cart:
        cart = {
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "session_id": session_id if not user_id else None,
            "items": [],
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        await db.carts.insert_one(cart)
    
    return cart


def calculate_cart_totals(cart: dict) -> tuple:
    """Calculate subtotal and item count"""
    subtotal = sum(item["unit_price"] * item["quantity"] for item in cart.get("items", []))
    item_count = sum(item["quantity"] for item in cart.get("items", []))
    return subtotal, item_count


@router.get("", response_model=CartResponse)
async def get_cart(
    request: Request,
    response: Response,
    user: Optional[dict] = Depends(get_current_user)
):
    """Get current cart"""
    db = get_db(request)
    session_id = get_session_id(request)
    
    # Set session cookie if not exists
    if not request.cookies.get("session_id"):
        response.set_cookie(
            key="session_id",
            value=session_id,
            httponly=True,
            secure=True,
            samesite="lax",
            max_age=30 * 24 * 60 * 60  # 30 days
        )
    
    user_id = user["id"] if user else None
    cart = await get_or_create_cart(db, user_id, session_id)
    
    subtotal, item_count = calculate_cart_totals(cart)
    
    return CartResponse(
        cart=Cart(**cart),
        subtotal=subtotal,
        item_count=item_count
    )


@router.post("/items", response_model=CartResponse)
async def add_to_cart(
    data: CartItemInput,
    request: Request,
    response: Response,
    user: Optional[dict] = Depends(get_current_user)
):
    """Add item to cart"""
    db = get_db(request)
    session_id = get_session_id(request)
    
    # Set session cookie
    if not request.cookies.get("session_id"):
        response.set_cookie(
            key="session_id",
            value=session_id,
            httponly=True,
            secure=True,
            samesite="lax",
            max_age=30 * 24 * 60 * 60
        )
    
    # Validate product and get details
    product = await db.products.find_one({"id": data.product_id, "is_active": True}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Find variant
    variant = None
    for v in product.get("variants", []):
        if v["id"] == data.variant_id:
            variant = v
            break
    
    if not variant:
        raise HTTPException(status_code=404, detail="Variant not found")
    
    # Find size and check stock
    size_info = None
    for s in variant.get("sizes", []):
        if s["size"].upper() == data.size.upper():
            size_info = s
            break
    
    if not size_info:
        raise HTTPException(status_code=404, detail="Size not found")
    
    if size_info.get("stock_qty", 0) < data.quantity:
        raise HTTPException(status_code=400, detail="Insufficient stock")
    
    # Get or create cart
    user_id = user["id"] if user else None
    cart = await get_or_create_cart(db, user_id, session_id)
    
    # Get price (use sale_price if available)
    unit_price = product.get("sale_price") or product["price"]
    
    # Get first image from variant
    image = variant["images"][0] if variant.get("images") else None
    
    # Check if item already exists
    item_key = f"{data.product_id}_{data.variant_id}_{data.size.upper()}"
    existing_idx = None
    for idx, item in enumerate(cart.get("items", [])):
        if f"{item['product_id']}_{item['variant_id']}_{item['size']}" == item_key:
            existing_idx = idx
            break
    
    if existing_idx is not None:
        # Update quantity
        new_qty = min(cart["items"][existing_idx]["quantity"] + data.quantity, 10)
        if new_qty > size_info.get("stock_qty", 0):
            raise HTTPException(status_code=400, detail="Insufficient stock")
        cart["items"][existing_idx]["quantity"] = new_qty
        cart["items"][existing_idx]["unit_price"] = unit_price
    else:
        # Add new item
        new_item = {
            "id": str(uuid.uuid4()),
            "product_id": data.product_id,
            "variant_id": data.variant_id,
            "size": data.size.upper(),
            "quantity": data.quantity,
            "unit_price": unit_price,
            "product_name": product["name"],
            "color": variant.get("color", ""),
            "image": image
        }
        cart["items"].append(new_item)
    
    # Update cart
    cart["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    if user_id:
        await db.carts.update_one({"user_id": user_id}, {"$set": {"items": cart["items"], "updated_at": cart["updated_at"]}})
    else:
        await db.carts.update_one({"session_id": session_id, "user_id": None}, {"$set": {"items": cart["items"], "updated_at": cart["updated_at"]}})
    
    subtotal, item_count = calculate_cart_totals(cart)
    
    return CartResponse(
        cart=Cart(**cart),
        subtotal=subtotal,
        item_count=item_count
    )


@router.patch("/items/{item_id}", response_model=CartResponse)
async def update_cart_item(
    item_id: str,
    request: Request,
    user: Optional[dict] = Depends(get_current_user)
):
    """Update cart item quantity"""
    db = get_db(request)
    session_id = get_session_id(request)
    
    # Get request body
    body = await request.json()
    quantity = body.get("quantity", 1)
    
    if quantity < 1 or quantity > 10:
        raise HTTPException(status_code=400, detail="Quantity must be between 1 and 10")
    
    # Get cart
    user_id = user["id"] if user else None
    cart = None
    
    if user_id:
        cart = await db.carts.find_one({"user_id": user_id}, {"_id": 0})
    if not cart:
        cart = await db.carts.find_one({"session_id": session_id, "user_id": None}, {"_id": 0})
    
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    
    # Find and update item
    item_found = False
    for idx, item in enumerate(cart.get("items", [])):
        if item["id"] == item_id:
            # Check stock
            product = await db.products.find_one({"id": item["product_id"]}, {"_id": 0})
            if product:
                for v in product.get("variants", []):
                    if v["id"] == item["variant_id"]:
                        for s in v.get("sizes", []):
                            if s["size"].upper() == item["size"].upper():
                                if s.get("stock_qty", 0) < quantity:
                                    raise HTTPException(status_code=400, detail="Insufficient stock")
                                break
                        break
            
            cart["items"][idx]["quantity"] = quantity
            item_found = True
            break
    
    if not item_found:
        raise HTTPException(status_code=404, detail="Item not found in cart")
    
    cart["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    if user_id:
        await db.carts.update_one({"user_id": user_id}, {"$set": {"items": cart["items"], "updated_at": cart["updated_at"]}})
    else:
        await db.carts.update_one({"session_id": session_id, "user_id": None}, {"$set": {"items": cart["items"], "updated_at": cart["updated_at"]}})
    
    subtotal, item_count = calculate_cart_totals(cart)
    
    return CartResponse(
        cart=Cart(**cart),
        subtotal=subtotal,
        item_count=item_count
    )


@router.delete("/items/{item_id}", response_model=CartResponse)
async def remove_cart_item(
    item_id: str,
    request: Request,
    user: Optional[dict] = Depends(get_current_user)
):
    """Remove item from cart"""
    db = get_db(request)
    session_id = get_session_id(request)
    
    # Get cart
    user_id = user["id"] if user else None
    cart = None
    
    if user_id:
        cart = await db.carts.find_one({"user_id": user_id}, {"_id": 0})
    if not cart:
        cart = await db.carts.find_one({"session_id": session_id, "user_id": None}, {"_id": 0})
    
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    
    # Remove item
    original_len = len(cart.get("items", []))
    cart["items"] = [item for item in cart.get("items", []) if item["id"] != item_id]
    
    if len(cart["items"]) == original_len:
        raise HTTPException(status_code=404, detail="Item not found in cart")
    
    cart["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    if user_id:
        await db.carts.update_one({"user_id": user_id}, {"$set": {"items": cart["items"], "updated_at": cart["updated_at"]}})
    else:
        await db.carts.update_one({"session_id": session_id, "user_id": None}, {"$set": {"items": cart["items"], "updated_at": cart["updated_at"]}})
    
    subtotal, item_count = calculate_cart_totals(cart)
    
    return CartResponse(
        cart=Cart(**cart),
        subtotal=subtotal,
        item_count=item_count
    )


@router.delete("", response_model=CartResponse)
async def clear_cart(
    request: Request,
    user: Optional[dict] = Depends(get_current_user)
):
    """Clear all items from cart"""
    db = get_db(request)
    session_id = get_session_id(request)
    
    user_id = user["id"] if user else None
    
    if user_id:
        await db.carts.update_one(
            {"user_id": user_id},
            {"$set": {"items": [], "updated_at": datetime.now(timezone.utc).isoformat()}}
        )
        cart = await db.carts.find_one({"user_id": user_id}, {"_id": 0})
    else:
        await db.carts.update_one(
            {"session_id": session_id, "user_id": None},
            {"$set": {"items": [], "updated_at": datetime.now(timezone.utc).isoformat()}}
        )
        cart = await db.carts.find_one({"session_id": session_id, "user_id": None}, {"_id": 0})
    
    if not cart:
        cart = await get_or_create_cart(db, user_id, session_id)
    
    return CartResponse(
        cart=Cart(**cart),
        subtotal=0,
        item_count=0
    )
