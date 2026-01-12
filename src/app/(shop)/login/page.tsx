
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        const res = await fetch('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            headers: { 'Content-Type': 'application/json' }
        })

        if (res.ok) {
            const data = await res.json()
            if (data.role === 'ADMIN') {
                router.push('/admin')
            } else {
                router.push('/')
            }
        } else {
            setError('Invalid email or password')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm">
                <h1 className="text-2xl font-bold text-center mb-6 text-gray-900">Admin Login</h1>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-pink-500 outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-pink-500 outline-none"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-pink-600 text-white py-2 rounded-md hover:bg-pink-700 font-medium"
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    )
}
