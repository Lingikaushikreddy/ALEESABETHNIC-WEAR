import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const CartPage = () => {
  const { items, subtotal, itemCount, isLoading, updateQuantity, removeItem, clearCart } = useCart();

  const handleUpdateQuantity = async (itemId, newQty) => {
    if (newQty < 1 || newQty > 10) return;
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

  const shippingCost = subtotal >= 2000 ? 0 : 99;
  const total = subtotal + shippingCost;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" data-testid="empty-cart">
        <div className="text-center px-4">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={48} className="text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Start shopping to add items to your cart</p>
          <Link
            to="/collections/new-arrivals"
            className="inline-flex items-center gap-2 px-6 py-3 bg-pink-600 text-white font-medium rounded-md hover:bg-pink-700"
          >
            <ArrowLeft size={18} />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" data-testid="cart-page">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
          Shopping Cart ({itemCount} items)
        </h1>

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-lg p-4 lg:p-6 shadow-sm" data-testid={`cart-item-${item.id}`}>
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="w-24 h-32 lg:w-32 lg:h-40 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.product_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ShoppingBag size={32} />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link 
                      to={`/products/${item.product_id}`}
                      className="text-base lg:text-lg font-medium text-gray-900 hover:text-pink-600 line-clamp-2"
                    >
                      {item.product_name}
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">
                      Color: {item.color} | Size: {item.size}
                    </p>
                    <p className="text-lg font-semibold text-gray-900 mt-2">
                      ₹{item.unit_price.toLocaleString('en-IN')}
                    </p>

                    {/* Quantity & Remove - Mobile */}
                    <div className="flex items-center justify-between mt-4 lg:hidden">
                      <div className="flex items-center border border-gray-200 rounded">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={isLoading || item.quantity <= 1}
                          className="p-2 hover:bg-gray-100 disabled:opacity-50"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-4 font-medium">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          disabled={isLoading || item.quantity >= 10}
                          className="p-2 hover:bg-gray-100 disabled:opacity-50"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={isLoading}
                        className="p-2 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Quantity & Remove - Desktop */}
                  <div className="hidden lg:flex flex-col items-end justify-between">
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={isLoading}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={20} />
                    </button>
                    <div className="flex items-center border border-gray-200 rounded">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={isLoading || item.quantity <= 1}
                        className="p-2 hover:bg-gray-100 disabled:opacity-50"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-4 font-medium">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={isLoading || item.quantity >= 10}
                        className="p-2 hover:bg-gray-100 disabled:opacity-50"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                      ₹{(item.unit_price * item.quantity).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Clear Cart */}
            <div className="flex justify-end">
              <button
                onClick={clearCart}
                disabled={isLoading}
                className="text-sm text-gray-500 hover:text-red-500"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="mt-8 lg:mt-0">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-24" data-testid="order-summary">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shippingCost === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `₹${shippingCost}`
                    )}
                  </span>
                </div>
                {subtotal < 2000 && (
                  <p className="text-xs text-gray-500">
                    Add ₹{(2000 - subtotal).toLocaleString('en-IN')} more for free shipping
                  </p>
                )}
                <div className="border-t pt-3">
                  <div className="flex justify-between text-base">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-lg">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">(Inclusive of all taxes)</p>
                </div>
              </div>

              <Link
                to="/checkout"
                className="block w-full mt-6 py-4 bg-pink-600 text-white text-center font-medium rounded-md hover:bg-pink-700"
                data-testid="checkout-btn"
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/collections/new-arrivals"
                className="block w-full mt-3 py-3 border border-gray-300 text-center text-sm text-gray-700 rounded-md hover:bg-gray-50"
              >
                Continue Shopping
              </Link>

              {/* Secure Checkout Badge */}
              <div className="mt-6 pt-6 border-t text-center">
                <p className="text-xs text-gray-500">
                  🔒 Secure Checkout | 💳 COD Available
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
