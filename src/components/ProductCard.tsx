import Link from 'next/link';
import Image from 'next/image';
import type { Product, ProductImage } from '@/lib/types';

interface ProductCardProps {
  product: Product & { images?: ProductImage[] };
}

export default function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images?.find((img) => img.is_primary) || product.images?.[0];
  const hasDiscount = product.mrp && product.mrp > product.base_price;
  const discountPercent = hasDiscount
    ? Math.round(((product.mrp! - product.base_price) / product.mrp!) * 100)
    : 0;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block bg-white border border-cream-dark/30 overflow-hidden card-lift"
      id={`product-card-${product.slug}`}
    >
      {/* Image */}
      <div className="relative aspect-square bg-cream overflow-hidden">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt_text || product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-warm-gray">
            <span className="text-4xl">👓</span>
          </div>
        )}

        {/* Discount badge */}
        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-amber text-white text-xs font-bold px-2 py-1">
            {discountPercent}% OFF
          </span>
        )}

        {/* Category tag */}
        <span className="absolute bottom-3 left-3 bg-charcoal/80 text-cream text-[10px] uppercase tracking-wider px-2 py-1 backdrop-blur-sm">
          {product.categories?.name || product.category?.replace('-', ' ') || 'Eyewear'}
        </span>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-body text-sm font-semibold text-charcoal group-hover:text-amber transition-colors line-clamp-1">
          {product.name}
        </h3>
        <p className="text-xs text-warm-gray mt-1 capitalize">
          {product.frame_shape} · {product.frame_material} · {product.gender}
        </p>

        {/* Price */}
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-base font-bold text-charcoal">
            ₹{product.base_price.toLocaleString('en-IN')}
          </span>
          {hasDiscount && (
            <span className="price-mrp text-sm">
              ₹{product.mrp!.toLocaleString('en-IN')}
            </span>
          )}
        </div>
        <p className="text-[10px] text-warm-gray mt-0.5">Inclusive of all taxes</p>
      </div>
    </Link>
  );
}
