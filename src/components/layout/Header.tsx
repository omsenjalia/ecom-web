'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, User, Menu, X, Search, ChevronDown } from 'lucide-react';
import { useCartStore } from '@/store/cart';

const categories = [
  { name: 'Eyeglasses', href: '/shop/eyeglasses' },
  { name: 'Sunglasses', href: '/shop/sunglasses' },
  { name: 'Reading Glasses', href: '/shop/reading-glasses' },
  { name: 'Kids', href: '/shop/kids' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopDropdown, setShopDropdown] = useState(false);
  const itemCount = useCartStore((s) => s.itemCount());

  return (
    <>
      <header className="sticky top-0 z-50 bg-warm-white/95 backdrop-blur-md border-b border-cream-dark/50">
        {/* Top bar */}
        <div className="bg-charcoal text-cream text-xs tracking-wider py-1.5 text-center font-body hidden sm:block">
          Free Shipping on Orders Above ₹999 &nbsp;·&nbsp; COD Available &nbsp;·&nbsp; Easy 7-Day Returns
        </div>

        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 -ml-2 text-charcoal hover:text-amber transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-amber rounded-full flex items-center justify-center text-white font-display text-sm group-hover:bg-amber-dark transition-colors">
                R
              </div>
              <div className="hidden sm:block">
                <span className="font-display text-xl text-charcoal tracking-tight">
                  Ram Chashma Ghar
                </span>
              </div>
              <div className="sm:hidden">
                <span className="font-display text-lg text-charcoal tracking-tight">
                  RCG
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-8">
              <Link
                href="/"
                className="text-sm font-medium text-warm-gray-dark hover:text-charcoal transition-colors tracking-wide uppercase"
              >
                Home
              </Link>

              {/* Shop dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setShopDropdown(true)}
                onMouseLeave={() => setShopDropdown(false)}
              >
                <Link
                  href="/shop"
                  className="flex items-center gap-1 text-sm font-medium text-warm-gray-dark hover:text-charcoal transition-colors tracking-wide uppercase"
                >
                  Shop <ChevronDown size={14} className={`transition-transform ${shopDropdown ? 'rotate-180' : ''}`} />
                </Link>
                {shopDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white shadow-lg border border-cream-dark/30 py-2 animate-fade-in-up">
                    <Link
                      href="/shop"
                      className="block px-4 py-2 text-sm text-warm-gray-dark hover:text-charcoal hover:bg-cream transition-colors"
                    >
                      All Eyewear
                    </Link>
                    {categories.map((cat) => (
                      <Link
                        key={cat.href}
                        href={cat.href}
                        className="block px-4 py-2 text-sm text-warm-gray-dark hover:text-charcoal hover:bg-cream transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/about"
                className="text-sm font-medium text-warm-gray-dark hover:text-charcoal transition-colors tracking-wide uppercase"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-sm font-medium text-warm-gray-dark hover:text-charcoal transition-colors tracking-wide uppercase"
              >
                Contact
              </Link>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-3 sm:gap-4">
              <Link
                href="/shop"
                className="p-2 text-charcoal hover:text-amber transition-colors hidden sm:block"
                aria-label="Search"
              >
                <Search size={20} />
              </Link>
              <Link
                href="/account"
                className="p-2 text-charcoal hover:text-amber transition-colors"
                aria-label="Account"
              >
                <User size={20} />
              </Link>
              <Link
                href="/cart"
                className="p-2 text-charcoal hover:text-amber transition-colors relative"
                aria-label="Cart"
              >
                <ShoppingBag size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-amber text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-warm-white shadow-2xl animate-fade-in-up overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <span className="font-display text-xl text-charcoal">
                  Ram Chashma Ghar
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 text-charcoal"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="space-y-1">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="block py-3 text-lg font-medium text-charcoal border-b border-cream-dark/30"
                >
                  Home
                </Link>
                <Link
                  href="/shop"
                  onClick={() => setMobileOpen(false)}
                  className="block py-3 text-lg font-medium text-charcoal border-b border-cream-dark/30"
                >
                  All Eyewear
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-3 pl-4 text-base text-warm-gray-dark border-b border-cream-dark/30"
                  >
                    {cat.name}
                  </Link>
                ))}
                <Link
                  href="/about"
                  onClick={() => setMobileOpen(false)}
                  className="block py-3 text-lg font-medium text-charcoal border-b border-cream-dark/30"
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="block py-3 text-lg font-medium text-charcoal border-b border-cream-dark/30"
                >
                  Contact
                </Link>
                <Link
                  href="/faq"
                  onClick={() => setMobileOpen(false)}
                  className="block py-3 text-lg font-medium text-charcoal border-b border-cream-dark/30"
                >
                  FAQ
                </Link>
                <Link
                  href="/account"
                  onClick={() => setMobileOpen(false)}
                  className="block py-3 text-lg font-medium text-charcoal border-b border-cream-dark/30"
                >
                  My Account
                </Link>
              </nav>

              <div className="mt-8 p-4 bg-cream rounded-lg">
                <p className="text-sm text-warm-gray-dark mb-2">Need help?</p>
                <a
                  href="https://wa.me/919876543210?text=Hi%2C%20I%20need%20help%20with%20my%20eyewear%20order"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber font-semibold text-sm hover:text-amber-dark"
                >
                  Chat on WhatsApp →
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
