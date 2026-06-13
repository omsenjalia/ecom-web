import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, internal_order_id } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !internal_order_id) {
      return NextResponse.json({ error: 'Missing payment details' }, { status: 400 });
    }

    // Server-side signature verification (HMAC SHA256)
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      console.error('Payment signature mismatch');
      
      // Mark order as failed
      const supabase = createAdminClient();
      await supabase
        .from('orders')
        .update({ payment_status: 'failed' })
        .eq('id', internal_order_id);

      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
    }

    // Payment verified — update order
    const supabase = createAdminClient();
    const { data: order, error: updateError } = await supabase
      .from('orders')
      .update({
        payment_status: 'paid',
        order_status: 'confirmed',
        razorpay_payment_id,
        razorpay_signature,
        updated_at: new Date().toISOString(),
      })
      .eq('id', internal_order_id)
      .select('id, order_number')
      .single();

    if (updateError) {
      console.error('Order update error:', updateError);
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }

    // Deduct stock for each order item
    const { data: orderItems } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', internal_order_id);

    // Update coupon usage if applicable
    const { data: orderData } = await supabase
      .from('orders')
      .select('coupon_code_used')
      .eq('id', internal_order_id)
      .single();

    if (orderData?.coupon_code_used) {
      await supabase.rpc('increment_coupon_usage', { coupon_code_param: orderData.coupon_code_used });
    }

    return NextResponse.json({
      success: true,
      order_id: order.id,
      order_number: order.order_number,
    });
  } catch (err) {
    console.error('Verify payment error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
