/**
 * API client for Aleesa Ethnic Wear
 */
const API_URL = process.env.REACT_APP_BACKEND_URL || '';

// Token management
let accessToken = localStorage.getItem('accessToken');

export const setAccessToken = (token) => {
  accessToken = token;
  if (token) {
    localStorage.setItem('accessToken', token);
  } else {
    localStorage.removeItem('accessToken');
  }
};

export const getAccessToken = () => accessToken;

// Session ID for guest carts
const getSessionId = () => {
  let sessionId = localStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem('session_id', sessionId);
  }
  return sessionId;
};

/**
 * Fetch wrapper with automatic token handling
 */
export const apiFetch = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  // Add session ID for cart endpoints (guest users)
  if (endpoint.startsWith('/api/cart') || endpoint.startsWith('/api/orders')) {
    headers['X-Session-ID'] = getSessionId();
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle 401 - try to refresh token
  if (response.status === 401 && !options._retry) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return apiFetch(endpoint, { ...options, _retry: true });
    }
  }

  return response;
};

/**
 * Refresh access token
 */
const refreshAccessToken = async () => {
  try {
    const response = await fetch(`${API_URL}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      setAccessToken(data.access_token);
      return true;
    }
  } catch (error) {
    console.error('Token refresh failed:', error);
  }

  setAccessToken(null);
  return false;
};

// API helpers
export const api = {
  // Auth
  register: (data) => apiFetch('/api/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  logout: () => apiFetch('/api/auth/logout', { method: 'POST' }),
  getMe: () => apiFetch('/api/auth/me'),

  // Categories
  getCategories: () => apiFetch('/api/categories'),
  getCategory: (slug) => apiFetch(`/api/categories/${slug}`),

  // Products
  getProducts: (params) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/api/products${query ? `?${query}` : ''}`);
  },
  getProduct: (slug) => apiFetch(`/api/products/${slug}`),
  searchProducts: (q) => apiFetch(`/api/search?q=${encodeURIComponent(q)}`),

  // Cart
  getCart: () => apiFetch('/api/cart'),
  addToCart: (data) => apiFetch('/api/cart/items', { method: 'POST', body: JSON.stringify(data) }),
  updateCartItem: (itemId, quantity) => apiFetch(`/api/cart/items/${itemId}`, { method: 'PATCH', body: JSON.stringify({ quantity }) }),
  removeCartItem: (itemId) => apiFetch(`/api/cart/items/${itemId}`, { method: 'DELETE' }),
  clearCart: () => apiFetch('/api/cart', { method: 'DELETE' }),

  // Addresses
  getAddresses: () => apiFetch('/api/addresses'),
  createAddress: (data) => apiFetch('/api/addresses', { method: 'POST', body: JSON.stringify(data) }),
  updateAddress: (id, data) => apiFetch(`/api/addresses/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteAddress: (id) => apiFetch(`/api/addresses/${id}`, { method: 'DELETE' }),
  setDefaultAddress: (id) => apiFetch(`/api/addresses/${id}/default`, { method: 'POST' }),

  // Orders
  validateCheckout: () => apiFetch('/api/orders/validate', { method: 'POST' }),
  createOrder: (data) => apiFetch('/api/orders', { method: 'POST', body: JSON.stringify(data) }),
  getOrders: (params) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/api/orders${query ? `?${query}` : ''}`);
  },
  getOrder: (id) => apiFetch(`/api/orders/${id}`),

  // Admin Products
  getAdminProducts: () => apiFetch('/api/admin/products'),
  createProduct: (data) => apiFetch('/api/admin/products', { method: 'POST', body: JSON.stringify(data) }),
  updateProduct: (id, data) => apiFetch(`/api/admin/products/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteProduct: (id) => apiFetch(`/api/admin/products/${id}`, { method: 'DELETE' }),
};

export default api;
