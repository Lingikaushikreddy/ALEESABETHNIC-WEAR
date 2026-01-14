
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { ArrowLeft, Clock, CheckCircle, Truck, Package, XCircle } from 'lucide-react'
import { notFound } from 'next/navigation'
import { updateOrderStatus } from '../../../actions'

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            user: true,
            items: true
        }
    })

    if (!order) notFound()

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

    return (
        <div className="space-y-6">
            <Link href="/admin/orders" className="flex items-center gap-2 text-gray-500 hover:text-gray-900">
                <ArrowLeft size={16} /> Back to Orders
            </Link>

            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold">Order #{order.orderNumber.slice(-8).toUpperCase()}</h1>
                    <div className="text-gray-500 text-sm mt-1">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                    </div>
                </div>
                {/* Status Updater could go here */}
                <div className="px-4 py-2 bg-gray-100 rounded-lg font-bold flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    {order.status}
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="md:col-span-2 space-y-6">
                    {/* Items */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b bg-gray-50 font-bold">Order Items</div>
                        <div className="p-6">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="text-left text-xs uppercase text-gray-500">
                                        <th className="pb-3">Product</th>
                                        <th className="pb-3">Size</th>
                                        <th className="pb-3 text-right">Price</th>
                                        <th className="pb-3 text-right">Qty</th>
                                        <th className="pb-3 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {order.items.map(item => (
                                        <tr key={item.id}>
                                            <td className="py-3 flex items-center gap-3">
                                                <div className="w-10 h-12 bg-gray-100 rounded overflow-hidden">
                                                    {item.productImage && <img src={item.productImage} className="w-full h-full object-cover" />}
                                                </div>
                                                <span className="font-medium text-sm">{item.productName}</span>
                                            </td>
                                            <td className="py-3 text-sm">{item.size}</td>
                                            <td className="py-3 text-right text-sm">₹{item.price}</td>
                                            <td className="py-3 text-right text-sm">{item.quantity}</td>
                                            <td className="py-3 text-right text-sm font-bold">₹{item.price * item.quantity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="mt-4 border-t pt-4 flex justify-end">
                                <div className="w-48 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Subtotal</span>
                                        <span>₹{order.subtotal}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Shipping</span>
                                        <span>₹{order.shippingCost}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                                        <span>Total</span>
                                        <span>₹{order.total}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Actions */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="font-bold mb-4">Update Status</h2>
                        <div className="flex flex-col gap-3">
                            <form action={updateOrderStatus.bind(null, order.id, 'SHIPPED') as any}>
                                <button disabled={order.status === 'SHIPPED'} className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-2 rounded hover:bg-purple-700 disabled:opacity-50">
                                    <Truck size={16} /> Mark as Shipped
                                </button>
                            </form>
                            <form action={updateOrderStatus.bind(null, order.id, 'DELIVERED') as any}>
                                <button disabled={order.status === 'DELIVERED'} className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50">
                                    <CheckCircle size={16} /> Mark as Delivered
                                </button>
                            </form>
                            <form action={updateOrderStatus.bind(null, order.id, 'CANCELLED') as any}>
                                <button disabled={order.status === 'CANCELLED'} className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 border border-red-200 py-2 rounded hover:bg-red-100 disabled:opacity-50">
                                    <XCircle size={16} /> Cancel Order
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Customer */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b bg-gray-50 font-bold">Customer</div>
                        <div className="p-6 space-y-4">
                            <div>
                                <div className="text-xs text-gray-500 uppercase">Name</div>
                                <div className="font-medium">{order.shippingName}</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 uppercase">Email</div>
                                <div className="font-medium">{order.user?.email || 'Guest'}</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 uppercase">Phone</div>
                                <div className="font-medium">{order.shippingPhone}</div>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b bg-gray-50 font-bold">Shipping Address</div>
                        <div className="p-6">
                            <p className="text-sm leading-relaxed text-gray-600">
                                {order.shippingAddress}<br />
                                {order.shippingCity}, {order.shippingState}<br />
                                {order.shippingZip}
                            </p>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b bg-gray-50 font-bold">Payment</div>
                        <div className="p-6 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Method</span>
                                <span className="font-medium">{order.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Status</span>
                                <span className={`font-bold ${order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-orange-600'}`}>
                                    {order.paymentStatus}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Transaction ID</span>
                                <span className="font-mono text-xs">{order.razorpayPaymentId || '-'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
