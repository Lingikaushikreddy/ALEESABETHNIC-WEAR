'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ImageGalleryProps {
    images: string[]
    productName: string
}

export default function ImageGallery({ images, productName }: ImageGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(0)
    const [isZoomOpen, setIsZoomOpen] = useState(false)

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div
                className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden cursor-zoom-in relative group"
                onClick={() => setIsZoomOpen(true)}
            >
                <Image
                    src={images[selectedImage]}
                    alt={`${productName} - Image ${selectedImage + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    priority
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 pointer-events-none">
                    <span className="bg-white/90 text-xs font-bold px-3 py-1 rounded shadow-sm text-gray-900">
                        Click to Zoom
                    </span>
                </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img: string, i: number) => (
                    <button
                        key={i}
                        onClick={() => setSelectedImage(i)}
                        className={`flex-shrink-0 relative w-20 h-24 bg-gray-100 rounded overflow-hidden border-2 transition-all ${selectedImage === i
                            ? 'border-primary ring-2 ring-primary/20'
                            : 'border-transparent hover:border-gray-300'
                            }`}
                    >
                        <Image
                            src={img}
                            alt={`Thumbnail ${i + 1}`}
                            fill
                            sizes="80px"
                            className="object-cover"
                        />
                    </button>
                ))}
            </div>

            {/* Zoom Modal */}
            {isZoomOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out animate-fade-in"
                    onClick={() => setIsZoomOpen(false)}
                >
                    <div className="relative w-full h-full max-w-4xl max-h-[90vh] flex items-center justify-center">
                        <img
                            src={images[selectedImage]}
                            alt={`${productName} - Zoomed`}
                            className="max-w-full max-h-full object-contain"
                        />
                        <button
                            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsZoomOpen(false);
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
