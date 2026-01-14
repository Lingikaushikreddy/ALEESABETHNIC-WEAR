
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
                        <p className="mt-2 text-xs font-semibold text-gray-700">#aleesaethnicwear</p>
                        <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                            We dream not only of making women more beautiful but happier too. Established in 2012, we bring the latest trending ethnic wear collections to both offline and online platforms.
                        </p>
                        <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                            Based in Hyderabad, our aim is to reach every Indian woman looking for supreme quality ethnic wear at the most affordable cost.
                        </p>
                        <div className="mt-4 space-y-2 text-sm">
                            <p className="text-gray-700 font-medium">📍 Hyderabad, India</p>
                            <p className="text-gray-700 font-medium">📞 WhatsApp: <a href="https://wa.me/918143906891" className="text-primary hover:underline">8143906891</a></p>
                        </div>
                        <div className="flex gap-4 mt-6">
                            <a href="https://instagram.com/aleesaethnicwear" target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded-full bg-white hover:bg-primary hover:text-white transition-colors cursor-pointer text-gray-600 border border-gray-200">
                                <Instagram size={16} />
                            </a>
                            <a href="https://facebook.com/aleesaethnicwear" target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded-full bg-white hover:bg-primary hover:text-white transition-colors cursor-pointer text-gray-600 border border-gray-200">
                                <Facebook size={16} />
                            </a>
                            <a href="https://wa.me/918143906891" target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded-full bg-white hover:bg-primary hover:text-white transition-colors cursor-pointer text-gray-600 border border-gray-200">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                            </a>
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
                            <li><Link href="/policies/shipping-returns" className="hover:text-primary transition-colors">Shipping & Returns</Link></li>
                            <li><Link href="/policies/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/policies/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                            <li><Link href="/faqs" className="hover:text-primary transition-colors">FAQs</Link></li>
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
                    <p className="text-xs text-gray-400">© 2012-2026 Aleesa Ethnic Wear. All rights reserved. | Hyderabad, India</p>
                </div>
            </div>
        </footer>
    )
}
