'use client';

import { useState } from 'react';
import type { AddressSnapshot } from '@/lib/types';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh',
  'Andaman and Nicobar Islands', 'Dadra and Nagar Haveli and Daman and Diu', 'Lakshadweep',
];

interface AddressFormProps {
  onSubmit: (address: AddressSnapshot) => void;
  initialValues?: AddressSnapshot;
}

interface FormErrors {
  full_name?: string;
  phone?: string;
  line1?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export default function AddressForm({ onSubmit, initialValues }: AddressFormProps) {
  const [form, setForm] = useState<AddressSnapshot>({
    full_name: initialValues?.full_name || '',
    phone: initialValues?.phone || '',
    line1: initialValues?.line1 || '',
    line2: initialValues?.line2 || '',
    city: initialValues?.city || '',
    state: initialValues?.state || '',
    pincode: initialValues?.pincode || '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const e: FormErrors = {};

    if (!form.full_name.trim() || form.full_name.trim().length < 2) {
      e.full_name = 'Full name is required (min 2 characters)';
    }

    const phoneClean = form.phone.replace(/\s/g, '');
    if (!/^[6-9]\d{9}$/.test(phoneClean)) {
      e.phone = 'Enter a valid 10-digit Indian mobile number';
    }

    if (!form.line1.trim() || form.line1.trim().length < 5) {
      e.line1 = 'Address is required (min 5 characters)';
    }

    if (!form.city.trim() || form.city.trim().length < 2) {
      e.city = 'City is required';
    }

    if (!form.state) {
      e.state = 'State is required';
    }

    if (!/^\d{6}$/.test(form.pincode)) {
      e.pincode = 'Enter a valid 6-digit pincode';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...form,
        phone: form.phone.replace(/\s/g, ''),
      });
    }
  };

  const update = (field: keyof AddressSnapshot, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Full Name */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-warm-gray-dark mb-1.5">
          Full Name *
        </label>
        <input
          type="text"
          value={form.full_name}
          onChange={(e) => update('full_name', e.target.value)}
          placeholder="Rahul Sharma"
          className={`w-full px-4 py-2.5 border bg-white text-sm placeholder:text-warm-gray-light focus:outline-none ${
            errors.full_name ? 'border-error focus:border-error' : 'border-cream-dark/50 focus:border-amber'
          }`}
        />
        {errors.full_name && <p className="text-xs text-error mt-1">{errors.full_name}</p>}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-warm-gray-dark mb-1.5">
          Mobile Number *
        </label>
        <div className="flex">
          <span className="px-3 py-2.5 bg-cream border border-r-0 border-cream-dark/50 text-sm text-warm-gray-dark">+91</span>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
            placeholder="98765 43210"
            className={`flex-1 px-4 py-2.5 border bg-white text-sm placeholder:text-warm-gray-light focus:outline-none ${
              errors.phone ? 'border-error focus:border-error' : 'border-cream-dark/50 focus:border-amber'
            }`}
          />
        </div>
        {errors.phone && <p className="text-xs text-error mt-1">{errors.phone}</p>}
      </div>

      {/* Address Line 1 */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-warm-gray-dark mb-1.5">
          Address *
        </label>
        <input
          type="text"
          value={form.line1}
          onChange={(e) => update('line1', e.target.value)}
          placeholder="House/Flat No., Street, Locality"
          className={`w-full px-4 py-2.5 border bg-white text-sm placeholder:text-warm-gray-light focus:outline-none ${
            errors.line1 ? 'border-error focus:border-error' : 'border-cream-dark/50 focus:border-amber'
          }`}
        />
        {errors.line1 && <p className="text-xs text-error mt-1">{errors.line1}</p>}
      </div>

      {/* Address Line 2 */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-warm-gray-dark mb-1.5">
          Landmark (optional)
        </label>
        <input
          type="text"
          value={form.line2 || ''}
          onChange={(e) => update('line2', e.target.value)}
          placeholder="Near temple, opposite park, etc."
          className="w-full px-4 py-2.5 border border-cream-dark/50 bg-white text-sm placeholder:text-warm-gray-light focus:border-amber focus:outline-none"
        />
      </div>

      {/* City + State */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-warm-gray-dark mb-1.5">
            City *
          </label>
          <input
            type="text"
            value={form.city}
            onChange={(e) => update('city', e.target.value)}
            placeholder="Rajkot"
            className={`w-full px-4 py-2.5 border bg-white text-sm placeholder:text-warm-gray-light focus:outline-none ${
              errors.city ? 'border-error focus:border-error' : 'border-cream-dark/50 focus:border-amber'
            }`}
          />
          {errors.city && <p className="text-xs text-error mt-1">{errors.city}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-warm-gray-dark mb-1.5">
            State *
          </label>
          <select
            value={form.state}
            onChange={(e) => update('state', e.target.value)}
            className={`w-full px-4 py-2.5 border bg-white text-sm focus:outline-none ${
              errors.state ? 'border-error focus:border-error' : 'border-cream-dark/50 focus:border-amber'
            } ${!form.state ? 'text-warm-gray-light' : 'text-charcoal'}`}
          >
            <option value="">Select state</option>
            {INDIAN_STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {errors.state && <p className="text-xs text-error mt-1">{errors.state}</p>}
        </div>
      </div>

      {/* Pincode */}
      <div className="max-w-[200px]">
        <label className="block text-xs font-bold uppercase tracking-wider text-warm-gray-dark mb-1.5">
          Pincode *
        </label>
        <input
          type="text"
          value={form.pincode}
          onChange={(e) => update('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="360001"
          className={`w-full px-4 py-2.5 border bg-white text-sm placeholder:text-warm-gray-light focus:outline-none ${
            errors.pincode ? 'border-error focus:border-error' : 'border-cream-dark/50 focus:border-amber'
          }`}
        />
        {errors.pincode && <p className="text-xs text-error mt-1">{errors.pincode}</p>}
      </div>

      <button type="submit" className="btn-primary w-full sm:w-auto mt-2">
        Continue to Review
      </button>
    </form>
  );
}
