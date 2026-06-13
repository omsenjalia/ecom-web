import { Suspense } from 'react';
import OrderSuccessClient from './OrderSuccessClient';

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-16 w-16 bg-cream-dark/30 rounded-full mx-auto" />
          <div className="h-8 bg-cream-dark/30 rounded w-64 mx-auto" />
        </div>
      </div>
    }>
      <OrderSuccessClient />
    </Suspense>
  );
}
