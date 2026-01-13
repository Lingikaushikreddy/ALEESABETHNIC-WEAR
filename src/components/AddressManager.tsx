'use client'

import { useState } from 'react'
import { addAddress, deleteAddress, setDefaultAddress } from '@/app/actions/address'
import { Plus, Trash2, Check, MapPin, Loader2 } from 'lucide-react'

interface Address {
    id: string
    fullName: string
    phone: string
    street: string
    city: string
    state: string
    zipCode: string
    isDefault: boolean
}

interface AddressManagerProps {
    initialAddresses: Address[]
}

export default function AddressManager({ initialAddresses }: AddressManagerProps) {
    const [isAdding, setIsAdding] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        const res = await addAddress(formData)
        setIsLoading(false)
        if (res?.success) {
            setIsAdding(false)
        } else {
            alert(res?.error || 'Something went wrong')
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure?')) return
        await deleteAddress(id)
    }

    async function handleSetDefault(id: string) {
        await setDefaultAddress(id)
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold font-heading">Saved Addresses</h2>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center gap-2 text-sm font-bold text-primary hover:text-pink-700 transition-colors"
                >
                    {isAdding ? 'Cancel' : <><Plus size={16} /> Add New</>}
                </button>
            </div>

            {isAdding && (
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 animate-slide-up">
                    <form action={handleSubmit} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Full Name</label>
                                <input name="fullName" required className="w-full border p-2 rounded text-sm" placeholder="John Doe" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Phone</label>
                                <input name="phone" required className="w-full border p-2 rounded text-sm" placeholder="+91 9876543210" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Address</label>
                            <input name="street" required className="w-full border p-2 rounded text-sm" placeholder="Flat No, Building, Street" />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">City</label>
                                <input name="city" required className="w-full border p-2 rounded text-sm" placeholder="City" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">State</label>
                                <input name="state" required className="w-full border p-2 rounded text-sm" placeholder="State" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Zip Code</label>
                                <input name="zipCode" required className="w-full border p-2 rounded text-sm" placeholder="123456" />
                            </div>
                        </div>
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-black text-white px-6 py-2 rounded text-sm font-bold hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
                            >
                                {isLoading && <Loader2 size={14} className="animate-spin" />}
                                Save Address
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {initialAddresses.length === 0 && !isAdding ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <MapPin className="mx-auto h-10 w-10 text-gray-300 mb-2" />
                    <p className="text-gray-500 text-sm">No addresses saved yet.</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-4">
                    {initialAddresses.map(addr => (
                        <div key={addr.id} className={`p-4 rounded-lg border relative group transition-all ${addr.isDefault ? 'border-primary bg-pink-50/10 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}>
                            {addr.isDefault && (
                                <span className="absolute top-2 right-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <Check size={10} /> DEFAULT
                                </span>
                            )}

                            <div className="font-bold text-gray-900 mb-1">{addr.fullName}</div>
                            <div className="text-sm text-gray-600 leading-relaxed mb-3">
                                {addr.street}<br />
                                {addr.city}, {addr.state} - {addr.zipCode}<br />
                                Ph: {addr.phone}
                            </div>

                            <div className="flex items-center gap-3 pt-3 border-t border-gray-100 opacity-60 group-hover:opacity-100 transition-opacity">
                                {!addr.isDefault && (
                                    <button
                                        onClick={() => handleSetDefault(addr.id)}
                                        className="text-xs font-bold text-gray-500 hover:text-primary transition-colors"
                                    >
                                        Set Default
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(addr.id)}
                                    className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors ml-auto flex items-center gap-1"
                                >
                                    <Trash2 size={12} /> Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
