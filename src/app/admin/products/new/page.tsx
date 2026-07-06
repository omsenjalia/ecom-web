import { requireAdmin } from '@/lib/supabase/admin-check';
import { createAdminClient } from '@/lib/supabase/admin';
import ProductForm from '../ProductForm';

export const metadata = { title: 'New Product' };

export default async function NewProductPage() {
  await requireAdmin();

  const supabase = createAdminClient();
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order');

  return <ProductForm categories={categories || []} />;
}
