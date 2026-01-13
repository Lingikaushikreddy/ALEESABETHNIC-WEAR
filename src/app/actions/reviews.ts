'use server'

import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function addReview(formData: FormData) {
    const session = await getSession()
    if (!session) {
        return { error: 'You must be logged in to leave a review' }
    }

    const productId = formData.get('productId') as string
    const rating = parseInt(formData.get('rating') as string)
    const comment = formData.get('comment') as string

    if (!rating || rating < 1 || rating > 5) {
        return { error: 'Invalid rating' }
    }

    try {
        await prisma.review.create({
            data: {
                userId: session.userId as string,
                productId,
                rating,
                comment
            }
        })

        revalidatePath(`/products/[slug]`) // Revalidate all products potentially, or specific one if we had slug
        return { success: true }
    } catch (error) {
        console.error('Failed to add review:', error)
        return { error: 'Failed to submit review' }
    }
}
