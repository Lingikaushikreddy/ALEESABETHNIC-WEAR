'use server'

import { getSession } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function addAddress(formData: FormData) {
    const session = await getSession()
    if (!session) return { error: 'Not authenticated' }

    const fullName = formData.get('fullName') as string
    const phone = formData.get('phone') as string
    const street = formData.get('street') as string
    const city = formData.get('city') as string
    const state = formData.get('state') as string
    const zipCode = formData.get('zipCode') as string

    if (!fullName || !phone || !street || !city || !state || !zipCode) {
        return { error: 'Missing fields' }
    }

    // Check if first address, if so make default
    const count = await prisma.address.count({ where: { userId: session.userId as string } })
    const isDefault = count === 0

    try {
        await prisma.address.create({
            data: {
                userId: session.userId as string,
                fullName,
                phone,
                street,
                city,
                state,
                zipCode,
                isDefault
            }
        })
        revalidatePath('/account/addresses')
        revalidatePath('/checkout') // Important if used in checkout
        return { success: true }
    } catch (e) {
        return { error: 'Failed to create address' }
    }
}

export async function deleteAddress(addressId: string) {
    const session = await getSession()
    if (!session) return { error: 'Not authenticated' }

    try {
        await prisma.address.delete({
            where: {
                id: addressId,
                userId: session.userId as string // Ensure ownership
            }
        })
        revalidatePath('/account/addresses')
        revalidatePath('/checkout')
        return { success: true }
    } catch (e) {
        return { error: 'Failed to delete address' }
    }
}

export async function setDefaultAddress(addressId: string) {
    const session = await getSession()
    if (!session) return { error: 'Not authenticated' }

    try {
        // Transaction to unset others and set this one
        await prisma.$transaction([
            prisma.address.updateMany({
                where: { userId: session.userId as string },
                data: { isDefault: false }
            }),
            prisma.address.update({
                where: { id: addressId, userId: session.userId as string },
                data: { isDefault: true }
            })
        ])
        revalidatePath('/account/addresses')
        revalidatePath('/checkout')
        return { success: true }
    } catch (e) {
        return { error: 'Failed to set default address' }
    }
}
