
import { getSession } from '@/lib/auth'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Package, Clock, CheckCircle, Truck, XCircle } from 'lucide-react'

export default async function OrderHistoryPage() {
    const session = await getSession()

    if (!session) {
        redirect('/login?redirect=/orders')
    }

    const orders = await prisma.order.findMany({
        where: { userId: session.userId as string },
        orderBy: { createdAt: 'desc' },
        include: {
            items: true
        }
    })

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'PENDING': return <Clock className="w-5 h-5 text-orange-500" />
            case 'CONFIRMED': return <CheckCircle className="w-5 h-5 text-blue-500" />
            case 'SHIPPED': return <Truck className="w-5 h-5 text-purple-500" />
            case 'DELIVERED': return <Package className="w-5 h-5 text-green-500" />
            case 'CANCELLED': return <XCircle className="w-5 h-5 text-red-500" />
            default: return <Clock className="w-5 h-5 text-gray-500" />
        }
    }

    const getStatusBadge = (status: string) => {
        const styles = {
            PENDING: "bg-orange-50 text-orange-700 border-orange-200",
            CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
            SHIPPED: "bg-purple-50 text-purple-700 border-purple-200",
            DELIVERED: "bg-green-50 text-green-700 border-green-200",
            CANCELLED: "bg-red-50 text-red-700 border-red-200",
        }
        const style = styles[status as keyof typeof styles] || "bg-gray-50 text-gray-700 border-gray-200"
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${style}`}>
                {status}
            </span>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 md:py-20">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-3xl font-heading font-bold mb-8">Your Orders</h1>

                {orders.length === 0 ? (
                    <div className="bg-white p-12 rounded-lg shadow-sm text-center">
                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-xl font-bold mb-2">No orders yet</h2>
                        <p className="text-gray-500 mb-6">Looks like you haven't made any purchases yet.</p>
                        <Link href="/" className="inline-block bg-primary text-white px-8 py-3 rounded font-bold uppercase tracking-wide hover:bg-pink-600">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                                {/* Header */}
                                <div className="bg-gray-50 px-6 py-4 flex flex-wrap gap-4 justify-between items-center border-b border-gray-100">
                                    <div className="flex gap-8 text-sm">
                                        <div>
                                            <div className="text-gray-500 mb-1">Order Placed</div>
                                            <div className="font-bold text-gray-800">
                                                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                    day: 'numeric', month: 'short', year: 'numeric'
                                                })}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500 mb-1">Total</div>
                                            <div className="font-bold text-gray-800">₹{order.total.toLocaleString('en-IN')}</div>
                                        </div>
                                        <div className="hidden sm:block">
                                            <div className="text-gray-500 mb-1">Order #</div>
                                            <div className="font-bold text-gray-800">{order.orderNumber.slice(-8).toUpperCase()}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {getStatusBadge(order.status)}
                                    </div>
                                </div>

                                {/* Items */}
                                <div className="p-6">
                                    <div className="flex flex-col gap-6">
                                        {order.items.map((item) => (
                                            <div key={item.id} className="flex gap-4 items-start">
                                                <div className="w-20 h-24 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
                                                    {item.productImage && (
                                                        <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-main">{item.productName}</h3>
                                                    <div className="text-sm text-gray-500 mt-1 space-x-4">
                                                        <span>Size: {item.size}</span>
                                                        <span>Qty: {item.quantity}</span>
                                                        <span className="font-medium text-gray-900 ml-4">₹{item.price.toLocaleString('en-IN')}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Footer (Actions) */}
                                {/* <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                                    <button className="text-primary text-sm font-bold hover:underline">View Invoice</button>
                                </div> */}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
