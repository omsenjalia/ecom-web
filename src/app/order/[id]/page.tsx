import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Order, OrderItem } from '@/lib/types';

interface OrderPageProps {
  params: Promise<{ id: string }>;
}

const statusSteps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
const statusLabels: Record<string, string> = {
  pending: 'Order Placed',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export default async function OrderPage({ params }: OrderPageProps) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) notFound();

  const currentStepIndex = statusSteps.indexOf(order.order_status);
  const address = order.shipping_address_snapshot as unknown as Record<string, string>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display text-charcoal">
            Order {order.order_number}
          </h1>
          <p className="text-sm text-warm-gray mt-1">
            Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'long', year: 'numeric',
            })}
          </p>
        </div>
        <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider ${
          order.order_status === 'delivered' ? 'bg-success/10 text-success' :
          order.order_status === 'cancelled' ? 'bg-error/10 text-error' :
          'bg-amber/10 text-amber-dark'
        }`}>
          {statusLabels[order.order_status] || order.order_status}
        </span>
      </div>

      {/* Status timeline */}
      {order.order_status !== 'cancelled' && (
        <div className="mb-10">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-cream-dark" />
            <div
              className="absolute top-4 left-0 h-0.5 bg-amber transition-all"
              style={{ width: `${Math.max(0, currentStepIndex) / (statusSteps.length - 1) * 100}%` }}
            />
            {statusSteps.map((step, i) => (
              <div key={step} className="relative flex flex-col items-center z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  i <= currentStepIndex ? 'bg-amber text-white' : 'bg-cream-dark text-warm-gray'
                }`}>
                  {i <= currentStepIndex ? '✓' : i + 1}
                </div>
                <span className={`text-[10px] mt-1.5 whitespace-nowrap ${
                  i <= currentStepIndex ? 'text-charcoal font-semibold' : 'text-warm-gray'
                }`}>
                  {statusLabels[step]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {/* Order Items */}
        <div>
          <h2 className="text-lg font-display text-charcoal mb-4">Items</h2>
          <div className="space-y-3">
            {order.items?.map((item) => (
              <div key={item.id} className="flex gap-3 bg-white border border-cream-dark/30 p-3">
                <div className="relative w-16 h-16 bg-cream shrink-0 overflow-hidden">
                  {item.image_url_snapshot && (
                    <Image src={item.image_url_snapshot} alt={item.product_name_snapshot} fill sizes="64px" className="object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-charcoal line-clamp-1">{item.product_name_snapshot}</p>
                  <p className="text-xs text-warm-gray">{item.variant_info_snapshot} × {item.quantity}</p>
                  <p className="text-sm font-bold text-charcoal mt-1">₹{item.total_price.toLocaleString('en-IN')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order details */}
        <div className="space-y-6">
          {/* Shipping address */}
          <div>
            <h2 className="text-lg font-display text-charcoal mb-3">Shipping Address</h2>
            <div className="bg-cream p-4 text-sm text-warm-gray-dark">
              <p className="font-semibold text-charcoal">{address.full_name}</p>
              <p>{address.line1}{address.line2 ? `, ${address.line2}` : ''}</p>
              <p>{address.city}, {address.state} — {address.pincode}</p>
              <p>📞 {address.phone}</p>
            </div>
          </div>

          {/* Payment */}
          <div>
            <h2 className="text-lg font-display text-charcoal mb-3">Payment</h2>
            <div className="bg-cream p-4 text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-warm-gray-dark">Method</span>
                <span className="text-charcoal font-medium uppercase">{order.payment_method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-warm-gray-dark">Status</span>
                <span className={`font-medium ${order.payment_status === 'paid' ? 'text-success' : 'text-amber'}`}>
                  {order.payment_status === 'paid' ? 'Paid' : 'Pending'}
                </span>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div>
            <h2 className="text-lg font-display text-charcoal mb-3">Summary</h2>
            <div className="bg-cream p-4 text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-warm-gray-dark">Subtotal</span>
                <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-success">
                  <span>Discount{order.coupon_code_used ? ` (${order.coupon_code_used})` : ''}</span>
                  <span>-₹{order.discount_amount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-warm-gray-dark">Shipping</span>
                <span>{order.shipping_cost === 0 ? 'Free' : `₹${order.shipping_cost}`}</span>
              </div>
              <div className="flex justify-between text-xs text-warm-gray">
                <span>GST (included)</span>
                <span>₹{order.gst_amount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-bold text-charcoal pt-2 border-t border-cream-dark/50">
                <span>Total</span>
                <span>₹{order.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link href="/shop" className="text-sm text-amber font-semibold hover:text-amber-dark">
          ← Continue Shopping
        </Link>
      </div>
    </div>
  );
}

async function getOrder(id: string): Promise<(Order & { items: OrderItem[] }) | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .eq('id', id)
      .single();
    return data as (Order & { items: OrderItem[] }) | null;
  } catch {
    return null;
  }
}
