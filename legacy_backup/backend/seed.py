"""
Database seeding script for Aleesa Ethnic Wear
"""
import asyncio
from datetime import datetime, timezone
import uuid
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Password hashing (same as auth.py)
import hashlib
import secrets

def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    hashed = hashlib.sha256((password + salt).encode()).hexdigest()
    return f"{salt}:{hashed}"

# Sample data
CATEGORIES = [
    {"id": str(uuid.uuid4()), "name": "Suits", "slug": "suits", "description": "Elegant suits and three-piece sets", "sort_order": 1, "is_active": True},
    {"id": str(uuid.uuid4()), "name": "Sarees", "slug": "sarees", "description": "Traditional and contemporary sarees", "sort_order": 2, "is_active": True},
    {"id": str(uuid.uuid4()), "name": "Dresses", "slug": "dresses", "description": "Beautiful dresses and gowns", "sort_order": 3, "is_active": True},
    {"id": str(uuid.uuid4()), "name": "Lehenga Sets", "slug": "lehenga-sets", "description": "Stunning lehenga collections", "sort_order": 4, "is_active": True},
    {"id": str(uuid.uuid4()), "name": "Kurtas", "slug": "kurtas", "description": "Stylish kurtas for every occasion", "sort_order": 5, "is_active": True},
    {"id": str(uuid.uuid4()), "name": "Bridals", "slug": "bridals", "description": "Bridal wear collection", "sort_order": 6, "is_active": True},
    {"id": str(uuid.uuid4()), "name": "New Arrivals", "slug": "new-arrivals", "description": "Latest additions to our collection", "sort_order": 0, "is_active": True},
]

# High-quality Indian ethnic wear images from Unsplash
PRODUCT_IMAGES = {
    "suits": [
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop",
        "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=800&fit=crop",
    ],
    "sarees": [
        "https://images.unsplash.com/photo-1610030469985-3750e0ff4e8b?w=600&h=800&fit=crop",
        "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&h=800&fit=crop",
    ],
    "kurtas": [
        "https://images.unsplash.com/photo-1617127365657-c47fa864d8bc?w=600&h=800&fit=crop",
        "https://images.unsplash.com/photo-1583391733981-5235b2f3a0a9?w=600&h=800&fit=crop",
    ],
    "dresses": [
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop",
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=800&fit=crop",
    ],
    "lehenga": [
        "https://images.unsplash.com/photo-1594897030264-ab7d87efc473?w=600&h=800&fit=crop",
        "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=600&h=800&fit=crop",
    ],
}


def create_product(name, price, category_id, category_name, fabric, colors, description="", is_featured=False, sale_price=None):
    """Helper to create a product with variants"""
    slug = name.lower().replace(" ", "-").replace("'", "")
    
    # Get images based on category
    cat_key = category_name.lower().replace(" sets", "").replace("s", "") if category_name else "suits"
    images = PRODUCT_IMAGES.get(cat_key, PRODUCT_IMAGES["suits"])
    
    variants = []
    for color in colors:
        variants.append({
            "id": str(uuid.uuid4()),
            "color": color,
            "color_hex": None,
            "images": images,
            "sizes": [
                {"size": "M", "stock_qty": 10, "sku": f"{slug[:6].upper()}-{color[:2].upper()}-M"},
                {"size": "L", "stock_qty": 15, "sku": f"{slug[:6].upper()}-{color[:2].upper()}-L"},
                {"size": "XL", "stock_qty": 12, "sku": f"{slug[:6].upper()}-{color[:2].upper()}-XL"},
                {"size": "XXL", "stock_qty": 8, "sku": f"{slug[:6].upper()}-{color[:2].upper()}-XXL"},
            ]
        })
    
    return {
        "id": str(uuid.uuid4()),
        "name": name,
        "slug": slug,
        "description": description or f"Beautiful {name.lower()} from our latest collection. Perfect for any occasion.",
        "price": price,
        "sale_price": sale_price,
        "category_id": category_id,
        "category_name": category_name,
        "fabric": fabric,
        "variants": variants,
        "is_active": True,
        "is_featured": is_featured,
        "ready_to_ship": True,
        "tags": [fabric.lower(), category_name.lower()],
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }


async def seed_database():
    """Seed the database with initial data"""
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    db_name = os.environ.get('DB_NAME', 'test_database')
    
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    print("🌱 Starting database seed...")
    
    # Clear existing data
    await db.categories.delete_many({})
    await db.products.delete_many({})
    await db.users.delete_many({})
    await db.carts.delete_many({})
    await db.orders.delete_many({})
    await db.addresses.delete_many({})
    
    print("✓ Cleared existing data")
    
    # Insert categories
    await db.categories.insert_many(CATEGORIES)
    print(f"✓ Inserted {len(CATEGORIES)} categories")
    
    # Create category lookup
    cat_lookup = {c["slug"]: c for c in CATEGORIES}
    
    # Create products
    products = [
        # Suits
        create_product("Purple Cotton Floral Printed Three Piece Set", 4999, cat_lookup["suits"]["id"], "Suits", "Cotton", ["Purple", "Pink"], is_featured=True),
        create_product("Rama Crepe Printed Three Piece Set", 5999, cat_lookup["suits"]["id"], "Suits", "Crepe", ["Teal", "Blue"], is_featured=True),
        create_product("Cream Chanderi Embroidery Three Piece Set", 6999, cat_lookup["suits"]["id"], "Suits", "Chanderi", ["Cream", "Off White"]),
        create_product("Off White Muslin Printed Three Piece Set", 7499, cat_lookup["suits"]["id"], "Suits", "Muslin", ["White", "Ivory"]),
        create_product("Black Rayon Three Piece Suit Set", 4499, cat_lookup["suits"]["id"], "Suits", "Rayon", ["Black", "Charcoal"]),
        create_product("Wine Modal Silk Printed Three Piece Set", 5499, cat_lookup["suits"]["id"], "Suits", "Modal Silk", ["Wine", "Maroon"]),
        create_product("Indigo Cotton Printed Anarkali Three Piece Set", 5299, cat_lookup["suits"]["id"], "Suits", "Cotton", ["Indigo", "Navy"]),
        
        # Kurtas
        create_product("Mustard Silk Long Anarkali Kurta", 3999, cat_lookup["kurtas"]["id"], "Kurtas", "Silk", ["Mustard", "Gold"], is_featured=True),
        create_product("Lemon Cotton Flex Printed Kurta", 2499, cat_lookup["kurtas"]["id"], "Kurtas", "Cotton", ["Yellow", "Lemon"]),
        create_product("Navy Blue Silk Long Anarkali Kurta", 4299, cat_lookup["kurtas"]["id"], "Kurtas", "Silk", ["Navy Blue", "Royal Blue"]),
        create_product("Rani Rayon Printed Kurta", 2299, cat_lookup["kurtas"]["id"], "Kurtas", "Rayon", ["Pink", "Magenta"]),
        create_product("Aqua Linen Printed Kurta", 2799, cat_lookup["kurtas"]["id"], "Kurtas", "Linen", ["Aqua", "Turquoise"]),
        create_product("Baby Pink Linen Printed Kurta", 2799, cat_lookup["kurtas"]["id"], "Kurtas", "Linen", ["Baby Pink", "Blush"]),
        
        # Sarees
        create_product("Red Georgette Embroidered Saree", 8999, cat_lookup["sarees"]["id"], "Sarees", "Georgette", ["Red", "Crimson"], is_featured=True),
        create_product("Golden Banarasi Silk Saree", 12999, cat_lookup["sarees"]["id"], "Sarees", "Silk", ["Gold", "Bronze"]),
        create_product("Emerald Green Chiffon Saree", 7499, cat_lookup["sarees"]["id"], "Sarees", "Chiffon", ["Green", "Emerald"]),
        create_product("Royal Blue Kanjivaram Saree", 15999, cat_lookup["sarees"]["id"], "Sarees", "Silk", ["Blue", "Navy"]),
        
        # Lehenga Sets
        create_product("Maroon Velvet Lehenga Set", 18999, cat_lookup["lehenga-sets"]["id"], "Lehenga Sets", "Velvet", ["Maroon", "Burgundy"], is_featured=True),
        create_product("Peach Net Embroidered Lehenga", 22999, cat_lookup["lehenga-sets"]["id"], "Lehenga Sets", "Net", ["Peach", "Coral"]),
        create_product("Navy Sequin Lehenga Set", 16999, cat_lookup["lehenga-sets"]["id"], "Lehenga Sets", "Georgette", ["Navy", "Midnight Blue"]),
        
        # Dresses
        create_product("Green Georgette Anarkali Dress", 6999, cat_lookup["dresses"]["id"], "Dresses", "Georgette", ["Green", "Olive"]),
        create_product("Turquoise Georgette Gown", 9999, cat_lookup["dresses"]["id"], "Dresses", "Georgette", ["Turquoise", "Teal"]),
        create_product("Blush Pink Silk Gown", 11999, cat_lookup["dresses"]["id"], "Dresses", "Silk", ["Pink", "Rose"]),
        
        # Sale items with discounts
        create_product("Yellow Printed Cotton Kurta Set", 3499, cat_lookup["kurtas"]["id"], "Kurtas", "Cotton", ["Yellow", "Mustard"], sale_price=2799),
        create_product("Blue Embroidered Suit Set", 5999, cat_lookup["suits"]["id"], "Suits", "Cotton", ["Blue", "Sky Blue"], sale_price=4499),
    ]
    
    await db.products.insert_many(products)
    print(f"✓ Inserted {len(products)} products")
    
    # Create admin user
    admin_user = {
        "id": str(uuid.uuid4()),
        "email": "admin@aleesa.com",
        "password": hash_password("admin123"),
        "first_name": "Admin",
        "last_name": "User",
        "phone": "+919876543210",
        "role": "admin",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.users.insert_one(admin_user)
    print("✓ Created admin user (admin@aleesa.com / admin123)")
    
    # Create test customer
    test_user = {
        "id": str(uuid.uuid4()),
        "email": "test@example.com",
        "password": hash_password("test123"),
        "first_name": "Test",
        "last_name": "Customer",
        "phone": "+919876543211",
        "role": "customer",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.users.insert_one(test_user)
    print("✓ Created test customer (test@example.com / test123)")
    
    # Create text index for search
    await db.products.create_index([("name", "text"), ("description", "text"), ("tags", "text")])
    print("✓ Created text search index")
    
    client.close()
    print("\n✅ Database seeding complete!")


if __name__ == "__main__":
    asyncio.run(seed_database())
