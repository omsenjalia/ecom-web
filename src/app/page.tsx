import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import ProductCard from '@/components/ProductCard';

const categories = [
  {
    name: 'Eyeglasses',
    slug: 'eyeglasses',
    description: 'Clear vision, bold style',
    emoji: '👓',
    image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=500&fit=crop',
  },
  {
    name: 'Sunglasses',
    slug: 'sunglasses',
    description: 'UV protection meets fashion',
    emoji: '🕶️',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=500&fit=crop',
  },
  {
    name: 'Reading Glasses',
    slug: 'reading-glasses',
    description: 'Comfort for every page',
    emoji: '📖',
    image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=400&h=500&fit=crop',
  },
  {
    name: 'Kids',
    slug: 'kids',
    description: 'Tough frames, happy faces',
    emoji: '🧒',
    image: 'https://images.unsplash.com/photo-1510686015-cf8d5bfa2732?w=400&h=500&fit=crop',
  },
];

const trustSignals = [
  { icon: '🚚', title: 'Free Shipping', desc: 'Orders above ₹999' },
  { icon: '💳', title: 'Cash on Delivery', desc: 'Pay when you receive' },
  { icon: '↩️', title: '7-Day Returns', desc: 'No questions asked' },
  { icon: '🛡️', title: '100% Genuine', desc: 'Authentic products only' },
  { icon: '📋', title: 'GST Invoice', desc: 'On every order' },
  { icon: '📞', title: 'WhatsApp Support', desc: 'Chat anytime' },
];

export default async function HomePage() {
  let featuredProducts: Awaited<ReturnType<typeof getFeaturedProducts>> = [];
  try {
    featuredProducts = await getFeaturedProducts();
  } catch {
    // Supabase not configured yet — show empty
  }

  return (
    <div>
      {/* ─── HERO ─── */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center overflow-hidden bg-charcoal">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1556306535-38febf6782e7?w=1600&h=900&fit=crop"
            alt="Person wearing stylish eyeglasses"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/80 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <p className="text-amber font-body text-sm uppercase tracking-[0.2em] mb-4 animate-fade-in-up">
              Trusted Since 1985
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display text-cream leading-[1.1] mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              See the World{' '}
              <span className="text-amber italic">Through</span>
              <br />
              Better Frames
            </h1>
            <p className="text-lg sm:text-xl text-warm-gray-light max-w-md mb-8 font-body leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Handpicked eyewear from Gujarat's most trusted optical house. 
              Premium frames, honest prices, delivered across India.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <Link href="/shop" className="btn-primary text-base px-8 py-4">
                Explore Collection
              </Link>
              <Link href="/about" className="btn-secondary border-cream/30 text-cream hover:bg-cream hover:text-charcoal text-base px-8 py-4">
                Our Story
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-cream/30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-amber rounded-full" />
          </div>
        </div>
      </section>

      {/* ─── TRUST SIGNALS ─── */}
      <section className="bg-cream border-y border-cream-dark/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex overflow-x-auto gap-8 no-scrollbar">
            {trustSignals.map((signal) => (
              <div key={signal.title} className="flex items-center gap-3 shrink-0">
                <span className="text-2xl">{signal.icon}</span>
                <div>
                  <p className="text-xs font-bold text-charcoal whitespace-nowrap">{signal.title}</p>
                  <p className="text-[10px] text-warm-gray whitespace-nowrap">{signal.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-12">
          <p className="text-amber text-sm uppercase tracking-[0.15em] font-semibold mb-2">Browse By Category</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display text-charcoal">
            Find Your Perfect Frame
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop/${cat.slug}`}
              className="group relative aspect-[3/4] sm:aspect-[3/4] overflow-hidden bg-charcoal"
              id={`category-${cat.slug}`}
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover opacity-70 group-hover:opacity-50 group-hover:scale-105 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                <span className="text-3xl mb-2 block">{cat.emoji}</span>
                <h3 className="font-display text-xl sm:text-2xl text-cream">
                  {cat.name}
                </h3>
                <p className="text-xs text-warm-gray-light mt-1 group-hover:text-cream transition-colors">
                  {cat.description}
                </p>
                <span className="inline-block mt-3 text-xs text-amber font-semibold uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                  Shop Now →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ─── */}
      {featuredProducts.length > 0 && (
        <section className="bg-cream py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-amber text-sm uppercase tracking-[0.15em] font-semibold mb-2">Curated For You</p>
                <h2 className="text-3xl sm:text-4xl font-display text-charcoal">
                  Bestsellers
                </h2>
              </div>
              <Link
                href="/shop"
                className="hidden sm:inline-block text-sm font-semibold text-charcoal hover:text-amber transition-colors uppercase tracking-wider"
              >
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="sm:hidden text-center mt-8">
              <Link href="/shop" className="btn-primary">
                View All Products
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ─── MARQUEE ─── */}
      <section className="bg-charcoal py-6 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap flex">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex shrink-0">
              {[
                'Premium Eyewear',
                'Free Shipping',
                'COD Available',
                'Easy Returns',
                '100% Genuine',
                'Made for India',
                'Since 1985',
                'UV Protection',
              ].map((text) => (
                <span
                  key={`${i}-${text}`}
                  className="mx-8 text-cream/40 text-sm uppercase tracking-[0.25em] font-semibold"
                >
                  {text} ·
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ─── BRAND STORY TEASER ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1556306535-38febf6782e7?w=800&h=600&fit=crop"
              alt="Ram Chashma Ghar store in Gujarat"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 to-transparent" />
            <div className="absolute bottom-6 left-6 bg-amber text-white px-4 py-2">
              <p className="font-display text-2xl">39+</p>
              <p className="text-xs uppercase tracking-wider">Years of Trust</p>
            </div>
          </div>

          <div>
            <p className="text-amber text-sm uppercase tracking-[0.15em] font-semibold mb-3">Our Story</p>
            <h2 className="text-3xl sm:text-4xl font-display text-charcoal mb-6 leading-tight">
              From a Small Shop in Gujarat to Homes Across India
            </h2>
            <p className="text-warm-gray-dark leading-relaxed mb-4 font-body">
              What started as a humble optical shop on Station Road, Rajkot in 1985 has grown into 
              a trusted name in Indian eyewear. Three generations of the Ram family have dedicated 
              themselves to one mission: helping India see better, look better.
            </p>
            <p className="text-warm-gray-dark leading-relaxed mb-8 font-body">
              Every frame we sell is handpicked for quality, comfort, and style. We believe premium 
              eyewear shouldn't cost a fortune — and with us, it doesn't.
            </p>
            <Link href="/about" className="btn-secondary">
              Read Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="relative py-20 sm:py-28 overflow-hidden bg-charcoal">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1508296695146-257a814070b4?w=1600&h=600&fit=crop"
            alt="Eyewear display"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative text-center max-w-2xl mx-auto px-4">
          <h2 className="text-3xl sm:text-5xl font-display text-cream mb-4">
            Ready to Find Your Frame?
          </h2>
          <p className="text-warm-gray-light mb-8 text-lg">
            Use code <span className="text-amber font-bold">WELCOME10</span> for 10% off your first order
          </p>
          <Link href="/shop" className="btn-primary text-base px-10 py-4">
            Shop Now
          </Link>
        </div>
      </section>
    </div>
  );
}

async function getFeaturedProducts() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('products')
    .select('*, images:product_images(*)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(8);
  return data || [];
}
