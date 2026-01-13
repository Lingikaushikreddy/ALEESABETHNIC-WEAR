"""
Admin Product routes for Aleesa Ethnic Wear
"""
from fastapi import APIRouter, HTTPException, Request, Depends, Query
from datetime import datetime, timezone
from typing import List, Optional
import uuid

from models import Product, ProductCreate, ProductUpdate
from auth import require_admin

router = APIRouter(prefix="/admin/products", tags=["Admin Products"])


def get_db(request: Request):
    return request.app.state.db


@router.get("", response_model=List[Product])
async def get_all_products(
    request: Request,
    user: dict = Depends(require_admin)
):
    """Get all products (admin only)"""
    db = get_db(request)
    products = await db.products.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return products


@router.post("", response_model=Product)
async def create_product(
    product_in: ProductCreate,
    request: Request,
    user: dict = Depends(require_admin)
):
    """Create a new product (admin only)"""
    db = get_db(request)
    
    # Generate slug if not provided
    if not product_in.slug:
        product_in.slug = product_in.name.lower().replace(" ", "-").replace("'", "")
    
    # Check if slug exists
    existing = await db.products.find_one({"slug": product_in.slug}, {"_id": 0})
    if existing:
        # Append random string to make unique
        product_in.slug = f"{product_in.slug}-{str(uuid.uuid4())[:8]}"
    
    # Generate ID
    new_product = Product(
        **product_in.model_dump(),
        id=str(uuid.uuid4()),
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc)
    )
    
    # Ensure variants have IDs
    for variant in new_product.variants:
        if not variant.id:
            variant.id = str(uuid.uuid4())
    
    await db.products.insert_one(new_product.model_dump())
    
    return new_product


@router.patch("/{product_id}", response_model=Product)
async def update_product(
    product_id: str,
    product_in: ProductUpdate,
    request: Request,
    user: dict = Depends(require_admin)
):
    """Update a product (admin only)"""
    db = get_db(request)
    
    existing = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Product not found")
    
    update_data = product_in.model_dump(exclude_unset=True)
    
    if not update_data:
        return Product(**existing)
    
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    # Handle variant ID generation if variants are updated
    if "variants" in update_data:
        for variant in update_data["variants"]:
            if not variant.get("id"):
                variant["id"] = str(uuid.uuid4())
    
    await db.products.update_one(
        {"id": product_id},
        {"$set": update_data}
    )
    
    updated = await db.products.find_one({"id": product_id}, {"_id": 0})
    
    # Fix datetime parsing
    if isinstance(updated.get("created_at"), str):
        updated["created_at"] = datetime.fromisoformat(updated["created_at"])
    if isinstance(updated.get("updated_at"), str):
        updated["updated_at"] = datetime.fromisoformat(updated["updated_at"])
        
    return Product(**updated)


@router.delete("/{product_id}")
async def delete_product(
    product_id: str,
    request: Request,
    user: dict = Depends(require_admin)
):
    """Delete a product (admin only)"""
    db = get_db(request)
    
    result = await db.products.delete_one({"id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return {"message": "Product deleted successfully"}
