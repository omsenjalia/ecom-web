'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

interface CouponInputProps {
  subtotal: number;
  onApply: (discount: number, code: string) => void;
  onRemove: () => void;
}

export default function CouponInput({ subtotal, onApply, onRemove }: CouponInputProps) {
  const [code, setCode] = useState('');
  const [appliedCode, setAppliedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleApply = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim().toUpperCase(), subtotal }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid coupon code');
        toast.error(data.error || 'Invalid coupon code');
        return;
      }

      setAppliedCode(data.code);
      onApply(data.discount, data.code);
      toast.success(`Coupon applied! You save ₹${data.discount}`);
    } catch {
      setError('Failed to validate coupon');
      toast.error('Failed to validate coupon');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setAppliedCode('');
    setCode('');
    setError('');
    onRemove();
    toast.success('Coupon removed');
  };

  if (appliedCode) {
    return (
      <div className="flex items-center justify-between bg-success/10 border border-success/30 px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="text-success text-sm">✓</span>
          <span className="text-sm font-semibold text-success">{appliedCode}</span>
        </div>
        <button
          onClick={handleRemove}
          className="text-xs text-warm-gray hover:text-error transition-colors"
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Enter coupon code"
          className="flex-1 px-3 py-2 text-sm border border-cream-dark/50 bg-white placeholder:text-warm-gray-light focus:border-amber focus:outline-none"
        />
        <button
          onClick={handleApply}
          disabled={loading || !code.trim()}
          className="px-4 py-2 text-sm font-semibold bg-charcoal text-cream hover:bg-charcoal-light transition-colors disabled:opacity-50"
        >
          {loading ? '...' : 'Apply'}
        </button>
      </div>
      {error && <p className="text-xs text-error mt-1">{error}</p>}
    </div>
  );
}
