import React, { useState, useCallback } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Simple Cloudinary Upload Component
 * Uploads directly to Cloudinary via unsigned preset
 */
const CloudinaryUpload = ({
    cloudName = "demo", // Default to demo if not set, user should change this
    uploadPreset = "unsigned_preset", // User should change this
    onUpload,
    images = [],
    onRemove
}) => {
    const [isUploading, setIsUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragging(true);
        } else if (e.type === 'dragleave') {
            setIsDragging(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    }, []);

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files);
        }
    };

    const handleFiles = async (files) => {
        if (!cloudName || !uploadPreset) {
            toast.error('Cloudinary configuration missing');
            return;
        }

        setIsUploading(true);
        const uploadedUrls = [];

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const formData = new FormData();
                formData.append('file', file);
                formData.append('upload_preset', uploadPreset);

                const response = await fetch(
                    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                    {
                        method: 'POST',
                        body: formData,
                    }
                );

                if (!response.ok) {
                    throw new Error('Upload failed');
                }

                const data = await response.json();
                uploadedUrls.push(data.secure_url);
            }

            onUpload(uploadedUrls);
            toast.success('Images uploaded successfully');
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload image. Check Cloudinary settings.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* Upload Area */}
            <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
          ${isDragging ? 'border-pink-500 bg-pink-50' : 'border-gray-300 hover:border-pink-400'}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload').click()}
            >
                <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    multiple
                    accept="image/*"
                    onChange={handleChange}
                />

                <div className="flex flex-col items-center justify-center gap-2">
                    {isUploading ? (
                        <>
                            <Loader2 className="h-10 w-10 text-pink-500 animate-spin" />
                            <p className="text-sm text-gray-500">Uploading...</p>
                        </>
                    ) : (
                        <>
                            <Upload className="h-10 w-10 text-gray-400" />
                            <p className="text-sm font-medium text-gray-900">
                                Click or drag images to upload
                            </p>
                            <p className="text-xs text-gray-500">
                                Supports JPG, PNG, WEBP
                            </p>
                        </>
                    )}
                </div>
            </div>

            {/* Image Preview Grid */}
            {images.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                    {images.map((url, index) => (
                        <div key={index} className="relative group aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden border">
                            <img
                                src={url}
                                alt={`Product ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => onRemove(index)}
                                className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CloudinaryUpload;
