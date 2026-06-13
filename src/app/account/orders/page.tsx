import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import type { Order } from '@/lib/types';

const statusColors: Record<string, string> = {
  pending: 'bg-amber/10 text-amber-dark',
  confirmed: 'bg-amber/10 text-amber-dark',
  processing: 'bg-amber/10 text-amber-dark',
  shipped: 'bg-blue-50 text-blue-700',
  delivered: 'bg-success/10 text-success',
  cancelled: 'bg-error/10 text-error',
};

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display text-charcoal">My Orders</h1>
        <Link href="/account" className="text-sm text-amber font-semibold hover:text-amber-dark">
          ← Account
        </Link>
      </div>

      {!orders || orders.length === 0 ? (
        <div className="text-center py-16">
          <span className="text-5xl mb-4 block">📦</span>
          <h2 className="text-xl font-display text-charcoal mb-2">No orders yet</h2>
          <p className="text-warm-gray mb-6">Start shopping to see your orders here.</p>
          <Link href="/shop" className="btn-primary">Browse Eyewear</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {(orders as Order[]).map((order) => (
            <Link
              key={order.id}
              href={`/order/${order.id}`}
              className="block bg-white border border-cream-dark/30 p-4 sm:p-6 hover:border-amber transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-charcoal">{order.order_number}</p>
                  <p className="text-xs text-warm-gray mt-0.5">
                    {new Date(order.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </p>
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusColors[order.order_status] || ''}`}>
                  {order.order_status}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-warm-gray-dark">
                  {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Paid Online'}
                </span>
                <span className="font-bold text-charcoal">₹{order.total.toLocaleString('en-IN')}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
