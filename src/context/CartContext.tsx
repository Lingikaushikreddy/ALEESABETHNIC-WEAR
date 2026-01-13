'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export interface CartItem {
    productId: string
    variantId?: string
    name: string
    price: number
    image: string
    size: string
    quantity: number
    maxStock: number
}

interface CartContextType {
    items: CartItem[]
    addToCart: (item: CartItem) => void
    removeFromCart: (productId: string, size: string) => void
    updateQuantity: (productId: string, size: string, quantity: number) => void
    clearCart: () => void
    cartCount: number
    subtotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
    const [isLoaded, setIsLoaded] = useState(false)

    // Load from local storage on mount
    // Load from local storage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('aleesa_cart')
        if (savedCart) {
            try {
                const parsed = JSON.parse(savedCart)
                setItems(parsed) // eslint-disable-line react-hooks/set-state-in-effect // eslint-disable-line
            } catch (e) {
                console.error('Failed to parse cart', e)
            }
        }
        setIsLoaded(true)
    }, [])

    // Save to local storage whenever items change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('aleesa_cart', JSON.stringify(items))
        }
    }, [items, isLoaded])

    const addToCart = (newItem: CartItem) => {
        setItems(currentItems => {
            const existingItemIndex = currentItems.findIndex(
                item => item.productId === newItem.productId && item.size === newItem.size
            )

            if (existingItemIndex > -1) {
                // Update quantity of existing item
                const newItems = [...currentItems]
                const item = newItems[existingItemIndex]
                const newQuantity = Math.min(item.quantity + newItem.quantity, item.maxStock)
                newItems[existingItemIndex] = { ...item, quantity: newQuantity }
                return newItems
            } else {
                // Add new item
                return [...currentItems, newItem]
            }
        })
    }

    const removeFromCart = (productId: string, size: string) => {
        setItems(currentItems =>
            currentItems.filter(item => !(item.productId === productId && item.size === size))
        )
    }

    const updateQuantity = (productId: string, size: string, quantity: number) => {
        if (quantity < 1) return

        setItems(currentItems =>
            currentItems.map(item => {
                if (item.productId === productId && item.size === size) {
                    return { ...item, quantity: Math.min(quantity, item.maxStock) }
                }
                return item
            })
        )
    }

    const clearCart = () => {
        setItems([])
    }

    const cartCount = items.reduce((total, item) => total + item.quantity, 0)
    const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0)

    if (!isLoaded) {
        return null // or a loading spinner
    }

    return (
        <CartContext.Provider value={{
            items,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartCount,
            subtotal
        }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}
