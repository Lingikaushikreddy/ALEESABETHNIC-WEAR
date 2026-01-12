
'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/auth'

// Helper to ensure admin
async function checkAdmin() {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
        throw new Error('Unauthorized')
    }
}

export async function updateStock(sizeId: string, newStock: number) {
    try {
        await checkAdmin()
        await prisma.variantSize.update({
            where: { id: sizeId },
            data: { stock: newStock }
        })
        revalidatePath('/admin')
        return { success: true }
    } catch (error) {
        console.error('Failed to update stock:', error)
        return { success: false, error: 'Failed to update stock' }
    }
}

export async function updateOrderStatus(orderId: string, status: string) {
    try {
        await checkAdmin()
        await prisma.order.update({
            where: { id: orderId },
            data: { status: status as any }
        })
        revalidatePath('/admin/orders')
        revalidatePath(`/admin/orders/${orderId}`)
        return { success: true }
    } catch (error) {
        console.error('Failed to update status:', error)
        return { error: 'Failed to update status' }
    }
}

export async function deleteProduct(id: string) {
    try {
        await checkAdmin()
        await prisma.product.delete({
            where: { id: id }
        })
        revalidatePath('/admin')
        return { success: true }
    } catch (error) {
        console.error('Failed to delete product:', error)
        return { success: false, error: 'Failed to delete product' }
    }
}

export async function createProduct(data: any) {
    try {
        await checkAdmin()
        // Create product + variants + sizes
        // Data shape expected: { name, category, price, description, fabric, images: string[], sizes: {size, stock}[] }
        const slug = data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Date.now()

        await prisma.product.create({
            data: {
                name: data.name,
                slug: slug,
                category: data.category,
                price: parseFloat(data.price),
                description: data.description,
                fabric: data.fabric,
                images: data.images, // Cloudinary URLs
                variants: {
                    create: [
                        {
                            color: "Standard",
                            images: data.images,
                            sizes: {
                                create: data.sizes.map((s: any) => ({
                                    size: s.size,
                                    stock: s.stock
                                }))
                            }
                        }
                    ]
                }
            }
        })
        revalidatePath('/admin')
        return { success: true }
    } catch (error) {
        console.error('Failed to create product:', error)
        throw new Error('Failed to create product')
    }
}
