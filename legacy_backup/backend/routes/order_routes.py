"""
Order routes for Aleesa Ethnic Wear
"""
from fastapi import APIRouter, HTTPException, Request, Depends
from datetime import datetime, timezone
from typing import List
import uuid
import random
import string

from models import (
    OrderCreate, Order, OrderResponse, OrdersListResponse,
    OrderItemSnapshot, AddressSnapshot, Address
)
from auth import require_auth, require_admin

router = APIRouter(prefix="/orders", tags=["Orders"])


def get_db(request: Request):
    return request.app.state.db


def generate_order_number() -> str:
    """Generate unique order number"""
    prefix = "ALE"
    timestamp = datetime.now(timezone.utc).strftime("%y%m%d")
    random_part = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
    return f"{prefix}{timestamp}{random_part}"


@router.post("/validate")
async def validate_checkout(request: Request, user: dict = Depends(require_auth)):
    """Validate cart before checkout"""
    db = get_db(request)
    
    # Get user cart
    cart = await db.carts.find_one({"user_id": user["id"]}, {"_id": 0})
    if not cart or not cart.get("items"):
        raise HTTPException(status_code=400, detail="Cart is empty")
    
    # Validate each item
    errors = []
    validated_items = []
    subtotal = 0
    
    for item in cart["items"]:
        product = await db.products.find_one({"id": item["product_id"], "is_active": True}, {"_id": 0})
        if not product:
            errors.append(f"{item['product_name']} is no longer available")
            continue
        
        # Find variant and size
        variant = None
        for v in product.get("variants", []):
            if v["id"] == item["variant_id"]:
                variant = v
                break
        
        if not variant:
            errors.append(f"{item['product_name']} variant is no longer available")
            continue
        
        size_info = None
        for s in variant.get("sizes", []):
            if s["size"].upper() == item["size"].upper():
                size_info = s
                break
        
        if not size_info:
            errors.append(f"{item['product_name']} size {item['size']} is no longer available")
            continue
        
        if size_info.get("stock_qty", 0) < item["quantity"]:
            errors.append(f"{item['product_name']} has only {size_info.get('stock_qty', 0)} in stock")
            continue
        
        # Update price if changed
        current_price = product.get("sale_price") or product["price"]
        
        validated_items.append({
            **item,
            "unit_price": current_price,
            "stock_available": size_info.get("stock_qty", 0)
        })
        subtotal += current_price * item["quantity"]
    
    if errors:
        return {
            "valid": False,
            "errors": errors,
            "items": validated_items,
            "subtotal": subtotal
        }
    
    # Get user addresses
    addresses = await db.addresses.find({"user_id": user["id"]}, {"_id": 0}).to_list(100)
    
    return {
        "valid": True,
        "items": validated_items,
        "subtotal": subtotal,
        "shipping_cost": 0 if subtotal >= 2000 else 99,  # Free shipping above ₹2000
        "addresses": addresses
    }


@router.post("", response_model=OrderResponse)
async def create_order(data: OrderCreate, request: Request, user: dict = Depends(require_auth)):
    """Create new order (COD only)"""
    db = get_db(request)
    
    # Check idempotency
    if data.idempotency_key:
        existing = await db.orders.find_one({"idempotency_key": data.idempotency_key}, {"_id": 0})
        if existing:
            return OrderResponse(order=Order(**existing))
    
    # Get user cart
    cart = await db.carts.find_one({"user_id": user["id"]}, {"_id": 0})
    if not cart or not cart.get("items"):
        raise HTTPException(status_code=400, detail="Cart is empty")
    
    # Get shipping address
    address = await db.addresses.find_one({"id": data.address_id, "user_id": user["id"]}, {"_id": 0})
    if not address:
        raise HTTPException(status_code=404, detail="Address not found")
    
    # Validate and lock stock
    order_items = []
    subtotal = 0
    
    for item in cart["items"]:
        product = await db.products.find_one({"id": item["product_id"], "is_active": True}, {"_id": 0})
        if not product:
            raise HTTPException(status_code=400, detail=f"{item['product_name']} is no longer available")
        
        # Find variant
        variant = None
        variant_idx = None
        for idx, v in enumerate(product.get("variants", [])):
            if v["id"] == item["variant_id"]:
                variant = v
                variant_idx = idx
                break
        
        if not variant:
            raise HTTPException(status_code=400, detail=f"{item['product_name']} variant not found")
        
        # Find and update size stock
        size_idx = None
        for idx, s in enumerate(variant.get("sizes", [])):
            if s["size"].upper() == item["size"].upper():
                if s.get("stock_qty", 0) < item["quantity"]:
                    raise HTTPException(status_code=400, detail=f"Insufficient stock for {item['product_name']}")
                size_idx = idx
                break
        
        if size_idx is None:
            raise HTTPException(status_code=400, detail=f"Size {item['size']} not found")
        
        # Deduct stock
        new_stock = product["variants"][variant_idx]["sizes"][size_idx]["stock_qty"] - item["quantity"]
        await db.products.update_one(
            {"id": item["product_id"]},
            {"$set": {f"variants.{variant_idx}.sizes.{size_idx}.stock_qty": new_stock}}
        )
        
        # Get current price
        current_price = product.get("sale_price") or product["price"]
        image = variant["images"][0] if variant.get("images") else None
        
        order_items.append(OrderItemSnapshot(
            product_id=item["product_id"],
            variant_id=item["variant_id"],
            product_name=product["name"],
            color=variant.get("color", ""),
            size=item["size"].upper(),
            quantity=item["quantity"],
            unit_price=current_price,
            image=image
        ))
        
        subtotal += current_price * item["quantity"]
    
    # Calculate shipping
    shipping_cost = 0 if subtotal >= 2000 else 99
    total = subtotal + shipping_cost
    
    # Create address snapshot
    address_snapshot = AddressSnapshot(
        full_name=address["full_name"],
        phone=address["phone"],
        address_line1=address["address_line1"],
        address_line2=address.get("address_line2"),
        city=address["city"],
        state=address["state"],
        postal_code=address["postal_code"],
        country=address.get("country", "India")
    )
    
    # Create order
    order = Order(
        id=str(uuid.uuid4()),
        order_number=generate_order_number(),
        user_id=user["id"],
        status="confirmed",
        payment_method="cod",
        payment_status="pending",
        items=[item.model_dump() for item in order_items],
        shipping_address=address_snapshot.model_dump(),
        subtotal=subtotal,
        shipping_cost=shipping_cost,
        total=total,
        idempotency_key=data.idempotency_key,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc)
    )
    
    order_doc = order.model_dump()
    order_doc["created_at"] = order_doc["created_at"].isoformat()
    order_doc["updated_at"] = order_doc["updated_at"].isoformat()
    
    await db.orders.insert_one(order_doc)
    
    # Clear cart
    await db.carts.update_one(
        {"user_id": user["id"]},
        {"$set": {"items": [], "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    return OrderResponse(order=order)


@router.get("", response_model=OrdersListResponse)
async def get_orders(
    request: Request,
    user: dict = Depends(require_auth),
    page: int = 1,
    page_size: int = 10
):
    """Get user's orders"""
    db = get_db(request)
    
    filter_query = {"user_id": user["id"]}
    total = await db.orders.count_documents(filter_query)
    
    skip = (page - 1) * page_size
    orders = await db.orders.find(filter_query, {"_id": 0}).sort("created_at", -1).skip(skip).limit(page_size).to_list(page_size)
    
    # Parse datetime strings
    for order in orders:
        if isinstance(order.get("created_at"), str):
            order["created_at"] = datetime.fromisoformat(order["created_at"])
        if isinstance(order.get("updated_at"), str):
            order["updated_at"] = datetime.fromisoformat(order["updated_at"])
    
    return OrdersListResponse(
        orders=orders,
        total=total,
        page=page,
        page_size=page_size
    )


@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(order_id: str, request: Request, user: dict = Depends(require_auth)):
    """Get single order"""
    db = get_db(request)
    
    order = await db.orders.find_one({"id": order_id, "user_id": user["id"]}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if isinstance(order.get("created_at"), str):
        order["created_at"] = datetime.fromisoformat(order["created_at"])
    if isinstance(order.get("updated_at"), str):
        order["updated_at"] = datetime.fromisoformat(order["updated_at"])
    
    return OrderResponse(order=Order(**order))
