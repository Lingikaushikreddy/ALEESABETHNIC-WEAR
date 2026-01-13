'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'

interface ImageGalleryProps {
    images: string[]
    productName: string
}

export default function ImageGallery({ images, productName }: ImageGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(0)

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
                <img
                    src={images[selectedImage]}
                    alt={`${productName} - Image ${selectedImage + 1}`}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-4 overflow-x-auto pb-2">
                {images.map((img: string, i: number) => (
                    <button
                        key={i}
                        onClick={() => setSelectedImage(i)}
                        className={`flex-shrink-0 w-20 h-24 bg-gray-100 rounded overflow-hidden border-2 transition-all ${selectedImage === i
                                ? 'border-primary ring-2 ring-primary/20'
                                : 'border-transparent hover:border-gray-300'
                            }`}
                    >
                        <img
                            src={img}
                            alt={`Thumbnail ${i + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </button>
                ))}
            </div>
        </div>
    )
}
