'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Truck, Package, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { updateOrderStatus } from '../actions';
import StatusBadge from '../../components/StatusBadge';
import ConfirmDialog from '../../components/ConfirmDialog';

const STATUS_FLOW = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
};

interface Props {
  order: Record<string, unknown>;
}

export default function OrderDetailClient({ order }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(order.order_status as string);
  const [trackingNumber, setTrackingNumber] = useState((order.tracking_number as string) || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [confirmAction, setConfirmAction] = useState<{ status: string; label: string } | null>(null);

  const items = (order.items || []) as Record<string, unknown>[];
  const address = order.shipping_address_snapshot as Record<string, string>;
  const currentIndex = STATUS_FLOW.indexOf(status);

  const handleStatusUpdate = async (newStatus: string) => {
    setSaving(true);
    setError('');
    try {
      await updateOrderStatus(
        order.id as string,
        newStatus,
        trackingNumber || undefined
      );
      setStatus(newStatus);
      setConfirmAction(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveTracking = async () => {
    setSaving(true);
    setError('');
    try {
      await updateOrderStatus(order.id as string, status, trackingNumber);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const getNextStatus = (): string | null => {
    const idx = STATUS_FLOW.indexOf(status);
    if (idx < 0 || idx >= STATUS_FLOW.length - 1) return null;
    return STATUS_FLOW[idx + 1];
  };

  const nextStatus = getNextStatus();

  return (
    <div>
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/admin/orders" className="admin-btn admin-btn-ghost">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="admin-page-title">Order {order.order_number as string}</h1>
            <p className="admin-page-subtitle">
              Placed on {new Date(order.created_at as string).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
        <div className="admin-flex-center" style={{ gap: '0.5rem' }}>
          <StatusBadge status={status} />
          <StatusBadge status={order.payment_status as string} />
        </div>
      </div>

      {error && <div className="admin-login-error" style={{ marginBottom: '1rem' }}>{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '1.5rem', alignItems: 'start' }}>
        {/* Main column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Status timeline */}
          {status !== 'cancelled' && status !== 'refunded' && (
            <div className="admin-card">
              <h2 className="admin-section-title">Order Progress</h2>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', padding: '0 1rem' }}>
                <div style={{ position: 'absolute', top: '50%', left: '2rem', right: '2rem', height: 2, background: '#e5e7eb', transform: 'translateY(-50%)' }} />
                <div style={{ position: 'absolute', top: '50%', left: '2rem', height: 2, background: '#D4782F', transform: 'translateY(-50%)', width: `${Math.max(0, currentIndex) / (STATUS_FLOW.length - 1) * 100}%`, maxWidth: 'calc(100% - 4rem)', transition: 'width 0.3s' }} />
                {STATUS_FLOW.map((step, i) => (
                  <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: i <= currentIndex ? '#D4782F' : '#e5e7eb',
                      color: i <= currentIndex ? 'white' : '#9ca3af',
                      fontSize: '0.75rem', fontWeight: 700,
                    }}>
                      {i <= currentIndex ? '✓' : i + 1}
                    </div>
                    <span style={{ fontSize: '0.6875rem', marginTop: 4, color: i <= currentIndex ? '#1a1a2e' : '#9ca3af', fontWeight: i <= currentIndex ? 600 : 400 }}>
                      {STATUS_LABELS[step]}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                {nextStatus && (
                  <button
                    onClick={() => handleStatusUpdate(nextStatus)}
                    disabled={saving}
                    className="admin-btn admin-btn-primary"
                  >
                    {saving ? <span className="admin-spinner" /> : null}
                    {nextStatus === 'confirmed' && <><CheckCircle size={16} /> Confirm Order</>}
                    {nextStatus === 'processing' && <><Package size={16} /> Start Processing</>}
                    {nextStatus === 'shipped' && <><Truck size={16} /> Mark Shipped</>}
                    {nextStatus === 'delivered' && <><CheckCircle size={16} /> Mark Delivered</>}
                  </button>
                )}
                {status !== 'delivered' && status !== 'cancelled' && status !== 'refunded' && (
                  <button
                    onClick={() => setConfirmAction({ status: 'cancelled', label: 'Cancel Order' })}
                    className="admin-btn admin-btn-danger"
                  >
                    <XCircle size={16} /> Cancel Order
                  </button>
                )}
                {(order.payment_status === 'paid') && status !== 'refunded' && (
                  <button
                    onClick={() => setConfirmAction({ status: 'refunded', label: 'Refund Order' })}
                    className="admin-btn admin-btn-secondary"
                  >
                    <RefreshCw size={16} /> Refund
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Cancelled/Refunded notice */}
          {(status === 'cancelled' || status === 'refunded') && (
            <div className="admin-card" style={{ borderColor: '#fee2e2' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <XCircle size={24} style={{ color: '#ef4444' }} />
                <div>
                  <p style={{ fontWeight: 600, color: '#b91c1c' }}>
                    Order {status === 'cancelled' ? 'Cancelled' : 'Refunded'}
                  </p>
                  <p className="admin-text-muted admin-text-sm">
                    {status === 'cancelled' ? 'This order has been cancelled and stock has been restored.' : 'This order has been refunded and stock has been restored.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Order items */}
          <div className="admin-card">
            <h2 className="admin-section-title">Order Items ({items.length})</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {items.map((item) => (
                <div key={item.id as string} style={{ display: 'flex', gap: '0.75rem', padding: '0.75rem', background: '#f9fafb', borderRadius: 8 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 6, overflow: 'hidden', flexShrink: 0, background: '#e5e7eb', position: 'relative' }}>
                    {item.image_url_snapshot && (
                      <Image src={item.image_url_snapshot as string} alt="" fill sizes="56px" style={{ objectFit: 'cover' }} />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: '0.8125rem' }}>{item.product_name_snapshot as string}</p>
                    <p className="admin-text-muted admin-text-sm">{item.variant_info_snapshot as string} × {item.quantity as number}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: 600, fontSize: '0.8125rem' }}>₹{(item.total_price as number).toLocaleString('en-IN')}</p>
                    <p className="admin-text-muted admin-text-sm">₹{(item.unit_price_snapshot as number).toLocaleString('en-IN')} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Tracking */}
          <div className="admin-card">
            <h2 className="admin-section-title">Tracking</h2>
            <div className="admin-form-group">
              <label className="admin-label">Tracking Number</label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="admin-input"
                placeholder="Enter tracking number"
              />
            </div>
            <button
              onClick={handleSaveTracking}
              disabled={saving}
              className="admin-btn admin-btn-secondary admin-btn-sm"
              style={{ width: '100%' }}
            >
              {saving ? <span className="admin-spinner" /> : 'Save Tracking'}
            </button>
          </div>

          {/* Shipping address */}
          <div className="admin-card">
            <h2 className="admin-section-title">Shipping Address</h2>
            {address && (
              <div style={{ fontSize: '0.8125rem', lineHeight: 1.6 }}>
                <p style={{ fontWeight: 600 }}>{address.full_name}</p>
                <p>{address.line1}</p>
                {address.line2 && <p>{address.line2}</p>}
                <p>{address.city}, {address.state} — {address.pincode}</p>
                <p>📞 {address.phone}</p>
              </div>
            )}
          </div>

          {/* Payment */}
          <div className="admin-card">
            <h2 className="admin-section-title">Payment</h2>
            <div style={{ fontSize: '0.8125rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <div className="admin-flex-between">
                <span className="admin-text-muted">Method</span>
                <span style={{ fontWeight: 600, textTransform: 'uppercase' }}>{order.payment_method as string}</span>
              </div>
              <div className="admin-flex-between">
                <span className="admin-text-muted">Status</span>
                <StatusBadge status={order.payment_status as string} />
              </div>
              {order.razorpay_payment_id && (
                <div className="admin-flex-between">
                  <span className="admin-text-muted">Payment ID</span>
                  <span className="admin-text-sm" style={{ fontFamily: 'monospace' }}>{order.razorpay_payment_id as string}</span>
                </div>
              )}
            </div>
          </div>

          {/* Order summary */}
          <div className="admin-card">
            <h2 className="admin-section-title">Summary</h2>
            <div style={{ fontSize: '0.8125rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <div className="admin-flex-between">
                <span className="admin-text-muted">Subtotal</span>
                <span>₹{(order.subtotal as number).toLocaleString('en-IN')}</span>
              </div>
              {(order.discount_amount as number) > 0 && (
                <div className="admin-flex-between" style={{ color: '#22c55e' }}>
                  <span>Discount{order.coupon_code_used ? ` (${order.coupon_code_used})` : ''}</span>
                  <span>-₹{(order.discount_amount as number).toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="admin-flex-between">
                <span className="admin-text-muted">Shipping</span>
                <span>{(order.shipping_cost as number) === 0 ? 'Free' : `₹${order.shipping_cost}`}</span>
              </div>
              <div className="admin-flex-between admin-text-muted admin-text-sm">
                <span>GST (included)</span>
                <span>₹{(order.gst_amount as number).toLocaleString('en-IN')}</span>
              </div>
              <hr className="admin-divider" style={{ margin: '0.5rem 0' }} />
              <div className="admin-flex-between" style={{ fontWeight: 700, fontSize: '1rem' }}>
                <span>Total</span>
                <span>₹{(order.total as number).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={!!confirmAction}
        title={confirmAction?.label || ''}
        message={
          confirmAction?.status === 'cancelled'
            ? 'Are you sure you want to cancel this order? Stock will be restored for all items.'
            : 'Are you sure you want to refund this order? Stock will be restored for all items.'
        }
        confirmLabel={confirmAction?.label || 'Confirm'}
        confirmVariant="danger"
        onConfirm={() => confirmAction && handleStatusUpdate(confirmAction.status)}
        onCancel={() => setConfirmAction(null)}
      />
    </div>
  );
}
