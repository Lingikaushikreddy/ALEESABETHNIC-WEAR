
import Link from 'next/link'
import { Facebook, Instagram, Twitter, Truck, RotateCcw, Headphones, Shirt } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="bg-footer pt-16 pb-8 border-t border-gray-200 text-main">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8">

                {/* Service Badges */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 border-b border-gray-200 pb-12">
                    <div className="flex flex-col items-center text-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-primary shadow-sm">
                            <Headphones strokeWidth={1.5} size={24} />
                        </div>
                        <div>
                            <h4 className="font-heading font-bold text-sm uppercase tracking-wider mb-1">24x7 Support</h4>
                            <p className="text-xs text-gray-500">Always here to help you</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center text-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-primary shadow-sm">
                            <Truck strokeWidth={1.5} size={24} />
                        </div>
                        <div>
                            <h4 className="font-heading font-bold text-sm uppercase tracking-wider mb-1">Free Shipping</h4>
                            <p className="text-xs text-gray-500">On all domestic orders</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center text-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-primary shadow-sm">
                            <RotateCcw strokeWidth={1.5} size={24} />
                        </div>
                        <div>
                            <h4 className="font-heading font-bold text-sm uppercase tracking-wider mb-1">Easy Returns</h4>
                            <p className="text-xs text-gray-500">7-day return policy</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center text-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-primary shadow-sm">
                            <Shirt strokeWidth={1.5} size={24} />
                        </div>
                        <div>
                            <h4 className="font-heading font-bold text-sm uppercase tracking-wider mb-1">Custom Fitting</h4>
                            <p className="text-xs text-gray-500">Tailored to perfection</p>
                        </div>
                    </div>
                </div>

                {/* Links Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
                    <div className="col-span-2 lg:col-span-1">
                        <span className="text-2xl font-heading font-bold text-primary tracking-tight">ALEESA</span>
                        <p className="mt-4 text-sm text-gray-500 leading-relaxed">
                            Handcrafted ethnic wear celebrating the timeless beauty of Indian traditions designed for the modern woman.
                        </p>
                        <div className="flex gap-4 mt-6">
                            <span className="w-8 h-8 flex items-center justify-center rounded-full bg-white hover:bg-primary hover:text-white transition-colors cursor-pointer text-gray-600 border border-gray-200">
                                <Instagram size={16} />
                            </span>
                            <span className="w-8 h-8 flex items-center justify-center rounded-full bg-white hover:bg-primary hover:text-white transition-colors cursor-pointer text-gray-600 border border-gray-200">
                                <Facebook size={16} />
                            </span>
                            <span className="w-8 h-8 flex items-center justify-center rounded-full bg-white hover:bg-primary hover:text-white transition-colors cursor-pointer text-gray-600 border border-gray-200">
                                <Twitter size={16} />
                            </span>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-heading font-bold text-sm uppercase tracking-widest mb-6">Shop</h4>
                        <ul className="space-y-3 text-sm text-gray-500">
                            <li><Link href="/collections/new-arrivals" className="hover:text-primary transition-colors">New Arrivals</Link></li>
                            <li><Link href="/collections/suits" className="hover:text-primary transition-colors">Suits</Link></li>
                            <li><Link href="/collections/sarees" className="hover:text-primary transition-colors">Sarees</Link></li>
                            <li><Link href="/collections/lehengas" className="hover:text-primary transition-colors">Lehengas</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-heading font-bold text-sm uppercase tracking-widest mb-6">Company</h4>
                        <ul className="space-y-3 text-sm text-gray-500">
                            <li><Link href="#" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Store Locator</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Contact Us</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Careers</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-heading font-bold text-sm uppercase tracking-widest mb-6">Policies</h4>
                        <ul className="space-y-3 text-sm text-gray-500">
                            <li><Link href="#" className="hover:text-primary transition-colors">Shipping & Returns</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">FAQs</Link></li>
                        </ul>
                    </div>

                    <div className="col-span-2 lg:col-span-1">
                        <h4 className="font-heading font-bold text-sm uppercase tracking-widest mb-6">Newsletter</h4>
                        <p className="text-sm text-gray-500 mb-4">Subscribe to get updates on new arrivals and special offers.</p>
                        <div className="flex">
                            <input placeholder="Your email" className="flex-1 bg-white border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary" />
                            <button className="bg-primary text-white px-4 text-xs font-bold uppercase tracking-wider">Join</button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-8 text-center">
                    <p className="text-xs text-gray-400">© 2026 Aleesa Ethnic Wear. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
