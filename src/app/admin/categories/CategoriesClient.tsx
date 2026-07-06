'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react';
import { createCategory, updateCategory, deleteCategory } from './actions';
import ConfirmDialog from '../components/ConfirmDialog';
import type { CategoryRecord } from '@/lib/types';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

interface Props {
  initialCategories: (CategoryRecord & { product_count?: number })[];
}

export default function CategoriesClient({ initialCategories }: Props) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<(CategoryRecord & { product_count?: number }) | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [slugManual, setSlugManual] = useState(false);

  const resetForm = () => {
    setName('');
    setSlug('');
    setDescription('');
    setDisplayOrder(categories.length);
    setIsActive(true);
    setSlugManual(false);
    setEditingId(null);
    setError('');
  };

  const openCreate = () => {
    resetForm();
    setDisplayOrder(categories.length + 1);
    setShowForm(true);
  };

  const openEdit = (cat: CategoryRecord) => {
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setDisplayOrder(cat.display_order);
    setIsActive(cat.is_active);
    setSlugManual(true);
    setEditingId(cat.id);
    setShowForm(true);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = {
        name,
        slug: slug || slugify(name),
        description,
        display_order: displayOrder,
        is_active: isActive,
      };

      if (editingId) {
        await updateCategory(editingId, formData);
      } else {
        await createCategory(formData);
      }

      setShowForm(false);
      resetForm();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCategory(deleteTarget.id);
      setDeleteTarget(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Categories</h1>
          <p className="admin-page-subtitle">{categories.length} categories</p>
        </div>
        <button onClick={openCreate} className="admin-btn admin-btn-primary">
          <Plus size={16} /> Add Category
        </button>
      </div>

      {error && (
        <div className="admin-login-error" style={{ marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
          <h2 className="admin-section-title">
            {editingId ? 'Edit Category' : 'New Category'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="admin-grid-2">
              <div className="admin-form-group">
                <label htmlFor="cat-name" className="admin-label">Name</label>
                <input
                  id="cat-name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!slugManual) setSlug(slugify(e.target.value));
                  }}
                  required
                  placeholder="e.g. Sunglasses"
                  className="admin-input"
                />
              </div>
              <div className="admin-form-group">
                <label htmlFor="cat-slug" className="admin-label">Slug</label>
                <input
                  id="cat-slug"
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    setSlugManual(true);
                  }}
                  required
                  placeholder="e.g. sunglasses"
                  className="admin-input"
                />
                <p className="admin-help-text">URL-friendly identifier, auto-generated from name</p>
              </div>
            </div>

            <div className="admin-form-group">
              <label htmlFor="cat-desc" className="admin-label">Description</label>
              <input
                id="cat-desc"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description for this category"
                className="admin-input"
              />
            </div>

            <div className="admin-grid-2">
              <div className="admin-form-group">
                <label htmlFor="cat-order" className="admin-label">Display Order</label>
                <input
                  id="cat-order"
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                  className="admin-input"
                  min={0}
                />
              </div>
              <div className="admin-form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
                <label className="admin-checkbox-label">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="admin-checkbox"
                  />
                  Active (visible on storefront)
                </label>
              </div>
            </div>

            <div className="admin-form-actions">
              <button
                type="button"
                onClick={() => { setShowForm(false); resetForm(); }}
                className="admin-btn admin-btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" disabled={loading} className="admin-btn admin-btn-primary">
                {loading ? <><span className="admin-spinner" /> Saving...</> : editingId ? 'Update Category' : 'Create Category'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      {categories.length === 0 ? (
        <div className="admin-card">
          <div className="admin-empty">
            <div className="admin-empty-icon">📁</div>
            <p className="admin-empty-title">No categories yet</p>
            <p className="admin-empty-text">Create your first category to start organizing products.</p>
          </div>
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 40 }}></th>
                <th>Name</th>
                <th>Slug</th>
                <th>Products</th>
                <th>Order</th>
                <th>Status</th>
                <th style={{ width: 100 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td><GripVertical size={14} className="admin-text-muted" /></td>
                  <td style={{ fontWeight: 600 }}>{cat.name}</td>
                  <td className="admin-text-muted">{cat.slug}</td>
                  <td>{cat.product_count || 0}</td>
                  <td>{cat.display_order}</td>
                  <td>
                    <span className={`admin-badge ${cat.is_active ? 'admin-badge-success' : 'admin-badge-muted'}`}>
                      {cat.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="admin-flex-center">
                      <button
                        onClick={() => openEdit(cat)}
                        className="admin-btn admin-btn-ghost admin-btn-sm"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(cat)}
                        className="admin-btn admin-btn-ghost admin-btn-sm"
                        title="Delete"
                        style={{ color: '#ef4444' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Category"
        message={
          deleteTarget?.product_count && deleteTarget.product_count > 0
            ? `This category has ${deleteTarget.product_count} product${deleteTarget.product_count > 1 ? 's' : ''} assigned. Reassign or delete them before deleting this category.`
            : `Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`
        }
        confirmLabel="Delete Category"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
