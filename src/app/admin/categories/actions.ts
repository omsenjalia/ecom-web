'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/supabase/admin-check';
import { revalidateStorefront, revalidateAdmin } from '@/lib/revalidate';
import { revalidatePath } from 'next/cache';

export async function getCategories() {
  await requireAdmin();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('categories')
    .select('*, products:products(count)')
    .order('display_order', { ascending: true });

  if (error) throw new Error(error.message);

  return (data || []).map((cat: Record<string, unknown>) => ({
    ...cat,
    product_count: Array.isArray(cat.products) && cat.products.length > 0
      ? (cat.products[0] as { count: number }).count
      : 0,
  }));
}

export async function createCategory(formData: {
  name: string;
  slug: string;
  description: string;
  display_order: number;
  is_active: boolean;
}) {
  await requireAdmin();
  const supabase = createAdminClient();

  // Validate
  if (!formData.name.trim()) throw new Error('Category name is required');
  if (!formData.slug.trim()) throw new Error('Category slug is required');

  const { error } = await supabase
    .from('categories')
    .insert({
      name: formData.name.trim(),
      slug: formData.slug.trim().toLowerCase(),
      description: formData.description.trim(),
      display_order: formData.display_order,
      is_active: formData.is_active,
    });

  if (error) {
    if (error.code === '23505') throw new Error('A category with this name or slug already exists');
    throw new Error(error.message);
  }

  revalidatePath('/admin/categories');
  revalidateStorefront();
}

export async function updateCategory(
  id: string,
  formData: {
    name: string;
    slug: string;
    description: string;
    display_order: number;
    is_active: boolean;
  }
) {
  await requireAdmin();
  const supabase = createAdminClient();

  if (!formData.name.trim()) throw new Error('Category name is required');

  const { error } = await supabase
    .from('categories')
    .update({
      name: formData.name.trim(),
      slug: formData.slug.trim().toLowerCase(),
      description: formData.description.trim(),
      display_order: formData.display_order,
      is_active: formData.is_active,
    })
    .eq('id', id);

  if (error) {
    if (error.code === '23505') throw new Error('A category with this name or slug already exists');
    throw new Error(error.message);
  }

  revalidatePath('/admin/categories');
  revalidateStorefront();
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  const supabase = createAdminClient();

  // Check for assigned products
  const { count } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('category_id', id)
    .is('deleted_at', null);

  if (count && count > 0) {
    throw new Error(`Cannot delete: ${count} product${count > 1 ? 's are' : ' is'} still assigned to this category. Reassign or delete them first.`);
  }

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath('/admin/categories');
  revalidateStorefront();
  revalidateAdmin();
}
