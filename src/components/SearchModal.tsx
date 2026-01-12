'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface SearchModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [query, setQuery] = useState('')
    const router = useRouter()
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100)
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => { document.body.style.overflow = 'unset' }
    }, [isOpen])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`)
            onClose()
            setQuery('')
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex flex-col">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white w-full animate-in slide-in-from-top-4 duration-300">
                <div className="max-w-[1400px] mx-auto px-4 py-6">
                    <form onSubmit={handleSearch} className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search for Kurtas, Sarees, etc..."
                            className="w-full pl-14 pr-12 py-4 text-xl font-heading font-bold outline-none border-b-2 border-gray-100 focus:border-primary bg-transparent text-gray-900 placeholder:text-gray-300 transition-colors"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={onClose}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                        >
                            <X size={24} />
                        </button>
                    </form>

                    {/* Quick Links Suggestions (Static for MVP) */}
                    <div className="mt-8 mb-4 px-2">
                        <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Popular Searches</div>
                        <div className="flex flex-wrap gap-2">
                            {['Anarkali Suit', 'Silk Saree', 'Lehenga', 'Pink Kurta'].map(term => (
                                <button
                                    key={term}
                                    onClick={() => {
                                        setQuery(term)
                                        // Optional: Auto search on click or just fill
                                        router.push(`/search?q=${encodeURIComponent(term)}`)
                                        onClose()
                                    }}
                                    className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-full text-sm hover:border-primary hover:text-primary transition-colors"
                                >
                                    {term}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
