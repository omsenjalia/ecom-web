'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/supabase/admin-check';
import { revalidatePath } from 'next/cache';

export async function getSettings() {
  await requireAdmin();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('site_settings')
    .select('*');

  if (error) throw new Error(error.message);

  const map: Record<string, string> = {};
  (data || []).forEach((s: { key: string; value: string }) => {
    map[s.key] = s.value;
  });

  return map;
}

export async function updateSettings(settings: Record<string, string>) {
  await requireAdmin();
  const supabase = createAdminClient();

  for (const [key, value] of Object.entries(settings)) {
    const { error } = await supabase
      .from('site_settings')
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });

    if (error) throw new Error(`Failed to update ${key}: ${error.message}`);
  }

  revalidatePath('/admin/settings');
  revalidatePath('/');
  revalidatePath('/checkout');
}

// Helper to read a single setting (for use in non-admin contexts like checkout)
export async function getSetting(key: string, defaultValue: string): Promise<string> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', key)
    .single();

  return data?.value || defaultValue;
}

export async function getAllSettings(): Promise<Record<string, string>> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('site_settings')
    .select('key, value');

  const map: Record<string, string> = {};
  (data || []).forEach((s: { key: string; value: string }) => {
    map[s.key] = s.value;
  });
  return map;
}
