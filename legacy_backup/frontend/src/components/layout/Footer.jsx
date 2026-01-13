import React from 'react';
import { Link } from 'react-router-dom';
import { Headset, Truck, RotateCcw, ShieldCheck, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 mt-16" data-testid="footer">
      {/* Trust Badges */}
      <div className="border-y border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-pink-100 rounded-full mb-3">
                <Headset className="text-pink-600" size={28} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">24x7 Support</h3>
              <p className="text-xs text-gray-600">Always here to help</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-pink-100 rounded-full mb-3">
                <Truck className="text-pink-600" size={28} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">Free Shipping*</h3>
              <p className="text-xs text-gray-600">On orders above ₹2000</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-pink-100 rounded-full mb-3">
                <RotateCcw className="text-pink-600" size={28} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">Easy Returns*</h3>
              <p className="text-xs text-gray-600">7-day return policy</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-pink-100 rounded-full mb-3">
                <ShieldCheck className="text-pink-600" size={28} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">100% Authentic</h3>
              <p className="text-xs text-gray-600">Quality guaranteed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Content */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* About Aleesa */}
            <div>
              <h3
                className="text-lg font-bold mb-4"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                <span className="text-pink-600">ALEESA</span>
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                We always try best to provide best possible quality of products to our customers. We dream not only of making women more beautiful but happier too.
              </p>
              <p className="text-xs text-gray-500">Established in 2012 • Based in Hyderabad</p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link to="/collections/new-arrivals" className="hover:text-pink-600 transition-colors">
                    New Arrivals
                  </Link>
                </li>
                <li>
                  <Link to="/collections/suits" className="hover:text-pink-600 transition-colors">
                    Suits
                  </Link>
                </li>
                <li>
                  <Link to="/collections/sarees" className="hover:text-pink-600 transition-colors">
                    Sarees
                  </Link>
                </li>
                <li>
                  <Link to="/account" className="hover:text-pink-600 transition-colors">
                    My Account
                  </Link>
                </li>
              </ul>
            </div>

            {/* Policies */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Policies</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link to="/shipping-policy" className="hover:text-pink-600 transition-colors">
                    Shipping Policy
                  </Link>
                </li>
                <li>
                  <Link to="/return-policy" className="hover:text-pink-600 transition-colors">
                    Return & Refund Policy
                  </Link>
                </li>
                <li>
                  <Link to="/privacy-policy" className="hover:text-pink-600 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-pink-600 transition-colors">
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>

            {/* Stay Connected */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Stay Connected</h4>
              <p className="text-sm text-gray-600 mb-3">
                Get the latest updates on new arrivals and exclusive offers
              </p>
              <div className="flex gap-2 mb-4">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <button className="px-4 py-2 bg-pink-600 text-white text-sm font-medium rounded-md hover:bg-pink-700 transition-colors">
                  Join
                </button>
              </div>
              <div className="flex gap-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-200 rounded-full hover:bg-pink-600 hover:text-white transition-colors"
                >
                  <Instagram size={18} />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-200 rounded-full hover:bg-pink-600 hover:text-white transition-colors"
                >
                  <Facebook size={18} />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-200 rounded-full hover:bg-pink-600 hover:text-white transition-colors"
                >
                  <Twitter size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-600">
            <p>© 2025 Aleesa Ethnic Wear. All rights reserved.</p>
            <p className="mt-2 md:mt-0">
              <span className="font-semibold">We Retail:</span> Indian Ethnic Wear • Hyderabad, India
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
