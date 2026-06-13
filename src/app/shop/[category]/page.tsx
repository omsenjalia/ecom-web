import { Suspense } from 'react';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import ProductCard from '@/components/ProductCard';
import ProductFilters from '@/components/ProductFilters';
import type { Product, ProductImage, Category } from '@/lib/types';

const categoryMeta: Record<string, { title: string; description: string }> = {
  eyeglasses: {
    title: 'Eyeglasses',
    description: 'Premium optical frames for men, women, and unisex. Lightweight, stylish, and built to last.',
  },
  sunglasses: {
    title: 'Sunglasses',
    description: 'UV400 polarised sunglasses that protect your eyes and elevate your look.',
  },
  'reading-glasses': {
    title: 'Reading Glasses',
    description: 'Comfortable reading glasses available in multiple powers. Anti-glare coated lenses.',
  },
  kids: {
    title: 'Kids Eyewear',
    description: 'Durable, colourful frames designed for active kids. Flexible and virtually unbreakable.',
  },
};

interface CategoryPageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{
    gender?: string;
    shape?: string;
    price?: string;
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const meta = categoryMeta[category];
  return {
    title: meta?.title || 'Shop',
    description: meta?.description || 'Browse our collection.',
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { category } = await params;
  const sp = await searchParams;
  const meta = categoryMeta[category];

  if (!meta) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-display text-charcoal">Category not found</h1>
      </div>
    );
  }

  const products = await getCategoryProducts(category as Category, sp);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-display text-charcoal">{meta.title}</h1>
        <p className="text-warm-gray mt-2 max-w-xl">{meta.description}</p>
        <p className="text-sm text-warm-gray-dark mt-1">
          {products.length} {products.length === 1 ? 'frame' : 'frames'}
        </p>
      </div>

      <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-10">
        {/* Filters */}
        <aside className="hidden lg:block">
          <div className="sticky top-28 space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-charcoal">Filters</h2>
            <Suspense fallback={null}>
              <ProductFilters hideCategory />
            </Suspense>
          </div>
        </aside>

        <div className="lg:hidden mb-6 overflow-x-auto pb-2">
          <Suspense fallback={null}>
            <ProductFilters hideCategory />
          </Suspense>
        </div>

        {/* Products */}
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
              <p className="text-warm-gray">Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

async function getCategoryProducts(
  category: Category,
  params: { gender?: string; shape?: string; price?: string }
): Promise<(Product & { images: ProductImage[] })[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from('products')
      .select('*, images:product_images(*)')
      .eq('is_active', true)
      .eq('category', category)
      .order('created_at', { ascending: false });

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
