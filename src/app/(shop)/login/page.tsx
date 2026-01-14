'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Loader2 } from 'lucide-react'

export default function LoginPage() {
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
                    router.push('/')
                }
            } else {
                setError('Invalid email or password')
                setIsLoading(false)
            }
        } catch (err) {
            setError('Something went wrong. Please try again.')
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#2c1810]">
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-60">
                <Image
                    src="https://images.unsplash.com/photo-1590041794746-713838c87548?q=80&w=2560&auto=format&fit=crop"
                    alt="Traditional Brown Art Pattern"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>
                <div className="absolute inset-0 bg-[#3d2315]/30 mix-blend-multiply"></div>
            </div>

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-[420px] mx-4">
                {/* Logo Section */}
                <div className="flex justify-center mb-8">
                    <Link href="/" className="relative w-32 h-32 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-[0_0_40px_rgba(0,0,0,0.3)] transform hover:scale-105 transition-transform duration-500">
                        <Image
                            src="/logo.png"
                            alt="Aleesa"
                            width={100}
                            height={100}
                            className="object-contain drop-shadow-xl"
                        />
                    </Link>
                </div>

                <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 md:p-10 shadow-2xl border border-white/40 relative overflow-hidden">
                    {/* Decorative Top Border */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#8B4513] to-transparent opacity-50"></div>

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-serif text-[#3d2315] mb-2">Welcome Back</h1>
                        <p className="text-[#8b5e3c] text-sm tracking-wide uppercase font-medium">Sign in to continue shopping</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center border border-red-100 flex items-center justify-center gap-2">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[#5c4033] uppercase tracking-wider ml-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-[#fdfbf7] border border-[#e6d0c3] rounded-xl text-gray-800 placeholder-[#bcaaa4] focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20 focus:border-[#8B4513] transition-all"
                                placeholder="hello@example.com"
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[#5c4033] uppercase tracking-wider ml-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-[#fdfbf7] border border-[#e6d0c3] rounded-xl text-gray-800 placeholder-[#bcaaa4] focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20 focus:border-[#8B4513] transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#3d2315] text-[#fdfbf7] py-3.5 rounded-xl hover:bg-[#5c3523] font-medium tracking-wide shadow-lg shadow-[#3d2315]/20 transform transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    <>
                                        Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center space-y-4">
                        <Link href="/signup" className="block text-sm text-[#8B4513] hover:text-[#3d2315] hover:underline decoration-[#3d2315]/30 underline-offset-4 transition-colors">
                            Don't have an account? Create one
                        </Link>
                    </div>
                </div>

                {/* Admin Link at very bottom */}
                <div className="mt-8 text-center">
                    <Link href="/admin/login" className="text-xs text-white/40 hover:text-white/80 transition-colors uppercase tracking-widest">
                        Staff Access
                    </Link>
                </div>
            </div>
        </div>
    )
}
