'use client'

import Link from 'next/link'
import { Home, Search, ShoppingBag, User } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { usePathname } from 'next/navigation'

export default function MobileNav() {
    const { cartCount } = useCart()
    const pathname = usePathname()

    const isActive = (path: string) => pathname === path

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 safe-area-bottom">
            <div className="grid grid-cols-4 h-16">
                {/* Home */}
                <Link
                    href="/"
                    className={`flex flex-col items-center justify-center gap-1 ${isActive('/') ? 'text-primary' : 'text-gray-600'
                        }`}
                >
                    <Home size={22} strokeWidth={isActive('/') ? 2.5 : 1.5} />
                    <span className="text-[10px] font-medium">Home</span>
                </Link>

                {/* Search */}
                <Link
                    href="/search"
                    className={`flex flex-col items-center justify-center gap-1 ${isActive('/search') ? 'text-primary' : 'text-gray-600'
                        }`}
                >
                    <Search size={22} strokeWidth={isActive('/search') ? 2.5 : 1.5} />
                    <span className="text-[10px] font-medium">Search</span>
                </Link>

                {/* Cart */}
                <Link
                    href="/cart"
                    className={`flex flex-col items-center justify-center gap-1 relative ${isActive('/cart') ? 'text-primary' : 'text-gray-600'
                        }`}
                >
                    <div className="relative">
                        <ShoppingBag size={22} strokeWidth={isActive('/cart') ? 2.5 : 1.5} />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </div>
                    <span className="text-[10px] font-medium">Cart</span>
                </Link>

                {/* Account */}
                <Link
                    href="/orders"
                    className={`flex flex-col items-center justify-center gap-1 ${isActive('/orders') ? 'text-primary' : 'text-gray-600'
                        }`}
                >
                    <User size={22} strokeWidth={isActive('/orders') ? 2.5 : 1.5} />
                    <span className="text-[10px] font-medium">Account</span>
                </Link>
            </div>
        </nav>
    )
}
