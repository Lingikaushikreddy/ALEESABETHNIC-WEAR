import React, { useState } from 'react';
import { Search, User, Heart, ShoppingCart, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = ({ cartCount = 0, wishlistCount = 0 }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top Promo Banner */}
      <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white py-2 px-4 text-center text-sm font-medium">
        <div className="animate-pulse">FLAT 10% OFF - NEERUS10 | FREE SHIPPING ABOVE $50</div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <h1 className="text-3xl font-bold tracking-wider" style={{ fontFamily: 'Playfair Display, serif' }}>
              <span className="text-pink-600">NEERU'S</span>
              <div className="text-xs text-gray-600 tracking-widest font-light">INDIAN ETHNIC</div>
            </h1>
          </Link>

          {/* Desktop Search */}
          <div className="hidden lg:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <button className="hidden sm:block p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Search size={22} className="text-gray-700" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <User size={22} className="text-gray-700" />
            </button>
            <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Heart size={22} className="text-gray-700" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>
            <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ShoppingCart size={22} className="text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className={`${mobileMenuOpen ? 'block' : 'hidden'} lg:block pb-4 lg:pb-0`}>
          <ul className="flex flex-col lg:flex-row lg:items-center lg:justify-center space-y-2 lg:space-y-0 lg:space-x-8 text-sm font-medium">
            <li>
              <Link to="/best-sellers" className="block py-2 lg:py-4 hover:text-pink-600 transition-colors">
                BEST SELLERS
              </Link>
            </li>
            <li>
              <Link to="/suits" className="block py-2 lg:py-4 hover:text-pink-600 transition-colors">
                SUITS
              </Link>
            </li>
            <li>
              <Link to="/sarees" className="block py-2 lg:py-4 hover:text-pink-600 transition-colors">
                SAREES
              </Link>
            </li>
            <li>
              <Link to="/dresses" className="block py-2 lg:py-4 hover:text-pink-600 transition-colors">
                DRESSES
              </Link>
            </li>
            <li>
              <Link to="/lehenga" className="block py-2 lg:py-4 hover:text-pink-600 transition-colors">
                LEHENGA SET
              </Link>
            </li>
            <li>
              <Link to="/wedding" className="block py-2 lg:py-4 hover:text-pink-600 transition-colors">
                WEDDING SAGA
              </Link>
            </li>
            <li>
              <Link to="/kurtas" className="block py-2 lg:py-4 hover:text-pink-600 transition-colors">
                KURTAS
              </Link>
            </li>
            <li>
              <Link to="/" className="block py-2 lg:py-4 text-pink-600 font-semibold transition-colors">
                NEW
              </Link>
            </li>
            <li>
              <Link to="/sale" className="block py-2 lg:py-4 text-red-600 hover:text-red-700 transition-colors">
                SALE
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
