'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface WishlistItem {
    id: string
    name: string
    price: number
    image: string
    slug: string
    category: string
}

interface WishlistContextType {
    wishlist: WishlistItem[]
    isInWishlist: (productId: string) => boolean
    toggleWishlist: (product: WishlistItem) => void
    removeFromWishlist: (productId: string) => void
    wishlistCount: number
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const [wishlist, setWishlist] = useState<WishlistItem[]>([])

    // Load from local storage on mount
    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem('aleesa_wishlist')
        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                setWishlist(parsed) // eslint-disable-line react-hooks/set-state-in-effect // eslint-disable-line
            } catch (e) {
                console.error('Failed to parse wishlist', e)
            }
        }
    }, [])

    // Update local storage on change
    useEffect(() => {
        localStorage.setItem('aleesa_wishlist', JSON.stringify(wishlist))
    }, [wishlist])

    const isInWishlist = (productId: string) => {
        return wishlist.some(item => item.id === productId)
    }

    const toggleWishlist = (product: WishlistItem) => {
        if (isInWishlist(product.id)) {
            setWishlist(prev => prev.filter(item => item.id !== product.id))
        } else {
            setWishlist(prev => [...prev, product])
        }
    }

    const removeFromWishlist = (productId: string) => {
        setWishlist(prev => prev.filter(item => item.id !== productId))
    }

    return (
        <WishlistContext.Provider value={{
            wishlist,
            isInWishlist,
            toggleWishlist,
            removeFromWishlist,
            wishlistCount: wishlist.length
        }}>
            {children}
        </WishlistContext.Provider>
    )
}

export function useWishlist() {
    const context = useContext(WishlistContext)
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider')
    }
    return context
}
