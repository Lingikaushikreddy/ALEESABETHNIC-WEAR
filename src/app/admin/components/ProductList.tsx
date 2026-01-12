
'use client'

import { useState } from 'react'
import { updateStock, deleteProduct } from '../actions'
import { useRouter } from 'next/navigation'
import { Trash, Save, Loader2, ChevronDown, ChevronUp } from 'lucide-react'

// Types (simplified for props)
type Product = {
    id: string
    name: string
    category: string
    price: number
    variants: Variant[]
}

type Variant = {
    id: string
    color: string
    sizes: Size[]
}

type Size = {
    id: string
    size: string
    stock: number
}

export default function ProductList({ products }: { products: Product[] }) {
    const [updating, setUpdating] = useState<string | null>(null)

    const handleStockUpdate = async (sizeId: string, newStock: number) => {
        setUpdating(sizeId)
        await updateStock(sizeId, newStock)
        setUpdating(null)
    }

    const handleDelete = async (productId: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        await deleteProduct(productId)
    }

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inventory</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                {product.variants.length} color variants
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {product.category}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                ₹{product.price}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                                <div className="space-y-2">
                                    {product.variants.map(variant => (
                                        <div key={variant.id} className="flex flex-wrap gap-2 items-center">
                                            <span className="text-xs font-semibold text-gray-400 w-16 uppercase">{variant.color}:</span>
                                            {variant.sizes.map(size => (
                                                <div key={size.id} className="flex items-center bg-gray-100 rounded p-1">
                                                    <span className="text-xs font-bold mr-2 w-4">{size.size}</span>
                                                    <input
                                                        type="number"
                                                        defaultValue={size.stock}
                                                        onBlur={(e) => {
                                                            const val = parseInt(e.target.value)
                                                            if (val !== size.stock) handleStockUpdate(size.id, val)
                                                        }}
                                                        className="w-16 text-xs p-1 border rounded"
                                                    />
                                                    {updating === size.id && <Loader2 className="animate-spin w-3 h-3 ml-1 text-pink-600" />}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                    onClick={() => handleDelete(product.id)}
                                    className="text-red-600 hover:text-red-900"
                                >
                                    <Trash size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
