import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createAdminClient } from '@/lib/supabase/admin';
import { getAllSettings } from '@/app/admin/settings/actions';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, address, coupon_code, discount_amount, guest_email, guest_phone } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }
    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    // Calculate totals
    let subtotal = 0;
    for (const item of items) {
      subtotal += item.unit_price * item.quantity;
    }

    const settings = await getAllSettings();
    const threshold = parseFloat(settings['free_shipping_threshold'] || '999');
    const shippingFee = parseFloat(settings['shipping_fee'] || '79');
    const gstPercent = parseFloat(settings['gst_percent'] || '18');

    const discount = discount_amount || 0;
    const shippingCost = subtotal >= threshold ? 0 : shippingFee;
    const total = subtotal - discount + shippingCost;
    const gstAmount = Math.round((subtotal - discount) * gstPercent / (100 + gstPercent) * 100) / 100;

    // Generate order number
    const orderNumber = `RCG-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(total * 100), // amount in paise
      currency: 'INR',
      receipt: orderNumber,
    });

    // Create internal order in DB
    const supabase = createAdminClient();

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        guest_email: guest_email || null,
        guest_phone: guest_phone || null,
        shipping_address_snapshot: address,
        subtotal,
        discount_amount: discount,
        coupon_code_used: coupon_code || null,
        gst_amount: gstAmount,
        shipping_cost: shippingCost,
        total,
        payment_method: 'razorpay',
        payment_status: 'pending',
        razorpay_order_id: razorpayOrder.id,
        order_status: 'pending',
      })
      .select('id')
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }

    // Insert order items
    const orderItems = items.map((item: { product_name: string; variant_info: string; product_slug: string; image_url: string; quantity: number; unit_price: number }) => ({
      order_id: order.id,
      product_name_snapshot: item.product_name,
      variant_info_snapshot: item.variant_info,
      product_slug_snapshot: item.product_slug,
      image_url_snapshot: item.image_url,
      quantity: item.quantity,
      unit_price_snapshot: item.unit_price,
      total_price: item.unit_price * item.quantity,
    }));

    await supabase.from('order_items').insert(orderItems);

    return NextResponse.json({
      razorpay_order_id: razorpayOrder.id,
      razorpay_amount: razorpayOrder.amount,
      internal_order_id: order.id,
      order_number: orderNumber,
    });
  } catch (err) {
    console.error('Create order error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
