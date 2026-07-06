'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/supabase/admin-check';
import { revalidateStorefront, revalidateProduct, revalidateAdmin } from '@/lib/revalidate';
import { revalidatePath } from 'next/cache';
import { deleteProductImage as deleteFromStorage } from '@/lib/supabase/storage';

interface ProductListParams {
  page?: number;
  perPage?: number;
  search?: string;
  categoryId?: string;
  status?: 'active' | 'inactive' | 'all';
  stockFilter?: 'all' | 'low' | 'out';
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export async function getProductsPage(params: ProductListParams = {}) {
  await requireAdmin();
  const supabase = createAdminClient();

  const page = params.page || 1;
  const perPage = params.perPage || 20;
  const offset = (page - 1) * perPage;

  let query = supabase
    .from('products')
    .select(
      '*, categories(*), variants:product_variants(id, stock_quantity, sku), images:product_images(id, url, is_primary)',
      { count: 'exact' }
    )
    .is('deleted_at', null);

  // Filters
  if (params.search) {
    query = query.ilike('name', `%${params.search}%`);
  }
  if (params.categoryId) {
    query = query.eq('category_id', params.categoryId);
  }
  if (params.status === 'active') {
    query = query.eq('is_active', true);
  } else if (params.status === 'inactive') {
    query = query.eq('is_active', false);
  }

  // Sort
  const sortBy = params.sortBy || 'created_at';
  const sortDir = params.sortDir === 'asc';
  query = query.order(sortBy, { ascending: sortDir });

  // Paginate
  query = query.range(offset, offset + perPage - 1);

  const { data, error, count } = await query;

  if (error) throw new Error(error.message);

  // Post-filter by stock if needed
  let products = data || [];
  if (params.stockFilter === 'low' || params.stockFilter === 'out') {
    products = products.filter((p: Record<string, unknown>) => {
      const variants = p.variants as { stock_quantity: number }[];
      const totalStock = variants.reduce((s, v) => s + v.stock_quantity, 0);
      if (params.stockFilter === 'out') return totalStock === 0;
      return totalStock > 0 && totalStock < 5;
    });
  }

  return {
    products,
    total: count || 0,
    page,
    perPage,
    totalPages: Math.ceil((count || 0) / perPage),
  };
}

export async function getProductById(id: string) {
  await requireAdmin();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('products')
    .select('*, categories(*), variants:product_variants(*), images:product_images(*)')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function saveProduct(formData: {
  id?: string;
  name: string;
  slug: string;
  description: string;
  category_id: string;
  gender: string;
  frame_shape: string;
  frame_material: string;
  base_price: number;
  mrp: number | null;
  is_active: boolean;
  variants: {
    id?: string;
    color_name: string;
    color_hex: string;
    size: string;
    sku: string;
    price_override: number | null;
    stock_quantity: number;
    is_active: boolean;
  }[];
  images: {
    id?: string;
    url: string;
    alt_text: string;
    display_order: number;
    is_primary: boolean;
    storage_path: string | null;
    variant_id: string | null;
  }[];
}) {
  await requireAdmin();
  const supabase = createAdminClient();

  // Validation
  if (!formData.name.trim()) throw new Error('Product name is required');
  if (!formData.slug.trim()) throw new Error('Product slug is required');
  if (!formData.category_id) throw new Error('Category is required');
  if (formData.base_price <= 0) throw new Error('Price must be greater than 0');
  if (formData.mrp !== null && formData.mrp < formData.base_price) {
    throw new Error('MRP must be greater than or equal to price');
  }
  if (formData.variants.length === 0) throw new Error('At least one variant is required');
  for (const v of formData.variants) {
    if (!v.color_name.trim()) throw new Error('Variant color name is required');
    if (!v.sku.trim()) throw new Error('Variant SKU is required');
    if (v.stock_quantity < 0) throw new Error('Stock cannot be negative');
  }

  // Use the RPC for atomic upsert
  const { data: productId, error: rpcError } = await supabase.rpc('admin_upsert_product', {
    p_id: formData.id || null,
    p_name: formData.name.trim(),
    p_slug: formData.slug.trim().toLowerCase(),
    p_description: formData.description.trim(),
    p_category_id: formData.category_id,
    p_gender: formData.gender,
    p_frame_shape: formData.frame_shape,
    p_frame_material: formData.frame_material,
    p_base_price: formData.base_price,
    p_mrp: formData.mrp,
    p_is_active: formData.is_active,
    p_variants: formData.variants,
    p_images: formData.images,
  });

  if (rpcError) {
    if (rpcError.message.includes('duplicate key')) {
      if (rpcError.message.includes('slug')) throw new Error('A product with this slug already exists');
      if (rpcError.message.includes('sku')) throw new Error('A variant with this SKU already exists');
    }
    throw new Error(rpcError.message);
  }

  revalidatePath('/admin/products');
  revalidateProduct(formData.slug);
  revalidateAdmin();

  return productId;
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  const supabase = createAdminClient();

  // Get product slug for cache invalidation
  const { data: product } = await supabase
    .from('products')
    .select('slug')
    .eq('id', id)
    .single();

  // Soft delete
  const { error } = await supabase
    .from('products')
    .update({ deleted_at: new Date().toISOString(), is_active: false })
    .eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath('/admin/products');
  if (product?.slug) revalidateProduct(product.slug);
  revalidateAdmin();
}

export async function bulkUpdateProducts(ids: string[], updates: { is_active?: boolean; category_id?: string }) {
  await requireAdmin();
  const supabase = createAdminClient();

  const { error } = await supabase
    .from('products')
    .update(updates)
    .in('id', ids);

  if (error) throw new Error(error.message);

  revalidatePath('/admin/products');
  revalidateStorefront();
  revalidateAdmin();
}

export async function bulkDeleteProducts(ids: string[]) {
  await requireAdmin();
  const supabase = createAdminClient();

  const { error } = await supabase
    .from('products')
    .update({ deleted_at: new Date().toISOString(), is_active: false })
    .in('id', ids);

  if (error) throw new Error(error.message);

  revalidatePath('/admin/products');
  revalidateStorefront();
  revalidateAdmin();
}

export async function deleteProductImageAction(imageId: string, storagePath: string | null) {
  await requireAdmin();
  const supabase = createAdminClient();

  // Delete from storage if it has a storage_path
  if (storagePath) {
    try {
      await deleteFromStorage(storagePath);
    } catch {
      // Continue with DB delete even if storage delete fails
      console.error('Failed to delete from storage:', storagePath);
    }
  }

  // Delete from DB
  const { error } = await supabase
    .from('product_images')
    .delete()
    .eq('id', imageId);

  if (error) throw new Error(error.message);
}

export async function uploadImageAction(formData: FormData): Promise<{ url: string; storagePath: string }> {
  await requireAdmin();
  const supabase = createAdminClient();

  const file = formData.get('file') as File;
  if (!file) throw new Error('No file provided');

  const ext = file.name.split('.').pop() || 'jpg';
  const path = `products/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();

  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(path, arrayBuffer, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data: urlData } = supabase.storage
    .from('product-images')
    .getPublicUrl(data.path);

  return {
    url: urlData.publicUrl,
    storagePath: data.path,
  };
}
