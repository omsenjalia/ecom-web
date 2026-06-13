'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import type { Category, Gender, FrameShape } from '@/lib/types';

const categoryOptions: { value: Category; label: string }[] = [
  { value: 'eyeglasses', label: 'Eyeglasses' },
  { value: 'sunglasses', label: 'Sunglasses' },
  { value: 'reading-glasses', label: 'Reading Glasses' },
  { value: 'kids', label: 'Kids' },
];

const genderOptions: { value: Gender; label: string }[] = [
  { value: 'men', label: 'Men' },
  { value: 'women', label: 'Women' },
  { value: 'unisex', label: 'Unisex' },
  { value: 'kids', label: 'Kids' },
];

const shapeOptions: { value: FrameShape; label: string }[] = [
  { value: 'round', label: 'Round' },
  { value: 'rectangular', label: 'Rectangular' },
  { value: 'aviator', label: 'Aviator' },
  { value: 'cat-eye', label: 'Cat-Eye' },
  { value: 'wayfarer', label: 'Wayfarer' },
  { value: 'square', label: 'Square' },
  { value: 'oval', label: 'Oval' },
  { value: 'geometric', label: 'Geometric' },
];

const priceRanges = [
  { value: '0-999', label: 'Under ₹1,000' },
  { value: '1000-1999', label: '₹1,000 – ₹1,999' },
  { value: '2000-2999', label: '₹2,000 – ₹2,999' },
  { value: '3000-4999', label: '₹3,000 – ₹4,999' },
  { value: '5000-99999', label: '₹5,000+' },
];

interface ProductFiltersProps {
  hideCategory?: boolean;
}

export default function ProductFilters({ hideCategory }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get('category') || '';
  const activeGender = searchParams.get('gender') || '';
  const activeShape = searchParams.get('shape') || '';
  const activePrice = searchParams.get('price') || '';

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function clearAll() {
    router.push(pathname, { scroll: false });
  }

  const hasFilters = activeCategory || activeGender || activeShape || activePrice;

  return (
    <div className="space-y-6">
      {/* Category filter */}
      {!hideCategory && (
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-warm-gray-dark mb-3">
            Category
          </h3>
          <div className="flex flex-wrap gap-2">
            {categoryOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => updateFilter('category', activeCategory === opt.value ? '' : opt.value)}
                className={`px-3 py-1.5 text-xs font-medium border transition-colors ${
                  activeCategory === opt.value
                    ? 'bg-charcoal text-cream border-charcoal'
                    : 'bg-white text-warm-gray-dark border-cream-dark hover:border-charcoal'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Gender */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-warm-gray-dark mb-3">
          Gender
        </h3>
        <div className="flex flex-wrap gap-2">
          {genderOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateFilter('gender', activeGender === opt.value ? '' : opt.value)}
              className={`px-3 py-1.5 text-xs font-medium border transition-colors ${
                activeGender === opt.value
                  ? 'bg-charcoal text-cream border-charcoal'
                  : 'bg-white text-warm-gray-dark border-cream-dark hover:border-charcoal'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Frame Shape */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-warm-gray-dark mb-3">
          Frame Shape
        </h3>
        <div className="flex flex-wrap gap-2">
          {shapeOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateFilter('shape', activeShape === opt.value ? '' : opt.value)}
              className={`px-3 py-1.5 text-xs font-medium border transition-colors ${
                activeShape === opt.value
                  ? 'bg-charcoal text-cream border-charcoal'
                  : 'bg-white text-warm-gray-dark border-cream-dark hover:border-charcoal'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-warm-gray-dark mb-3">
          Price Range
        </h3>
        <div className="flex flex-wrap gap-2">
          {priceRanges.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateFilter('price', activePrice === opt.value ? '' : opt.value)}
              className={`px-3 py-1.5 text-xs font-medium border transition-colors ${
                activePrice === opt.value
                  ? 'bg-charcoal text-cream border-charcoal'
                  : 'bg-white text-warm-gray-dark border-cream-dark hover:border-charcoal'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clear all */}
      {hasFilters && (
        <button
          onClick={clearAll}
          className="text-xs text-amber font-semibold hover:text-amber-dark transition-colors uppercase tracking-wider"
        >
          Clear All Filters ×
        </button>
      )}
    </div>
  );
}
