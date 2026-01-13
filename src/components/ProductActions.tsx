'use client'

import { useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import WishlistButton from '@/components/WishlistButton'
import WhatsAppButton from '@/components/WhatsAppButton'
import SizeGuide from '@/components/SizeGuide'

interface Size {
    id: string
    size: string
    stock: number
}

interface Variant {
    id: string
    sizes: Size[]
}

interface Product {
    id: string
    name: string
    price: number
    images: string[]
    slug: string
}

interface ProductActionsProps {
    product: Product
    variant: Variant
}

export default function ProductActions({ product, variant }: ProductActionsProps) {
    const [selectedSize, setSelectedSize] = useState<string>('')
    const { addToCart } = useCart()
    const [isAdded, setIsAdded] = useState(false)

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert('Please select a size') // Replace with toast later if possible
            return
        }

        const sizeObj = variant.sizes.find(s => s.size === selectedSize)
        if (!sizeObj) return

        addToCart({
            productId: product.id,
            variantId: variant.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            size: selectedSize,
            quantity: 1,
            maxStock: sizeObj.stock
        })

        setIsAdded(true)
        setTimeout(() => setIsAdded(false), 2000)
    }

    return (
        <div>
            {/* Size Selector */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                    <div className="font-bold text-sm uppercase tracking-widest">Select Size</div>
                    <SizeGuide />
                </div>
                <div className="flex flex-wrap gap-3">
                    {variant.sizes.map(s => (
                        <button
                            key={s.id}
                            disabled={s.stock === 0}
                            onClick={() => setSelectedSize(s.size)}
                            className={`w-12 h-12 flex items-center justify-center border font-medium transition-all ${s.stock === 0
                                ? 'opacity-40 cursor-not-allowed bg-gray-50 border-gray-200 decoration-slice line-through'
                                : selectedSize === s.size
                                    ? 'border-primary text-primary bg-pink-50 ring-1 ring-primary'
                                    : 'hover:border-primary hover:text-primary border-gray-300'
                                }`}
                        >
                            {s.size}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex gap-4">
                <button
                    onClick={handleAddToCart}
                    disabled={!selectedSize}
                    className={`flex-1 py-4 font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 ${!selectedSize
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : isAdded
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-primary text-white hover:bg-pink-600'
                        }`}
                >
                    <ShoppingCart size={20} strokeWidth={2} />
                    {isAdded ? 'Added' : 'Add to Cart'}
                </button>

                <WishlistButton
                    product={{
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.images[0],
                        slug: product.slug,
                        category: "product"
                    }}
                    className="w-16 flex items-center justify-center border border-gray-300 hover:border-primary"
                    iconSize={24}
                />
            </div>

            {/* WhatsApp Buy Button */}
            <div className="mt-4">
                <WhatsAppButton
                    productName={product.name}
                    productUrl={typeof window !== 'undefined' ? window.location.href : undefined}
                    variantName={selectedSize ? `Size: ${selectedSize}` : undefined}
                />
                <p className="text-center text-xs text-gray-500 mt-2">
                    Direct buy via WhatsApp • Instant Support
                </p>
            </div>
        </div>
    )
}
