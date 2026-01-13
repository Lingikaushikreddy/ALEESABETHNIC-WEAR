
'use client'

import { useState, useCallback } from 'react'
import { Upload, X, Loader2 } from 'lucide-react'

type Props = {
    onUpload: (url: string) => void
    onRemove: () => void // Remove single image for now logic, or remove specific url
    value?: string
}

export default function CloudinaryUpload({ onUpload, onRemove, value }: Props) {
    const [uploading, setUploading] = useState(false)

    const handleFile = async (file: File) => {
        setUploading(true)
        const formData = new FormData()
        formData.append('file', file)

        // Get from env or user input (ideally env)
        // Note: We are using UNSIGNED upload preset, which allows upload without server signature
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

        if (!cloudName || !uploadPreset) {
            alert('Cloudinary not configured in .env')
            setUploading(false)
            return
        }

        formData.append('upload_preset', uploadPreset)

        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: 'POST',
                body: formData
            })
            const data = await res.json()
            if (data.secure_url) {
                onUpload(data.secure_url)
            }
        } catch (err) {
            console.error(err)
            alert('Upload failed')
        } finally {
            setUploading(false)
        }
    }

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault()
        if (e.dataTransfer.files?.[0]) {
            handleFile(e.dataTransfer.files[0])
        }
    }

    if (value) {
        return (
            <div className="relative w-32 h-40 bg-gray-100 rounded overflow-hidden border">
                <img src={value} alt="Uploaded" className="w-full h-full object-cover" />
                <button
                    onClick={onRemove}
                    className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:text-red-600"
                    type="button"
                >
                    <X size={14} />
                </button>
            </div>
        )
    }

    return (
        <div
            onDragOver={e => e.preventDefault()}
            onDrop={onDrop}
            className="w-32 h-40 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center text-gray-500 hover:border-pink-600 hover:bg-pink-50 cursor-pointer transition-colors relative"
        >
            <input
                type="file"
                accept="image/*"
                onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
                className="absolute inset-0 opacity-0 cursor-pointer"
            />
            {uploading ? (
                <Loader2 className="animate-spin text-pink-600" />
            ) : (
                <>
                    <Upload size={24} className="mb-2" />
                    <span className="text-xs text-center px-2">Drag or Click</span>
                </>
            )}
        </div>
    )
}
