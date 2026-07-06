'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { createCoupon, updateCoupon, deleteCoupon } from './actions';
import ConfirmDialog from '../components/ConfirmDialog';
import StatusBadge from '../components/StatusBadge';
import type { Coupon } from '@/lib/types';

interface Props {
  initialCoupons: Coupon[];
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function toInputDate(dateStr: string) {
  return new Date(dateStr).toISOString().slice(0, 10);
}

export default function CouponsClient({ initialCoupons }: Props) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percent' | 'flat'>('percent');
  const [discountValue, setDiscountValue] = useState(10);
  const [minOrderValue, setMinOrderValue] = useState(0);
  const [maxDiscount, setMaxDiscount] = useState<number | null>(null);
  const [validFrom, setValidFrom] = useState(new Date().toISOString().slice(0, 10));
  const [validUntil, setValidUntil] = useState('');
  const [usageLimit, setUsageLimit] = useState(100);
  const [isActive, setIsActive] = useState(true);

  const resetForm = () => {
    setCode('');
    setDiscountType('percent');
    setDiscountValue(10);
    setMinOrderValue(0);
    setMaxDiscount(null);
    setValidFrom(new Date().toISOString().slice(0, 10));
    setValidUntil('');
    setUsageLimit(100);
    setIsActive(true);
    setEditingId(null);
    setError('');
  };

  const openEdit = (coupon: Coupon) => {
    setCode(coupon.code);
    setDiscountType(coupon.discount_type);
    setDiscountValue(coupon.discount_value);
    setMinOrderValue(coupon.min_order_value);
    setMaxDiscount(coupon.max_discount);
    setValidFrom(toInputDate(coupon.valid_from));
    setValidUntil(toInputDate(coupon.valid_until));
    setUsageLimit(coupon.usage_limit);
    setIsActive(coupon.is_active);
    setEditingId(coupon.id);
    setShowForm(true);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = {
        code,
        discount_type: discountType,
        discount_value: discountValue,
        min_order_value: minOrderValue,
        max_discount: maxDiscount,
        valid_from: new Date(validFrom).toISOString(),
        valid_until: new Date(validUntil).toISOString(),
        usage_limit: usageLimit,
        is_active: isActive,
      };

      if (editingId) {
        await updateCoupon(editingId, data);
      } else {
        await createCoupon(data);
      }

      setShowForm(false);
      resetForm();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save coupon');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCoupon(deleteTarget.id);
      setDeleteTarget(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
      setDeleteTarget(null);
    }
  };

  const isExpired = (coupon: Coupon) => new Date(coupon.valid_until) < new Date();

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Coupons</h1>
          <p className="admin-page-subtitle">{initialCoupons.length} coupons</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="admin-btn admin-btn-primary">
          <Plus size={16} /> Add Coupon
        </button>
      </div>

      {error && <div className="admin-login-error" style={{ marginBottom: '1rem' }}>{error}</div>}

      {showForm && (
        <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
          <h2 className="admin-section-title">{editingId ? 'Edit Coupon' : 'New Coupon'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="admin-grid-3">
              <div className="admin-form-group">
                <label className="admin-label">Coupon Code</label>
                <input type="text" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} required className="admin-input" placeholder="WELCOME10" />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Discount Type</label>
                <select value={discountType} onChange={(e) => setDiscountType(e.target.value as 'percent' | 'flat')} className="admin-select">
                  <option value="percent">Percentage (%)</option>
                  <option value="flat">Flat Amount (₹)</option>
                </select>
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Discount Value</label>
                <input type="number" value={discountValue} onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)} min={0.01} step={0.01} required className="admin-input" />
              </div>
            </div>

            <div className="admin-grid-3">
              <div className="admin-form-group">
                <label className="admin-label">Min Order Value (₹)</label>
                <input type="number" value={minOrderValue} onChange={(e) => setMinOrderValue(parseFloat(e.target.value) || 0)} min={0} className="admin-input" />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Max Discount (₹)</label>
                <input type="number" value={maxDiscount ?? ''} onChange={(e) => setMaxDiscount(e.target.value ? parseFloat(e.target.value) : null)} min={0} className="admin-input" placeholder="No limit" />
                <p className="admin-help-text">Leave blank for no cap</p>
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Usage Limit</label>
                <input type="number" value={usageLimit} onChange={(e) => setUsageLimit(parseInt(e.target.value) || 0)} min={1} required className="admin-input" />
              </div>
            </div>

            <div className="admin-grid-3">
              <div className="admin-form-group">
                <label className="admin-label">Valid From</label>
                <input type="date" value={validFrom} onChange={(e) => setValidFrom(e.target.value)} required className="admin-input" />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Valid Until</label>
                <input type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} required className="admin-input" />
              </div>
              <div className="admin-form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
                <label className="admin-checkbox-label">
                  <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="admin-checkbox" />
                  Active
                </label>
              </div>
            </div>

            <div className="admin-form-actions">
              <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="admin-btn admin-btn-secondary">Cancel</button>
              <button type="submit" disabled={loading} className="admin-btn admin-btn-primary">
                {loading ? <><span className="admin-spinner" /> Saving...</> : editingId ? 'Update Coupon' : 'Create Coupon'}
              </button>
            </div>
          </form>
        </div>
      )}

      {initialCoupons.length === 0 ? (
        <div className="admin-card">
          <div className="admin-empty">
            <div className="admin-empty-icon">🎟️</div>
            <p className="admin-empty-title">No coupons yet</p>
            <p className="admin-empty-text">Create your first discount coupon.</p>
          </div>
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Discount</th>
                <th>Min Order</th>
                <th>Valid Period</th>
                <th>Usage</th>
                <th>Status</th>
                <th style={{ width: 100 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {initialCoupons.map((coupon) => (
                <tr key={coupon.id}>
                  <td style={{ fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.05em' }}>{coupon.code}</td>
                  <td>
                    {coupon.discount_type === 'percent'
                      ? `${coupon.discount_value}%${coupon.max_discount ? ` (max ₹${coupon.max_discount})` : ''}`
                      : `₹${coupon.discount_value}`}
                  </td>
                  <td>₹{coupon.min_order_value}</td>
                  <td className="admin-text-sm">
                    {formatDate(coupon.valid_from)} — {formatDate(coupon.valid_until)}
                  </td>
                  <td>
                    {coupon.times_used} / {coupon.usage_limit}
                  </td>
                  <td>
                    {!coupon.is_active ? (
                      <StatusBadge status="inactive" />
                    ) : isExpired(coupon) ? (
                      <span className="admin-badge admin-badge-danger">Expired</span>
                    ) : (
                      <StatusBadge status="active" />
                    )}
                  </td>
                  <td>
                    <div className="admin-flex-center">
                      <button onClick={() => openEdit(coupon)} className="admin-btn admin-btn-ghost admin-btn-sm" title="Edit">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => setDeleteTarget(coupon)} className="admin-btn admin-btn-ghost admin-btn-sm" title="Deactivate" style={{ color: '#ef4444' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Deactivate Coupon"
        message={`Are you sure you want to deactivate coupon "${deleteTarget?.code}"? Customers will no longer be able to use it.`}
        confirmLabel="Deactivate"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
