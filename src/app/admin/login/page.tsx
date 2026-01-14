'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheck, Loader2 } from 'lucide-react'
import Image from 'next/image'

export default function AdminLoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
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
                    setError('Access Denied: Administrative privileges required.')
                    setIsLoading(false)
                }
            } else {
                setError('Invalid credentials. Please try again.')
                setIsLoading(false)
            }
        } catch (err) {
            setError('An error occurred. Please try again.')
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=1600&q=80"
                    alt="Royal Ethnic Saree Background"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
            </div>

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-md mx-4">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl p-8 md:p-10">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 border border-white/20 mb-4 backdrop-blur-sm shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                            <ShieldCheck className="w-8 h-8 text-white" strokeWidth={1.5} />
                        </div>
                        <h1 className="text-3xl font-serif text-white tracking-wide mb-2 drop-shadow-md">
                            Aleesa Admin
                        </h1>
                        <p className="text-white/70 text-sm font-light tracking-wider uppercase">
                            Secure Portal Access
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-100 p-3 rounded-lg mb-6 text-sm text-center backdrop-blur-sm">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-white/80 uppercase tracking-widest pl-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all backdrop-blur-sm hover:bg-white/10"
                                placeholder="name@aleesa.com"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-white/80 uppercase tracking-widest pl-1">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all backdrop-blur-sm hover:bg-white/10"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-pink-700 to-purple-800 hover:from-pink-600 hover:to-purple-700 text-white font-medium py-3.5 rounded-xl shadow-lg shadow-pink-900/30 transform transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4 border border-white/10"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Verifying...
                                </span>
                            ) : (
                                "Enter Dashboard"
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-white/40 text-xs font-light tracking-wide">
                            Authorized personnel only. <br />
                            Unauthorized access is strictly prohibited.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
