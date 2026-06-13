'use client';

import { useState } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useCartStore } from '@/store/cart';
import type { Product, ProductVariant, ProductImage } from '@/lib/types';

interface ProductDetailClientProps {
  product: Product;
  variants: ProductVariant[];
  images: ProductImage[];
}

export default function ProductDetailClient({
  product,
  variants,
  images,
}: ProductDetailClientProps) {
  const [selectedVariant, setSelectedVariant] = useState(variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(
    images.find((img) => img.is_primary)?.url || images[0]?.url || ''
  );
  const addItem = useCartStore((s) => s.addItem);

  const effectivePrice = selectedVariant?.price_override ?? product.base_price;
  const hasDiscount = product.mrp && product.mrp > effectivePrice;
  const inStock = selectedVariant && selectedVariant.stock_quantity > 0;

  const handleAddToCart = () => {
    if (!selectedVariant || !inStock) return;
    addItem({
      product_id: product.id,
      variant_id: selectedVariant.id,
      product_name: product.name,
      product_slug: product.slug,
      variant_info: `${selectedVariant.color_name} / ${selectedVariant.size}`,
      color_name: selectedVariant.color_name,
      color_hex: selectedVariant.color_hex,
      size: selectedVariant.size,
      image_url: mainImage,
      price: effectivePrice,
      mrp: product.mrp,
      quantity,
      stock_quantity: selectedVariant.stock_quantity,
    });
    toast.success(`${product.name} added to cart!`);
  };

  // Get variant-specific images or fallback to general product images
  const variantImages = selectedVariant
    ? images.filter(
        (img) => img.variant_id === selectedVariant.id || !img.variant_id
      )
    : images;
  const displayImages = variantImages.length > 0 ? variantImages : images;

  return (
    <div className="grid lg:grid-cols-2 gap-8 lg:gap-14">
      {/* ─── IMAGE GALLERY ─── */}
      <div className="space-y-4">
        {/* Main image */}
        <div className="relative aspect-square bg-cream overflow-hidden">
          {mainImage ? (
            <Image
              src={mainImage}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-warm-gray">
              <span className="text-6xl">👓</span>
            </div>
          )}
          {hasDiscount && (
            <span className="absolute top-4 left-4 bg-amber text-white text-sm font-bold px-3 py-1">
              {Math.round(((product.mrp! - effectivePrice) / product.mrp!) * 100)}% OFF
            </span>
          )}
        </div>

        {/* Thumbnails */}
        {displayImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto">
            {displayImages.map((img) => (
              <button
                key={img.id}
                onClick={() => setMainImage(img.url)}
                className={`relative w-20 h-20 shrink-0 border-2 overflow-hidden transition-colors ${
                  mainImage === img.url ? 'border-amber' : 'border-cream-dark/30 hover:border-warm-gray'
                }`}
              >
                <Image
                  src={img.url}
                  alt={img.alt_text || product.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ─── PRODUCT INFO ─── */}
      <div className="space-y-6">
        <div>
          <p className="text-xs text-warm-gray uppercase tracking-wider mb-1">
            {product.category.replace('-', ' ')} · {product.gender}
          </p>
          <h1 className="text-3xl sm:text-4xl font-display text-charcoal">
            {product.name}
          </h1>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-charcoal">
            ₹{effectivePrice.toLocaleString('en-IN')}
          </span>
          {hasDiscount && (
            <span className="price-mrp text-lg">
              ₹{product.mrp!.toLocaleString('en-IN')}
            </span>
          )}
        </div>
        <p className="text-xs text-warm-gray -mt-4">Inclusive of 18% GST</p>

        {/* Color variants */}
        {variants.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-warm-gray-dark mb-3">
              Colour: <span className="text-charcoal">{selectedVariant?.color_name}</span>
            </h3>
            <div className="flex flex-wrap gap-3">
              {variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => {
                    setSelectedVariant(v);
                    setQuantity(1);
                    // Update image if variant-specific
                    const vImg = images.find(
                      (img) => img.variant_id === v.id && img.is_primary
                    );
                    if (vImg) setMainImage(vImg.url);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 border transition-colors ${
                    selectedVariant?.id === v.id
                      ? 'border-charcoal bg-cream'
                      : 'border-cream-dark/50 hover:border-charcoal'
                  }`}
                  title={`${v.color_name} – ${v.size}`}
                >
                  <span
                    className="w-5 h-5 rounded-full border border-warm-gray-light/50"
                    style={{ backgroundColor: v.color_hex }}
                  />
                  <span className="text-xs font-medium">
                    {v.color_name}
                  </span>
                  <span className="text-[10px] text-warm-gray">{v.size}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Stock status */}
        <div className="flex items-center gap-2">
          {inStock ? (
            <>
              <span className="w-2 h-2 bg-success rounded-full" />
              <span className="text-sm text-success font-medium">
                In Stock ({selectedVariant.stock_quantity} left)
              </span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 bg-error rounded-full" />
              <span className="text-sm text-error font-medium">Out of Stock</span>
            </>
          )}
        </div>

        {/* Quantity + Add to Cart */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center border border-cream-dark/50">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 flex items-center justify-center text-charcoal hover:bg-cream transition-colors"
              disabled={quantity <= 1}
            >
              −
            </button>
            <span className="w-10 h-10 flex items-center justify-center text-sm font-semibold border-x border-cream-dark/50">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(Math.min(selectedVariant?.stock_quantity || 1, quantity + 1))}
              className="w-10 h-10 flex items-center justify-center text-charcoal hover:bg-cream transition-colors"
              disabled={quantity >= (selectedVariant?.stock_quantity || 1)}
            >
              +
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className="btn-primary flex-1 disabled:opacity-50 disabled:hover:transform-none disabled:cursor-not-allowed"
          >
            {inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>

        {/* Product details */}
        <div className="border-t border-cream-dark/30 pt-6 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-charcoal mb-2">Description</h3>
            <p className="text-sm text-warm-gray-dark leading-relaxed">
              {product.description}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-charcoal mb-2">Specifications</h3>
            <dl className="grid grid-cols-2 gap-y-2 text-sm">
              <dt className="text-warm-gray">Frame Shape</dt>
              <dd className="text-charcoal capitalize">{product.frame_shape}</dd>
              <dt className="text-warm-gray">Frame Material</dt>
              <dd className="text-charcoal capitalize">{product.frame_material}</dd>
              <dt className="text-warm-gray">Gender</dt>
              <dd className="text-charcoal capitalize">{product.gender}</dd>
              <dt className="text-warm-gray">Category</dt>
              <dd className="text-charcoal capitalize">{product.category.replace('-', ' ')}</dd>
            </dl>
          </div>

          <div>
            <h3 className="text-sm font-bold text-charcoal mb-2">Shipping & Returns</h3>
            <ul className="text-sm text-warm-gray-dark space-y-1">
              <li>🚚 Free shipping on orders above ₹999</li>
              <li>💳 Cash on Delivery available</li>
              <li>↩️ 7-day easy returns</li>
              <li>📋 GST invoice provided</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
