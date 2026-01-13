# 🌸 Aleesa Ethnic Wear

![Aleesa Banner](public/placeholder.png)

> A premium, full-stack e-commerce platform for ethnic wear, built with modern web technologies. Experience seamless shopping with robust discovery, secure checkout, and comprehensive admin management.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-6.0-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql&logoColor=white)

## ✨ Key Features

### 🛍️ Customer Experience
*   **Modern Storefront**: Responsive, high-performance UI inspired by top fashion brands.
*   **Global Search**: Instant product discovery by name, category, or description.
*   **Smart Filtering**: Filter collections by price range and sort by newest/price.
*   **Product Details**: Rich product pages with image galleries, size selection, and related products.
*   **Wishlist**: Save favorite items for later (locally persisted).
*   **Product Reviews**: Star ratings and detailed customer feedback.
*   **User Accounts**: Order history tracking and profile management.

### 💳 Secure Checkout
*   **Shopping Cart**: Persistent cart state with stock validation.
*   **Payment Integration**: Secure payments powered by **Razorpay**.
*   **Guest Checkout**: Seamless flow for non-logged-in users with auto-registration.

### 👑 Admin Dashboard
*   **Order Management**: View, filter, and update order status (Pending → Shipped → Delivered).
*   **Product Management**: Create, edit, and delete products with variant support.
*   **Inventory Control**: Real-time stock management for different sizes.
*   **Analytics**: Sales overview and order metrics (Coming Soon).

## 🛠️ Tech Stack

**Frontend**
*   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **State Management**: React Context (Cart, Wishlist)

**Backend**
*   **Database**: PostgreSQL
*   **ORM**: [Prisma](https://www.prisma.io/)
*   **Authentication**: Custom JWT-based secure session management (JOSE).
*   **Payments**: Razorpay SDK
*   **Image Storage**: Cloudinary (Configured)

## 🚀 Getting Started

### Prerequisites
*   Node.js 18+
*   PostgreSQL Database URL
*   Razorpay Account (Test Mode)

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
    # Database
    DATABASE_URL="postgresql://user:password@localhost:5432/aleesa_db"

    # Authentication
    JWT_SECRET="your-super-secret-key-min-32-chars"

    # Payments (Razorpay)
    RAZORPAY_KEY_ID="rzp_test_..."
    RAZORPAY_KEY_SECRET="your_razorpay_secret"

    # Images (Cloudinary)
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
    ```

4.  **Database Setup**
    ```bash
    npx prisma generate
    npx prisma db push
    # Optional: Seed initial data
    npx prisma db seed
    ```

5.  **Run the Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📂 Project Structure

```bash
src/
├── app/
│   ├── (shop)/          # Customer-facing pages (Home, Cart, Products)
│   ├── admin/           # Secured Admin Dashboard
│   ├── api/             # Next.js API Routes (Auth, Checkout)
│   └── actions/         # Server Actions
├── components/          # Reusable UI Components
├── context/             # Global State (CartContext, WishlistContext)
└── lib/                 # Utilities (Prisma, Auth, Helpers)
prisma/
└── schema.prisma        # Database Models
```

## 🔒 Security

*   **Role-Based Access Control (RBAC)**: Admin routes are protected via middleware and server-side session checks.
*   **Secure Payments**: Order totals are calculated server-side to prevent client-side manipulation. Payment signatures are verified using HMAC-SHA256.
*   **Input Validation**: Strict typing with TypeScript and runtime checks.

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a Pull Request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

Built with ❤️ by [Lingikaushikreddy](https://github.com/Lingikaushikreddy)
