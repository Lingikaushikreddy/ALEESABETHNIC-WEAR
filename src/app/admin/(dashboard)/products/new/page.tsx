
'use client'

import { useState } from 'react'
import CloudinaryUpload from '@/components/CloudinaryUpload'
import { createProduct } from '../../../actions'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, X } from 'lucide-react'
import Link from 'next/link'

export default function NewProductPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        category: 'Suits',
        price: '',
        description: '',
        fabric: ''
    })

    // Simplified: 1 Variant, Helper to add more sizes
    const [images, setImages] = useState<string[]>([])
    const [sizes, setSizes] = useState([
        { size: 'S', stock: 10 },
        { size: 'M', stock: 10 },
        { size: 'L', stock: 10 },
        { size: 'XL', stock: 5 }
    ])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            await createProduct({
                ...formData,
                price: parseFloat(formData.price),
                images,
                sizes
            })
            router.push('/admin')
        } catch (err) {
            alert('Failed to create product')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <Link href="/admin" className="flex items-center text-gray-500 hover:text-pink-600 mb-6">
                <ArrowLeft size={18} className="mr-2" /> Back to Dashboard
            </Link>

            <h1 className="text-2xl font-bold mb-8">Add New Product</h1>

            <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-lg shadow-sm">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">Product Name</label>
                        <input
                            required
                            className="w-full p-2 border rounded"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <select
                            className="w-full p-2 border rounded"
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option>Suits</option>
                            <option>Sarees</option>
                            <option>Lehenga Sets</option>
                            <option>Kurtas</option>
                            <option>Dresses</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Price (₹)</label>
                        <input
                            type="number" required
                            className="w-full p-2 border rounded"
                            value={formData.price}
                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Fabric</label>
                        <input
                            className="w-full p-2 border rounded"
                            value={formData.fabric}
                            onChange={e => setFormData({ ...formData, fabric: e.target.value })}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                        className="w-full p-2 border rounded h-24"
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                {/* Images */}
                <div>
                    <label className="block text-sm font-medium mb-3">Images (Drag to upload)</label>
                    <div className="flex flex-wrap gap-4">
                        {images.map((url, idx) => (
                            <CloudinaryUpload
                                key={idx}
                                value={url}
                                onUpload={() => { }}
                                onRemove={() => setImages(prev => prev.filter((_, i) => i !== idx))}
                            />
                        ))}
                        <CloudinaryUpload
                            onUpload={(url) => setImages(prev => [...prev, url])}
                            onRemove={() => { }}
                        />
                    </div>
                </div>

                {/* Inventory */}
                <div>
                    <label className="block text-sm font-medium mb-3">Inventory Initial Stock</label>
                    <div className="flex gap-4">
                        {sizes.map((s, idx) => (
                            <div key={idx} className="bg-gray-50 p-3 rounded">
                                <div className="text-xs font-bold mb-1">{s.size}</div>
                                <input
                                    type="number"
                                    value={s.stock}
                                    onChange={e => {
                                        const newSizes = [...sizes]
                                        newSizes[idx].stock = parseInt(e.target.value) || 0
                                        setSizes(newSizes)
                                    }}
                                    className="w-20 p-1 border rounded text-sm"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    disabled={loading}
                    className="w-full bg-pink-600 text-white py-3 rounded font-bold hover:bg-pink-700 disabled:opacity-50"
                >
                    {loading ? 'Creating...' : 'Create Product'}
                </button>
            </form>
        </div>
    )
}
