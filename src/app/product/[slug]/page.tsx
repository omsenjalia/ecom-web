import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ProductDetailClient from '@/components/ProductDetailClient';
import type { Product, ProductVariant, ProductImage } from '@/lib/types';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: 'Product Not Found' };

  return {
    title: product.name,
    description: product.description.slice(0, 160),
    openGraph: {
      title: `${product.name} | Ram Chashma Ghar`,
      description: product.description.slice(0, 160),
      images: product.images?.[0]?.url ? [{ url: product.images[0].url }] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-warm-gray mb-6">
        <a href="/" className="hover:text-charcoal transition-colors">Home</a>
        <span className="mx-2">/</span>
        <a href="/shop" className="hover:text-charcoal transition-colors">Shop</a>
        <span className="mx-2">/</span>
        <a
          href={`/shop/${product.category}`}
          className="hover:text-charcoal transition-colors capitalize"
        >
          {product.category.replace('-', ' ')}
        </a>
        <span className="mx-2">/</span>
        <span className="text-charcoal">{product.name}</span>
      </nav>

      <ProductDetailClient
        product={product}
        variants={product.variants || []}
        images={product.images || []}
      />
    </div>
  );
}

async function getProduct(slug: string): Promise<
  (Product & { variants: ProductVariant[]; images: ProductImage[] }) | null
> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('products')
      .select('*, variants:product_variants(*), images:product_images(*)')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();
    return data as (Product & { variants: ProductVariant[]; images: ProductImage[] }) | null;
  } catch {
    return null;
  }
}
