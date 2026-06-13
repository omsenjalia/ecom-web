import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import AddressManager from '@/components/AddressManager';

export default async function AddressesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: addresses } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', user.id)
    .order('is_default', { ascending: false });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display text-charcoal">Saved Addresses</h1>
        <Link href="/account" className="text-sm text-amber font-semibold hover:text-amber-dark">
          ← Account
        </Link>
      </div>

      <AddressManager initialAddresses={addresses || []} />
    </div>
  );
}
