import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Ram Chashma Ghar — three generations of trust in Indian eyewear since 1985.',
};

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative py-20 sm:py-28 bg-charcoal overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <Image
            src="https://images.unsplash.com/photo-1556306535-38febf6782e7?w=1600&h=600&fit=crop"
            alt="Eyewear workshop"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <p className="text-amber text-sm uppercase tracking-[0.2em] font-semibold mb-3">Our Story</p>
          <h1 className="text-4xl sm:text-5xl font-display text-cream leading-tight">
            Three Generations of Helping India See Better
          </h1>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-display text-charcoal mb-6">
              Started with a Dream, Built on Trust
            </h2>
            <div className="space-y-4 text-warm-gray-dark leading-relaxed font-body">
              <p>
                In 1985, Rambhai Patel opened a small optical shop on Station Road in Rajkot, Gujarat. 
                He had one simple belief: every person deserves clear vision and well-made eyewear, 
                regardless of their budget.
              </p>
              <p>
                His son, and now his grandson, have carried that belief forward. What started as a 
                neighbourhood optician now serves customers across India — from bustling metros to 
                small towns.
              </p>
              <p>
                We personally select every frame we sell. We visit factories, check quality, test 
                hinges, verify lenses, and only then does a frame earn a place in our collection. 
                If we wouldn&apos;t wear it ourselves, we won&apos;t sell it to you.
              </p>
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&h=750&fit=crop"
              alt="Handcrafted eyeglasses"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-charcoal/60 to-transparent p-6">
              <p className="text-cream font-display text-2xl">Est. 1985</p>
              <p className="text-cream/80 text-sm">Rajkot, Gujarat</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-cream py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display text-charcoal text-center mb-12">What We Stand For</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                icon: '🔍',
                title: 'Quality First',
                desc: 'Every frame is hand-checked. We reject more frames than we accept because your eyes deserve the best.',
              },
              {
                icon: '💰',
                title: 'Honest Pricing',
                desc: 'No inflated MRPs, no fake discounts. Our prices reflect true value. GST-inclusive, always.',
              },
              {
                icon: '🤝',
                title: 'Customer Trust',
                desc: 'From 7-day returns to WhatsApp support — we treat every customer like family.',
              },
            ].map((value) => (
              <div key={value.title} className="text-center">
                <span className="text-4xl mb-4 block">{value.icon}</span>
                <h3 className="font-display text-xl text-charcoal mb-2">{value.title}</h3>
                <p className="text-sm text-warm-gray-dark leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { number: '39+', label: 'Years of Trust' },
            { number: '50K+', label: 'Happy Customers' },
            { number: '500+', label: 'Frame Styles' },
            { number: '28', label: 'States Delivered' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-4xl font-display text-amber">{stat.number}</p>
              <p className="text-sm text-warm-gray mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-charcoal py-16 text-center">
        <h2 className="text-3xl font-display text-cream mb-4">Ready to See the Difference?</h2>
        <p className="text-warm-gray-light mb-8 max-w-md mx-auto">
          Browse our handpicked collection and find frames that match your face, style, and budget.
        </p>
        <Link href="/shop" className="btn-primary">
          Explore Our Collection
        </Link>
      </section>
    </div>
  );
}
