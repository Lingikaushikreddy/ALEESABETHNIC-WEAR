'use client'

import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

export default function OrderSuccessPage() {
    const searchParams = useSearchParams()
    const orderId = searchParams.get('orderId')

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-gray-50">
            <div className="bg-white p-10 rounded-lg shadow-sm max-w-lg w-full">
                <CheckCircle className="text-green-500 w-20 h-20 mx-auto mb-6" />
                <h1 className="text-3xl font-heading font-bold mb-2">Order Confirmed!</h1>
                <p className="text-gray-500 mb-8">
                    Thank you for your purchase. Your order {orderId ? `#${orderId.slice(-6)}` : ''} has been placed successfully.
                </p>

                <div className="space-y-4">
                    <Link
                        href="/"
                        className="block w-full bg-black text-white py-3 rounded font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors"
                    >
                        Continue Shopping
                    </Link>
                    {/* Link to Orders page if needed */}
                </div>
            </div>
        </div>
    )
}
