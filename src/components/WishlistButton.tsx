'use client'

import { Heart } from 'lucide-react'
import { useWishlist } from '@/context/WishlistContext'

interface WishlistButtonProps {
    product: {
        id: string
        name: string
        price: number
        image: string
        slug: string
        category: string
    }
    className?: string
    iconSize?: number
}

export default function WishlistButton({ product, className = '', iconSize = 20 }: WishlistButtonProps) {
    const { isInWishlist, toggleWishlist } = useWishlist()
    const active = isInWishlist(product.id)

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault() // Prevent navigation if on a link
        e.stopPropagation()
        toggleWishlist(product)
    }

    return (
        <button
            onClick={handleClick}
            className={`transition-colors hover:scale-110 active:scale-95 duration-200 ${className}`}
            title={active ? "Remove from Wishlist" : "Add to Wishlist"}
        >
            <Heart
                size={iconSize}
                className={`${active ? 'fill-primary text-primary' : 'text-gray-400 hover:text-primary'}`}
            />
        </button>
    )
}
