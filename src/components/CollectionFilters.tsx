'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SlidersHorizontal, ChevronDown, Check } from 'lucide-react'

export default function CollectionFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()

    // Initialize state from URL
    const [isOpen, setIsOpen] = useState(false)
    const [priceRange, setPriceRange] = useState({
        min: searchParams.get('price_min') || '',
        max: searchParams.get('price_max') || ''
    })
    const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest')

    // Update local state when URL params change (e.g. back button)
    useEffect(() => {
        setPriceRange(prev => { // eslint-disable-line react-hooks/set-state-in-effect // eslint-disable-line
            const newMin = searchParams.get('price_min') || ''
            const newMax = searchParams.get('price_max') || ''
            if (prev.min !== newMin || prev.max !== newMax) {
                return { min: newMin, max: newMax }
            }
            return prev
        })
        setSortBy(prev => { // eslint-disable-line
            const newSort = searchParams.get('sort') || 'newest'
            return prev !== newSort ? newSort : prev
        })
    }, [searchParams])

    const applyFilters = () => {
        const params = new URLSearchParams(searchParams.toString())

        if (priceRange.min) params.set('price_min', priceRange.min)
        else params.delete('price_min')

        if (priceRange.max) params.set('price_max', priceRange.max)
        else params.delete('price_max')

        if (sortBy) params.set('sort', sortBy)

        router.push(`?${params.toString()}`)
        setIsOpen(false)
    }

    const sortOptions = [
        { label: 'Newest Arrivals', value: 'newest' },
        { label: 'Price: Low to High', value: 'price_asc' },
        { label: 'Price: High to Low', value: 'price_desc' },
    ]

    return (
        <div className="mb-8">
            {/* Mobile/Tablet Toggle */}
            <div className="md:hidden flex justify-between items-center mb-4">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 px-4 py-2 border rounded text-sm font-bold uppercase tracking-wide"
                >
                    <SlidersHorizontal size={16} /> Filters & Sort
                </button>
                <span className="text-xs text-gray-500 font-medium">
                    {searchParams.toString() ? 'Filters Active' : ''}
                </span>
            </div>

            {/* Filter Panel (Desktop: Always visible, Mobile: Togglable) */}
            <div className={`${isOpen ? 'block' : 'hidden'} md:block bg-gray-50 p-4 rounded-lg md:bg-transparent md:p-0`}>
                <div className="flex flex-col md:flex-row gap-6 md:items-end">

                    {/* Sort Dropdown */}
                    <div className="relative group min-w-[200px]">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">Sort By</label>
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => {
                                    setSortBy(e.target.value)
                                    const params = new URLSearchParams(searchParams.toString())
                                    params.set('sort', e.target.value)
                                    router.push(`?${params.toString()}`)
                                }}
                                className="w-full appearance-none bg-white border border-gray-200 px-4 py-2 pr-8 rounded focus:outline-none focus:border-primary cursor-pointer text-sm font-medium"
                            >
                                {sortOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Size Filter */}
                    <div className="min-w-[150px]">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">Size</label>
                        <div className="relative">
                            <select
                                value={searchParams.get('size') || ''}
                                onChange={(e) => {
                                    const params = new URLSearchParams(searchParams.toString())
                                    if (e.target.value) params.set('size', e.target.value)
                                    else params.delete('size')
                                    router.push(`?${params.toString()}`)
                                }}
                                className="w-full appearance-none bg-white border border-gray-200 px-4 py-2 pr-8 rounded focus:outline-none focus:border-primary cursor-pointer text-sm font-medium"
                            >
                                <option value="">All Sizes</option>
                                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                                    <option key={size} value={size}>{size}</option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Price Range */}
                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">Price Range</label>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={priceRange.min}
                                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                                    className="w-24 pl-7 px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-primary"
                                />
                            </div>
                            <span className="text-gray-400">-</span>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={priceRange.max}
                                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                                    className="w-24 pl-7 px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-primary"
                                />
                            </div>
                            <button
                                onClick={applyFilters}
                                className="bg-black text-white px-4 py-2 rounded text-sm font-bold hover:bg-gray-800 transition-colors"
                            >
                                Go
                            </button>
                        </div>
                    </div>

                    {/* Clear Filters */}
                    {(priceRange.min || priceRange.max || sortBy !== 'newest' || searchParams.get('size')) && (
                        <div className="md:mb-1">
                            <button
                                onClick={() => router.push('?')}
                                className="text-xs font-bold text-red-500 hover:text-red-600 underline"
                            >
                                Clear All
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
