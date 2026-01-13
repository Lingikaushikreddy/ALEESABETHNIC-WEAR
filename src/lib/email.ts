import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: 'gmail', // Or use 'SMTP' with host/port
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

export async function sendOrderNotification(order: any) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('EMAIL_USER or EMAIL_PASS not set. Skipping email notification.')
        return
    }

    const itemsList = order.items.map((item: any) =>
        `- ${item.productName} (${item.size}) x${item.quantity} - ₹${item.price}`
    ).join('\n')

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // Send to owner (same email for now)
        subject: `New Order Received: #${order.orderNumber.slice(-8).toUpperCase()}`,
        text: `
New Order Received!

Order #: ${order.orderNumber}
Total: ₹${order.total}
Customer: ${order.shippingName} (${order.shippingPhone})

Items:
${itemsList}

Shipping Address:
${order.shippingAddress}, ${order.shippingCity}, ${order.shippingState} - ${order.shippingZip}

View in Admin Panel: ${process.env.NEXT_PUBLIC_APP_URL}/admin/orders/${order.id}
        `
    }

    try {
        await transporter.sendMail(mailOptions)
        console.log('Order notification email sent')
    } catch (error) {
        console.error('Error sending email:', error)
    }
}
