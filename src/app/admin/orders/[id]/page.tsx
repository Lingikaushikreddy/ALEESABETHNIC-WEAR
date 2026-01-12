
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Truck, Check, X } from 'lucide-react'
import { updateOrderStatus } from '../../actions'

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

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/orders" className="text-gray-500 hover:text-gray-900">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-2xl font-bold">Order #{order.orderNumber.slice(-6)}</h1>
                <span className="px-3 py-1 rounded-full text-sm font-bold bg-gray-100 border">{order.status}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Items */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="font-bold mb-4">Items</h2>
                        <div className="space-y-4">
                            {order.items.map(item => (
                                <div key={item.id} className="flex gap-4 border-b pb-4 last:border-0 last:pb-0">
                                    <div className="w-16 h-20 bg-gray-100 rounded overflow-hidden">
                                        {item.productImage && <img src={item.productImage} className="w-full h-full object-cover" />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium">{item.productName}</div>
                                        <div className="text-sm text-gray-500">Size: {item.size} | Qty: {item.quantity}</div>
                                    </div>
                                    <div className="font-medium">₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between pt-4 mt-4 border-t font-bold text-lg">
                            <span>Total</span>
                            <span>₹{order.total.toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                </div>

                {/* Right: Customer & Actions */}
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
                                    <Check size={16} /> Mark as Delivered
                                </button>
                            </form>
                            <form action={updateOrderStatus.bind(null, order.id, 'CANCELLED') as any}>
                                <button disabled={order.status === 'CANCELLED'} className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 border border-red-200 py-2 rounded hover:bg-red-100 disabled:opacity-50">
                                    <X size={16} /> Cancel Order
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="font-bold mb-4">Customer Details</h2>
                        <div className="space-y-3 text-sm">
                            <div>
                                <div className="text-gray-500">Name</div>
                                <div className="font-medium">{order.shippingName}</div>
                            </div>
                            <div>
                                <div className="text-gray-500">Email</div>
                                <div className="font-medium">{order.shippingAddress}</div>
                            </div>
                            <div>
                                <div className="text-gray-500">Phone</div>
                                <div className="font-medium">{order.shippingPhone}</div>
                            </div>
                            <div>
                                <div className="text-gray-500">Shipping Address</div>
                                <div>{order.shippingAddress}</div>
                                <div>{order.shippingCity}, {order.shippingState} {order.shippingZip}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
