import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, ChevronRight, User, ShoppingBag, Heart } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const MobileMenu = ({ isOpen, onClose, categories }) => {
  const { user, logout } = useAuth();

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div className="fixed top-0 left-0 h-full w-80 bg-white z-50 lg:hidden shadow-xl overflow-y-auto" data-testid="mobile-menu">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-pink-600" style={{ fontFamily: 'Playfair Display, serif' }}>
            ALEESA
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* User Section */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          {user ? (
            <div>
              <p className="text-sm font-medium text-gray-900">Hello, {user.first_name}!</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link
                to="/login"
                onClick={onClose}
                className="flex-1 py-2 text-center text-sm font-medium bg-pink-600 text-white rounded-md hover:bg-pink-700"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={onClose}
                className="flex-1 py-2 text-center text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Categories */}
        <nav className="p-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Categories
          </h3>
          <ul className="space-y-1">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link
                  to={`/collections/${category.slug}`}
                  onClick={onClose}
                  className="flex items-center justify-between py-3 px-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-md transition-colors"
                >
                  <span>{category.name}</span>
                  <ChevronRight size={18} className="text-gray-400" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Quick Links */}
        {user && (
          <div className="p-4 border-t border-gray-200">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              My Account
            </h3>
            <ul className="space-y-1">
              <li>
                <Link
                  to="/account"
                  onClick={onClose}
                  className="flex items-center gap-3 py-3 px-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-md transition-colors"
                >
                  <User size={18} />
                  <span>Profile</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/account/orders"
                  onClick={onClose}
                  className="flex items-center gap-3 py-3 px-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-md transition-colors"
                >
                  <ShoppingBag size={18} />
                  <span>My Orders</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/wishlist"
                  onClick={onClose}
                  className="flex items-center gap-3 py-3 px-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-md transition-colors"
                >
                  <Heart size={18} />
                  <span>Wishlist</span>
                </Link>
              </li>
            </ul>
          </div>
        )}

        {/* Logout */}
        {user && (
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full py-2 text-center text-sm font-medium text-red-600 border border-red-200 rounded-md hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default MobileMenu;
