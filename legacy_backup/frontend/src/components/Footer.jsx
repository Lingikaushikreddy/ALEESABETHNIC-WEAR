import React from 'react';
import { Headset, Truck, RotateCcw, Ruler } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 mt-16">
      {/* Trust Badges */}
      <div className="border-y border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-pink-100 rounded-full mb-3">
                <Headset className="text-pink-600" size={28} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">24x7 Customer Support</h3>
              <p className="text-xs text-gray-600">Always here to help</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-pink-100 rounded-full mb-3">
                <Truck className="text-pink-600" size={28} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Free Shipping*</h3>
              <p className="text-xs text-gray-600">On orders above $50</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-pink-100 rounded-full mb-3">
                <RotateCcw className="text-pink-600" size={28} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Easy Returns*</h3>
              <p className="text-xs text-gray-600">7-day return policy</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-pink-100 rounded-full mb-3">
                <Ruler className="text-pink-600" size={28} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Custom Fitting</h3>
              <p className="text-xs text-gray-600">Tailored to perfection</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Content */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <h3 className="text-lg font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                <span className="text-pink-600">NEERU'S</span>
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Your destination for authentic Indian ethnic wear. Fresh styles every week.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-pink-600 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-pink-600 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-pink-600 transition-colors">Track Order</a></li>
                <li><a href="#" className="hover:text-pink-600 transition-colors">Size Guide</a></li>
              </ul>
            </div>

            {/* Policies */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Policies</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-pink-600 transition-colors">Returns & Refund Policy</a></li>
                <li><a href="#" className="hover:text-pink-600 transition-colors">Shipping Policy</a></li>
                <li><a href="#" className="hover:text-pink-600 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-pink-600 transition-colors">Terms & Conditions</a></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Stay Connected</h4>
              <p className="text-sm text-gray-600 mb-3">Get the latest updates on new arrivals and exclusive offers</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <button className="px-4 py-2 bg-pink-600 text-white text-sm font-medium rounded-md hover:bg-pink-700 transition-colors">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-600">
            <p>© 2025 Neeru's India. All rights reserved.</p>
            <p className="mt-2 md:mt-0">
              <span className="font-semibold">We Ship Across the World:</span> United States, United Kingdom, Canada, Australia, India
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
