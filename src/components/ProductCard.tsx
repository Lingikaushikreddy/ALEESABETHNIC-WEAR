'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, ShoppingBag } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'

interface ProductCardProps {
    product: any
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useCart()
    const { toggleWishlist, isInWishlist } = useWishlist()
    const [imageLoaded, setImageLoaded] = useState(false)
    const [showQuickAdd, setShowQuickAdd] = useState(false)

    const inWishlist = isInWishlist(product.id)
    const mainImage = product.images?.[0] || '/placeholder.jpg'

    const handleQuickAdd = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        
        if (product.variants?.[0]?.sizes?.[0]) {
            addToCart({
                productId: product.id,
                variantId: product.variants[0].id,
                name: product.name,
                price: product.price,
                image: mainImage,
                size: product.variants[0].sizes[0].size,
                quantity: 1
            })
        }
    }

    const handleWishlist = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        toggleWishlist({
            id: product.id,
            name: product.name,
            price: product.price,
            image: mainImage,
            slug: product.slug,
            category: product.category
        })
    }

    return (
        <Link 
            href={`/products/${product.slug}`}
            className="group block"
            onMouseEnter={() => setShowQuickAdd(true)}
            onMouseLeave={() => setShowQuickAdd(false)}
        >
            <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-3">
                {/* Image */}
                {!imageLoaded && (
                    <div className="absolute inset-0 skeleton" />
                )}
                <img
                    src={mainImage}
                    alt={product.name}
                    className={`w-full h-full object-cover transition-all duration-500 ${
                        imageLoaded ? 'opacity-100 group-hover:scale-105' : 'opacity-0'
                    }`}
                    onLoad={() => setImageLoaded(true)}
                    loading="lazy"
                />

                {/* Wishlist Button */}
                <button
                    onClick={handleWishlist}
                    className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all active:scale-95 z-10"
                    aria-label="Add to wishlist"
                >
                    <Heart
                        size={18}
                        className={inWishlist ? 'fill-primary text-primary' : 'text-gray-700'}
                    />
                </button>

                {/* Quick Add Button (Mobile & Desktop) */}
                <button
                    onClick={handleQuickAdd}
                    className={`absolute bottom-3 left-3 right-3 bg-primary text-white py-3 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg ${
                        showQuickAdd ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 md:opacity-0'
                    } md:group-hover:opacity-100 md:group-hover:translate-y-0`}
                >
                    <ShoppingBag size={16} />
                    Quick Add
                </button>

                {/* Sale Badge */}
                {product.salePrice && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        SALE
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="space-y-1">
                <p className="text-xs text-gray-500 uppercase tracking-wider">{product.category}</p>
                <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                    {product.name}
                </h3>
                <div className="flex items-center gap-2">
                    <span className="font-bold text-main">₹{product.price.toLocaleString('en-IN')}</span>
                    {product.salePrice && (
                        <span className="text-sm text-gray-400 line-through">
                            ₹{product.salePrice.toLocaleString('en-IN')}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    )
}
