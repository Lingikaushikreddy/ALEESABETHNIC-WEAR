'use client'

import { useState } from 'react'
import { X, MessageCircle } from 'lucide-react'
import Image from 'next/image'

interface OrderItem {
    id: string
    productName: string
    productImage?: string | null
    size: string
    price: number
    quantity: number
}

interface ReturnRequestModalProps {
    isOpen: boolean
    onClose: () => void
    orderNumber: string
    items: OrderItem[]
}

export default function ReturnRequestModal({ isOpen, onClose, orderNumber, items }: ReturnRequestModalProps) {
    const [selectedItems, setSelectedItems] = useState<string[]>([])
    const [reason, setReason] = useState('')
    const [action, setAction] = useState<'return' | 'exchange'>('return')

    if (!isOpen) return null

    const toggleItem = (itemId: string) => {
        setSelectedItems(prev =>
            prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
        )
    }

    const handleWhatsAppRedirect = () => {
        const selectedProducts = items
            .filter(item => selectedItems.includes(item.id))
            .map(item => `${item.productName} (Size: ${item.size})`)
            .join(', ')

        const message = `Hi Aleesa Support, I want to ${action} items from Order #${orderNumber.slice(-8).toUpperCase()}.
        
Items: ${selectedProducts}
Reason: ${reason}

Please guide me through the process.`

        const encodedMessage = encodeURIComponent(message)
        window.open(`https://wa.me/918143906891?text=${encodedMessage}`, '_blank')
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-lg rounded-lg shadow-xl overflow-hidden animate-slide-up">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="font-heading font-bold text-lg">Return / Exchange Request</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="mb-6">
                        <label className="block text-sm font-bold mb-2">1. Select Action</label>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setAction('return')}
                                className={`flex-1 py-2 px-4 rounded border text-sm font-medium transition-colors ${action === 'return'
                                        ? 'bg-black text-white border-black'
                                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                Return
                            </button>
                            <button
                                onClick={() => setAction('exchange')}
                                className={`flex-1 py-2 px-4 rounded border text-sm font-medium transition-colors ${action === 'exchange'
                                        ? 'bg-black text-white border-black'
                                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                Exchange
                            </button>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-bold mb-2">2. Select Items</label>
                        <div className="space-y-3">
                            {items.map(item => (
                                <div
                                    key={item.id}
                                    className={`flex items-start gap-3 p-3 rounded border cursor-pointer transition-colors ${selectedItems.includes(item.id)
                                            ? 'border-primary bg-pink-50/50'
                                            : 'border-gray-100 hover:border-gray-200'
                                        }`}
                                    onClick={() => toggleItem(item.id)}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.includes(item.id)}
                                        readOnly
                                        className="mt-1"
                                    />
                                    <div className="w-12 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0 relative">
                                        {item.productImage && (
                                            <Image
                                                src={item.productImage}
                                                alt={item.productName}
                                                fill
                                                className="object-cover"
                                            />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-bold text-gray-900 line-clamp-1">{item.productName}</div>
                                        <div className="text-xs text-gray-500">Size: {item.size} • Qty: {item.quantity}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-bold mb-2">3. Reason</label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Why do you want to return/exchange this?"
                            className="w-full border border-gray-200 rounded p-3 text-sm focus:outline-none focus:border-primary h-24 resize-none"
                        ></textarea>
                    </div>

                    <button
                        onClick={handleWhatsAppRedirect}
                        disabled={selectedItems.length === 0 || !reason.trim()}
                        className="w-full bg-[#25D366] text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-[#128C7E] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <MessageCircle size={20} />
                        Request via WhatsApp
                    </button>
                    <p className="text-center text-xs text-gray-400 mt-3">
                        Our support team will instantly process your request.
                    </p>
                </div>
            </div>
        </div>
    )
}
