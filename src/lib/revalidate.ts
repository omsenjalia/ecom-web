import { revalidatePath } from 'next/cache';

export function revalidateStorefront() {
  revalidatePath('/', 'page');
  revalidatePath('/shop', 'page');
  revalidatePath('/shop/[category]', 'page');
}

export function revalidateProduct(slug: string) {
  revalidatePath(`/product/${slug}`, 'page');
  revalidateStorefront();
}

export function revalidateOrders() {
  revalidatePath('/admin/orders', 'page');
}

export function revalidateAdmin() {
  revalidatePath('/admin', 'page');
  revalidatePath('/admin/products', 'page');
  revalidatePath('/admin/categories', 'page');
  revalidatePath('/admin/orders', 'page');
  revalidatePath('/admin/coupons', 'page');
}
