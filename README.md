# 🌸 ALEESA ETHNIC WEAR — Full-Stack E-commerce Platform (MVP)

![Aleesa Banner](public/placeholder.png)

> A premium, full-stack e-commerce platform for ethnic wear built with modern web technologies. Includes high-quality storefront UX, secure authentication, guest + user cart support, checkout validation, and a transaction-safe order system.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-6.0-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql&logoColor=white)

---

## ✅ Tech Stack

### Frontend
- **Framework**: Next.js (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Icons**: Lucide Icons
- **State Management**: React Context (Auth + Cart)

### Backend
- **API**: Next.js API Routes (Serverless)
- **Auth**: Custom JWT Authentication (Access + Refresh Tokens)
- **Security**: RBAC Roles (CUSTOMER, ADMIN)
- **Logic**: Transaction-safe Cart Merge + Idempotent Orders

### Database
- **Engine**: PostgreSQL (Neon Free Tier)
- **ORM**: Prisma ORM

### Media
- **Storage**: Cloudinary (Product image storage + optimization)

---

## ✨ Key Features

### 🛍️ Customer Experience
- **Modern Storefront**: Mobile-first, fast, and clean UI.
- **Collection Browsing**: Advanced sorting and pagination.
- **Product Details**: Variant selection (size/color) and real-time stock options.
- **Search**: Dedicated endpoint for instant product discovery.
- **Accounts**: Customer profile management with order history and address book.

### 🛒 Cart (Highlight Feature)
- **Persistence**: robust cart for both guests and logged-in users.
- **Auto-Merge**: Seamlessly merges guest cart into user cart upon login.
- **Stock Validation**: Server-side checks to prevent overselling.

### ✅ Checkout (COD MVP)
- **Address Management**: Selection and validation of shipping addresses.
- **Validation API**: Verifies pricing and stock availability before order placement.
- **Payment**: Cash on Delivery (MVP) with extensible architecture.
- **Reliability**: Order snapshots for historical accuracy.

### 👑 Admin (MVP)
- **Order Management**: View and update order statuses.
- **Security**: Protected routes via middleware + Role-Based Access Control (RBAC).

---

## ✅ API Endpoints

### Auth
- `POST /api/auth/register` - Create a new account
- `POST /api/auth/login` - Authenticate user
- `POST /api/auth/logout` - End session
- `POST /api/auth/refresh` - Refresh access token
- `GET  /api/auth/me` - Get current user details

### Catalog
- `GET /api/categories` - List all categories
- `GET /api/products` - List products (filters/sorting/pagination)
- `GET /api/products/[slug]` - Get single product details
- `GET /api/search` - Search products

### Cart
- `GET /api/cart` - Get current cart
- `POST /api/cart/items` - Add item to cart
- `PATCH /api/cart/items/[id]` - Update item quantity
- `DELETE /api/cart/items/[id]` - Remove item

### Addresses
- `GET /api/addresses` - List user addresses
- `POST /api/addresses` - Add new address
- `PATCH /api/addresses/[id]` - Update address
- `DELETE /api/addresses/[id]` - Delete address

### Checkout + Orders
- `POST /api/checkout/validate` - Validate cart before payment
- `POST /api/orders` - Place order
- `GET /api/orders` - List user orders
- `GET /api/orders/[id]` - Get order details

### Admin
- `GET /api/admin/orders` - List all orders
- `PATCH /api/admin/orders/[id]` - Update order status

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Neon Postgres database URL

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Lingikaushikreddy/ALEESABETHNIC-WEAR.git
    cd ALEESABETHNIC-WEAR
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory:
    ```env
    DATABASE_URL="postgresql://user:password@host:5432/db"
    JWT_SECRET="your-secret-key"
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
    ```

4.  **Database Setup**
    ```bash
    npx prisma generate
    npx prisma db push
    ```

5.  **Run the Development Server**
    ```bash
    npm run dev
    ```

---

Built with ❤️ by [Lingikaushikreddy](https://github.com/Lingikaushikreddy)
