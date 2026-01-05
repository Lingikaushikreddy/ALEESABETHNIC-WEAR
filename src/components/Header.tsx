'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Search, ShoppingBag, Heart, User } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import SearchModal from './SearchModal'

export default function Header() {
    const { cartCount } = useCart()
    const [isSearchOpen, setIsSearchOpen] = useState(false)

    return (
        <>
            <header className="bg-white sticky top-0 z-50 border-b border-gray-100">
                {/* Top Bar - Icons & Logo */}
                <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-20 flex items-center justify-between relative">

                    {/* Left: Search */}
                    <div className="flex-1">
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="text-gray-600 hover:text-primary transition-colors"
                        >
                            <Search strokeWidth={1.5} size={22} />
                        </button>
                    </div>

                    {/* Center: Logo */}
                    <div className="flex-1 flex justify-center">
                        <Link href="/" className="text-3xl font-heading font-bold text-primary tracking-tight">
                            ALEESA
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
                <div className="hidden md:flex justify-center pb-4">
                    <nav className="flex items-center gap-8 md:gap-12">
                        {['New Arrivals', 'Suits', 'Sarees', 'Lehengas', 'Gowns', 'Kurtas'].map((item) => (
                            <Link
                                key={item}
                                href={`/collections/${item.toLowerCase().replace(' ', '-')}`}
                                className="text-[11px] font-bold uppercase tracking-[2px] text-main hover:text-primary transition-colors"
                            >
                                {item}
                            </Link>
                        ))}
                    </nav>
                </div>
            </header>

            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    )
}
