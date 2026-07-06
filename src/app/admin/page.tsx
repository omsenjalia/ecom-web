import { requireAdmin } from '@/lib/supabase/admin-check';
import { createAdminClient } from '@/lib/supabase/admin';
import Link from 'next/link';
import { Package, ShoppingCart, AlertTriangle, DollarSign, TrendingUp, Eye } from 'lucide-react';
import StatusBadge from './components/StatusBadge';

export const metadata = { title: 'Dashboard' };

export default async function AdminDashboard() {
  await requireAdmin();
  const supabase = createAdminClient();

  // Stats queries
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    { count: totalProducts },
    { count: activeProducts },
    { count: totalOrders },
    { data: todayOrders },
    { data: lowStockVariants },
    { data: recentOrders },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }).is('deleted_at', null),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true).is('deleted_at', null),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('id, total, order_status').gte('created_at', today.toISOString()),
    supabase.from('product_variants').select('id, sku, color_name, stock_quantity, product_id, products(name)').lt('stock_quantity', 5).order('stock_quantity', { ascending: true }).limit(10),
    supabase.from('orders').select('id, order_number, total, order_status, payment_status, created_at').order('created_at', { ascending: false }).limit(10),
  ]);

  const todayRevenue = (todayOrders || []).reduce((sum: number, o: { total: number }) => sum + Number(o.total), 0);
  const todayOrderCount = todayOrders?.length || 0;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-subtitle">
            Welcome back — here&apos;s what&apos;s happening today
          </p>
        </div>
      </div>

      {/* Stats cards */}
      <div className="admin-stat-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon admin-stat-icon-amber">
            <DollarSign size={20} />
          </div>
          <div>
            <p className="admin-stat-value">₹{todayRevenue.toLocaleString('en-IN')}</p>
            <p className="admin-stat-label">Today&apos;s Revenue</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon admin-stat-icon-blue">
            <ShoppingCart size={20} />
          </div>
          <div>
            <p className="admin-stat-value">{todayOrderCount}</p>
            <p className="admin-stat-label">Today&apos;s Orders</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon admin-stat-icon-green">
            <Package size={20} />
          </div>
          <div>
            <p className="admin-stat-value">{activeProducts || 0}<span className="admin-text-muted admin-text-sm"> / {totalProducts || 0}</span></p>
            <p className="admin-stat-label">Active Products</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon admin-stat-icon-red">
            <AlertTriangle size={20} />
          </div>
          <div>
            <p className="admin-stat-value">{lowStockVariants?.length || 0}</p>
            <p className="admin-stat-label">Low Stock Alerts</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Recent orders */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Recent Orders</h2>
            <Link href="/admin/orders" className="admin-btn admin-btn-ghost admin-btn-sm">
              View All <Eye size={14} />
            </Link>
          </div>
          {recentOrders && recentOrders.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {recentOrders.map((order: Record<string, unknown>) => (
                <Link
                  key={order.id as string}
                  href={`/admin/orders/${order.id}`}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f3f4f6', textDecoration: 'none', color: 'inherit' }}
                >
                  <div>
                    <span style={{ fontWeight: 600, fontSize: '0.8125rem' }}>{order.order_number as string}</span>
                    <br />
                    <span className="admin-text-muted admin-text-sm">
                      {new Date(order.created_at as string).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.8125rem' }}>₹{(order.total as number).toLocaleString('en-IN')}</span>
                    <br />
                    <StatusBadge status={order.order_status as string} />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="admin-empty">
              <p className="admin-empty-text">No orders yet</p>
            </div>
          )}
        </div>

        {/* Low stock alerts */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Low Stock Alerts</h2>
            <Link href="/admin/products?stock=low" className="admin-btn admin-btn-ghost admin-btn-sm">
              View All <Eye size={14} />
            </Link>
          </div>
          {lowStockVariants && lowStockVariants.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {lowStockVariants.map((v: Record<string, unknown>) => {
                const product = v.products as { name: string } | null;
                return (
                  <div
                    key={v.id as string}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f3f4f6' }}
                  >
                    <div>
                      <span style={{ fontWeight: 600, fontSize: '0.8125rem' }}>
                        {product?.name || 'Unknown'}
                      </span>
                      <br />
                      <span className="admin-text-muted admin-text-sm">
                        {v.color_name as string} · {v.sku as string}
                      </span>
                    </div>
                    <StatusBadge status={(v.stock_quantity as number) === 0 ? 'out-of-stock' : 'low-stock'} />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="admin-empty">
              <div className="admin-empty-icon">✅</div>
              <p className="admin-empty-text">All stock levels healthy</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="admin-card" style={{ marginTop: '1.5rem' }}>
        <h2 className="admin-card-title" style={{ marginBottom: '1rem' }}>Quick Actions</h2>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link href="/admin/products/new" className="admin-btn admin-btn-primary">
            <Package size={16} /> Add Product
          </Link>
          <Link href="/admin/categories" className="admin-btn admin-btn-secondary">
            <TrendingUp size={16} /> Manage Categories
          </Link>
          <Link href="/admin/orders" className="admin-btn admin-btn-secondary">
            <ShoppingCart size={16} /> View Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
