
import prisma from '@/lib/prisma'
import ProductList from './components/ProductList'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default async function AdminDashboard() {
    const products = await prisma.product.findMany({
        include: {
            variants: {
                include: {
                    sizes: true
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Inventory Management</h3>
                <Link
                    href="/admin/products/new"
                    className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 flex items-center gap-2"
                >
                    <Plus size={18} />
                    Add Product
                </Link>
            </div>

            <ProductList products={products} />
        </div>
    )
}
