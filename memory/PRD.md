# ALEESA ETHNIC WEAR - E-commerce Platform

## Product Requirements Document

### Project Overview
A production-ready e-commerce website for ALEESA ETHNIC WEAR, an Indian ethnic wear brand.

### Tech Stack
- **Frontend:** React 18 + React Router DOM + TailwindCSS + shadcn/ui
- **Backend:** FastAPI (Python) + MongoDB (Motor async driver)
- **Authentication:** Custom JWT-based (access + refresh tokens)
- **Session Management:** localStorage-based session ID for guest carts

---

## What's Been Implemented (Jan 12, 2025)

### Backend APIs (100% Complete for MVP)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/categories` | GET | List all categories |
| `/api/categories/{slug}` | GET | Get category by slug |
| `/api/products` | GET | Products with filters & pagination |
| `/api/products/{slug}` | GET | Product detail with variants |
| `/api/search` | GET | Search products |
| `/api/auth/register` | POST | User registration |
| `/api/auth/login` | POST | User login |
| `/api/auth/logout` | POST | User logout |
| `/api/auth/refresh` | POST | Refresh access token |
| `/api/auth/me` | GET | Get current user |
| `/api/cart` | GET/DELETE | Get/Clear cart |
| `/api/cart/items` | POST | Add to cart |
| `/api/cart/items/{id}` | PATCH/DELETE | Update/Remove item |
| `/api/addresses` | GET/POST | List/Create addresses |
| `/api/addresses/{id}` | PATCH/DELETE | Update/Delete address |
| `/api/orders/validate` | POST | Validate checkout |
| `/api/orders` | GET/POST | List/Create orders |
| `/api/orders/{id}` | GET | Get order detail |
| `/api/admin/orders` | GET | Admin: List all orders |
| `/api/admin/orders/{id}` | PATCH | Admin: Update order status |

### Frontend Pages (100% Complete for MVP)

| Page | Route | Features |
|------|-------|----------|
| Home | `/` | Hero, categories, featured products |
| Collection | `/collections/:slug` | Filters (price, size, color), sorting, pagination |
| Product Detail | `/products/:slug` | Gallery, variants, sizes, Add to Cart |
| Cart | `/cart` | Item management, order summary |
| Checkout | `/checkout` | Address selection, order review, COD |
| Order Confirmation | `/order-confirmation/:id` | Success page |
| Login | `/login` | Email/password auth |
| Register | `/register` | User registration |
| Account | `/account` | Profile, orders, addresses |

### Database Schema (MongoDB Collections)

- **users**: id, email, password, first_name, last_name, phone, role
- **categories**: id, name, slug, description, is_active, sort_order
- **products**: id, name, slug, price, sale_price, category_id, fabric, variants[], is_active, is_featured
- **carts**: id, user_id, session_id, items[]
- **addresses**: id, user_id, full_name, phone, address_line1/2, city, state, postal_code, country, is_default
- **orders**: id, order_number, user_id, status, items[], shipping_address, subtotal, shipping_cost, total

### Seed Data
- 7 Categories: Suits, Sarees, Dresses, Lehenga Sets, Kurtas, Bridals, New Arrivals
- 25 Products with multiple variants (colors) and sizes (M, L, XL, XXL)
- Admin user: admin@aleesa.com / admin123
- Test user: test@example.com / test123

---

## Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@aleesa.com | admin123 |
| Customer | test@example.com | test123 |

---

## Prioritized Backlog

### P0 (Critical) - Completed ✅
- [x] Backend APIs for products, cart, auth, orders
- [x] Frontend pages with full shopping flow
- [x] Guest cart with session tracking
- [x] User authentication
- [x] Checkout with COD

### P1 (High Priority) - Upcoming
- [ ] Cart merge on login (backend ready, frontend needs integration)
- [ ] Order email notifications
- [ ] Admin dashboard for order management
- [ ] Product image upload to Cloudinary

### P2 (Medium Priority)
- [ ] Wishlist functionality
- [ ] User profile editing
- [ ] Product reviews and ratings
- [ ] Advanced search with filters

### P3 (Low Priority)
- [ ] Multiple payment gateways (Razorpay, Stripe)
- [ ] Coupon/discount system
- [ ] Inventory alerts
- [ ] Analytics dashboard

---

## Architecture

```
/app
├── backend/
│   ├── server.py          # FastAPI app entry
│   ├── models.py          # Pydantic models
│   ├── auth.py            # JWT authentication
│   ├── seed.py            # Database seeding
│   └── routes/
│       ├── auth_routes.py
│       ├── product_routes.py
│       ├── cart_routes.py
│       ├── order_routes.py
│       ├── address_routes.py
│       └── admin_routes.py
│
├── frontend/src/
│   ├── App.js             # Main routing
│   ├── lib/api.js         # API client
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── CartContext.jsx
│   ├── components/
│   │   ├── layout/        # Header, Footer, CartDrawer
│   │   ├── ui/            # shadcn components
│   │   └── ProductCard.jsx
│   └── pages/
│       ├── HomePage.jsx
│       ├── CollectionPage.jsx
│       ├── ProductDetailPage.jsx
│       ├── CartPage.jsx
│       ├── CheckoutPage.jsx
│       └── AccountPage.jsx
```

---

## Key Technical Decisions

1. **Guest Cart**: Uses `X-Session-ID` header (stored in localStorage) instead of cookies to avoid CORS issues
2. **JWT Strategy**: Access token in memory + localStorage, refresh token in HttpOnly cookie
3. **Cart Persistence**: Session-based for guests, user-based after login
4. **Order Idempotency**: Uses `idempotency_key` to prevent duplicate orders
5. **Stock Management**: Deducted atomically during order creation

---

## Testing Status

- **Backend Tests**: 25/25 passed ✅
- **Frontend Tests**: All major flows verified ✅
- **Test File**: `/app/tests/test_aleesa_api.py`
