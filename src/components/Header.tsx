'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Search, ShoppingBag, Heart, User, Menu } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import SearchModal from './SearchModal'
import MobileMenu from './MobileMenu'

export default function Header() {
    const { cartCount } = useCart()
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    return (
        <>
            <header className="bg-white sticky top-0 z-50 border-b border-gray-100">
                {/* Top Bar - Icons & Logo */}
                <div className="max-w-[1400px] mx-auto px-4 md:px-8 min-h-[120px] py-4 flex items-center justify-between relative">

                    {/* Left: Mobile Menu / Search */}
                    <div className="flex-1 flex items-center gap-4">
                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="md:hidden text-gray-600 hover:text-primary transition-colors p-2 -ml-2"
                            aria-label="Open menu"
                        >
                            <Menu strokeWidth={1.5} size={28} />
                        </button>
                        {/* Search Button (Desktop) */}
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="hidden md:block text-gray-600 hover:text-primary transition-colors"
                        >
                            <Search strokeWidth={1.5} size={24} />
                        </button>
                    </div>

                    {/* Center: Logo */}
                    <div className="flex-1 flex justify-center">
                        <Link href="/" className="flex items-center">
                            <img
                                src="/logo.png"
                                alt="Aleesa Ethnic Wear"
                                className="h-32 md:h-40 w-auto object-contain mix-blend-multiply"
                            />
                        </Link>
                    </div>


                    {/* Right: Icons */}
                    <div className="flex-1 flex justify-end items-center gap-6">
                        <Link href="/orders" className="text-gray-600 hover:text-primary transition-colors">
                            <User strokeWidth={1.5} size={22} />
                        </Link>
                        <Link href="/wishlist" className="text-gray-600 hover:text-primary transition-colors">
                            <Heart strokeWidth={1.5} size={22} />
                        </Link>
                        <Link href="/cart" className="text-gray-600 hover:text-primary transition-colors relative">
                            <ShoppingBag strokeWidth={1.5} size={22} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>

                {/* Bottom Bar - Navigation */}
                <div className="hidden md:flex justify-center pb-4 overflow-x-auto">
                    <nav className="flex items-center gap-6 lg:gap-8">
                        {[
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
                        ].map((item) => (
                            <Link
                                key={item}
                                href={`/collections/${item.toLowerCase().replace(/[']/g, '').replace(/\s+/g, '-')}`}
                                className="text-[10px] font-bold uppercase tracking-[2px] text-main hover:text-primary transition-colors whitespace-nowrap"
                            >
                                {item}
                            </Link>
                        ))}
                    </nav>
                </div>
            </header>

            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
            <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
        </>
    )
}
