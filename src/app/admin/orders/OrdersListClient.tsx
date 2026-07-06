'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { useCallback } from 'react';

const STATUS_TABS = [
  { value: 'all', label: 'All Orders' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refunded', label: 'Refunded' },
];

interface Props {
  orders: Record<string, unknown>[];
  total: number;
  page: number;
  totalPages: number;
  currentStatus: string;
  currentPayment: string;
}

export default function OrdersListClient({
  orders,
  total,
  page,
  totalPages,
  currentStatus,
  currentPayment,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value && value !== 'all') params.set(key, value);
        else params.delete(key);
      });
      if (!('page' in updates)) params.set('page', '1');
      router.push(`/admin/orders?${params.toString()}`);
    },
    [router, searchParams]
  );

  const getAddress = (order: Record<string, unknown>) => {
    const snapshot = order.shipping_address_snapshot as Record<string, string> | null;
    if (!snapshot) return '—';
    return `${snapshot.full_name}, ${snapshot.city}`;
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Orders</h1>
          <p className="admin-page-subtitle">{total} total orders</p>
        </div>
      </div>

      {/* Status tabs */}
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => updateParams({ status: tab.value, page: '1' })}
            className={`admin-btn admin-btn-sm ${currentStatus === tab.value ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Payment filter */}
      <div className="admin-filters">
        <select
          value={currentPayment}
          onChange={(e) => updateParams({ payment: e.target.value, page: '1' })}
          className="admin-filter-select"
        >
          <option value="all">All Payment Status</option>
          <option value="pending">Payment Pending</option>
          <option value="paid">Paid</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {/* Orders table */}
      {orders.length === 0 ? (
        <div className="admin-card">
          <div className="admin-empty">
            <div className="admin-empty-icon">📦</div>
            <p className="admin-empty-title">No orders found</p>
            <p className="admin-empty-text">Orders will appear here when customers place them.</p>
          </div>
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th style={{ width: 60 }}></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id as string}>
                  <td>
                    <Link href={`/admin/orders/${order.id}`} style={{ fontWeight: 600, color: '#1a1a2e', textDecoration: 'none' }}>
                      {order.order_number as string}
                    </Link>
                  </td>
                  <td className="admin-text-muted admin-text-sm">
                    {new Date(order.created_at as string).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8125rem' }}>{getAddress(order)}</span>
                    <br />
                    <span className="admin-text-muted admin-text-sm">
                      {(order.payment_method as string).toUpperCase()}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>
                    ₹{(order.total as number).toLocaleString('en-IN')}
                  </td>
                  <td>
                    <StatusBadge status={order.payment_status as string} />
                  </td>
                  <td>
                    <StatusBadge status={order.order_status as string} />
                  </td>
                  <td>
                    <Link href={`/admin/orders/${order.id}`} className="admin-btn admin-btn-ghost admin-btn-sm" title="View details">
                      <Eye size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="admin-pagination">
              <span>Page {page} of {totalPages} ({total} orders)</span>
              <div className="admin-pagination-controls">
                <button
                  disabled={page <= 1}
                  onClick={() => updateParams({ page: String(page - 1) })}
                  className="admin-pagination-btn"
                >
                  <ChevronLeft size={14} />
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
                  const pageNum = start + i;
                  if (pageNum > totalPages) return null;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => updateParams({ page: String(pageNum) })}
                      className={`admin-pagination-btn ${pageNum === page ? 'admin-pagination-btn-active' : ''}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  disabled={page >= totalPages}
                  onClick={() => updateParams({ page: String(page + 1) })}
                  className="admin-pagination-btn"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
