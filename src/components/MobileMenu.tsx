'use client'

import { useState } from 'react'
import Link from 'next/link'
import { X, ChevronRight } from 'lucide-react'

interface MobileMenuProps {
    isOpen: boolean
    onClose: () => void
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
    const categories = [
        'New Arrivals',
        'Suits',
        'Sarees',
        'Dresses',
        'Lehenga Sets',
        'Bridals',
        'Wedding Edit',
        'Formals',
        'Luxury Pret',
        'Unstitched',
        "Men's Wear",
        'Jewellery',
        'Gifts'
    ]

    if (!isOpen) return null

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
                onClick={onClose}
            />

            {/* Menu Panel */}
            <div className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white z-50 md:hidden overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <span className="text-xl font-heading font-bold text-primary">ALEESA</span>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                        <X size={24} />
                    </button>
                </div>

                {/* Categories */}
                <nav className="py-4">
                    <div className="px-4 mb-3">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Shop by Category</h3>
                    </div>
                    {categories.map((category) => (
                        <Link
                            key={category}
                            href={`/collections/${category.toLowerCase().replace(/[']/g, '').replace(/\s+/g, '-')}`}
                            onClick={onClose}
                            className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                        >
                            <span className="text-sm font-medium">{category}</span>
                            <ChevronRight size={18} className="text-gray-400" />
                        </Link>
                    ))}
                </nav>

                {/* Quick Links */}
                <div className="border-t mt-4 pt-4 px-4 pb-6">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Quick Links</h3>
                    <div className="space-y-2">
                        <Link href="/wishlist" onClick={onClose} className="block py-2 text-sm font-medium hover:text-primary">
                            My Wishlist
                        </Link>
                        <Link href="/orders" onClick={onClose} className="block py-2 text-sm font-medium hover:text-primary">
                            My Orders
                        </Link>
                        <Link href="/admin" onClick={onClose} className="block py-2 text-sm font-medium hover:text-primary">
                            Admin Panel
                        </Link>
                    </div>
                </div>

                {/* Contact */}
                <div className="border-t px-4 py-4 bg-gray-50">
                    <p className="text-xs text-gray-600 mb-2">Need Help?</p>
                    <a
                        href="https://wa.me/918143906891"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-primary"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                        WhatsApp: 8143906891
                    </a>
                </div>
            </div>
        </>
    )
}
