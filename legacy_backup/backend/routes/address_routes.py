"""
Address routes for Aleesa Ethnic Wear
"""
from fastapi import APIRouter, HTTPException, Request, Depends
from datetime import datetime, timezone
from typing import List
import uuid

from models import AddressInput, Address
from auth import require_auth

router = APIRouter(prefix="/addresses", tags=["Addresses"])


def get_db(request: Request):
    return request.app.state.db


@router.get("", response_model=List[Address])
async def get_addresses(request: Request, user: dict = Depends(require_auth)):
    """Get user's addresses"""
    db = get_db(request)
    addresses = await db.addresses.find({"user_id": user["id"]}, {"_id": 0}).to_list(100)
    
    # Parse datetime strings
    for addr in addresses:
        if isinstance(addr.get("created_at"), str):
            addr["created_at"] = datetime.fromisoformat(addr["created_at"])
    
    return addresses


@router.post("", response_model=Address)
async def create_address(data: AddressInput, request: Request, user: dict = Depends(require_auth)):
    """Create new address"""
    db = get_db(request)
    
    # If this is default, unset other defaults
    if data.is_default:
        await db.addresses.update_many(
            {"user_id": user["id"]},
            {"$set": {"is_default": False}}
        )
    
    # Check if this is first address (make it default)
    count = await db.addresses.count_documents({"user_id": user["id"]})
    is_default = data.is_default or count == 0
    
    address = Address(
        id=str(uuid.uuid4()),
        user_id=user["id"],
        full_name=data.full_name,
        phone=data.phone,
        address_line1=data.address_line1,
        address_line2=data.address_line2,
        city=data.city,
        state=data.state,
        postal_code=data.postal_code,
        country=data.country,
        is_default=is_default,
        created_at=datetime.now(timezone.utc)
    )
    
    address_doc = address.model_dump()
    address_doc["created_at"] = address_doc["created_at"].isoformat()
    
    await db.addresses.insert_one(address_doc)
    
    return address


@router.patch("/{address_id}", response_model=Address)
async def update_address(
    address_id: str,
    data: AddressInput,
    request: Request,
    user: dict = Depends(require_auth)
):
    """Update address"""
    db = get_db(request)
    
    address = await db.addresses.find_one({"id": address_id, "user_id": user["id"]}, {"_id": 0})
    if not address:
        raise HTTPException(status_code=404, detail="Address not found")
    
    # If setting as default, unset others
    if data.is_default:
        await db.addresses.update_many(
            {"user_id": user["id"], "id": {"$ne": address_id}},
            {"$set": {"is_default": False}}
        )
    
    update_data = data.model_dump()
    await db.addresses.update_one({"id": address_id}, {"$set": update_data})
    
    updated = await db.addresses.find_one({"id": address_id}, {"_id": 0})
    if isinstance(updated.get("created_at"), str):
        updated["created_at"] = datetime.fromisoformat(updated["created_at"])
    
    return Address(**updated)


@router.delete("/{address_id}")
async def delete_address(address_id: str, request: Request, user: dict = Depends(require_auth)):
    """Delete address"""
    db = get_db(request)
    
    address = await db.addresses.find_one({"id": address_id, "user_id": user["id"]}, {"_id": 0})
    if not address:
        raise HTTPException(status_code=404, detail="Address not found")
    
    await db.addresses.delete_one({"id": address_id})
    
    # If deleted was default, make another default
    if address.get("is_default"):
        other = await db.addresses.find_one({"user_id": user["id"]}, {"_id": 0})
        if other:
            await db.addresses.update_one({"id": other["id"]}, {"$set": {"is_default": True}})
    
    return {"message": "Address deleted"}


@router.post("/{address_id}/default")
async def set_default_address(address_id: str, request: Request, user: dict = Depends(require_auth)):
    """Set address as default"""
    db = get_db(request)
    
    address = await db.addresses.find_one({"id": address_id, "user_id": user["id"]}, {"_id": 0})
    if not address:
        raise HTTPException(status_code=404, detail="Address not found")
    
    # Unset other defaults
    await db.addresses.update_many(
        {"user_id": user["id"]},
        {"$set": {"is_default": False}}
    )
    
    # Set this as default
    await db.addresses.update_one({"id": address_id}, {"$set": {"is_default": True}})
    
    return {"message": "Default address updated"}
