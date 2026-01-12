
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import CollectionFilters from '@/components/CollectionFilters'

export default async function CollectionPage({
    params,
    searchParams
}: {
    params: Promise<{ slug: string }>,
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const { slug } = await params
    const resolvedSearchParams = await searchParams

    // Parse Filters
    const priceMin = resolvedSearchParams.price_min ? Number(resolvedSearchParams.price_min) : undefined
    const priceMax = resolvedSearchParams.price_max ? Number(resolvedSearchParams.price_max) : undefined
    const sort = typeof resolvedSearchParams.sort === 'string' ? resolvedSearchParams.sort : 'newest'

    // Sort Logic
    let orderBy: any = { createdAt: 'desc' }
    if (sort === 'price_asc') orderBy = { price: 'asc' }
    if (sort === 'price_desc') orderBy = { price: 'desc' }

    // Filter Logic
    let where: any = {}

    // Price Filter
    if (priceMin || priceMax) {
        where.price = {}
        if (priceMin) where.price.gte = priceMin
        if (priceMax) where.price.lte = priceMax
    }

    let title = "All Products"

    if (slug === 'new-arrivals') {
        title = "New Arrivals"
    } else if (slug !== 'all') {
        const categoryName = slug.replace(/-/g, ' ')
        where.category = { contains: categoryName, mode: 'insensitive' }
        title = categoryName.charAt(0).toUpperCase() + categoryName.slice(1)
    }

    const products = await prisma.product.findMany({
        where: {
            AND: [
                { isActive: true },
                where
            ]
        },
        orderBy: orderBy
    })

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
                    <h1 className="text-3xl font-heading font-bold capitalize text-primary">{title}</h1>
                    <div className="text-gray-500 text-sm font-medium">{products.length} Items</div>
                </div>

                <CollectionFilters />

                {products.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-lg">
                        <p className="text-gray-500 font-medium text-lg mb-2">No products found.</p>
                        <p className="text-gray-400 text-sm">Try adjusting your filters.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
                        {products.map((product) => (
                            <Link key={product.id} href={`/products/${product.slug}`} className="group block">
                                <div className="aspect-[2/3] overflow-hidden bg-gray-100 mb-4 relative">
                                    <img
                                        src={product.images[0] || '/placeholder.png'}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-bold text-sm tracking-wide text-main group-hover:text-primary transition-colors line-clamp-1">
                                        {product.name}
                                    </h3>
                                    <p className="text-xs text-gray-500 capitalize">{product.category}</p>
                                    <div className="font-bold text-gray-900 mt-1">₹{product.price.toLocaleString('en-IN')}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
