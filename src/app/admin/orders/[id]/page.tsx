import { requireAdmin } from '@/lib/supabase/admin-check';
import { getOrderDetail } from '../actions';
import { notFound } from 'next/navigation';
import OrderDetailClient from './OrderDetailClient';

export const metadata = { title: 'Order Detail' };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;

  let order;
  try {
    order = await getOrderDetail(id);
  } catch {
    notFound();
  }

  if (!order) notFound();

  return <OrderDetailClient order={order} />;
}
