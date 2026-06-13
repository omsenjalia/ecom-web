import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-charcoal text-cream">
      {/* Trust Strip */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="flex flex-col items-center gap-2">
              <span className="text-2xl">🚚</span>
              <div>
                <p className="text-sm font-semibold">Free Shipping</p>
                <p className="text-xs text-warm-gray-light">On orders above ₹999</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-2xl">💳</span>
              <div>
                <p className="text-sm font-semibold">Secure Payment</p>
                <p className="text-xs text-warm-gray-light">UPI, Cards & COD</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-2xl">↩️</span>
              <div>
                <p className="text-sm font-semibold">Easy Returns</p>
                <p className="text-xs text-warm-gray-light">7-day return policy</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-2xl">📋</span>
              <div>
                <p className="text-sm font-semibold">GST Invoice</p>
                <p className="text-xs text-warm-gray-light">On every purchase</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-amber rounded-full flex items-center justify-center text-white font-display text-sm">
                  R
                </div>
                <span className="font-display text-xl text-cream">
                  Ram Chashma Ghar
                </span>
              </div>
            </Link>
            <p className="text-sm text-warm-gray-light leading-relaxed mb-4">
              Trusted eyewear since 1985. Handpicked frames for every face, every occasion. Based in Gujarat, delivering across India.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-amber transition-colors text-sm"
                aria-label="WhatsApp"
              >
                💬
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-amber transition-colors text-sm"
                aria-label="Instagram"
              >
                📷
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-amber transition-colors text-sm"
                aria-label="Facebook"
              >
                📘
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-gold mb-4">
              Shop
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/shop/eyeglasses" className="text-sm text-warm-gray-light hover:text-cream transition-colors">
                  Eyeglasses
                </Link>
              </li>
              <li>
                <Link href="/shop/sunglasses" className="text-sm text-warm-gray-light hover:text-cream transition-colors">
                  Sunglasses
                </Link>
              </li>
              <li>
                <Link href="/shop/reading-glasses" className="text-sm text-warm-gray-light hover:text-cream transition-colors">
                  Reading Glasses
                </Link>
              </li>
              <li>
                <Link href="/shop/kids" className="text-sm text-warm-gray-light hover:text-cream transition-colors">
                  Kids Eyewear
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-sm text-warm-gray-light hover:text-cream transition-colors">
                  All Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-gold mb-4">
              Help
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/faq" className="text-sm text-warm-gray-light hover:text-cream transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-warm-gray-light hover:text-cream transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-warm-gray-light hover:text-cream transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="text-sm text-warm-gray-light hover:text-cream transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/faq#returns" className="text-sm text-warm-gray-light hover:text-cream transition-colors">
                  Returns & Refunds
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-gold mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 text-amber shrink-0" />
                <span className="text-sm text-warm-gray-light">
                  Station Road, Rajkot,<br />Gujarat 360001
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-amber shrink-0" />
                <a href="tel:+919876543210" className="text-sm text-warm-gray-light hover:text-cream transition-colors">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-amber shrink-0" />
                <a href="mailto:hello@ramchashmagar.in" className="text-sm text-warm-gray-light hover:text-cream transition-colors">
                  hello@ramchashmagar.in
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-warm-gray">
            <p>© 2024 Ram Chashma Ghar. All rights reserved. | GST: 24XXXXX1234X1ZX</p>
            <p>Prices inclusive of 18% GST</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
