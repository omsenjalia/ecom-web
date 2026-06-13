'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Star, Plus, MapPin } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import AddressForm from '@/components/AddressForm';
import toast from 'react-hot-toast';
import type { Address, AddressSnapshot } from '@/lib/types';

interface AddressManagerProps {
  initialAddresses: Address[];
}

export default function AddressManager({ initialAddresses }: AddressManagerProps) {
  const router = useRouter();
  const [addresses, setAddresses] = useState(initialAddresses);
  const [showForm, setShowForm] = useState(false);

  const handleAdd = async (addr: AddressSnapshot) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('addresses').insert({
      user_id: user.id,
      full_name: addr.full_name,
      phone: addr.phone,
      line1: addr.line1,
      line2: addr.line2 || null,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      is_default: addresses.length === 0,
    });

    if (error) {
      toast.error('Failed to save address');
      return;
    }

    toast.success('Address saved!');
    setShowForm(false);
    router.refresh();
    // Refetch
    const { data } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false });
    if (data) setAddresses(data);
  };

  const handleDelete = async (id: string) => {
    const supabase = createClient();
    await supabase.from('addresses').delete().eq('id', id);
    setAddresses(addresses.filter((a) => a.id !== id));
    toast.success('Address deleted');
  };

  const handleSetDefault = async (id: string) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Unset all defaults
    await supabase.from('addresses').update({ is_default: false }).eq('user_id', user.id);
    // Set new default
    await supabase.from('addresses').update({ is_default: true }).eq('id', id);

    setAddresses(addresses.map((a) => ({ ...a, is_default: a.id === id })));
    toast.success('Default address updated');
  };

  return (
    <div>
      {addresses.length === 0 && !showForm ? (
        <div className="text-center py-16">
          <MapPin size={48} className="mx-auto text-warm-gray-light mb-4" />
          <h2 className="text-xl font-display text-charcoal mb-2">No saved addresses</h2>
          <p className="text-warm-gray mb-6">Add an address for faster checkout.</p>
          <button onClick={() => setShowForm(true)} className="btn-primary">
            Add Address
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {addresses.map((addr) => (
              <div key={addr.id} className="bg-white border border-cream-dark/30 p-4 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-charcoal text-sm">{addr.full_name}</p>
                    {addr.is_default && (
                      <span className="px-2 py-0.5 bg-amber/10 text-amber-dark text-[10px] font-bold uppercase">Default</span>
                    )}
                    <span className="px-2 py-0.5 bg-cream text-warm-gray text-[10px] font-bold uppercase">{addr.label}</span>
                  </div>
                  <p className="text-sm text-warm-gray-dark">
                    {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}<br />
                    {addr.city}, {addr.state} — {addr.pincode}
                  </p>
                  <p className="text-xs text-warm-gray mt-1">📞 {addr.phone}</p>
                </div>
                <div className="flex items-center gap-2">
                  {!addr.is_default && (
                    <button
                      onClick={() => handleSetDefault(addr.id)}
                      className="p-1.5 text-warm-gray hover:text-amber transition-colors"
                      title="Set as default"
                    >
                      <Star size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="p-1.5 text-warm-gray hover:text-error transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {showForm ? (
            <div className="bg-cream p-6">
              <h3 className="text-lg font-display text-charcoal mb-4">Add New Address</h3>
              <AddressForm onSubmit={handleAdd} />
              <button onClick={() => setShowForm(false)} className="text-sm text-warm-gray mt-3 hover:text-charcoal">
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 text-sm text-amber font-semibold hover:text-amber-dark"
            >
              <Plus size={16} />
              Add New Address
            </button>
          )}
        </>
      )}
    </div>
  );
}
