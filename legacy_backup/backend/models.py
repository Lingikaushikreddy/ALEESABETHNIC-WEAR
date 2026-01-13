"""
Pydantic models for Aleesa Ethnic Wear E-commerce API
"""
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
from datetime import datetime, timezone
import uuid


def generate_id() -> str:
    return str(uuid.uuid4())


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


# ==================== User Models ====================
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    first_name: str = Field(min_length=1)
    last_name: str = Field(min_length=1)
    phone: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    email: str
    first_name: str
    last_name: str
    phone: Optional[str] = None
    role: str = "customer"
    created_at: datetime


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# ==================== Category Models ====================
class Category(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=generate_id)
    name: str
    slug: str
    description: Optional[str] = None
    image: Optional[str] = None
    parent_id: Optional[str] = None
    is_active: bool = True
    sort_order: int = 0


# ==================== Product Models ====================
class ProductVariantSize(BaseModel):
    size: str
    stock_qty: int = 0
    sku: str


class ProductVariant(BaseModel):
    id: str = Field(default_factory=generate_id)
    color: str
    color_hex: Optional[str] = None
    images: List[str] = []
    sizes: List[ProductVariantSize] = []


class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=generate_id)
    name: str
    slug: str
    description: Optional[str] = None
    price: float
    sale_price: Optional[float] = None
    category_id: str
    category_name: Optional[str] = None
    fabric: Optional[str] = None
    variants: List[ProductVariant] = []
    is_active: bool = True
    is_featured: bool = False
    ready_to_ship: bool = True
    tags: List[str] = []
    created_at: datetime = Field(default_factory=utc_now)
    updated_at: datetime = Field(default_factory=utc_now)


class ProductListItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    slug: str
    price: float
    sale_price: Optional[float] = None
    category_name: Optional[str] = None
    fabric: Optional[str] = None
    image: Optional[str] = None
    colors: List[str] = []
    sizes: List[str] = []
    is_featured: bool = False
    ready_to_ship: bool = True


class ProductsResponse(BaseModel):
    products: List[ProductListItem]
    total: int
    page: int
    page_size: int
    total_pages: int


class ProductCreate(BaseModel):
    name: str
    slug: Optional[str] = None  # Generated if not provided
    description: Optional[str] = None
    price: float
    sale_price: Optional[float] = None
    category_id: str
    category_name: Optional[str] = None
    fabric: Optional[str] = None
    variants: List[ProductVariant] = []
    is_active: bool = True
    is_featured: bool = False
    ready_to_ship: bool = True
    tags: List[str] = []


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    sale_price: Optional[float] = None
    category_id: Optional[str] = None
    category_name: Optional[str] = None
    fabric: Optional[str] = None
    variants: Optional[List[ProductVariant]] = None
    is_active: Optional[bool] = None
    is_featured: Optional[bool] = None
    ready_to_ship: Optional[bool] = None
    tags: Optional[List[str]] = None


# ==================== Cart Models ====================
class CartItemInput(BaseModel):
    product_id: str
    variant_id: str
    size: str
    quantity: int = Field(ge=1, le=10)


class CartItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=generate_id)
    product_id: str
    variant_id: str
    size: str
    quantity: int
    unit_price: float
    product_name: str
    color: str
    image: Optional[str] = None


class Cart(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=generate_id)
    user_id: Optional[str] = None
    session_id: Optional[str] = None
    items: List[CartItem] = []
    created_at: datetime = Field(default_factory=utc_now)
    updated_at: datetime = Field(default_factory=utc_now)


class CartResponse(BaseModel):
    cart: Cart
    subtotal: float
    item_count: int


# ==================== Address Models ====================
class AddressInput(BaseModel):
    full_name: str = Field(min_length=1)
    phone: str = Field(min_length=10)
    address_line1: str = Field(min_length=1)
    address_line2: Optional[str] = None
    city: str = Field(min_length=1)
    state: str = Field(min_length=1)
    postal_code: str = Field(min_length=5)
    country: str = "India"
    is_default: bool = False


class Address(AddressInput):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=generate_id)
    user_id: str
    created_at: datetime = Field(default_factory=utc_now)


# ==================== Order Models ====================
class OrderItemSnapshot(BaseModel):
    product_id: str
    variant_id: str
    product_name: str
    color: str
    size: str
    quantity: int
    unit_price: float
    image: Optional[str] = None


class AddressSnapshot(BaseModel):
    full_name: str
    phone: str
    address_line1: str
    address_line2: Optional[str] = None
    city: str
    state: str
    postal_code: str
    country: str


class OrderCreate(BaseModel):
    address_id: str
    idempotency_key: Optional[str] = None


class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=generate_id)
    order_number: str
    user_id: str
    status: str = "pending"  # pending, confirmed, processing, shipped, delivered, cancelled
    payment_method: str = "cod"
    payment_status: str = "pending"  # pending, paid, refunded
    items: List[OrderItemSnapshot] = []
    shipping_address: AddressSnapshot
    subtotal: float
    shipping_cost: float = 0.0
    total: float
    idempotency_key: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=utc_now)
    updated_at: datetime = Field(default_factory=utc_now)


class OrderResponse(BaseModel):
    order: Order


class OrdersListResponse(BaseModel):
    orders: List[Order]
    total: int
    page: int
    page_size: int
