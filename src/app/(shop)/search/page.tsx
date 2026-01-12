
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { ArrowRight, Search as SearchIcon } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q: string }> }) {
    const { q } = await searchParams
    const query = q || ''

    if (!query) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <SearchIcon className="w-16 h-16 text-gray-200 mb-6" />
                <h1 className="text-2xl font-bold font-heading mb-2">Search for something</h1>
                <p className="text-gray-500">Try searching for "Kurta", "Pink", or "Silk"</p>
            </div>
        )
    }

    const products = await prisma.product.findMany({
        where: {
            OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
                { category: { contains: query, mode: 'insensitive' } },
            ]
        },
        include: {
            variants: true
        }
    })

    return (
        <div className="min-h-screen bg-gray-50 py-12 md:py-20">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8">
                <h1 className="text-3xl font-heading font-bold mb-2">Search Results</h1>
                <p className="text-gray-500 mb-12">
                    Found {products.length} results for <span className="text-black font-bold">"{query}"</span>
                </p>

                {products.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-lg shadow-sm">
                        <h2 className="text-xl font-bold mb-2">No items found</h2>
                        <p className="text-gray-500 mb-6">We couldn't find matches for "{query}". Try a different term.</p>
                        <Link href="/" className="text-primary font-bold hover:underline">
                            View All Collections
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                        {products.map(product => (
                            <Link key={product.id} href={`/products/${product.slug}`} className="group block">
                                <div className="aspect-[2/3] overflow-hidden bg-gray-200 mb-4 relative">
                                    <img
                                        src={product.images[0]}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    {/* Badges could go here */}
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-bold text-sm tracking-wide text-main group-hover:text-primary transition-colors line-clamp-1">
                                        {product.name}
                                    </h3>
                                    <div className="flex gap-3 items-center text-sm">
                                        <span className="font-medium">₹{product.price.toLocaleString('en-IN')}</span>
                                        {product.salePrice && (
                                            <span className="text-gray-400 line-through text-xs">₹{product.salePrice}</span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
