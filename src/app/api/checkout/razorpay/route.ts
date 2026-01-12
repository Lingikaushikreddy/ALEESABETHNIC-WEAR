import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import Razorpay from 'razorpay'

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(request: Request) {
    try {
        const { items, address } = await request.json()

        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'No items in cart' }, { status: 400 })
        }

        // 1. Calculate Total securely from Database
        let calculatedTotal = 0
        const preparedItems = []

        for (const item of items) {
            const product = await prisma.product.findUnique({
                where: { id: item.productId }
            })

            if (!product) {
                console.error(`Product not found: ${item.productId}`)
                continue
            }

            const itemTotal = product.price * item.quantity
            calculatedTotal += itemTotal

            preparedItems.push({
                productId: product.id,
                productName: product.name,
                productImage: item.image || product.images[0], // Fallback to first image
                price: product.price,
                quantity: item.quantity,
                size: item.size,
                color: "Default", // In a real app, we'd fetch this from the Variant
            })
        }

        // 2. Create Razorpay Order
        const orderOptions = {
            amount: Math.round(calculatedTotal * 100),
            currency: "INR",
            receipt: "order_" + Date.now(),
        }

        const razorpayOrder = await razorpay.orders.create(orderOptions)

        // 3. Create OR Find User (Guest Flow)
        // Check if user exists by email, else create guest user
        const userEmail = address.email || 'guest@aleesa.com'
        let user = await prisma.user.findUnique({ where: { email: userEmail } })

        if (!user) {
            // Create a pseudo-guest user
            user = await prisma.user.create({
                data: {
                    email: userEmail,
                    password: "guest_password_" + Date.now(), // Secure enough for guest
                    role: 'CUSTOMER',
                    firstName: address.fullName.split(' ')[0],
                    lastName: address.fullName.split(' ').slice(1).join(' ') || '',
                }
            })
        }

        // 4. Create Database Order with PENDING status
        const order = await prisma.order.create({
            data: {
                orderNumber: razorpayOrder.id,
                userId: user.id,
                shippingName: address.fullName,
                shippingPhone: address.phone,
                shippingAddress: address.address,
                shippingCity: address.city,
                shippingState: address.state,
                shippingZip: address.zip,
                subtotal: calculatedTotal,
                shippingCost: 0,
                total: calculatedTotal,
                status: 'PENDING',
                paymentMethod: 'RAZORPAY',
                paymentStatus: 'PENDING',
                razorpayOrderId: razorpayOrder.id,
                items: {
                    create: preparedItems
                }
            }
        })

        return NextResponse.json({
            id: razorpayOrder.id,
            currency: razorpayOrder.currency,
            amount: razorpayOrder.amount,
            dbOrderId: order.id,
            key_id: process.env.RAZORPAY_KEY_ID // Send key to client if needed, or client env
        })

    } catch (error) {
        console.error('Checkout Error:', error)
        return NextResponse.json({ error: 'Payment initialization failed' }, { status: 500 })
    }
}
