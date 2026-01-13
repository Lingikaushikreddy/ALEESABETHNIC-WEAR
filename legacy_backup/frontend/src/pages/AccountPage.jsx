import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, Package, MapPin, LogOut, ChevronRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

const AccountPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isLoading: authLoading } = useAuth();
  
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  // Determine active tab from URL
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('orders')) setActiveTab('orders');
    else if (path.includes('addresses')) setActiveTab('addresses');
    else setActiveTab('profile');
  }, [location.pathname]);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login?redirect=/account');
    }
  }, [user, authLoading, navigate]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const [ordersRes, addressesRes] = await Promise.all([
          api.getOrders({ page_size: 5 }),
          api.getAddresses(),
        ]);
        
        if (ordersRes.ok) {
          const data = await ordersRes.json();
          setOrders(data.orders);
        }
        if (addressesRes.ok) {
          const data = await addressesRes.json();
          setAddresses(data);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-pink-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" data-testid="account-page">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
          My Account
        </h1>

        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Sidebar */}
          <div className="mb-6 lg:mb-0">
            <div className="bg-white rounded-lg shadow-sm p-4">
              {/* User Info */}
              <div className="flex items-center gap-3 pb-4 border-b">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                  <User className="text-pink-600" size={24} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user?.first_name} {user?.last_name}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="mt-4 space-y-1">
                <Link
                  to="/account"
                  className={`flex items-center gap-3 px-3 py-2 rounded-md ${
                    activeTab === 'profile' ? 'bg-pink-50 text-pink-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <User size={18} />
                  <span>Profile</span>
                </Link>
                <Link
                  to="/account/orders"
                  className={`flex items-center gap-3 px-3 py-2 rounded-md ${
                    activeTab === 'orders' ? 'bg-pink-50 text-pink-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Package size={18} />
                  <span>Orders</span>
                </Link>
                <Link
                  to="/account/addresses"
                  className={`flex items-center gap-3 px-3 py-2 rounded-md ${
                    activeTab === 'addresses' ? 'bg-pink-50 text-pink-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <MapPin size={18} />
                  <span>Addresses</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-red-600 hover:bg-red-50"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="bg-white rounded-lg shadow-sm p-8 flex items-center justify-center">
                <Loader2 className="animate-spin text-pink-600" size={32} />
              </div>
            ) : (
              <>
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    {/* Profile Info */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h2>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">First Name</p>
                          <p className="font-medium text-gray-900">{user?.first_name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Last Name</p>
                          <p className="font-medium text-gray-900">{user?.last_name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium text-gray-900">{user?.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-medium text-gray-900">{user?.phone || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                        <Link to="/account/orders" className="text-sm text-pink-600 hover:underline">
                          View All
                        </Link>
                      </div>
                      
                      {orders.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No orders yet</p>
                      ) : (
                        <div className="space-y-4">
                          {orders.slice(0, 3).map((order) => (
                            <Link
                              key={order.id}
                              to={`/order-confirmation/${order.id}`}
                              className="block p-4 border rounded-lg hover:border-pink-300 transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-gray-900">{order.order_number}</p>
                                  <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                                </div>
                                <div className="text-right">
                                  <span className={`inline-block px-2 py-1 text-xs rounded ${getStatusColor(order.status)}`}>
                                    {order.status?.toUpperCase()}
                                  </span>
                                  <p className="font-medium text-gray-900 mt-1">₹{order.total?.toLocaleString('en-IN')}</p>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Order History</h2>
                    
                    {orders.length === 0 ? (
                      <div className="text-center py-12">
                        <Package size={48} className="text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">No orders yet</p>
                        <Link to="/collections/new-arrivals" className="text-pink-600 hover:underline">
                          Start Shopping
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <Link
                            key={order.id}
                            to={`/order-confirmation/${order.id}`}
                            className="block p-4 border rounded-lg hover:border-pink-300 transition-colors"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium text-gray-900">{order.order_number}</p>
                                <p className="text-sm text-gray-500 mt-1">{formatDate(order.created_at)}</p>
                                <p className="text-sm text-gray-500">{order.items?.length} item(s)</p>
                              </div>
                              <div className="text-right">
                                <span className={`inline-block px-2 py-1 text-xs rounded ${getStatusColor(order.status)}`}>
                                  {order.status?.toUpperCase()}
                                </span>
                                <p className="font-semibold text-gray-900 mt-2">₹{order.total?.toLocaleString('en-IN')}</p>
                                <div className="flex items-center gap-1 text-pink-600 text-sm mt-1">
                                  View Details <ChevronRight size={14} />
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Addresses Tab */}
                {activeTab === 'addresses' && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-gray-900">Saved Addresses</h2>
                      <Link to="/checkout" className="text-sm text-pink-600 hover:underline">
                        Add New
                      </Link>
                    </div>
                    
                    {addresses.length === 0 ? (
                      <div className="text-center py-12">
                        <MapPin size={48} className="text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">No addresses saved</p>
                        <Link to="/checkout" className="text-pink-600 hover:underline">
                          Add Address
                        </Link>
                      </div>
                    ) : (
                      <div className="grid sm:grid-cols-2 gap-4">
                        {addresses.map((addr) => (
                          <div
                            key={addr.id}
                            className={`p-4 border rounded-lg ${addr.is_default ? 'border-pink-300 bg-pink-50' : ''}`}
                          >
                            {addr.is_default && (
                              <span className="inline-block px-2 py-0.5 bg-pink-600 text-white text-xs rounded mb-2">
                                Default
                              </span>
                            )}
                            <p className="font-medium text-gray-900">{addr.full_name}</p>
                            <p className="text-sm text-gray-600 mt-1">{addr.address_line1}</p>
                            {addr.address_line2 && <p className="text-sm text-gray-600">{addr.address_line2}</p>}
                            <p className="text-sm text-gray-600">
                              {addr.city}, {addr.state} - {addr.postal_code}
                            </p>
                            <p className="text-sm text-gray-600">{addr.phone}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
