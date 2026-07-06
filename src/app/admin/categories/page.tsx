import { requireAdmin } from '@/lib/supabase/admin-check';
import CategoriesClient from './CategoriesClient';
import { getCategories } from './actions';

export const metadata = { title: 'Categories' };

export default async function CategoriesPage() {
  await requireAdmin();

  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  try {
    categories = await getCategories();
  } catch {
    // will show empty state
  }

  return <CategoriesClient initialCategories={categories} />;
}
