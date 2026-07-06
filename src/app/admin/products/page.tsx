import { requireAdmin } from '@/lib/supabase/admin-check';
import { getProductsPage } from './actions';
import { createAdminClient } from '@/lib/supabase/admin';
import ProductsListClient from './ProductsListClient';

export const metadata = { title: 'Products' };

interface Props {
  searchParams: Promise<{
    page?: string;
    search?: string;
    category?: string;
    status?: string;
    stock?: string;
    sort?: string;
    dir?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  await requireAdmin();
  const params = await searchParams;

  const result = await getProductsPage({
    page: parseInt(params.page || '1'),
    search: params.search,
    categoryId: params.category,
    status: (params.status as 'active' | 'inactive' | 'all') || 'all',
    stockFilter: (params.stock as 'all' | 'low' | 'out') || 'all',
    sortBy: params.sort || 'created_at',
    sortDir: (params.dir as 'asc' | 'desc') || 'desc',
  });

  // Get categories for filter dropdown
  const supabase = createAdminClient();
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug')
    .order('display_order');

  return (
    <ProductsListClient
      products={result.products}
      total={result.total}
      page={result.page}
      totalPages={result.totalPages}
      categories={categories || []}
      currentFilters={{
        search: params.search || '',
        category: params.category || '',
        status: params.status || 'all',
        stock: params.stock || 'all',
        sort: params.sort || 'created_at',
        dir: params.dir || 'desc',
      }}
    />
  );
}
