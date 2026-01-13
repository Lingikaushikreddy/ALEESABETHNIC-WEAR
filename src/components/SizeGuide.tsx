'use client'

import { useState } from 'react'
import { Ruler, X } from 'lucide-react'

export default function SizeGuide() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-primary flex items-center gap-1 transition-colors"
                type="button"
            >
                <Ruler size={14} /> Size Guide
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="bg-white w-full max-w-md rounded-lg shadow-xl overflow-hidden animate-slide-up"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="font-heading font-bold text-lg">Size Guide</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <p className="text-sm text-gray-500 mb-6">
                                All measurements are in inches. For the best fit, measure your bust, waist, and hips and compare with the chart below.
                            </p>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-700">
                                        <tr>
                                            <th className="px-4 py-3 rounded-tl-md">Size</th>
                                            <th className="px-4 py-3">Bust</th>
                                            <th className="px-4 py-3">Waist</th>
                                            <th className="px-4 py-3 rounded-tr-md">Hip</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 font-bold">XS</td>
                                            <td className="px-4 py-3">32"</td>
                                            <td className="px-4 py-3">26"</td>
                                            <td className="px-4 py-3">34"</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 font-bold">S</td>
                                            <td className="px-4 py-3">34"</td>
                                            <td className="px-4 py-3">28"</td>
                                            <td className="px-4 py-3">36"</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 font-bold">M</td>
                                            <td className="px-4 py-3">36"</td>
                                            <td className="px-4 py-3">30"</td>
                                            <td className="px-4 py-3">38"</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 font-bold">L</td>
                                            <td className="px-4 py-3">38"</td>
                                            <td className="px-4 py-3">32"</td>
                                            <td className="px-4 py-3">40"</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 font-bold">XL</td>
                                            <td className="px-4 py-3">40"</td>
                                            <td className="px-4 py-3">34"</td>
                                            <td className="px-4 py-3">42"</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 font-bold">XXL</td>
                                            <td className="px-4 py-3">42"</td>
                                            <td className="px-4 py-3">36"</td>
                                            <td className="px-4 py-3">44"</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-6 text-xs text-gray-400">
                                * Garment measurements may vary slightly by style.
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
