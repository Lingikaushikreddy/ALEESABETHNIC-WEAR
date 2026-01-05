
import { jwtVerify, SignJWT } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

const SECRET_KEY = process.env.JWT_SECRET || 'super-secret-key-change-this'
const key = new TextEncoder().encode(SECRET_KEY)

export type SessionPayload = {
    userId: string
    email: string
    role: 'ADMIN' | 'CUSTOMER'
    expires: Date
}

export async function signToken(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(key)
}

export async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, key)
        return payload
    } catch (error) {
        return null
    }
}

export async function getSession() {
    const cookieStore = await cookies()
    const token = cookieStore.get('session')?.value
    if (!token) return null
    return await verifyToken(token)
}

export async function login(payload: any) {
    const token = await signToken(payload)
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    const cookieStore = await cookies()
    cookieStore.set('session', token, { expires, httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' })
}

export async function logout() {
    const cookieStore = await cookies()
    cookieStore.set('session', '', { expires: new Date(0) })
}
