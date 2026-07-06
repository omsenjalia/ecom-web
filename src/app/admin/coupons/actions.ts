'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/supabase/admin-check';
import { revalidatePath } from 'next/cache';

export async function getCoupons() {
  await requireAdmin();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function createCoupon(formData: {
  code: string;
  discount_type: string;
  discount_value: number;
  min_order_value: number;
  max_discount: number | null;
  valid_from: string;
  valid_until: string;
  usage_limit: number;
  is_active: boolean;
}) {
  await requireAdmin();
  const supabase = createAdminClient();

  if (!formData.code.trim()) throw new Error('Coupon code is required');
  if (formData.discount_value <= 0) throw new Error('Discount value must be greater than 0');

  const { error } = await supabase
    .from('coupons')
    .insert({
      code: formData.code.trim().toUpperCase(),
      discount_type: formData.discount_type,
      discount_value: formData.discount_value,
      min_order_value: formData.min_order_value,
      max_discount: formData.max_discount,
      valid_from: formData.valid_from,
      valid_until: formData.valid_until,
      usage_limit: formData.usage_limit,
      is_active: formData.is_active,
    });

  if (error) {
    if (error.code === '23505') throw new Error('A coupon with this code already exists');
    throw new Error(error.message);
  }

  revalidatePath('/admin/coupons');
}

export async function updateCoupon(id: string, formData: {
  code: string;
  discount_type: string;
  discount_value: number;
  min_order_value: number;
  max_discount: number | null;
  valid_from: string;
  valid_until: string;
  usage_limit: number;
  is_active: boolean;
}) {
  await requireAdmin();
  const supabase = createAdminClient();

  const { error } = await supabase
    .from('coupons')
    .update({
      code: formData.code.trim().toUpperCase(),
      discount_type: formData.discount_type,
      discount_value: formData.discount_value,
      min_order_value: formData.min_order_value,
      max_discount: formData.max_discount,
      valid_from: formData.valid_from,
      valid_until: formData.valid_until,
      usage_limit: formData.usage_limit,
      is_active: formData.is_active,
    })
    .eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath('/admin/coupons');
}

export async function deleteCoupon(id: string) {
  await requireAdmin();
  const supabase = createAdminClient();

  // Soft delete — deactivate instead of hard delete
  const { error } = await supabase
    .from('coupons')
    .update({ is_active: false })
    .eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath('/admin/coupons');
}
