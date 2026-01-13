'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { addReview } from '@/app/actions/reviews'

interface Review {
    id: string
    rating: number
    comment: string | null
    createdAt: Date
    user: {
        firstName: string | null // Or just email if no name
        email: string
    }
}

interface ProductReviewsProps {
    productId: string
    reviews: Review[]
}

export default function ProductReviews({ productId, reviews }: ProductReviewsProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [rating, setRating] = useState(5)

    // Server action wrapper
    async function action(formData: FormData) {
        setIsSubmitting(true)
        await addReview(formData)
        setIsSubmitting(false)
        // Ideally we'd refresh or optimistic update, but keep simple for MVP
        window.location.reload()
    }

    return (
        <div className="border-t pt-12 mt-12">
            <h2 className="text-2xl font-bold font-heading mb-8">Customer Reviews</h2>

            <div className="grid md:grid-cols-2 gap-12">
                {/* List */}
                <div className="space-y-6">
                    {reviews.length === 0 ? (
                        <p className="text-gray-500">No reviews yet. Be the first to write one!</p>
                    ) : (
                        reviews.map(review => (
                            <div key={review.id} className="border-b pb-6 last:border-0">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex text-yellow-500">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                                        ))}
                                    </div>
                                    <span className="text-sm font-bold text-gray-900">
                                        {review.user.firstName || review.user.email.split('@')[0]}
                                    </span>
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                                <div className="text-xs text-gray-400 mt-2">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Form */}
                <div className="bg-gray-50 p-6 rounded-lg h-fit">
                    <h3 className="font-bold text-lg mb-4">Write a Review</h3>
                    <form action={action} className="space-y-4">
                        <input type="hidden" name="productId" value={productId} />

                        <div>
                            <label className="block text-xs font-bold uppercase mb-2 text-gray-500">Rating</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className="text-yellow-500 focus:outline-none transition-transform hover:scale-110"
                                    >
                                        <Star size={24} fill={star <= rating ? "currentColor" : "none"} />
                                    </button>
                                ))}
                            </div>
                            <input type="hidden" name="rating" value={rating} />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase mb-2 text-gray-500">Review</label>
                            <textarea
                                name="comment"
                                rows={4}
                                className="w-full border border-gray-200 rounded p-3 text-sm focus:border-primary focus:outline-none"
                                placeholder="How was the fit and quality?"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-black text-white font-bold uppercase py-3 rounded hover:bg-gray-800 transition-colors disabled:opacity-50"
                        >
                            {isSubmitting ? 'Posting...' : 'Post Review'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
