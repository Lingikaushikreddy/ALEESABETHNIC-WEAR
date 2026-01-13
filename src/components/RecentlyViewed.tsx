'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Product {
    id: string
    name: string
    price: number
    image: string
    slug: string
    category: string
}

interface RecentlyViewedProps {
    currentProduct?: Product
}

export default function RecentlyViewed({ currentProduct }: RecentlyViewedProps) {
    const [recentProducts, setRecentProducts] = useState<Product[]>([])

    useEffect(() => {
        // 1. Get existing items
        const stored = localStorage.getItem('recently_viewed')
        let items: Product[] = stored ? JSON.parse(stored) : []

        // 2. If valid current product, add it to history
        if (currentProduct) {
            // Remove if already exists (to move to top)
            items = items.filter(p => p.id !== currentProduct.id)

            // Add to start
            items.unshift(currentProduct)

            // Limit to 8 items
            if (items.length > 8) items = items.slice(0, 8)

            // Save back
            localStorage.setItem('recently_viewed', JSON.stringify(items))
        }

        // 3. Set state (excluding current product from display if on that page)
        const displayItems = currentProduct
            ? items.filter(p => p.id !== currentProduct.id)
            : items

        setRecentProducts(displayItems)
    }, [currentProduct])

    if (recentProducts.length === 0) return null

    return (
        <div className="border-t pt-12 mt-12">
            <h2 className="text-2xl font-heading font-bold mb-8 text-center uppercase tracking-wider">Recently Viewed</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
                {recentProducts.slice(0, 4).map((product) => (
                    <Link key={product.id} href={`/products/${product.slug}`} className="group block">
                        <div className="aspect-[3/4] overflow-hidden bg-gray-100 mb-3 relative rounded-lg">
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                sizes="(max-width: 768px) 50vw, 25vw"
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-gray-500 uppercase tracking-wider">{product.category}</p>
                            <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                                {product.name}
                            </h3>
                            <div className="font-bold text-main">₹{product.price.toLocaleString('en-IN')}</div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
