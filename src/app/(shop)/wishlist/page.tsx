'use client'

import Link from 'next/link'
import { useWishlist } from '@/context/WishlistContext'
import { Trash2, ShoppingBag } from 'lucide-react'

export default function WishlistPage() {
    const { wishlist, removeFromWishlist } = useWishlist()

    return (
        <div className="min-h-screen bg-gray-50 py-12 md:py-20">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8">
                <h1 className="text-3xl font-heading font-bold mb-8 text-center text-primary">My Wishlist</h1>

                {wishlist.length === 0 ? (
                    <div className="text-center bg-white p-12 rounded-lg shadow-sm">
                        <HeartIcon className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                        <h2 className="text-xl font-bold mb-2">Your wishlist is empty</h2>
                        <p className="text-gray-500 mb-6">Save items you love to view them here later.</p>
                        <Link href="/" className="inline-block bg-primary text-white px-8 py-3 rounded font-bold uppercase tracking-wide hover:bg-pink-600">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {wishlist.map((item) => (
                            <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-sm group relative">
                                <Link href={`/products/${item.slug}`}>
                                    <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                </Link>

                                <div className="p-4">
                                    <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider">{item.category}</div>
                                    <Link href={`/products/${item.slug}`}>
                                        <h3 className="font-bold text-gray-900 mb-2 truncate hover:text-primary">{item.name}</h3>
                                    </Link>
                                    <div className="flex justify-between items-center">
                                        <div className="font-bold text-gray-900">₹{item.price.toLocaleString('en-IN')}</div>
                                        <button
                                            onClick={() => removeFromWishlist(item.id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors p-2"
                                            title="Remove"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                                <Link
                                    href={`/products/${item.slug}`}
                                    className="absolute bottom-20 right-4 bg-white p-2 rounded-full shadow-md text-primary hover:bg-primary hover:text-white transition-colors opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300"
                                >
                                    <ShoppingBag size={20} />
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

function HeartIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
    )
}
