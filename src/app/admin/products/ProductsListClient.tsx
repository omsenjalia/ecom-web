'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Search, ArrowUpDown, Trash2, Eye, EyeOff, ChevronLeft, ChevronRight } from 'lucide-react';
import { bulkUpdateProducts, bulkDeleteProducts, deleteProduct } from './actions';
import ConfirmDialog from '../components/ConfirmDialog';
import StatusBadge from '../components/StatusBadge';

interface Props {
  products: Record<string, unknown>[];
  total: number;
  page: number;
  totalPages: number;
  categories: { id: string; name: string; slug: string }[];
  currentFilters: {
    search: string;
    category: string;
    status: string;
    stock: string;
    sort: string;
    dir: string;
  };
}

export default function ProductsListClient({
  products,
  total,
  page,
  totalPages,
  categories,
  currentFilters,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [searchInput, setSearchInput] = useState(currentFilters.search);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [bulkAction, setBulkAction] = useState<string | null>(null);
  const [error, setError] = useState('');

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) params.set(key, value);
        else params.delete(key);
      });
      if (updates.page === undefined && !('page' in updates)) params.set('page', '1');
      router.push(`/admin/products?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleSearch = useCallback(() => {
    updateParams({ search: searchInput, page: '1' });
  }, [searchInput, updateParams]);

  const handleSort = (col: string) => {
    const newDir = currentFilters.sort === col && currentFilters.dir === 'asc' ? 'desc' : 'asc';
    updateParams({ sort: col, dir: newDir });
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === products.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(products.map((p) => p.id as string)));
    }
  };

  const handleBulkAction = async () => {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    setError('');

    try {
      switch (bulkAction) {
        case 'activate':
          await bulkUpdateProducts(ids, { is_active: true });
          break;
        case 'deactivate':
          await bulkUpdateProducts(ids, { is_active: false });
          break;
        case 'delete':
          await bulkDeleteProducts(ids);
          break;
      }
      setSelected(new Set());
      setBulkAction(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bulk action failed');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteProduct(deleteTarget.id);
      setDeleteTarget(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
      setDeleteTarget(null);
    }
  };

  const getProductThumbnail = (product: Record<string, unknown>) => {
    const images = product.images as { url: string; is_primary: boolean }[];
    const primary = images?.find((i) => i.is_primary) || images?.[0];
    return primary?.url;
  };

  const getProductStock = (product: Record<string, unknown>) => {
    const variants = product.variants as { stock_quantity: number }[];
    return variants?.reduce((sum, v) => sum + v.stock_quantity, 0) || 0;
  };

  const getCategoryName = (product: Record<string, unknown>) => {
    const cat = product.categories as { name: string } | null;
    return cat?.name || '—';
  };

  const SortIcon = ({ col }: { col: string }) => (
    <ArrowUpDown
      size={12}
      className={currentFilters.sort === col ? '' : 'admin-text-muted'}
      style={{ opacity: currentFilters.sort === col ? 1 : 0.4 }}
    />
  );

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Products</h1>
          <p className="admin-page-subtitle">{total} total products</p>
        </div>
        <Link href="/admin/products/new" className="admin-btn admin-btn-primary">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {error && (
        <div className="admin-login-error" style={{ marginBottom: '1rem' }}>{error}</div>
      )}

      {/* Filters */}
      <div className="admin-filters">
        <div className="admin-search-wrapper">
          <Search size={16} className="admin-search-icon" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search products..."
            className="admin-search-input"
          />
        </div>
        <select
          value={currentFilters.category}
          onChange={(e) => updateParams({ category: e.target.value, page: '1' })}
          className="admin-filter-select"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select
          value={currentFilters.status}
          onChange={(e) => updateParams({ status: e.target.value, page: '1' })}
          className="admin-filter-select"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select
          value={currentFilters.stock}
          onChange={(e) => updateParams({ stock: e.target.value, page: '1' })}
          className="admin-filter-select"
        >
          <option value="all">All Stock</option>
          <option value="low">Low Stock (&lt;5)</option>
          <option value="out">Out of Stock</option>
        </select>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="admin-bulk-bar">
          <span><span className="admin-bulk-count">{selected.size}</span> selected</span>
          <div className="admin-bulk-actions">
            <button onClick={() => { setBulkAction('activate'); handleBulkAction(); }} className="admin-btn admin-btn-sm admin-btn-secondary" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>
              <Eye size={14} /> Activate
            </button>
            <button onClick={() => { setBulkAction('deactivate'); handleBulkAction(); }} className="admin-btn admin-btn-sm admin-btn-secondary" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>
              <EyeOff size={14} /> Deactivate
            </button>
            <button onClick={() => { setBulkAction('delete'); handleBulkAction(); }} className="admin-btn admin-btn-sm admin-btn-danger">
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      {products.length === 0 ? (
        <div className="admin-card">
          <div className="admin-empty">
            <div className="admin-empty-icon">📦</div>
            <p className="admin-empty-title">No products found</p>
            <p className="admin-empty-text">
              {currentFilters.search
                ? 'Try a different search term or clear filters.'
                : 'Add your first product to get started.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 40 }}>
                  <input
                    type="checkbox"
                    className="admin-table-checkbox"
                    checked={selected.size === products.length && products.length > 0}
                    onChange={toggleAll}
                  />
                </th>
                <th style={{ width: 50 }}></th>
                <th className="admin-table-sortable" onClick={() => handleSort('name')}>
                  Name <SortIcon col="name" />
                </th>
                <th>Category</th>
                <th className="admin-table-sortable" onClick={() => handleSort('base_price')}>
                  Price <SortIcon col="base_price" />
                </th>
                <th>Stock</th>
                <th>Status</th>
                <th className="admin-table-sortable" onClick={() => handleSort('created_at')}>
                  Added <SortIcon col="created_at" />
                </th>
                <th style={{ width: 80 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const id = product.id as string;
                const stock = getProductStock(product);
                return (
                  <tr key={id}>
                    <td>
                      <input
                        type="checkbox"
                        className="admin-table-checkbox"
                        checked={selected.has(id)}
                        onChange={() => toggleSelect(id)}
                      />
                    </td>
                    <td>
                      {getProductThumbnail(product) ? (
                        <Image
                          src={getProductThumbnail(product)!}
                          alt=""
                          width={40}
                          height={40}
                          className="admin-table-thumbnail"
                          style={{ borderRadius: 6 }}
                        />
                      ) : (
                        <div className="admin-table-thumbnail" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>👓</div>
                      )}
                    </td>
                    <td>
                      <Link href={`/admin/products/${id}/edit`} style={{ fontWeight: 600, color: '#1a1a2e', textDecoration: 'none' }}>
                        {product.name as string}
                      </Link>
                      <br />
                      <span className="admin-text-muted admin-text-sm">{product.slug as string}</span>
                    </td>
                    <td className="admin-text-muted">{getCategoryName(product)}</td>
                    <td>
                      <span style={{ fontWeight: 600 }}>₹{(product.base_price as number).toLocaleString('en-IN')}</span>
                      {(product.mrp as number) && (
                        <><br /><span className="admin-text-muted admin-text-sm" style={{ textDecoration: 'line-through' }}>₹{(product.mrp as number).toLocaleString('en-IN')}</span></>
                      )}
                    </td>
                    <td>
                      <StatusBadge status={stock === 0 ? 'out-of-stock' : stock < 5 ? 'low-stock' : 'in-stock'} />
                      <br />
                      <span className="admin-text-muted admin-text-sm">{stock} units</span>
                    </td>
                    <td>
                      <StatusBadge status={product.is_active ? 'active' : 'inactive'} />
                    </td>
                    <td className="admin-text-muted admin-text-sm">
                      {new Date(product.created_at as string).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </td>
                    <td>
                      <div className="admin-flex-center">
                        <Link href={`/admin/products/${id}/edit`} className="admin-btn admin-btn-ghost admin-btn-sm" title="Edit">
                          ✏️
                        </Link>
                        <button
                          onClick={() => setDeleteTarget({ id, name: product.name as string })}
                          className="admin-btn admin-btn-ghost admin-btn-sm"
                          title="Delete"
                          style={{ color: '#ef4444' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="admin-pagination">
              <span>Showing {(page - 1) * 20 + 1}–{Math.min(page * 20, total)} of {total}</span>
              <div className="admin-pagination-controls">
                <button
                  disabled={page <= 1}
                  onClick={() => updateParams({ page: String(page - 1) })}
                  className="admin-pagination-btn"
                >
                  <ChevronLeft size={14} />
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
                  const pageNum = start + i;
                  if (pageNum > totalPages) return null;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => updateParams({ page: String(pageNum) })}
                      className={`admin-pagination-btn ${pageNum === page ? 'admin-pagination-btn-active' : ''}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  disabled={page >= totalPages}
                  onClick={() => updateParams({ page: String(page + 1) })}
                  className="admin-pagination-btn"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? The product will be hidden from the storefront but retained for order history.`}
        confirmLabel="Delete Product"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
