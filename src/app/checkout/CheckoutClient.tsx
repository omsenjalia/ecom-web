'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useCartStore } from '@/store/cart';
import AddressForm from '@/components/AddressForm';
import type { AddressSnapshot } from '@/lib/types';

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export default function CheckoutClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, subtotal, clearCart } = useCartStore();
  const [address, setAddress] = useState<AddressSnapshot | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'address' | 'review'>('address');

  const couponCode = searchParams.get('coupon') || '';
  const discount = Number(searchParams.get('discount')) || 0;

  const sub = subtotal();
  const gstAmount = Math.round((sub - discount) * 18 / 118 * 100) / 100;
  const shippingCost = sub >= 999 ? 0 : 79;
  const total = sub - discount + shippingCost;

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items, router]);

  const handleAddressSubmit = (addr: AddressSnapshot) => {
    setAddress(addr);
    setStep('review');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = async () => {
    if (!address) return;
    setLoading(true);

    try {
      if (paymentMethod === 'cod') {
        const res = await fetch('/api/checkout/cod-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: items.map((i) => ({
              product_id: i.product_id,
              variant_id: i.variant_id,
              product_name: i.product_name,
              variant_info: i.variant_info,
              product_slug: i.product_slug,
              image_url: i.image_url,
              quantity: i.quantity,
              unit_price: i.price,
            })),
            address,
            coupon_code: couponCode,
            discount_amount: discount,
            guest_email: guestEmail,
            guest_phone: guestPhone || address.phone,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Order failed');

        clearCart();
        router.push(`/order/success?id=${data.order_id}&number=${data.order_number}`);
      } else {
        const res = await fetch('/api/checkout/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: items.map((i) => ({
              product_id: i.product_id,
              variant_id: i.variant_id,
              product_name: i.product_name,
              variant_info: i.variant_info,
              product_slug: i.product_slug,
              image_url: i.image_url,
              quantity: i.quantity,
              unit_price: i.price,
            })),
            address,
            coupon_code: couponCode,
            discount_amount: discount,
            guest_email: guestEmail,
            guest_phone: guestPhone || address.phone,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to create order');

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: data.razorpay_amount,
          currency: 'INR',
          name: 'Ram Chashma Ghar',
          description: 'Eyewear Purchase',
          order_id: data.razorpay_order_id,
          handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
            const verifyRes = await fetch('/api/checkout/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                internal_order_id: data.internal_order_id,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) {
              toast.error('Payment verification failed');
              return;
            }

            clearCart();
            router.push(`/order/success?id=${verifyData.order_id}&number=${verifyData.order_number}`);
          },
          prefill: {
            email: guestEmail,
            contact: guestPhone || address.phone,
          },
          theme: { color: '#D4782F' },
          modal: {
            ondismiss: () => {
              setLoading(false);
              toast.error('Payment cancelled');
            },
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="text-3xl font-display text-charcoal mb-8">Checkout</h1>

      {/* Steps indicator */}
      <div className="flex items-center gap-4 mb-8 text-sm">
        <button
          onClick={() => setStep('address')}
          className={`flex items-center gap-2 ${step === 'address' ? 'text-amber font-semibold' : 'text-warm-gray'}`}
        >
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === 'address' ? 'bg-amber text-white' : 'bg-cream-dark text-warm-gray'}`}>1</span>
          Address
        </button>
        <div className="h-px flex-1 bg-cream-dark" />
        <span className={`flex items-center gap-2 ${step === 'review' ? 'text-amber font-semibold' : 'text-warm-gray'}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === 'review' ? 'bg-amber text-white' : 'bg-cream-dark text-warm-gray'}`}>2</span>
          Review & Pay
        </span>
      </div>

      <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-10">
        <div>
          {/* STEP 1: Address */}
          {step === 'address' && (
            <div>
              <h2 className="text-xl font-display text-charcoal mb-4">Shipping Address</h2>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-warm-gray-dark mb-1.5">
                    Email (for order updates)
                  </label>
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-2.5 border border-cream-dark/50 bg-white text-sm placeholder:text-warm-gray-light focus:border-amber focus:outline-none"
                  />
                </div>
              </div>
              <AddressForm onSubmit={handleAddressSubmit} initialValues={address || undefined} />
            </div>
          )}

          {/* STEP 2: Review & Pay */}
          {step === 'review' && address && (
            <div className="space-y-6">
              <div className="bg-cream p-4 flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-bold text-charcoal mb-1">Shipping to</h3>
                  <p className="text-sm text-warm-gray-dark">
                    {address.full_name}<br />
                    {address.line1}{address.line2 ? `, ${address.line2}` : ''}<br />
                    {address.city}, {address.state} — {address.pincode}<br />
                    📞 {address.phone}
                  </p>
                </div>
                <button onClick={() => setStep('address')} className="text-xs text-amber font-semibold hover:text-amber-dark">
                  Change
                </button>
              </div>

              <div>
                <h3 className="text-sm font-bold text-charcoal mb-3">Order Items</h3>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.variant_id} className="flex gap-3 text-sm">
                      <div className="relative w-16 h-16 bg-cream shrink-0 overflow-hidden">
                        {item.image_url && (
                          <Image src={item.image_url} alt={item.product_name} fill sizes="64px" className="object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-charcoal line-clamp-1">{item.product_name}</p>
                        <p className="text-xs text-warm-gray">{item.variant_info} × {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-charcoal shrink-0">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-charcoal mb-3">Payment Method</h3>
                <div className="space-y-2">
                  <label className={`flex items-center gap-3 p-4 border cursor-pointer transition-colors ${paymentMethod === 'razorpay' ? 'border-amber bg-amber/5' : 'border-cream-dark/50 hover:border-warm-gray'}`}>
                    <input type="radio" name="payment" value="razorpay" checked={paymentMethod === 'razorpay'} onChange={() => setPaymentMethod('razorpay')} className="accent-amber" />
                    <div>
                      <p className="text-sm font-semibold text-charcoal">Pay Online</p>
                      <p className="text-xs text-warm-gray">UPI, Credit/Debit Card, Net Banking</p>
                    </div>
                  </label>
                  <label className={`flex items-center gap-3 p-4 border cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-amber bg-amber/5' : 'border-cream-dark/50 hover:border-warm-gray'}`}>
                    <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="accent-amber" />
                    <div>
                      <p className="text-sm font-semibold text-charcoal">Cash on Delivery</p>
                      <p className="text-xs text-warm-gray">Pay when your order arrives</p>
                    </div>
                  </label>
                </div>
              </div>

              <button onClick={handlePlaceOrder} disabled={loading} className="btn-primary w-full text-base py-4 disabled:opacity-50">
                {loading ? 'Processing...' : paymentMethod === 'cod' ? `Place Order — ₹${total.toLocaleString('en-IN')}` : `Pay ₹${total.toLocaleString('en-IN')}`}
              </button>

              <p className="text-xs text-warm-gray text-center">
                By placing this order, you agree to our terms of service and return policy.
              </p>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="mt-8 lg:mt-0">
          <div className="bg-cream p-6 sticky top-28">
            <h2 className="text-lg font-display text-charcoal mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-warm-gray-dark">Subtotal ({items.length} items)</span>
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
                  {shippingCost === 0 ? <span className="text-success">Free</span> : `₹${shippingCost}`}
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
          </div>
        </div>
      </div>
    </div>
  );
}
