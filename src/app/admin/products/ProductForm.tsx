'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Plus, Trash2, Star, Upload, ArrowUp, ArrowDown, X } from 'lucide-react';
import { saveProduct, uploadImageAction, deleteProductImageAction } from './actions';
import type { CategoryRecord, Gender, FrameShape, FrameMaterial } from '@/lib/types';

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

interface VariantData {
  id?: string;
  color_name: string;
  color_hex: string;
  size: string;
  sku: string;
  price_override: number | null;
  stock_quantity: number;
  is_active: boolean;
}

interface ImageData {
  id?: string;
  url: string;
  alt_text: string;
  display_order: number;
  is_primary: boolean;
  storage_path: string | null;
  variant_id: string | null;
}

const GENDERS: { value: Gender; label: string }[] = [
  { value: 'men', label: 'Men' },
  { value: 'women', label: 'Women' },
  { value: 'unisex', label: 'Unisex' },
  { value: 'kids', label: 'Kids' },
];

const SHAPES: { value: FrameShape; label: string }[] = [
  { value: 'round', label: 'Round' },
  { value: 'rectangular', label: 'Rectangular' },
  { value: 'aviator', label: 'Aviator' },
  { value: 'cat-eye', label: 'Cat-Eye' },
  { value: 'wayfarer', label: 'Wayfarer' },
  { value: 'square', label: 'Square' },
  { value: 'oval', label: 'Oval' },
  { value: 'geometric', label: 'Geometric' },
];

const MATERIALS: { value: FrameMaterial; label: string }[] = [
  { value: 'acetate', label: 'Acetate' },
  { value: 'metal', label: 'Metal' },
  { value: 'titanium', label: 'Titanium' },
  { value: 'tr90', label: 'TR90' },
  { value: 'wood', label: 'Wood' },
  { value: 'mixed', label: 'Mixed' },
];

interface Props {
  categories: CategoryRecord[];
  initialData?: {
    id: string;
    name: string;
    slug: string;
    description: string;
    category_id: string;
    gender: Gender;
    frame_shape: FrameShape;
    frame_material: FrameMaterial;
    base_price: number;
    mrp: number | null;
    is_active: boolean;
    variants: VariantData[];
    images: ImageData[];
  };
}

export default function ProductForm({ categories, initialData }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEdit = !!initialData;

  // Product fields
  const [name, setName] = useState(initialData?.name || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [slugManual, setSlugManual] = useState(isEdit);
  const [description, setDescription] = useState(initialData?.description || '');
  const [categoryId, setCategoryId] = useState(initialData?.category_id || '');
  const [gender, setGender] = useState<Gender>(initialData?.gender || 'unisex');
  const [frameShape, setFrameShape] = useState<FrameShape>(initialData?.frame_shape || 'rectangular');
  const [frameMaterial, setFrameMaterial] = useState<FrameMaterial>(initialData?.frame_material || 'acetate');
  const [basePrice, setBasePrice] = useState(initialData?.base_price || 0);
  const [mrp, setMrp] = useState<number | null>(initialData?.mrp ?? null);
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true);

  // Variants
  const [variants, setVariants] = useState<VariantData[]>(
    initialData?.variants || [{ color_name: '', color_hex: '#000000', size: 'Medium', sku: '', price_override: null, stock_quantity: 10, is_active: true }]
  );

  // Images
  const [images, setImages] = useState<ImageData[]>(initialData?.images || []);
  const [uploadingCount, setUploadingCount] = useState(0);

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Name is required';
    if (!slug.trim()) errs.slug = 'Slug is required';
    if (!categoryId) errs.category = 'Category is required';
    if (basePrice <= 0) errs.price = 'Price must be greater than 0';
    if (mrp !== null && mrp < basePrice) errs.mrp = 'MRP must be ≥ price';
    if (variants.length === 0) errs.variants = 'At least one variant is required';
    variants.forEach((v, i) => {
      if (!v.color_name.trim()) errs[`variant_${i}_color`] = 'Color name required';
      if (!v.sku.trim()) errs[`variant_${i}_sku`] = 'SKU required';
      if (v.stock_quantity < 0) errs[`variant_${i}_stock`] = 'Stock cannot be negative';
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);

    try {
      await saveProduct({
        id: initialData?.id,
        name: name.trim(),
        slug: slug.trim().toLowerCase(),
        description: description.trim(),
        category_id: categoryId,
        gender,
        frame_shape: frameShape,
        frame_material: frameMaterial,
        base_price: basePrice,
        mrp,
        is_active: isActive,
        variants: variants.map((v) => ({
          ...v,
          color_name: v.color_name.trim(),
          sku: v.sku.trim(),
        })),
        images: images.map((img, i) => ({
          ...img,
          display_order: i,
        })),
      });

      router.push('/admin/products');
      router.refresh();
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : 'Save failed' });
    } finally {
      setSaving(false);
    }
  };

  // Variant helpers
  const addVariant = () => {
    setVariants([...variants, { color_name: '', color_hex: '#000000', size: 'Medium', sku: '', price_override: null, stock_quantity: 10, is_active: true }]);
  };

  const updateVariant = (index: number, updates: Partial<VariantData>) => {
    setVariants(variants.map((v, i) => i === index ? { ...v, ...updates } : v));
  };

  const removeVariant = (index: number) => {
    if (variants.length <= 1) return;
    setVariants(variants.filter((_, i) => i !== index));
  };

  // Image helpers
  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return;
    setUploadingCount((c) => c + files.length);

    for (let i = 0; i < files.length; i++) {
      try {
        const formData = new FormData();
        formData.append('file', files[i]);
        const result = await uploadImageAction(formData);

        setImages((prev) => [
          ...prev,
          {
            url: result.url,
            alt_text: name || 'Product image',
            display_order: prev.length,
            is_primary: prev.length === 0,
            storage_path: result.storagePath,
            variant_id: null,
          },
        ]);
      } catch (err) {
        console.error('Upload failed:', err);
      }
      setUploadingCount((c) => c - 1);
    }
  };

  const removeImage = async (index: number) => {
    const img = images[index];
    if (img.id && img.storage_path) {
      await deleteProductImageAction(img.id, img.storage_path);
    } else if (img.storage_path) {
      // New image not yet saved to DB but uploaded to storage
      try {
        await deleteProductImageAction('', img.storage_path);
      } catch { /* ignore */ }
    }
    const newImages = images.filter((_, i) => i !== index);
    // If we removed the primary, make the first one primary
    if (img.is_primary && newImages.length > 0) {
      newImages[0].is_primary = true;
    }
    setImages(newImages);
  };

  const setPrimaryImage = (index: number) => {
    setImages(images.map((img, i) => ({ ...img, is_primary: i === index })));
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= images.length) return;
    const newImages = [...images];
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
    setImages(newImages);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{isEdit ? 'Edit Product' : 'New Product'}</h1>
          <p className="admin-page-subtitle">
            {isEdit ? `Editing: ${initialData?.name}` : 'Fill in the details to create a new product'}
          </p>
        </div>
        <div className="admin-flex-center" style={{ gap: '0.75rem' }}>
          <button type="button" onClick={() => router.back()} className="admin-btn admin-btn-secondary">Cancel</button>
          <button type="submit" disabled={saving} className="admin-btn admin-btn-primary admin-btn-lg">
            {saving ? <><span className="admin-spinner" /> Saving...</> : isEdit ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </div>

      {errors.form && (
        <div className="admin-login-error" style={{ marginBottom: '1rem' }}>{errors.form}</div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem', alignItems: 'start' }}>
        {/* Main column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Basic info */}
          <div className="admin-card">
            <h2 className="admin-section-title">Basic Information</h2>
            <div className="admin-form-group">
              <label htmlFor="p-name" className="admin-label">Product Name</label>
              <input
                id="p-name"
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); if (!slugManual) setSlug(slugify(e.target.value)); }}
                className={`admin-input ${errors.name ? 'admin-input-error' : ''}`}
                placeholder="e.g. Horizon Classic"
              />
              {errors.name && <p className="admin-error-text">{errors.name}</p>}
            </div>
            <div className="admin-form-group">
              <label htmlFor="p-slug" className="admin-label">Slug</label>
              <input
                id="p-slug"
                type="text"
                value={slug}
                onChange={(e) => { setSlug(e.target.value); setSlugManual(true); }}
                className={`admin-input ${errors.slug ? 'admin-input-error' : ''}`}
                placeholder="horizon-classic"
              />
              {errors.slug && <p className="admin-error-text">{errors.slug}</p>}
              <p className="admin-help-text">URL: /product/{slug || '...'}</p>
            </div>
            <div className="admin-form-group">
              <label htmlFor="p-desc" className="admin-label">Description</label>
              <textarea
                id="p-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="admin-textarea"
                placeholder="Describe the product..."
                rows={4}
              />
            </div>
          </div>

          {/* Classification */}
          <div className="admin-card">
            <h2 className="admin-section-title">Classification</h2>
            <div className="admin-grid-2">
              <div className="admin-form-group">
                <label htmlFor="p-cat" className="admin-label">Category</label>
                <select id="p-cat" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={`admin-select ${errors.category ? 'admin-input-error' : ''}`}>
                  <option value="">Select category...</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                {errors.category && <p className="admin-error-text">{errors.category}</p>}
              </div>
              <div className="admin-form-group">
                <label htmlFor="p-gender" className="admin-label">Gender</label>
                <select id="p-gender" value={gender} onChange={(e) => setGender(e.target.value as Gender)} className="admin-select">
                  {GENDERS.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
                </select>
              </div>
              <div className="admin-form-group">
                <label htmlFor="p-shape" className="admin-label">Frame Shape</label>
                <select id="p-shape" value={frameShape} onChange={(e) => setFrameShape(e.target.value as FrameShape)} className="admin-select">
                  {SHAPES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <div className="admin-form-group">
                <label htmlFor="p-mat" className="admin-label">Frame Material</label>
                <select id="p-mat" value={frameMaterial} onChange={(e) => setFrameMaterial(e.target.value as FrameMaterial)} className="admin-select">
                  {MATERIALS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Variants */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h2 className="admin-section-title" style={{ marginBottom: 0 }}>Variants</h2>
              <button type="button" onClick={addVariant} className="admin-btn admin-btn-secondary admin-btn-sm">
                <Plus size={14} /> Add Variant
              </button>
            </div>
            {errors.variants && <p className="admin-error-text" style={{ marginBottom: '0.75rem' }}>{errors.variants}</p>}

            {variants.map((v, i) => (
              <div key={i} className="admin-variant-card">
                <div className="admin-variant-header">
                  <span className="admin-variant-number">
                    <span className="admin-color-preview" style={{ backgroundColor: v.color_hex }} />
                    Variant {i + 1}{v.color_name ? `: ${v.color_name}` : ''}
                  </span>
                  {variants.length > 1 && (
                    <button type="button" onClick={() => removeVariant(i)} className="admin-btn admin-btn-ghost admin-btn-sm" style={{ color: '#ef4444' }}>
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <div className="admin-grid-3">
                  <div className="admin-form-group">
                    <label className="admin-label">Color Name</label>
                    <input
                      type="text"
                      value={v.color_name}
                      onChange={(e) => updateVariant(i, { color_name: e.target.value })}
                      className={`admin-input ${errors[`variant_${i}_color`] ? 'admin-input-error' : ''}`}
                      placeholder="Matte Black"
                    />
                    {errors[`variant_${i}_color`] && <p className="admin-error-text">{errors[`variant_${i}_color`]}</p>}
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Color</label>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input
                        type="color"
                        value={v.color_hex}
                        onChange={(e) => updateVariant(i, { color_hex: e.target.value })}
                        style={{ width: 40, height: 34, padding: 2, cursor: 'pointer', border: '1px solid #d1d5db', borderRadius: 6 }}
                      />
                      <input
                        type="text"
                        value={v.color_hex}
                        onChange={(e) => updateVariant(i, { color_hex: e.target.value })}
                        className="admin-input"
                        style={{ flex: 1 }}
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Size</label>
                    <input type="text" value={v.size} onChange={(e) => updateVariant(i, { size: e.target.value })} className="admin-input" placeholder="Medium" />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">SKU</label>
                    <input
                      type="text"
                      value={v.sku}
                      onChange={(e) => updateVariant(i, { sku: e.target.value })}
                      className={`admin-input ${errors[`variant_${i}_sku`] ? 'admin-input-error' : ''}`}
                      placeholder="HC-BLK-M"
                    />
                    {errors[`variant_${i}_sku`] && <p className="admin-error-text">{errors[`variant_${i}_sku`]}</p>}
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Stock</label>
                    <input
                      type="number"
                      value={v.stock_quantity}
                      onChange={(e) => updateVariant(i, { stock_quantity: parseInt(e.target.value) || 0 })}
                      className={`admin-input ${errors[`variant_${i}_stock`] ? 'admin-input-error' : ''}`}
                      min={0}
                    />
                    {errors[`variant_${i}_stock`] && <p className="admin-error-text">{errors[`variant_${i}_stock`]}</p>}
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Price Override</label>
                    <input
                      type="number"
                      value={v.price_override ?? ''}
                      onChange={(e) => updateVariant(i, { price_override: e.target.value ? parseFloat(e.target.value) : null })}
                      className="admin-input"
                      placeholder="Leave blank for base price"
                      min={0}
                      step={0.01}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Images */}
          <div className="admin-card">
            <h2 className="admin-section-title">Product Images</h2>
            <p className="admin-help-text" style={{ marginBottom: '1rem' }}>
              Upload product images. Click the star to set the primary image. Images are uploaded immediately.
            </p>

            <div className="admin-image-grid">
              {images.map((img, i) => (
                <div key={img.url + i} className={`admin-image-item ${img.is_primary ? 'admin-image-item-primary' : ''}`}>
                  <Image src={img.url} alt={img.alt_text} fill sizes="120px" style={{ objectFit: 'cover' }} />
                  {img.is_primary && (
                    <span style={{ position: 'absolute', top: 4, left: 4, background: '#D4782F', color: 'white', borderRadius: 4, padding: '1px 5px', fontSize: '0.6rem', fontWeight: 700 }}>
                      PRIMARY
                    </span>
                  )}
                  <div className="admin-image-overlay">
                    <button type="button" onClick={() => setPrimaryImage(i)} className="admin-btn admin-btn-ghost admin-btn-sm" style={{ color: 'white' }} title="Set as primary">
                      <Star size={14} />
                    </button>
                    <button type="button" onClick={() => moveImage(i, -1)} className="admin-btn admin-btn-ghost admin-btn-sm" style={{ color: 'white' }} title="Move up" disabled={i === 0}>
                      <ArrowUp size={14} />
                    </button>
                    <button type="button" onClick={() => moveImage(i, 1)} className="admin-btn admin-btn-ghost admin-btn-sm" style={{ color: 'white' }} title="Move down" disabled={i === images.length - 1}>
                      <ArrowDown size={14} />
                    </button>
                    <button type="button" onClick={() => removeImage(i)} className="admin-btn admin-btn-ghost admin-btn-sm" style={{ color: '#ef4444' }} title="Remove">
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))}

              {/* Upload zone */}
              <div
                className="admin-image-upload-zone"
                onClick={() => fileInputRef.current?.click()}
                style={{ aspectRatio: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
              >
                {uploadingCount > 0 ? (
                  <>
                    <span className="admin-spinner" style={{ width: 20, height: 20, marginBottom: '0.5rem' }} />
                    <span className="admin-text-sm admin-text-muted">Uploading {uploadingCount}...</span>
                  </>
                ) : (
                  <>
                    <Upload size={20} style={{ color: '#9ca3af', marginBottom: '0.25rem' }} />
                    <span className="admin-text-sm admin-text-muted">Upload</span>
                  </>
                )}
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFileUpload(e.target.files)}
              style={{ display: 'none' }}
            />
          </div>
        </div>

        {/* Right sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Pricing */}
          <div className="admin-card">
            <h2 className="admin-section-title">Pricing</h2>
            <div className="admin-form-group">
              <label htmlFor="p-price" className="admin-label">Selling Price (₹)</label>
              <input
                id="p-price"
                type="number"
                value={basePrice || ''}
                onChange={(e) => setBasePrice(parseFloat(e.target.value) || 0)}
                className={`admin-input ${errors.price ? 'admin-input-error' : ''}`}
                min={1}
                step={0.01}
                placeholder="2499"
              />
              {errors.price && <p className="admin-error-text">{errors.price}</p>}
            </div>
            <div className="admin-form-group">
              <label htmlFor="p-mrp" className="admin-label">MRP (₹) — optional</label>
              <input
                id="p-mrp"
                type="number"
                value={mrp ?? ''}
                onChange={(e) => setMrp(e.target.value ? parseFloat(e.target.value) : null)}
                className={`admin-input ${errors.mrp ? 'admin-input-error' : ''}`}
                min={0}
                step={0.01}
                placeholder="3999"
              />
              {errors.mrp && <p className="admin-error-text">{errors.mrp}</p>}
              <p className="admin-help-text">If set, shows as crossed-out price with discount %</p>
            </div>
          </div>

          {/* Status */}
          <div className="admin-card">
            <h2 className="admin-section-title">Status</h2>
            <label className="admin-checkbox-label" style={{ marginBottom: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`admin-toggle ${isActive ? 'admin-toggle-active' : ''}`}
              />
              {isActive ? 'Active — visible on storefront' : 'Inactive — hidden from storefront'}
            </label>
          </div>

          {/* Summary */}
          {variants.length > 0 && (
            <div className="admin-card">
              <h2 className="admin-section-title">Summary</h2>
              <div style={{ fontSize: '0.8125rem', color: '#6b7280' }}>
                <p><strong>{variants.length}</strong> variant{variants.length !== 1 ? 's' : ''}</p>
                <p><strong>{images.length}</strong> image{images.length !== 1 ? 's' : ''}</p>
                <p><strong>{variants.reduce((s, v) => s + v.stock_quantity, 0)}</strong> total stock</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
