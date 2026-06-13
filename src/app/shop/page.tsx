import { Suspense } from 'react';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import ProductCard from '@/components/ProductCard';
import ProductFilters from '@/components/ProductFilters';
import type { Product, ProductImage } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Shop All Eyewear',
  description: 'Browse our complete collection of eyeglasses, sunglasses, reading glasses, and kids eyewear. Free shipping on orders above ₹999.',
};

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    gender?: string;
    shape?: string;
    price?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const products = await getFilteredProducts(params);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-display text-charcoal">All Eyewear</h1>
        <p className="text-warm-gray mt-2">
          {products.length} {products.length === 1 ? 'frame' : 'frames'} found
        </p>
      </div>

      <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-10">
        {/* Filters sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-28 space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-charcoal">Filters</h2>
            <Suspense fallback={null}>
              <ProductFilters />
            </Suspense>
          </div>
        </aside>

        {/* Mobile filters */}
        <div className="lg:hidden mb-6 overflow-x-auto pb-2">
          <Suspense fallback={null}>
            <ProductFilters />
          </Suspense>
        </div>

        {/* Product grid */}
        <div>
          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <span className="text-5xl mb-4 block">🔍</span>
              <h3 className="text-xl font-display text-charcoal mb-2">No frames found</h3>
              <p className="text-warm-gray">Try adjusting your filters to find what you&apos;re looking for.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

async function getFilteredProducts(params: {
  category?: string;
  gender?: string;
  shape?: string;
  price?: string;
}): Promise<(Product & { images: ProductImage[] })[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from('products')
      .select('*, images:product_images(*)')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (params.category) query = query.eq('category', params.category);
    if (params.gender) query = query.eq('gender', params.gender);
    if (params.shape) query = query.eq('frame_shape', params.shape);
    if (params.price) {
      const [min, max] = params.price.split('-').map(Number);
      if (!isNaN(min)) query = query.gte('base_price', min);
      if (!isNaN(max)) query = query.lte('base_price', max);
    }

    const { data } = await query;
    return (data as (Product & { images: ProductImage[] })[]) || [];
  } catch {
    return [];
  }
}
