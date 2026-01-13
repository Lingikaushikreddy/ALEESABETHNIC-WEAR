from fastapi import FastAPI
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path

# Load environment
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Import routes
from routes.auth_routes import router as auth_router
from routes.product_routes import router as product_router
from routes.cart_routes import router as cart_router
from routes.order_routes import router as order_router
from routes.address_routes import router as address_router
from routes.admin_routes import router as admin_router
from routes.admin_product_routes import router as admin_product_router

# Create app
app = FastAPI(
    title="Aleesa Ethnic Wear API",
    description="E-commerce API for Indian ethnic wear",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def startup_db_client():
    """Connect to MongoDB on startup"""
    mongo_url = os.environ['MONGO_URL']
    db_name = os.environ['DB_NAME']
    
    app.state.mongo_client = AsyncIOMotorClient(mongo_url)
    app.state.db = app.state.mongo_client[db_name]
    logger.info(f"Connected to MongoDB: {db_name}")


@app.on_event("shutdown")
async def shutdown_db_client():
    """Close MongoDB connection on shutdown"""
    app.state.mongo_client.close()
    logger.info("Disconnected from MongoDB")


# Include routers with /api prefix
app.include_router(auth_router, prefix="/api")
app.include_router(product_router, prefix="/api")
app.include_router(cart_router, prefix="/api")
app.include_router(order_router, prefix="/api")
app.include_router(address_router, prefix="/api")
app.include_router(admin_router, prefix="/api")
app.include_router(admin_product_router, prefix="/api")


# Health check
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "aleesa-api"}


@app.get("/api")
async def root():
    return {
        "message": "Aleesa Ethnic Wear API",
        "version": "1.0.0",
        "docs": "/docs"
    }
