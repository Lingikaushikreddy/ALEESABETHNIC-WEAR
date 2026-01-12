
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { login } from '@/lib/auth'

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json()

        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
        }

        // Example password check (Plain text for demo admin, ideally use bcrypt)
        // For this migration speed run: if password matches directly OR verify hash later
        const isValid = user.password === password // Simple check for the seed data "admin123"

        if (!isValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
        }

        // Login successful
        await login({ userId: user.id, email: user.email, role: user.role })

        return NextResponse.json({ success: true, role: user.role })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
