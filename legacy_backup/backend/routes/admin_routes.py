"""
Admin routes for Aleesa Ethnic Wear
"""
from fastapi import APIRouter, HTTPException, Request, Depends, Query
from datetime import datetime, timezone
from typing import Optional

from models import Order, OrdersListResponse
from auth import require_admin

router = APIRouter(prefix="/admin", tags=["Admin"])


def get_db(request: Request):
    return request.app.state.db


@router.get("/orders", response_model=OrdersListResponse)
async def get_all_orders(
    request: Request,
    user: dict = Depends(require_admin),
    status: Optional[str] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100)
):
    """Get all orders (admin only)"""
    db = get_db(request)
    
    filter_query = {}
    if status:
        filter_query["status"] = status
    
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


@router.patch("/orders/{order_id}")
async def update_order_status(
    order_id: str,
    request: Request,
    user: dict = Depends(require_admin)
):
    """Update order status (admin only)"""
    db = get_db(request)
    
    body = await request.json()
    status = body.get("status")
    payment_status = body.get("payment_status")
    notes = body.get("notes")
    
    valid_statuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]
    valid_payment_statuses = ["pending", "paid", "refunded"]
    
    if status and status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")
    
    if payment_status and payment_status not in valid_payment_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid payment status. Must be one of: {valid_payment_statuses}")
    
    order = await db.orders.find_one({"id": order_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    update = {"updated_at": datetime.now(timezone.utc).isoformat()}
    if status:
        update["status"] = status
    if payment_status:
        update["payment_status"] = payment_status
    if notes is not None:
        update["notes"] = notes
    
    await db.orders.update_one({"id": order_id}, {"$set": update})
    
    updated = await db.orders.find_one({"id": order_id}, {"_id": 0})
    if isinstance(updated.get("created_at"), str):
        updated["created_at"] = datetime.fromisoformat(updated["created_at"])
    if isinstance(updated.get("updated_at"), str):
        updated["updated_at"] = datetime.fromisoformat(updated["updated_at"])
    
    return {"order": updated}


@router.get("/stats")
async def get_dashboard_stats(request: Request, user: dict = Depends(require_admin)):
    """Get dashboard statistics"""
    db = get_db(request)
    
    total_orders = await db.orders.count_documents({})
    pending_orders = await db.orders.count_documents({"status": "pending"})
    confirmed_orders = await db.orders.count_documents({"status": "confirmed"})
    processing_orders = await db.orders.count_documents({"status": "processing"})
    delivered_orders = await db.orders.count_documents({"status": "delivered"})
    
    total_users = await db.users.count_documents({"role": "customer"})
    total_products = await db.products.count_documents({"is_active": True})
    
    # Calculate total revenue from delivered orders
    pipeline = [
        {"$match": {"status": "delivered"}},
        {"$group": {"_id": None, "total": {"$sum": "$total"}}}
    ]
    revenue_result = await db.orders.aggregate(pipeline).to_list(1)
    total_revenue = revenue_result[0]["total"] if revenue_result else 0
    
    return {
        "orders": {
            "total": total_orders,
            "pending": pending_orders,
            "confirmed": confirmed_orders,
            "processing": processing_orders,
            "delivered": delivered_orders
        },
        "users": total_users,
        "products": total_products,
        "revenue": total_revenue
    }
