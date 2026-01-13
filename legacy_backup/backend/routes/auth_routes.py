"""
Authentication routes for Aleesa Ethnic Wear
"""
from fastapi import APIRouter, HTTPException, Response, Request, Depends
from datetime import datetime, timezone

from models import UserCreate, UserLogin, UserResponse, TokenResponse
from auth import (
    hash_password, verify_password, create_access_token, 
    create_refresh_token, decode_token, require_auth, get_session_id
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


def get_db(request: Request):
    return request.app.state.db


@router.post("/register", response_model=TokenResponse)
async def register(data: UserCreate, request: Request, response: Response):
    """Register a new user"""
    db = get_db(request)
    
    # Check if email exists
    existing = await db.users.find_one({"email": data.email.lower()})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user_id = str(__import__("uuid").uuid4())
    user_doc = {
        "id": user_id,
        "email": data.email.lower(),
        "password": hash_password(data.password),
        "first_name": data.first_name,
        "last_name": data.last_name,
        "phone": data.phone,
        "role": "customer",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.users.insert_one(user_doc)
    
    # Merge guest cart if exists
    session_id = get_session_id(request)
    if session_id:
        await merge_guest_cart(db, session_id, user_id)
    
    # Create tokens
    access_token = create_access_token(user_id, data.email.lower(), "customer")
    refresh_token = create_refresh_token(user_id)
    
    # Set refresh token cookie
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=7 * 24 * 60 * 60  # 7 days
    )
    
    user_response = UserResponse(
        id=user_id,
        email=data.email.lower(),
        first_name=data.first_name,
        last_name=data.last_name,
        phone=data.phone,
        role="customer",
        created_at=datetime.fromisoformat(user_doc["created_at"])
    )
    
    return TokenResponse(access_token=access_token, user=user_response)


@router.post("/login", response_model=TokenResponse)
async def login(data: UserLogin, request: Request, response: Response):
    """Login user"""
    db = get_db(request)
    
    user = await db.users.find_one({"email": data.email.lower()}, {"_id": 0})
    if not user or not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Merge guest cart if exists
    session_id = get_session_id(request)
    if session_id:
        await merge_guest_cart(db, session_id, user["id"])
    
    # Create tokens
    access_token = create_access_token(user["id"], user["email"], user["role"])
    refresh_token = create_refresh_token(user["id"])
    
    # Set refresh token cookie
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=7 * 24 * 60 * 60
    )
    
    user_response = UserResponse(
        id=user["id"],
        email=user["email"],
        first_name=user["first_name"],
        last_name=user["last_name"],
        phone=user.get("phone"),
        role=user["role"],
        created_at=datetime.fromisoformat(user["created_at"]) if isinstance(user["created_at"], str) else user["created_at"]
    )
    
    return TokenResponse(access_token=access_token, user=user_response)


@router.post("/logout")
async def logout(response: Response):
    """Logout user"""
    response.delete_cookie("refresh_token")
    response.delete_cookie("session_id")
    return {"message": "Logged out successfully"}


@router.post("/refresh")
async def refresh_token(request: Request, response: Response):
    """Refresh access token"""
    db = get_db(request)
    
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token required")
    
    payload = decode_token(refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    
    user_id = payload.get("sub")
    user = await db.users.find_one({"id": user_id}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    # Create new tokens
    access_token = create_access_token(user["id"], user["email"], user["role"])
    new_refresh_token = create_refresh_token(user["id"])
    
    response.set_cookie(
        key="refresh_token",
        value=new_refresh_token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=7 * 24 * 60 * 60
    )
    
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserResponse)
async def get_me(request: Request, user: dict = Depends(require_auth)):
    """Get current user profile"""
    db = get_db(request)
    
    user_doc = await db.users.find_one({"id": user["id"]}, {"_id": 0, "password": 0})
    if not user_doc:
        raise HTTPException(status_code=404, detail="User not found")
    
    return UserResponse(
        id=user_doc["id"],
        email=user_doc["email"],
        first_name=user_doc["first_name"],
        last_name=user_doc["last_name"],
        phone=user_doc.get("phone"),
        role=user_doc["role"],
        created_at=datetime.fromisoformat(user_doc["created_at"]) if isinstance(user_doc["created_at"], str) else user_doc["created_at"]
    )


async def merge_guest_cart(db, session_id: str, user_id: str):
    """Merge guest cart into user cart"""
    # Find guest cart
    guest_cart = await db.carts.find_one({"session_id": session_id, "user_id": None}, {"_id": 0})
    if not guest_cart or not guest_cart.get("items"):
        return
    
    # Find or create user cart
    user_cart = await db.carts.find_one({"user_id": user_id}, {"_id": 0})
    
    if not user_cart:
        # Convert guest cart to user cart
        await db.carts.update_one(
            {"session_id": session_id, "user_id": None},
            {"$set": {"user_id": user_id, "session_id": None}}
        )
    else:
        # Merge items
        existing_items = {f"{i['product_id']}_{i['variant_id']}_{i['size']}": i for i in user_cart.get("items", [])}
        
        for item in guest_cart.get("items", []):
            key = f"{item['product_id']}_{item['variant_id']}_{item['size']}"
            if key in existing_items:
                # Update quantity (max 10)
                new_qty = min(existing_items[key]["quantity"] + item["quantity"], 10)
                existing_items[key]["quantity"] = new_qty
            else:
                existing_items[key] = item
        
        # Update user cart
        await db.carts.update_one(
            {"user_id": user_id},
            {"$set": {
                "items": list(existing_items.values()),
                "updated_at": datetime.now(timezone.utc).isoformat()
            }}
        )
        
        # Delete guest cart
        await db.carts.delete_one({"session_id": session_id, "user_id": None})
