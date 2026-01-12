'use client'

import Link from 'next/link'
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react'
import { useCart } from '@/context/CartContext'

export default function CartPage() {
    const { items, removeFromCart, updateQuantity, subtotal, cartCount } = useCart()

    if (cartCount === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <h2 className="text-2xl font-heading font-bold mb-4">Your bag is empty</h2>
                <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
                <Link
                    href="/"
                    className="bg-primary text-white px-8 py-3 rounded font-bold uppercase tracking-wide hover:bg-pink-600 transition-colors"
                >
                    Start Shopping
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 md:py-20">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <h1 className="text-3xl font-heading font-bold mb-8">Shopping Bag <span className="text-lg font-normal text-gray-500">({cartCount} items)</span></h1>

                <div className="lg:grid lg:grid-cols-12 lg:gap-12">
                    {/* Cart Items */}
                    <div className="lg:col-span-8">
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            {items.map((item) => (
                                <div key={`${item.productId}-${item.size}`} className="p-6 border-b border-gray-100 last:border-0 flex gap-6">
                                    {/* Image */}
                                    <div className="w-24 h-32 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-main mb-1">{item.name}</h3>
                                                <p className="text-sm text-gray-500">Size: {item.size}</p>
                                            </div>
                                            <div className="font-bold text-main">
                                                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-end">
                                            {/* Quantity Controls */}
                                            <div className="flex items-center border border-gray-200 rounded-sm">
                                                <button
                                                    onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-main"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                                                    disabled={item.quantity >= item.maxStock}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-main disabled:opacity-40"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeFromCart(item.productId, item.size)}
                                                className="text-red-500 hover:text-red-600 text-sm flex items-center gap-1"
                                            >
                                                <Trash2 size={16} /> <span className="hidden sm:inline">Remove</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-4 mt-8 lg:mt-0">
                        <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
                            <h2 className="font-heading font-bold text-lg mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6 pb-6 border-b border-gray-100">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-medium">Free</span>
                                </div>
                            </div>

                            <div className="flex justify-between font-bold text-xl mb-8">
                                <span>Total</span>
                                <span>₹{subtotal.toLocaleString('en-IN')}</span>
                            </div>

                            <Link
                                href="/checkout"
                                className="w-full bg-black text-white py-4 rounded font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 group"
                            >
                                Checkout <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <p className="text-xs text-center text-gray-400 mt-4">
                                Taxes and duties included. secure checkout.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
