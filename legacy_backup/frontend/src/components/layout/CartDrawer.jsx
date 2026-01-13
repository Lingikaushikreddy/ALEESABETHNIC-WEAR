import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const CartDrawer = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { items, itemCount, subtotal, isLoading, updateQuantity, removeItem } = useCart();

  // Close drawer when route changes
  useEffect(() => {
    onClose();
  }, [location.pathname, onClose]);

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

  // Lock body scroll when drawer is open
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

  const handleUpdateQuantity = async (itemId, newQty) => {
    if (newQty < 1) return;
    try {
      await updateQuantity(itemId, newQty);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await removeItem(itemId);
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  if (!isOpen) return null;

  const isEmpty = items.length === 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
        onClick={onClose}
        data-testid="cart-backdrop"
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white z-50 shadow-xl flex flex-col" data-testid="cart-drawer">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Shopping Cart ({itemCount})</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close cart"
            data-testid="close-cart-btn"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cart Content */}
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center flex-1 p-8 text-center">
            <div className="p-4 bg-gray-100 rounded-full mb-4">
              <ShoppingBag size={48} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-6">Start adding items to your cart!</p>
            <Link
              to="/collections/new-arrivals"
              onClick={onClose}
              className="px-6 py-3 bg-pink-600 text-white font-medium rounded-md hover:bg-pink-700 transition-colors"
              data-testid="continue-shopping-btn"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-3 bg-gray-50 rounded-lg" data-testid={`cart-item-${item.id}`}>
                  {/* Image */}
                  <div className="w-20 h-24 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.product_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ShoppingBag size={24} />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">{item.product_name}</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.color} / {item.size}
                    </p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      ₹{item.unit_price.toLocaleString('en-IN')}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-gray-200 rounded">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={isLoading || item.quantity <= 1}
                          className="p-1 hover:bg-gray-100 disabled:opacity-50"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-3 text-sm">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          disabled={isLoading || item.quantity >= 10}
                          className="p-1 hover:bg-gray-100 disabled:opacity-50"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={isLoading}
                        className="p-1 text-red-500 hover:bg-red-50 rounded disabled:opacity-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-700 font-medium">Subtotal</span>
                <span className="text-xl font-bold text-gray-900">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-4">
                Shipping calculated at checkout
              </p>
              <Link
                to="/cart"
                onClick={onClose}
                className="block w-full px-6 py-3 bg-gray-900 text-white text-center font-medium rounded-md hover:bg-gray-800 transition-colors mb-2"
                data-testid="view-cart-btn"
              >
                View Cart
              </Link>
              <Link
                to="/checkout"
                onClick={onClose}
                className="block w-full px-6 py-3 bg-pink-600 text-white text-center font-medium rounded-md hover:bg-pink-700 transition-colors"
                data-testid="checkout-btn"
              >
                Checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
