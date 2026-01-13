import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const refreshCart = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.getCart();
      if (response.ok) {
        const data = await response.json();
        setCart(data);
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart, user]);

  const addToCart = async (productId, variantId, size, quantity = 1) => {
    setIsLoading(true);
    try {
      const response = await api.addToCart({
        product_id: productId,
        variant_id: variantId,
        size: size,
        quantity: quantity,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to add to cart');
      }

      const data = await response.json();
      setCart(data);
      return data;
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    setIsLoading(true);
    try {
      const response = await api.updateCartItem(itemId, quantity);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to update quantity');
      }

      const data = await response.json();
      setCart(data);
      return data;
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (itemId) => {
    setIsLoading(true);
    try {
      const response = await api.removeCartItem(itemId);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to remove item');
      }

      const data = await response.json();
      setCart(data);
      return data;
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    setIsLoading(true);
    try {
      const response = await api.clearCart();
      if (response.ok) {
        const data = await response.json();
        setCart(data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const itemCount = cart?.item_count || 0;
  const subtotal = cart?.subtotal || 0;
  const items = cart?.cart?.items || [];

  return (
    <CartContext.Provider
      value={{
        cart,
        items,
        itemCount,
        subtotal,
        isLoading,
        refreshCart,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
