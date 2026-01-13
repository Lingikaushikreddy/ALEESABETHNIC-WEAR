import { getSession } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import OrderList from '@/components/OrderList'

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

    return (
        <div className="min-h-screen bg-gray-50 py-12 md:py-20">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-3xl font-heading font-bold mb-8">Your Orders</h1>
                <OrderList orders={orders} />
            </div>
        </div>
    )
}
