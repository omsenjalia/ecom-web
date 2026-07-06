import { requireAdmin } from '@/lib/supabase/admin-check';
import { getCoupons } from './actions';
import CouponsClient from './CouponsClient';

export const metadata = { title: 'Coupons' };

export default async function CouponsPage() {
  await requireAdmin();

  let coupons: Awaited<ReturnType<typeof getCoupons>> = [];
  try {
    coupons = await getCoupons();
  } catch { /* empty */ }

  return <CouponsClient initialCoupons={coupons} />;
}
