'use client'

import { useState } from 'react'
import Script from 'next/script'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'

export default function CheckoutPage() {
    const router = useRouter()
    const { items, subtotal, clearCart } = useCart()
    const [loading, setLoading] = useState(false)

    // Redirect if empty (in a real app)
    // if (items.length === 0) router.push('/cart')

    const [address, setAddress] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip: ''
    })

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        if (items.length === 0) {
            alert("Your cart is empty")
            setLoading(false)
            return
        }

        try {
            // 1. Create Order on Backend (Calculate price securely)
            const res = await fetch('/api/checkout/razorpay', {
                method: 'POST',
                body: JSON.stringify({
                    items,
                    address
                })
            })
            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Server error')
            }

            // 2. Open Razorpay and Verify
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'test_key',
                amount: data.amount,
                currency: data.currency,
                name: "Aleesa Ethnic Wear",
                description: `Order #${data.dbOrderId.slice(-6)}`,
                order_id: data.id, // Razorpay Order ID
                handler: async function (response: any) {
                    // 3. Verify Payment
                    try {
                        const verifyRes = await fetch('/api/checkout/razorpay/verify', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            }),
                        })

                        const verifyData = await verifyRes.json()

                        if (verifyData.message === 'success') {
                            clearCart() // Clear local cart
                            router.push(`/order-success?orderId=${data.dbOrderId}`)
                        } else {
                            alert('Payment Verification Failed')
                        }
                    } catch (verifyErr) {
                        console.error(verifyErr)
                        alert('Verification Failed')
                    }
                },
                prefill: {
                    name: address.fullName,
                    email: address.email,
                    contact: address.phone
                },
                theme: {
                    color: "#F1429A" // brand color
                }
            };

            const rzp1 = new (window as any).Razorpay(options);
            rzp1.on('payment.failed', function (response: any) {
                alert(response.error.description);
                setLoading(false)
            });
            rzp1.open();

        } catch (err: any) {
            console.error(err)
            alert(err.message || 'Payment failed')
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />

            <div className="max-w-3xl mx-auto px-4">
                <h1 className="text-3xl font-bold mb-8 font-heading">Checkout</h1>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <form onSubmit={handlePayment} className="space-y-6">
                        <section>
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">Shipping Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    placeholder="Full Name" required
                                    className="p-3 border border-gray-200 rounded w-full focus:border-primary outline-none"
                                    value={address.fullName} onChange={e => setAddress({ ...address, fullName: e.target.value })}
                                />
                                <input
                                    placeholder="Email" required type="email"
                                    className="p-3 border border-gray-200 rounded w-full focus:border-primary outline-none"
                                    value={address.email} onChange={e => setAddress({ ...address, email: e.target.value })}
                                />
                                <input
                                    placeholder="Phone" required
                                    className="p-3 border border-gray-200 rounded w-full focus:border-primary outline-none"
                                    value={address.phone} onChange={e => setAddress({ ...address, phone: e.target.value })}
                                />
                                <input
                                    placeholder="Zip Code" required
                                    className="p-3 border border-gray-200 rounded w-full focus:border-primary outline-none"
                                    value={address.zip} onChange={e => setAddress({ ...address, zip: e.target.value })}
                                />
                            </div>
                            <input
                                placeholder="Address" required
                                className="mt-4 p-3 border border-gray-200 rounded w-full focus:border-primary outline-none"
                                value={address.address} onChange={e => setAddress({ ...address, address: e.target.value })}
                            />
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <input
                                    placeholder="City" required
                                    className="p-3 border border-gray-200 rounded w-full focus:border-primary outline-none"
                                    value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })}
                                />
                                <input
                                    placeholder="State" required
                                    className="p-3 border border-gray-200 rounded w-full focus:border-primary outline-none"
                                    value={address.state} onChange={e => setAddress({ ...address, state: e.target.value })}
                                />
                            </div>
                        </section>

                        <div className="border-t pt-6 bg-gray-50 -mx-6 px-6 -mb-6 pb-6 rounded-b-lg">
                            <div className="flex justify-between text-lg font-bold mb-6">
                                <span>Total Amount</span>
                                <span>₹{subtotal.toLocaleString('en-IN')}</span>
                            </div>

                            <button
                                type="submit" disabled={loading}
                                className="w-full bg-black text-white py-4 rounded font-bold uppercase tracking-widest hover:bg-gray-800 disabled:opacity-50 transition-colors"
                            >
                                {loading ? 'Processing...' : 'Pay Now'}
                            </button>
                            <p className="text-xs text-center text-gray-400 mt-4">
                                Secure payments by Razorpay
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
