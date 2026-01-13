import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, Heart, ShoppingCart, Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import CartDrawer from './CartDrawer';
import MobileMenu from './MobileMenu';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();
  
  const { user, logout } = useAuth();
  const { itemCount } = useCart();

  const categories = [
    { name: 'New Arrivals', slug: 'new-arrivals' },
    { name: 'Suits', slug: 'suits' },
    { name: 'Sarees', slug: 'sarees' },
    { name: 'Dresses', slug: 'dresses' },
    { name: 'Lehenga Sets', slug: 'lehenga-sets' },
    { name: 'Kurtas', slug: 'kurtas' },
    { name: 'Bridals', slug: 'bridals' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-sm" data-testid="header">
        {/* Top Promo Banner */}
        <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white py-2 px-4 text-center text-sm font-medium">
          <div className="animate-pulse">
            FREE SHIPPING ON ORDERS ABOVE ₹2000 | COD AVAILABLE | #aleesaethnicwear
          </div>
        </div>

        {/* Main Header */}
        <div className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 lg:h-20">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
                aria-label="Toggle menu"
                data-testid="mobile-menu-btn"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              {/* Logo */}
              <Link to="/" className="flex-shrink-0" data-testid="logo">
                <div className="text-center">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-wider" style={{ fontFamily: 'Playfair Display, serif' }}>
                    <span className="text-pink-600">ALEESA</span>
                  </h1>
                  <div className="text-[10px] sm:text-xs text-gray-600 tracking-widest font-light">
                    INDIAN ETHNIC
                  </div>
                </div>
              </Link>

              {/* Desktop Search Bar */}
              <div className="hidden lg:flex flex-1 max-w-lg mx-8">
                <form onSubmit={handleSearch} className="relative w-full">
                  <input
                    type="text"
                    placeholder="Search for products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    data-testid="search-input"
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                </form>
              </div>

              {/* Icons */}
              <div className="flex items-center space-x-2 sm:space-x-4">
                {/* Mobile Search */}
                <button 
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
                  onClick={() => setSearchOpen(!searchOpen)}
                  data-testid="mobile-search-btn"
                >
                  <Search size={22} className="text-gray-700" />
                </button>

                {/* User Menu */}
                <div className="relative" ref={userMenuRef}>
                  <button 
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center"
                    data-testid="user-menu-btn"
                  >
                    <User size={22} className="text-gray-700" />
                    {user && <ChevronDown size={14} className="text-gray-500 ml-1 hidden sm:block" />}
                  </button>
                  
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50" data-testid="user-dropdown">
                      {user ? (
                        <>
                          <div className="px-4 py-2 border-b border-gray-100">
                            <p className="text-sm font-medium text-gray-900">{user.first_name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                          <Link 
                            to="/account" 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            My Account
                          </Link>
                          <Link 
                            to="/account/orders" 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            My Orders
                          </Link>
                          <button 
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                          >
                            Logout
                          </button>
                        </>
                      ) : (
                        <>
                          <Link 
                            to="/login" 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            Login
                          </Link>
                          <Link 
                            to="/register" 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            Create Account
                          </Link>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Wishlist */}
                <button className="hidden sm:block p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Heart size={22} className="text-gray-700" />
                </button>

                {/* Cart */}
                <button
                  onClick={() => setCartDrawerOpen(true)}
                  className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                  data-testid="cart-btn"
                >
                  <ShoppingCart size={22} className="text-gray-700" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold" data-testid="cart-count">
                      {itemCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {searchOpen && (
          <div className="lg:hidden border-b border-gray-200 p-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500"
                autoFocus
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </form>
          </div>
        )}

        {/* Desktop Navigation */}
        <nav className="hidden lg:block bg-white border-b border-gray-100" data-testid="nav">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center space-x-8 py-3">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  to={`/collections/${category.slug}`}
                  className="text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors whitespace-nowrap"
                >
                  {category.name.toUpperCase()}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        categories={categories}
      />

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
    </>
  );
};

export default Header;
