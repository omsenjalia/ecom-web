'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, ShoppingBag, Package } from 'lucide-react';

export default function OrderSuccessClient() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  const orderNumber = searchParams.get('number');

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
      <div className="mb-6">
        <CheckCircle size={72} className="mx-auto text-success" />
      </div>

      <h1 className="text-3xl sm:text-4xl font-display text-charcoal mb-3">
        Order Placed Successfully!
      </h1>

      {orderNumber && (
        <p className="text-lg text-warm-gray-dark mb-2">
          Order Number: <span className="font-bold text-charcoal">{orderNumber}</span>
        </p>
      )}

      <p className="text-warm-gray mb-8 max-w-md mx-auto">
        Thank you for shopping with Ram Chashma Ghar! We&apos;ll send you an update once your order is shipped.
      </p>

      <div className="bg-cream p-6 mb-8 text-left space-y-3">
        <h2 className="font-display text-lg text-charcoal mb-4">What happens next?</h2>
        {[
          { num: '1', title: 'Order Confirmed', desc: "We've received your order and are preparing it", active: true },
          { num: '2', title: 'Processing', desc: 'Your eyewear is being carefully packaged', active: false },
          { num: '3', title: 'Shipped', desc: "You'll receive a tracking number via email", active: false },
          { num: '4', title: 'Delivered', desc: 'Your new frames arrive at your doorstep', active: false },
        ].map((step) => (
          <div key={step.num} className="flex items-start gap-3">
            <div className={`w-8 h-8 ${step.active ? 'bg-amber/20' : 'bg-cream-dark'} rounded-full flex items-center justify-center shrink-0 mt-0.5`}>
              <span className={`text-sm font-bold ${step.active ? 'text-amber' : 'text-warm-gray'}`}>{step.num}</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-charcoal">{step.title}</p>
              <p className="text-xs text-warm-gray">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {orderId && (
          <Link href={`/order/${orderId}`} className="btn-secondary flex items-center justify-center gap-2">
            <Package size={18} />
            Track Order
          </Link>
        )}
        <Link href="/shop" className="btn-primary flex items-center justify-center gap-2">
          <ShoppingBag size={18} />
          Continue Shopping
        </Link>
      </div>

      <div className="mt-8 p-4 bg-charcoal/5 rounded-lg">
        <p className="text-sm text-warm-gray-dark">
          Need help? Chat with us on{' '}
          <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="text-amber font-semibold hover:text-amber-dark">
            WhatsApp
          </a>{' '}
          or call <a href="tel:+919876543210" className="text-amber font-semibold">+91 98765 43210</a>
        </p>
      </div>
    </div>
  );
}
