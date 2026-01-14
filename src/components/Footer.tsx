
import Link from 'next/link'
import { Facebook, Instagram, Twitter, Truck, RotateCcw, Headphones, Shirt, MapPin } from 'lucide-react'

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
                    <div className="col-span-2 lg:col-span-1 flex flex-col items-start">
                        {/* Logo */}
                        <Link href="/" className="mb-6 block relative">
                            <img
                                src="/logo.png"
                                alt="Aleesa Ethnic Wear"
                                className="h-20 w-auto object-contain"
                            />
                        </Link>

                        {/* Hashtag */}
                        <p className="mb-6 text-xs font-bold tracking-[0.2em] text-pink-600 uppercase border-b border-pink-100 pb-2">
                            #aleesaethnicwear
                        </p>

                        {/* Description */}
                        <div className="space-y-4 text-sm leading-7 text-gray-600 font-light">
                            <p>
                                <span className="font-serif italic text-lg text-gray-800 pr-1">"</span>
                                We dream not only of making women more beautiful but happier too. Established in 2012, we bring the latest trending ethnic wear collections to both offline and online platforms.
                            </p>
                            <p>
                                Based in Hyderabad, our aim is to reach every Indian woman looking for supreme quality ethnic wear at the most affordable cost.
                            </p>
                        </div>

                        {/* Contact Info */}
                        <div className="mt-8 space-y-3">
                            <div className="flex items-center gap-3 text-sm text-gray-700 group">
                                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-all">
                                    <MapPin size={14} strokeWidth={2} />
                                </div>
                                <span className="font-medium">Hyderabad, India</span>
                            </div>
                            <a href="https://wa.me/918143906891" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-gray-700 group cursor-pointer">
                                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-green-500 group-hover:text-white transition-all">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                                </div>
                                <span className="font-medium group-hover:text-green-600 transition-colors">WhatsApp: 8143906891</span>
                            </a>
                        </div>

                        {/* Social Links */}
                        <div className="flex gap-4 mt-8 pt-6 border-t border-gray-100 w-full">
                            <a href="https://instagram.com/aleesaethnicwear" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-gray-400 shadow-sm border border-gray-100 hover:border-pink-500 hover:text-pink-500 hover:shadow-md transition-all transform hover:-translate-y-1">
                                <Instagram size={18} />
                            </a>
                            <a href="https://facebook.com/aleesaethnicwear" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-gray-400 shadow-sm border border-gray-100 hover:border-blue-600 hover:text-blue-600 hover:shadow-md transition-all transform hover:-translate-y-1">
                                <Facebook size={18} />
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
