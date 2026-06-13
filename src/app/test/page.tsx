'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCartStore } from '@/store/cart';
import toast from 'react-hot-toast';

const TEST_PRODUCT = {
  product_id: 'test-product-001',
  variant_id: 'test-variant-001',
  product_name: 'Test Aviator Frame',
  product_slug: 'test-aviator',
  variant_info: 'Matte Black / Medium',
  color_name: 'Matte Black',
  color_hex: '#1A1A1A',
  size: 'Medium',
  image_url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop',
  price: 1,       // ₹1 for easy Razorpay testing
  mrp: 99,
  quantity: 1,
  stock_quantity: 100,
};

export default function TestProductPage() {
  const router = useRouter();
  const { addItem, items, clearCart } = useCartStore();
  const [added, setAdded] = useState(false);

  const isInCart = items.some((i) => i.variant_id === TEST_PRODUCT.variant_id);

  const handleAddToCart = () => {
    addItem(TEST_PRODUCT);
    setAdded(true);
    toast.success('Test product added to cart!');
  };

  const handleQuickCheckout = () => {
    if (!isInCart && !added) {
      addItem(TEST_PRODUCT);
    }
    router.push('/cart');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 sm:py-20">
      <div className="bg-amber/10 border border-amber/30 p-4 mb-8 text-sm">
        <p className="font-bold text-amber-dark mb-1">🧪 Test Mode</p>
        <p className="text-warm-gray-dark">
          This is a dummy product priced at <strong>₹1</strong> so you can test the full checkout flow 
          (Razorpay or COD) without spending real money. Use Razorpay&apos;s test card: 
          <code className="bg-cream px-1 mx-1">4111 1111 1111 1111</code> with any future expiry and any CVV.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-8 items-start">
        {/* Image */}
        <div className="relative aspect-square bg-cream overflow-hidden">
          <Image
            src={TEST_PRODUCT.image_url}
            alt={TEST_PRODUCT.product_name}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover"
          />
          <span className="absolute top-3 left-3 bg-amber text-white text-xs font-bold px-2 py-1">
            TEST
          </span>
        </div>

        {/* Details */}
        <div className="space-y-4">
          <div>
            <p className="text-xs text-warm-gray uppercase tracking-wider">Test Product</p>
            <h1 className="text-2xl font-display text-charcoal">{TEST_PRODUCT.product_name}</h1>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-charcoal">₹{TEST_PRODUCT.price}</span>
            <span className="price-mrp text-lg">₹{TEST_PRODUCT.mrp}</span>
          </div>

          <p className="text-sm text-warm-gray-dark">
            {TEST_PRODUCT.variant_info}
          </p>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-success rounded-full" />
            <span className="text-sm text-success font-medium">In Stock</span>
          </div>

          <div className="space-y-3 pt-2">
            <button onClick={handleAddToCart} disabled={isInCart || added} className="btn-primary w-full disabled:opacity-50">
              {isInCart || added ? '✓ Added to Cart' : 'Add to Cart — ₹1'}
            </button>

            <button onClick={handleQuickCheckout} className="btn-secondary w-full">
              Go to Cart →
            </button>

            <button
              onClick={() => { clearCart(); setAdded(false); toast.success('Cart cleared'); }}
              className="text-xs text-warm-gray hover:text-error transition-colors w-full text-center"
            >
              Clear Cart & Reset
            </button>
          </div>

          <div className="bg-cream p-4 text-xs text-warm-gray-dark space-y-1.5 mt-4">
            <p className="font-bold text-charcoal text-sm mb-2">Razorpay Test Mode Info</p>
            <p>1. Select <strong>Pay Online</strong> and click Pay.</p>
            <p>2. A Razorpay <strong>Test Mode</strong> popup will appear.</p>
            <p>3. You do <strong>not</strong> need to enter a card number.</p>
            <p>4. Just select any method (e.g., Netbanking &gt; ICICI) and click <strong>Success</strong> in the mock bank page.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
