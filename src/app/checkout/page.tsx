import { Suspense } from 'react';
import CheckoutClient from './CheckoutClient';

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-cream-dark/30 rounded w-48 mx-auto" />
          <div className="h-4 bg-cream-dark/20 rounded w-64 mx-auto" />
        </div>
      </div>
    }>
      <CheckoutClient />
    </Suspense>
  );
}
