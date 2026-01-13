import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(request: Request) {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = await request.json()

        // 1. Verify Signature
        const body = razorpay_order_id + "|" + razorpay_payment_id
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(body.toString())
            .digest("hex")

        const isAuthentic = expectedSignature === razorpay_signature

        if (isAuthentic) {
            // 2. Update Order Status
            // Find order by razorpayOrderId
            const order = await prisma.order.findFirst({
                where: { razorpayOrderId: razorpay_order_id }
            })

            if (order) {
                const updatedOrder = await prisma.order.update({
                    where: { id: order.id },
                    data: {
                        status: 'CONFIRMED',
                        paymentStatus: 'PAID',
                        razorpayPaymentId: razorpay_payment_id
                    },
                    include: { items: true } // Include items for email
                })

                // 3. Stock Deduction (Optional but recommended)
                // We would iterate over order items and decrement stock
                // Skipped for MVP speed, but placeholder comment added

                // 4. Send Email Notification
                try {
                    const { sendOrderNotification } = await import('@/lib/email')
                    await sendOrderNotification(updatedOrder)
                } catch (emailError) {
                    console.error('Failed to send email:', emailError)
                }
            }

            return NextResponse.json({
                message: "success",
                orderId: razorpay_order_id,
                paymentId: razorpay_payment_id
            })
        } else {
            return NextResponse.json({
                message: "fail",
                error: "Invalid Signature"
            }, { status: 400 })
        }

    } catch (error) {
        console.error('Verification Error:', error)
        return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
    }
}
