import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about ordering, shipping, returns, payments, and more at Ram Chashma Ghar.',
};

const faqs = [
  {
    category: 'Ordering',
    questions: [
      {
        q: 'Do I need to create an account to order?',
        a: 'No! You can checkout as a guest. However, creating an account lets you track orders and save addresses for faster checkout next time.',
      },
      {
        q: 'Can I order prescription lenses?',
        a: 'Currently, we sell frames only. You can take your new frames to any local optician who can fit your prescription lenses. We\'re working on adding lens customisation to the website — stay tuned!',
      },
      {
        q: 'How do I know which frame size fits me?',
        a: 'Each product page shows the frame size (Small, Medium, Large). As a general guide: Small fits narrow faces, Medium fits most adult faces, and Large is for wider faces. When in doubt, chat with us on WhatsApp and we\'ll help you pick.',
      },
    ],
  },
  {
    category: 'Shipping',
    questions: [
      {
        q: 'How much does shipping cost?',
        a: 'Shipping is FREE on all orders above ₹999. For orders below ₹999, we charge a flat ₹79 shipping fee.',
      },
      {
        q: 'How long does delivery take?',
        a: 'Most orders are delivered within 5–7 business days. Metro cities (Mumbai, Delhi, Bangalore, etc.) typically receive orders in 3–5 days. We ship from Gujarat via trusted courier partners.',
      },
      {
        q: 'Do you deliver across all of India?',
        a: 'Yes! We deliver to all states and union territories across India, including pin codes in remote areas.',
      },
    ],
  },
  {
    category: 'Payments',
    questions: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, Net Banking through Razorpay. We also offer Cash on Delivery (COD) — pay when your order arrives.',
      },
      {
        q: 'Is Cash on Delivery (COD) really available?',
        a: 'Absolutely! COD is a first-class payment option for us. We understand that many customers prefer paying on delivery, and we\'re happy to offer it at no extra charge.',
      },
      {
        q: 'Are your prices inclusive of GST?',
        a: 'Yes. All prices displayed on our website include 18% GST. The price you see is the price you pay — no surprises at checkout. A GST invoice is provided with every order.',
      },
    ],
  },
  {
    id: 'returns',
    category: 'Returns & Refunds',
    questions: [
      {
        q: 'What is your return policy?',
        a: 'We offer a 7-day return policy. If you\'re not happy with your purchase, you can return it within 7 days of delivery. The product must be unused, in original packaging, and with all tags intact.',
      },
      {
        q: 'How do I initiate a return?',
        a: 'Simply message us on WhatsApp at +91 98765 43210 with your order number and reason for return. We\'ll arrange a reverse pickup within 48 hours.',
      },
      {
        q: 'When will I receive my refund?',
        a: 'Once we receive and inspect the returned product, refunds are processed within 5–7 business days to your original payment method. COD orders are refunded via bank transfer.',
      },
    ],
  },
  {
    category: 'Product Care',
    questions: [
      {
        q: 'How should I clean my glasses?',
        a: 'Use lukewarm water and a drop of dish soap. Gently rub with your fingers, rinse, and dry with a microfibre cloth. Avoid paper towels, tissues, or your shirt — they can scratch lenses.',
      },
      {
        q: 'Do your sunglasses have UV protection?',
        a: 'Yes! All our sunglasses come with UV400 protection, which blocks 99–100% of UVA and UVB rays. Most models also feature polarised lenses for glare reduction.',
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
      <div className="text-center mb-12">
        <p className="text-amber text-sm uppercase tracking-[0.15em] font-semibold mb-2">Help Centre</p>
        <h1 className="text-3xl sm:text-4xl font-display text-charcoal">
          Frequently Asked Questions
        </h1>
        <p className="text-warm-gray mt-3">
          Can&apos;t find your answer? Chat with us on{' '}
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber font-semibold hover:text-amber-dark"
          >
            WhatsApp
          </a>
        </p>
      </div>

      <div className="space-y-10">
        {faqs.map((section) => (
          <div key={section.category} id={section.category === 'Returns & Refunds' ? 'returns' : undefined}>
            <h2 className="text-xl font-display text-charcoal mb-4 pb-2 border-b border-cream-dark/50">
              {section.category}
            </h2>
            <div className="space-y-4">
              {section.questions.map((faq) => (
                <details key={faq.q} className="group bg-white border border-cream-dark/30">
                  <summary className="flex items-center justify-between p-4 cursor-pointer list-none text-sm font-semibold text-charcoal hover:text-amber transition-colors">
                    <span className="pr-4">{faq.q}</span>
                    <span className="text-warm-gray group-open:rotate-45 transition-transform text-lg shrink-0">+</span>
                  </summary>
                  <div className="px-4 pb-4 text-sm text-warm-gray-dark leading-relaxed">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-cream p-6 text-center">
        <h3 className="font-display text-xl text-charcoal mb-2">Still Have Questions?</h3>
        <p className="text-sm text-warm-gray-dark mb-4">
          Our team is available Mon–Sat, 10 AM to 8 PM IST
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            💬 WhatsApp Us
          </a>
          <a href="tel:+919876543210" className="btn-secondary">
            📞 Call Us
          </a>
        </div>
      </div>
    </div>
  );
}
