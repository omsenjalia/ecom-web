import { requireAdmin } from '@/lib/supabase/admin-check';
import { getOrders } from './actions';
import OrdersListClient from './OrdersListClient';

export const metadata = { title: 'Orders' };

interface Props {
  searchParams: Promise<{
    page?: string;
    status?: string;
    payment?: string;
  }>;
}

export default async function OrdersPage({ searchParams }: Props) {
  await requireAdmin();
  const params = await searchParams;

  const result = await getOrders({
    page: parseInt(params.page || '1'),
    status: params.status || 'all',
    paymentStatus: params.payment || 'all',
  });

  return (
    <OrdersListClient
      orders={result.orders}
      total={result.total}
      page={result.page}
      totalPages={result.totalPages}
      currentStatus={params.status || 'all'}
      currentPayment={params.payment || 'all'}
    />
  );
}
