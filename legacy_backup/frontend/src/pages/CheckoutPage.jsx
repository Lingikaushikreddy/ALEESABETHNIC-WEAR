import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, Plus, Check, ArrowLeft, Loader2, ShoppingBag } from 'lucide-react';
import { api } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, subtotal, refreshCart } = useCart();
  
  const [step, setStep] = useState(1); // 1: Address, 2: Review, 3: Confirm
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [validationData, setValidationData] = useState(null);
  
  const [addressForm, setAddressForm] = useState({
    full_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India',
    is_default: false,
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/checkout');
    }
  }, [user, navigate]);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !loading) {
      navigate('/cart');
    }
  }, [items, loading, navigate]);

  // Fetch addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await api.getAddresses();
        if (response.ok) {
          const data = await response.json();
          setAddresses(data);
          // Select default address
          const defaultAddr = data.find(a => a.is_default);
          if (defaultAddr) {
            setSelectedAddressId(defaultAddr.id);
          } else if (data.length > 0) {
            setSelectedAddressId(data[0].id);
          }
        }
      } catch (error) {
        console.error('Failed to fetch addresses:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchAddresses();
    }
  }, [user]);

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const response = await api.createAddress(addressForm);
      if (response.ok) {
        const newAddr = await response.json();
        setAddresses(prev => [...prev, newAddr]);
        setSelectedAddressId(newAddr.id);
        setShowAddressForm(false);
        setAddressForm({
          full_name: '',
          phone: '',
          address_line1: '',
          address_line2: '',
          city: '',
          state: '',
          postal_code: '',
          country: 'India',
          is_default: false,
        });
        toast.success('Address added successfully');
      } else {
        const error = await response.json();
        toast.error(error.detail || 'Failed to add address');
      }
    } catch (error) {
      toast.error('Failed to add address');
    } finally {
      setSubmitting(false);
    }
  };

  const handleValidateCheckout = async () => {
    if (!selectedAddressId) {
      toast.error('Please select a delivery address');
      return;
    }
    
    setSubmitting(true);
    try {
      const response = await api.validateCheckout();
      if (response.ok) {
        const data = await response.json();
        if (data.valid) {
          setValidationData(data);
          setStep(2);
        } else {
          toast.error(data.errors?.[0] || 'Validation failed');
        }
      } else {
        const error = await response.json();
        toast.error(error.detail || 'Validation failed');
      }
    } catch (error) {
      toast.error('Failed to validate checkout');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePlaceOrder = async () => {
    setSubmitting(true);
    try {
      const idempotencyKey = `order_${user.id}_${Date.now()}`;
      const response = await api.createOrder({
        address_id: selectedAddressId,
        idempotency_key: idempotencyKey,
      });
      
      if (response.ok) {
        const data = await response.json();
        await refreshCart();
        navigate(`/order-confirmation/${data.order.id}`);
      } else {
        const error = await response.json();
        toast.error(error.detail || 'Failed to place order');
      }
    } catch (error) {
      toast.error('Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedAddress = addresses.find(a => a.id === selectedAddressId);
  const shippingCost = subtotal >= 2000 ? 0 : 99;
  const total = subtotal + shippingCost;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-pink-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" data-testid="checkout-page">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/cart" className="inline-flex items-center gap-2 text-gray-600 hover:text-pink-600 mb-4">
            <ArrowLeft size={18} />
            Back to Cart
          </Link>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
            Checkout
          </h1>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= s ? 'bg-pink-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {step > s ? <Check size={20} /> : s}
              </div>
              {s < 3 && (
                <div className={`w-16 h-1 ${step > s ? 'bg-pink-600' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Address */}
            {step === 1 && (
              <div className="bg-white rounded-lg p-6 shadow-sm" data-testid="address-step">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin size={20} className="text-pink-600" />
                  Delivery Address
                </h2>

                {/* Address List */}
                {addresses.length > 0 && !showAddressForm && (
                  <div className="space-y-3 mb-4">
                    {addresses.map((addr) => (
                      <label
                        key={addr.id}
                        className={`block p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedAddressId === addr.id
                            ? 'border-pink-600 bg-pink-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="address"
                            checked={selectedAddressId === addr.id}
                            onChange={() => setSelectedAddressId(addr.id)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{addr.full_name}</p>
                            <p className="text-sm text-gray-600 mt-1">
                              {addr.address_line1}
                              {addr.address_line2 && `, ${addr.address_line2}`}
                            </p>
                            <p className="text-sm text-gray-600">
                              {addr.city}, {addr.state} - {addr.postal_code}
                            </p>
                            <p className="text-sm text-gray-600">{addr.phone}</p>
                            {addr.is_default && (
                              <span className="inline-block mt-2 px-2 py-0.5 bg-gray-100 text-xs text-gray-600 rounded">
                                Default
                              </span>
                            )}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                {/* Add New Address Button/Form */}
                {!showAddressForm ? (
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-pink-600 hover:text-pink-600 flex items-center justify-center gap-2"
                  >
                    <Plus size={18} />
                    Add New Address
                  </button>
                ) : (
                  <form onSubmit={handleAddressSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={addressForm.full_name}
                          onChange={(e) => setAddressForm(f => ({ ...f, full_name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                        <input
                          type="tel"
                          required
                          value={addressForm.phone}
                          onChange={(e) => setAddressForm(f => ({ ...f, phone: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1 *</label>
                      <input
                        type="text"
                        required
                        value={addressForm.address_line1}
                        onChange={(e) => setAddressForm(f => ({ ...f, address_line1: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                        placeholder="House No., Building, Street"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                      <input
                        type="text"
                        value={addressForm.address_line2}
                        onChange={(e) => setAddressForm(f => ({ ...f, address_line2: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                        placeholder="Landmark, Area (Optional)"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                        <input
                          type="text"
                          required
                          value={addressForm.city}
                          onChange={(e) => setAddressForm(f => ({ ...f, city: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                        <input
                          type="text"
                          required
                          value={addressForm.state}
                          onChange={(e) => setAddressForm(f => ({ ...f, state: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code *</label>
                        <input
                          type="text"
                          required
                          value={addressForm.postal_code}
                          onChange={(e) => setAddressForm(f => ({ ...f, postal_code: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                        <input
                          type="text"
                          value={addressForm.country}
                          disabled
                          className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="is_default"
                        checked={addressForm.is_default}
                        onChange={(e) => setAddressForm(f => ({ ...f, is_default: e.target.checked }))}
                        className="rounded"
                      />
                      <label htmlFor="is_default" className="text-sm text-gray-600">Set as default address</label>
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowAddressForm(false)}
                        className="flex-1 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:opacity-50"
                      >
                        {submitting ? 'Saving...' : 'Save Address'}
                      </button>
                    </div>
                  </form>
                )}

                {/* Continue Button */}
                {!showAddressForm && (
                  <button
                    onClick={handleValidateCheckout}
                    disabled={!selectedAddressId || submitting}
                    className="w-full mt-6 py-4 bg-pink-600 text-white font-medium rounded-md hover:bg-pink-700 disabled:opacity-50 flex items-center justify-center gap-2"
                    data-testid="continue-btn"
                  >
                    {submitting && <Loader2 className="animate-spin" size={18} />}
                    Continue to Review
                  </button>
                )}
              </div>
            )}

            {/* Step 2: Review */}
            {step === 2 && (
              <div className="space-y-6" data-testid="review-step">
                {/* Delivery Address */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Delivery Address</h2>
                    <button onClick={() => setStep(1)} className="text-sm text-pink-600 hover:underline">
                      Change
                    </button>
                  </div>
                  {selectedAddress && (
                    <div className="text-sm text-gray-600">
                      <p className="font-medium text-gray-900">{selectedAddress.full_name}</p>
                      <p>{selectedAddress.address_line1}</p>
                      {selectedAddress.address_line2 && <p>{selectedAddress.address_line2}</p>}
                      <p>{selectedAddress.city}, {selectedAddress.state} - {selectedAddress.postal_code}</p>
                      <p>Phone: {selectedAddress.phone}</p>
                    </div>
                  )}
                </div>

                {/* Order Items */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="w-16 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                          {item.image ? (
                            <img src={item.image} alt={item.product_name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag size={20} className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{item.product_name}</p>
                          <p className="text-sm text-gray-500">{item.color} / {item.size}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium text-gray-900">
                          ₹{(item.unit_price * item.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>
                  <div className="p-4 border border-pink-600 bg-pink-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Check className="text-pink-600" size={20} />
                      <div>
                        <p className="font-medium text-gray-900">Cash on Delivery (COD)</p>
                        <p className="text-sm text-gray-500">Pay when you receive your order</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={submitting}
                  className="w-full py-4 bg-pink-600 text-white font-medium rounded-md hover:bg-pink-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  data-testid="place-order-btn"
                >
                  {submitting && <Loader2 className="animate-spin" size={18} />}
                  Place Order (COD)
                </button>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="mt-8 lg:mt-0">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({items.length} items)</span>
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
                <div className="border-t pt-3">
                  <div className="flex justify-between text-base">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-lg">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">(Inclusive of all taxes)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
