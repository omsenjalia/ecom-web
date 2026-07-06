import { requireAdmin } from '@/lib/supabase/admin-check';
import { getSettings } from './actions';
import SettingsClient from './SettingsClient';

export const metadata = { title: 'Settings' };

export default async function SettingsPage() {
  await requireAdmin();

  let settings = {};
  try {
    settings = await getSettings();
  } catch { /* empty */ }

  return <SettingsClient initialSettings={settings} />;
}
