import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Star } from 'lucide-react'
import ProductActions from '@/components/ProductActions'
import ProductReviews from '@/components/ProductReviews'

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params

    // Fetch product with variants (and their sizes) and reviews (and their authors)
    const product = await prisma.product.findUnique({
        where: { slug },
        include: {
            variants: {
                include: {
                    sizes: true
                }
            },
            reviews: {
                orderBy: { createdAt: 'desc' },
                include: { user: true }
            }
        } as any // Cast to any because Prisma types might be stale
    }) as any

    if (!product) notFound()

    // Fetch similar products based on the same category
    const similarProducts = await prisma.product.findMany({
        where: {
            category: product.category,
            id: { not: product.id }
        },
        take: 4
    })

    // Simplified view: Just show the first variant
    const variant = product.variants[0]
    if (!variant) return <div>No variants available</div>

    return (
        <div className="min-h-screen bg-white pb-20">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12">
                <div className="grid md:grid-cols-2 gap-12 mb-24">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
                            <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex gap-4">
                            {product.images.map((img: string, i: number) => (
                                <div key={i} className="w-20 h-24 bg-gray-100 rounded overflow-hidden">
                                    <img src={img} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Details */}
                    <div>
                        <div className="text-gray-500 text-sm uppercase tracking-widest mb-2 font-heading">{product.category}</div>
                        <h1 className="text-3xl font-heading font-bold text-main mb-4 tracking-wide">{product.name}</h1>
                        <div className="flex items-center gap-4 mb-6 border-b border-gray-100 pb-6">
                            <div className="text-2xl font-bold text-main">₹{product.price.toLocaleString('en-IN')}</div>
                            {product.salePrice && (
                                <div className="text-lg text-gray-400 line-through">₹{product.salePrice}</div>
                            )}
                            <span className="text-xs font-bold text-primary uppercase bg-pink-50 px-2 py-1 rounded">Tax Included</span>
                        </div>

                        <div className="prose prose-sm text-gray-600 mb-8 font-sans leading-relaxed">
                            {product.description}
                        </div>

                        <ProductActions product={product} variant={variant} />

                        <div className="grid grid-cols-2 gap-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                            <div className="flex items-center gap-3 border p-3 rounded-sm justify-center">
                                <Star size={16} /> Authentic Quality
                            </div>
                            <div className="flex items-center gap-3 border p-3 rounded-sm justify-center">
                                <Star size={16} /> Free Shipping
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews */}
                {/* Cast to any if strict typing fails due to client generation lag, but try to use inferred types */}
                <ProductReviews productId={product.id} reviews={product.reviews as any} />

                {/* Similar Products */}
                {similarProducts.length > 0 && (
                    <div className="border-t pt-12">
                        <h2 className="text-2xl font-heading font-bold mb-8 text-center uppercase tracking-wider">You May Also Like</h2>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
                            {similarProducts.map((item) => (
                                <Link key={item.id} href={`/products/${item.slug}`} className="group block">
                                    <div className="aspect-[2/3] overflow-hidden bg-gray-100 mb-4 relative">
                                        <img
                                            src={item.images[0] || '/placeholder.png'}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-bold text-sm tracking-wide text-main group-hover:text-primary transition-colors line-clamp-1">
                                            {item.name}
                                        </h3>
                                        <p className="text-xs text-gray-500 capitalize">{item.category}</p>
                                        <div className="font-bold text-gray-900 mt-1">₹{item.price.toLocaleString('en-IN')}</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
