'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import CouponInput from '@/components/CouponInput';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, subtotal } = useCartStore();
  const [discount, setDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState('');

  const sub = subtotal();
  const gstAmount = Math.round((sub - discount) * 18 / 118 * 100) / 100;
  const shippingCost = sub >= 999 ? 0 : 79;
  const total = sub - discount + shippingCost;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <ShoppingBag size={64} className="mx-auto text-warm-gray-light mb-6" />
        <h1 className="text-3xl font-display text-charcoal mb-3">Your Cart is Empty</h1>
        <p className="text-warm-gray mb-8 max-w-md mx-auto">
          Looks like you haven&apos;t added any frames yet. Browse our collection and find your perfect pair.
        </p>
        <Link href="/shop" className="btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="text-3xl font-display text-charcoal mb-8">Shopping Cart</h1>

      <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-10">
        {/* Cart Items */}
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.variant_id}
              className="flex gap-4 bg-white border border-cream-dark/30 p-4"
            >
              {/* Image */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 bg-cream overflow-hidden">
                {item.image_url ? (
                  <Image
                    src={item.image_url}
                    alt={item.product_name}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl">👓</div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <Link
                      href={`/product/${item.product_slug}`}
                      className="font-semibold text-charcoal hover:text-amber transition-colors text-sm sm:text-base line-clamp-1"
                    >
                      {item.product_name}
                    </Link>
                    <p className="text-xs text-warm-gray mt-0.5">{item.variant_info}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span
                        className="w-3 h-3 rounded-full border border-warm-gray-light/50"
                        style={{ backgroundColor: item.color_hex }}
                      />
                      <span className="text-xs text-warm-gray">{item.color_name}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.variant_id)}
                    className="p-1.5 text-warm-gray hover:text-error transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-3">
                  {/* Quantity */}
                  <div className="flex items-center border border-cream-dark/50">
                    <button
                      onClick={() => updateQuantity(item.variant_id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-cream transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 h-8 flex items-center justify-center text-sm font-semibold border-x border-cream-dark/50">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.variant_id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock_quantity}
                      className="w-8 h-8 flex items-center justify-center hover:bg-cream transition-colors disabled:opacity-50"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="font-bold text-charcoal">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-[10px] text-warm-gray">
                        ₹{item.price.toLocaleString('en-IN')} each
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center pt-2">
            <Link href="/shop" className="text-sm text-amber font-semibold hover:text-amber-dark transition-colors">
              ← Continue Shopping
            </Link>
            <button
              onClick={clearCart}
              className="text-sm text-warm-gray hover:text-error transition-colors"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="mt-8 lg:mt-0">
          <div className="bg-cream p-6 sticky top-28">
            <h2 className="text-lg font-display text-charcoal mb-4">Order Summary</h2>

            {/* Coupon */}
            <CouponInput
              subtotal={sub}
              onApply={(discountAmount, code) => {
                setDiscount(discountAmount);
                setCouponCode(code);
              }}
              onRemove={() => {
                setDiscount(0);
                setCouponCode('');
              }}
            />

            <div className="space-y-2 mt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-warm-gray-dark">Subtotal</span>
                <span className="text-charcoal font-medium">₹{sub.toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-success">
                  <span>Discount ({couponCode})</span>
                  <span>-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-warm-gray-dark">Shipping</span>
                <span className="text-charcoal font-medium">
                  {shippingCost === 0 ? (
                    <span className="text-success">Free</span>
                  ) : (
                    `₹${shippingCost}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-xs text-warm-gray">
                <span>GST (included)</span>
                <span>₹{gstAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="border-t border-cream-dark/50 pt-2 mt-2">
                <div className="flex justify-between text-lg font-bold text-charcoal">
                  <span>Total</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
                <p className="text-[10px] text-warm-gray mt-0.5">Inclusive of all taxes</p>
              </div>
            </div>

            <Link
              href={`/checkout?coupon=${couponCode}&discount=${discount}`}
              className="btn-primary w-full mt-6 text-center"
            >
              Proceed to Checkout
            </Link>

            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-warm-gray">
              <span>🔒 Secure Checkout</span>
              <span>💳 COD Available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
