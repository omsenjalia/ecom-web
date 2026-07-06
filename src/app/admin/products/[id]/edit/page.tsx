import { requireAdmin } from '@/lib/supabase/admin-check';
import { createAdminClient } from '@/lib/supabase/admin';
import { notFound } from 'next/navigation';
import ProductForm from '../../ProductForm';

export const metadata = { title: 'Edit Product' };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;

  const supabase = createAdminClient();

  // Get product with variants and images
  const { data: product, error } = await supabase
    .from('products')
    .select('*, variants:product_variants(*), images:product_images(*)')
    .eq('id', id)
    .single();

  if (error || !product) notFound();

  // Get categories
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order');

  return (
    <ProductForm
      categories={categories || []}
      initialData={{
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description || '',
        category_id: product.category_id || '',
        gender: product.gender,
        frame_shape: product.frame_shape,
        frame_material: product.frame_material,
        base_price: parseFloat(product.base_price),
        mrp: product.mrp ? parseFloat(product.mrp) : null,
        is_active: product.is_active,
        variants: (product.variants || []).map((v: Record<string, unknown>) => ({
          id: v.id as string,
          color_name: v.color_name as string,
          color_hex: v.color_hex as string,
          size: v.size as string,
          sku: v.sku as string,
          price_override: v.price_override ? parseFloat(v.price_override as string) : null,
          stock_quantity: v.stock_quantity as number,
          is_active: v.is_active as boolean,
        })),
        images: (product.images || [])
          .sort((a: Record<string, unknown>, b: Record<string, unknown>) => (a.display_order as number) - (b.display_order as number))
          .map((img: Record<string, unknown>) => ({
            id: img.id as string,
            url: img.url as string,
            alt_text: (img.alt_text as string) || '',
            display_order: img.display_order as number,
            is_primary: img.is_primary as boolean,
            storage_path: (img.storage_path as string) || null,
            variant_id: (img.variant_id as string) || null,
          })),
      }}
    />
  );
}
