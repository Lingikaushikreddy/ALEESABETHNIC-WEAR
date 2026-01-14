'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldAlert } from 'lucide-react'

export default function AdminLoginPage() {
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
                setError('Access Denied: You are not an admin.')
                // Optionally logout immediately if not admin
            }
        } else {
            setError('Invalid credentials')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-2xl border-t-4 border-pink-600">
                <div className="flex justify-center mb-6">
                    <div className="bg-pink-100 p-3 rounded-full">
                        <ShieldAlert className="w-8 h-8 text-pink-600" />
                    </div>
                </div>
                <h1 className="text-2xl font-bold text-center mb-2 text-gray-900">Admin Portal</h1>
                <p className="text-center text-gray-500 mb-8 text-sm">Secure access for store owners only</p>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm border border-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                            placeholder="admin@aleesa.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 font-bold tracking-wide transition-colors mt-2"
                    >
                        ACCESS DASHBOARD
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <a href="/login" className="text-xs text-gray-400 hover:text-gray-600">Not an admin? Go to Customer Login</a>
                </div>
            </div>
        </div>
    )
}
