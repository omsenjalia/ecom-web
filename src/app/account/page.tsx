import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Package, MapPin, User, LogOut } from 'lucide-react';
import LogoutButton from '@/components/LogoutButton';

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('customer_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="text-3xl font-display text-charcoal mb-8">My Account</h1>

      {/* Profile card */}
      <div className="bg-cream p-6 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-amber/20 rounded-full flex items-center justify-center">
            <User size={24} className="text-amber" />
          </div>
          <div>
            <p className="font-semibold text-charcoal">{profile?.full_name || 'Welcome!'}</p>
            <p className="text-sm text-warm-gray">{user.email}</p>
          </div>
        </div>
        <LogoutButton />
      </div>

      {/* Navigation cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          href="/account/orders"
          className="flex items-center gap-4 p-6 bg-white border border-cream-dark/30 hover:border-amber transition-colors group"
        >
          <Package size={24} className="text-warm-gray group-hover:text-amber transition-colors" />
          <div>
            <p className="font-semibold text-charcoal">My Orders</p>
            <p className="text-sm text-warm-gray">Track and review your orders</p>
          </div>
        </Link>

        <Link
          href="/account/addresses"
          className="flex items-center gap-4 p-6 bg-white border border-cream-dark/30 hover:border-amber transition-colors group"
        >
          <MapPin size={24} className="text-warm-gray group-hover:text-amber transition-colors" />
          <div>
            <p className="font-semibold text-charcoal">Saved Addresses</p>
            <p className="text-sm text-warm-gray">Manage your delivery addresses</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
