'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/supabase/admin-check';
import { revalidatePath } from 'next/cache';

export async function getOrders(params: {
  page?: number;
  status?: string;
  paymentStatus?: string;
}) {
  await requireAdmin();
  const supabase = createAdminClient();

  const page = params.page || 1;
  const perPage = 20;
  const offset = (page - 1) * perPage;

  let query = supabase
    .from('orders')
    .select('*, items:order_items(count)', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (params.status && params.status !== 'all') {
    query = query.eq('order_status', params.status);
  }
  if (params.paymentStatus && params.paymentStatus !== 'all') {
    query = query.eq('payment_status', params.paymentStatus);
  }

  query = query.range(offset, offset + perPage - 1);

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);

  return {
    orders: data || [],
    total: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / perPage),
  };
}

export async function getOrderDetail(id: string) {
  await requireAdmin();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('orders')
    .select('*, items:order_items(*)')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateOrderStatus(orderId: string, newStatus: string, trackingNumber?: string) {
  await requireAdmin();
  const supabase = createAdminClient();

  const updates: Record<string, unknown> = {
    order_status: newStatus,
    updated_at: new Date().toISOString(),
  };

  if (trackingNumber !== undefined) {
    updates.tracking_number = trackingNumber;
  }

  // If cancelling or refunding, restore stock
  if (newStatus === 'cancelled' || newStatus === 'refunded') {
    // Get order items to restore stock
    const { data: orderItems } = await supabase
      .from('order_items')
      .select('product_name_snapshot, variant_info_snapshot, quantity')
      .eq('order_id', orderId);

    if (orderItems) {
      for (const item of orderItems) {
        // Try to find matching variant and restore stock
        const variantInfo = item.variant_info_snapshot || '';
        // Extract color/size from "Color / Size" format
        const parts = variantInfo.split(' / ');
        const colorName = parts[0]?.trim();

        if (colorName) {
          // Find variants matching this product name and color
          const { data: products } = await supabase
            .from('products')
            .select('id')
            .eq('name', item.product_name_snapshot)
            .limit(1);

          if (products && products.length > 0) {
            const { data: variants } = await supabase
              .from('product_variants')
              .select('id, stock_quantity')
              .eq('product_id', products[0].id)
              .eq('color_name', colorName)
              .limit(1);

            if (variants && variants.length > 0) {
              await supabase
                .from('product_variants')
                .update({ stock_quantity: variants[0].stock_quantity + item.quantity })
                .eq('id', variants[0].id);
            }
          }
        }
      }
    }

    // If refunding, also update payment status
    if (newStatus === 'refunded') {
      updates.payment_status = 'refunded';
    }
  }

  const { error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', orderId);

  if (error) throw new Error(error.message);

  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath(`/order/${orderId}`);
  revalidatePath('/admin');
}
