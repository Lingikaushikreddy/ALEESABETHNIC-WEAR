import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

// Context Providers
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

// Layout Components
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

// Pages
import HomePage from "./pages/HomePage";
import CollectionPage from "./pages/CollectionPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AccountPage from "./pages/AccountPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProductEditor from "./pages/admin/ProductEditor";

// Layout wrapper for pages with header/footer
const MainLayout = ({ children }) => (
  <>
    <Header />
    <main className="min-h-screen">{children}</main>
    <Footer />
  </>
);

// Auth layout (no header/footer)
const AuthLayout = ({ children }) => (
  <main>{children}</main>
);

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <Toaster position="top-center" richColors />
            <Routes>
              {/* Auth Routes (no header/footer) */}
              <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
              <Route path="/register" element={<AuthLayout><RegisterPage /></AuthLayout>} />

              {/* Main Routes (with header/footer) */}
              <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
              <Route path="/collections/:slug" element={<MainLayout><CollectionPage /></MainLayout>} />
              <Route path="/products/:slug" element={<MainLayout><ProductDetailPage /></MainLayout>} />
              <Route path="/cart" element={<MainLayout><CartPage /></MainLayout>} />
              <Route path="/checkout" element={<MainLayout><CheckoutPage /></MainLayout>} />
              <Route path="/order-confirmation/:orderId" element={<MainLayout><OrderConfirmationPage /></MainLayout>} />
              <Route path="/account" element={<MainLayout><AccountPage /></MainLayout>} />
              <Route path="/account/orders" element={<MainLayout><AccountPage /></MainLayout>} />
              <Route path="/account/addresses" element={<MainLayout><AccountPage /></MainLayout>} />

              {/* Admin Routes */}
              <Route path="/admin" element={<MainLayout><AdminDashboard /></MainLayout>} />
              <Route path="/admin/products/new" element={<MainLayout><ProductEditor /></MainLayout>} />
              <Route path="/admin/products/:id" element={<MainLayout><ProductEditor /></MainLayout>} />

              {/* 404 */}
              <Route path="*" element={
                <MainLayout>
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                      <p className="text-gray-600 mb-8">Page not found</p>
                      <a href="/" className="text-pink-600 hover:underline">Go Home</a>
                    </div>
                  </div>
                </MainLayout>
              } />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
