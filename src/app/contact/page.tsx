import type { Metadata } from 'next';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Ram Chashma Ghar — visit our store in Rajkot, Gujarat or reach us via WhatsApp, phone, or email.',
};

export default function ContactPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
      <div className="text-center mb-12">
        <p className="text-amber text-sm uppercase tracking-[0.15em] font-semibold mb-2">Get In Touch</p>
        <h1 className="text-3xl sm:text-4xl font-display text-charcoal">We&apos;d Love to Hear From You</h1>
        <p className="text-warm-gray mt-3 max-w-lg mx-auto">
          Whether you need help choosing frames, have a question about your order, or just want to say hello — we&apos;re here.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Contact info */}
        <div className="space-y-6">
          <div className="bg-cream p-6">
            <h2 className="font-display text-xl text-charcoal mb-5">Reach Us Directly</h2>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-amber/20 rounded-full flex items-center justify-center shrink-0">
                  <Phone size={18} className="text-amber" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-charcoal">Phone</p>
                  <a href="tel:+919876543210" className="text-sm text-warm-gray-dark hover:text-amber transition-colors">
                    +91 98765 43210
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#25D366]/20 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-lg">💬</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-charcoal">WhatsApp</p>
                  <a
                    href="https://wa.me/919876543210"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-warm-gray-dark hover:text-amber transition-colors"
                  >
                    Chat with us (fastest response!)
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-amber/20 rounded-full flex items-center justify-center shrink-0">
                  <Mail size={18} className="text-amber" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-charcoal">Email</p>
                  <a href="mailto:hello@ramchashmagar.in" className="text-sm text-warm-gray-dark hover:text-amber transition-colors">
                    hello@ramchashmagar.in
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-amber/20 rounded-full flex items-center justify-center shrink-0">
                  <MapPin size={18} className="text-amber" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-charcoal">Visit Our Store</p>
                  <p className="text-sm text-warm-gray-dark">
                    Ram Chashma Ghar<br />
                    Shop No. 12, Station Road<br />
                    Rajkot, Gujarat — 360001
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-amber/20 rounded-full flex items-center justify-center shrink-0">
                  <Clock size={18} className="text-amber" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-charcoal">Store Hours</p>
                  <p className="text-sm text-warm-gray-dark">
                    Mon – Sat: 10:00 AM – 8:00 PM<br />
                    Sunday: 11:00 AM – 5:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact form */}
        <div>
          <h2 className="font-display text-xl text-charcoal mb-5">Send Us a Message</h2>
          <form className="space-y-4" action="https://formspree.io/f/placeholder" method="POST">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-warm-gray-dark mb-1.5">Name</label>
              <input
                type="text"
                name="name"
                required
                placeholder="Your name"
                className="w-full px-4 py-2.5 border border-cream-dark/50 bg-white text-sm placeholder:text-warm-gray-light focus:border-amber focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-warm-gray-dark mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                required
                placeholder="you@email.com"
                className="w-full px-4 py-2.5 border border-cream-dark/50 bg-white text-sm placeholder:text-warm-gray-light focus:border-amber focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-warm-gray-dark mb-1.5">Phone (optional)</label>
              <input
                type="tel"
                name="phone"
                placeholder="+91 98765 43210"
                className="w-full px-4 py-2.5 border border-cream-dark/50 bg-white text-sm placeholder:text-warm-gray-light focus:border-amber focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-warm-gray-dark mb-1.5">Message</label>
              <textarea
                name="message"
                required
                rows={5}
                placeholder="Tell us how we can help..."
                className="w-full px-4 py-2.5 border border-cream-dark/50 bg-white text-sm placeholder:text-warm-gray-light focus:border-amber focus:outline-none resize-none"
              />
            </div>
            <button type="submit" className="btn-primary w-full">
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* Map */}
      <div className="mt-12">
        <div className="bg-cream aspect-[2/1] sm:aspect-[3/1] flex items-center justify-center">
          <div className="text-center">
            <MapPin size={32} className="mx-auto text-amber mb-2" />
            <p className="text-sm text-warm-gray-dark font-semibold">Ram Chashma Ghar</p>
            <p className="text-xs text-warm-gray">Station Road, Rajkot, Gujarat 360001</p>
            <a
              href="https://maps.google.com/?q=Rajkot+Station+Road+Gujarat"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-amber font-semibold mt-2 inline-block hover:text-amber-dark"
            >
              Open in Google Maps →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
