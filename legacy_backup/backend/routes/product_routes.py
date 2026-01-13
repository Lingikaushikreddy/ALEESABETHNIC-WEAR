"""
Product and Category routes for Aleesa Ethnic Wear
"""
from fastapi import APIRouter, HTTPException, Request, Query
from typing import Optional, List

from models import Category, ProductListItem, ProductsResponse, Product

router = APIRouter(tags=["Catalog"])


def get_db(request: Request):
    return request.app.state.db


@router.get("/categories", response_model=List[Category])
async def get_categories(request: Request):
    """Get all active categories"""
    db = get_db(request)
    categories = await db.categories.find({"is_active": True}, {"_id": 0}).sort("sort_order", 1).to_list(100)
    return categories


@router.get("/categories/{slug}", response_model=Category)
async def get_category(slug: str, request: Request):
    """Get category by slug"""
    db = get_db(request)
    category = await db.categories.find_one({"slug": slug, "is_active": True}, {"_id": 0})
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


@router.get("/products", response_model=ProductsResponse)
async def get_products(
    request: Request,
    category: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    colors: Optional[str] = None,  # comma-separated
    sizes: Optional[str] = None,   # comma-separated
    sort: str = "featured",  # featured, price-low, price-high, newest
    search: Optional[str] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=50)
):
    """Get products with filters and pagination"""
    db = get_db(request)
    
    # Build filter
    filter_query = {"is_active": True}
    
    if category:
        # Find category by slug
        cat = await db.categories.find_one({"slug": category}, {"_id": 0})
        if cat:
            filter_query["category_id"] = cat["id"]
    
    if min_price is not None:
        filter_query["$or"] = [
            {"sale_price": {"$gte": min_price}},
            {"$and": [{"sale_price": None}, {"price": {"$gte": min_price}}]}
        ]
    
    if max_price is not None:
        if "$or" in filter_query:
            # Combine with existing price filter
            filter_query["$and"] = [
                {"$or": filter_query.pop("$or")},
                {"$or": [
                    {"sale_price": {"$lte": max_price}},
                    {"$and": [{"sale_price": None}, {"price": {"$lte": max_price}}]}
                ]}
            ]
        else:
            filter_query["$or"] = [
                {"sale_price": {"$lte": max_price}},
                {"$and": [{"sale_price": None}, {"price": {"$lte": max_price}}]}
            ]
    
    if search:
        filter_query["$text"] = {"$search": search}
    
    # Sort
    sort_options = {
        "featured": [("is_featured", -1), ("created_at", -1)],
        "price-low": [("price", 1)],
        "price-high": [("price", -1)],
        "newest": [("created_at", -1)],
        "name-az": [("name", 1)],
        "name-za": [("name", -1)]
    }
    sort_by = sort_options.get(sort, sort_options["featured"])
    
    # Get total count
    total = await db.products.count_documents(filter_query)
    
    # Get products
    skip = (page - 1) * page_size
    products = await db.products.find(filter_query, {"_id": 0}).sort(sort_by).skip(skip).limit(page_size).to_list(page_size)
    
    # Filter by colors/sizes if specified (post-query filter for variant matching)
    if colors or sizes:
        color_list = [c.strip().lower() for c in colors.split(",")] if colors else []
        size_list = [s.strip().upper() for s in sizes.split(",")] if sizes else []
        
        filtered = []
        for p in products:
            match = True
            if color_list:
                product_colors = [v.get("color", "").lower() for v in p.get("variants", [])]
                if not any(c in product_colors for c in color_list):
                    match = False
            if size_list and match:
                product_sizes = set()
                for v in p.get("variants", []):
                    for s in v.get("sizes", []):
                        product_sizes.add(s.get("size", "").upper())
                if not any(s in product_sizes for s in size_list):
                    match = False
            if match:
                filtered.append(p)
        products = filtered
        total = len(filtered)  # Approximate for filtered results
    
    # Transform to list items
    items = []
    for p in products:
        # Get first image from first variant
        image = None
        colors_list = []
        sizes_set = set()
        
        for v in p.get("variants", []):
            if not image and v.get("images"):
                image = v["images"][0]
            colors_list.append(v.get("color", ""))
            for s in v.get("sizes", []):
                sizes_set.add(s.get("size", ""))
        
        items.append(ProductListItem(
            id=p["id"],
            name=p["name"],
            slug=p["slug"],
            price=p["price"],
            sale_price=p.get("sale_price"),
            category_name=p.get("category_name"),
            fabric=p.get("fabric"),
            image=image,
            colors=colors_list,
            sizes=list(sizes_set),
            is_featured=p.get("is_featured", False),
            ready_to_ship=p.get("ready_to_ship", True)
        ))
    
    return ProductsResponse(
        products=items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=(total + page_size - 1) // page_size
    )


@router.get("/products/{slug}", response_model=Product)
async def get_product(slug: str, request: Request):
    """Get product by slug"""
    db = get_db(request)
    product = await db.products.find_one({"slug": slug, "is_active": True}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Get category name
    if product.get("category_id"):
        cat = await db.categories.find_one({"id": product["category_id"]}, {"_id": 0})
        if cat:
            product["category_name"] = cat["name"]
    
    return product


@router.get("/search")
async def search_products(
    request: Request,
    q: str = Query(..., min_length=2),
    limit: int = Query(10, ge=1, le=20)
):
    """Search products by name"""
    db = get_db(request)
    
    # Simple regex search (for production, use text index or search engine)
    products = await db.products.find(
        {
            "is_active": True,
            "name": {"$regex": q, "$options": "i"}
        },
        {"_id": 0, "id": 1, "name": 1, "slug": 1, "price": 1, "variants": 1}
    ).limit(limit).to_list(limit)
    
    # Get first image for each
    results = []
    for p in products:
        image = None
        for v in p.get("variants", []):
            if v.get("images"):
                image = v["images"][0]
                break
        results.append({
            "id": p["id"],
            "name": p["name"],
            "slug": p["slug"],
            "price": p["price"],
            "image": image
        })
    
    return {"results": results}
