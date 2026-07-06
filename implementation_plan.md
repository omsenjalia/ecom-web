# Ram Chashma Ghar — Admin Panel & Empty Catalog

Full implementation plan for the two client change requests against the existing Next.js 16 + Supabase + Tailwind CSS codebase.

---

## User Review Required

> [!IMPORTANT]
> **Categories table.** The current schema stores `category` as a `CHECK`-constrained text column on `products` (hardcoded to `eyeglasses | sunglasses | reading-glasses | kids`). The admin panel needs a dynamic `categories` CRUD. I'll create a new `categories` table, migrate the existing category values, replace the `CHECK` constraint with a foreign key, and update all storefront queries. This is a schema-level change — please confirm you're OK with this.

> [!IMPORTANT]
> **`customer_profiles` → `user_profiles`.** The CR says `is_admin` goes on `user_profiles`, but the existing table is called `customer_profiles`. I'll add `is_admin` directly to the existing `customer_profiles` table rather than renaming it, to minimize migration risk. The admin check will query `customer_profiles.is_admin`.

> [!IMPORTANT]
> **`product_images.url` → `storage_path`.** The CR mentions a `storage_path` field on `product_images`, but the existing schema uses `url`. I'll add a `storage_path` column and keep `url` for backward compatibility — new admin-uploaded images will populate both (`storage_path` for deletion, `url` for the public URL). Existing Unsplash seed URLs will be wiped by Change 1 anyway.

> [!WARNING]
> **`refunded` status.** The existing `order_status` CHECK doesn't include `refunded`, but the CR mentions filtering by it. I'll add `refunded` to the `order_status` CHECK constraint so the admin can set it.

> [!IMPORTANT]
> **Site settings table.** For the `/admin/settings` page (GST%, shipping fee, free-shipping threshold, WhatsApp number, About/FAQ/Contact page text), I'll create a simple `site_settings` key-value table. Currently these values are hardcoded (e.g. `18` for GST, `999` for free-shipping threshold, `79` for shipping cost). The admin settings page will make these client-editable without code changes.

## Open Questions

> [!IMPORTANT]
> **Supabase Storage bucket.** Is the `product-images` bucket already created in your Supabase project, or do I need to provide instructions for creating it? (The migration SQL can't create storage buckets — that's a dashboard/API action.)

> [!IMPORTANT]
> **Tracking number field.** The existing `orders` table doesn't have a `tracking_number` column. I'll add one. Confirm that a single text field is sufficient (vs. carrier + tracking number separately).

---

## Proposed Changes

### Phase 1 — Database Migration & Auth Gate

The foundation: schema changes, RLS policies, admin auth check, and the admin shell.

---

#### [NEW] [002_admin_schema.sql](file:///home/om/EcomWeb/supabase/migrations/002_admin_schema.sql)

A single migration containing all schema changes:

1. **`categories` table** — `id UUID PK`, `name TEXT NOT NULL UNIQUE`, `slug TEXT NOT NULL UNIQUE`, `description TEXT`, `display_order INT DEFAULT 0`, `is_active BOOLEAN DEFAULT true`, `created_at TIMESTAMPTZ`
2. **Seed the 4 existing categories** into the new table (eyeglasses, sunglasses, reading-glasses, kids)
3. **`products.category`** — drop the CHECK constraint, add `category_id UUID REFERENCES categories(id)`, backfill from existing text values, drop old `category TEXT` column
4. **`customer_profiles.is_admin`** — `ALTER TABLE customer_profiles ADD COLUMN is_admin BOOLEAN DEFAULT false`
5. **`orders.tracking_number`** — `ALTER TABLE orders ADD COLUMN tracking_number TEXT`
6. **`orders.order_status`** — add `refunded` to the CHECK constraint
7. **`product_images.storage_path`** — `ALTER TABLE product_images ADD COLUMN storage_path TEXT`
8. **`products.deleted_at`** — `TIMESTAMPTZ DEFAULT NULL` for soft-delete
9. **`site_settings` table** — `key TEXT PK`, `value TEXT NOT NULL`, `updated_at TIMESTAMPTZ DEFAULT now()`
10. **CHECK constraints** — `base_price > 0`, `mrp >= base_price OR mrp IS NULL` on products; `stock_quantity >= 0` on `product_variants`; `discount_value > 0` on coupons
11. **Trigram index** — `CREATE EXTENSION IF NOT EXISTS pg_trgm; CREATE INDEX idx_products_name_trgm ON products USING gin (name gin_trgm_ops);`
12. **Additional indexes** — `idx_variants_stock ON product_variants(stock_quantity)`, `idx_products_category_id ON products(category_id)`
13. **RLS policies for admin writes** — policies on `products`, `product_variants`, `product_images`, `categories`, `coupons`, `orders` (update), `site_settings` that check `EXISTS (SELECT 1 FROM customer_profiles WHERE user_id = auth.uid() AND is_admin = true)`. Alternative: use the service role key from server actions (the admin API routes already use `createAdminClient()` with the service role key, which bypasses RLS).

**Design decision on RLS vs. server-side guard:** Since all admin mutations will go through Next.js Server Actions that use the service role client (`createAdminClient()`), the RLS policies for admin writes are defense-in-depth rather than the primary gate. The primary gate is the `requireAdmin()` server-side check in each action/route. I'll still add RLS policies for safety.

14. **Postgres functions (RPCs):**
   - `admin_upsert_product(...)` — Atomic function that inserts/updates `products` + `product_variants` + `product_images` in a single transaction, rolling back on any failure
   - `admin_delete_product(product_id UUID)` — Soft-deletes (sets `deleted_at = now()`, `is_active = false`)
   - `adjust_stock(variant_id UUID, delta INT)` — Single code path for all stock changes; uses `UPDATE product_variants SET stock_quantity = stock_quantity + delta WHERE id = variant_id AND stock_quantity + delta >= 0 RETURNING stock_quantity` — returns null if stock would go negative
   - `restore_stock_for_order(order_id UUID)` — Called on cancel/refund, restores stock from `order_items` quantities

---

#### [MODIFY] [proxy.ts](file:///home/om/EcomWeb/src/proxy.ts)

Add admin route protection: for any request to `/admin/*` (except `/admin/login`), check auth + `is_admin` flag. Redirect to `/admin/login` if not authenticated or not admin.

---

#### [NEW] [src/lib/supabase/admin-check.ts](file:///home/om/EcomWeb/src/lib/supabase/admin-check.ts)

`requireAdmin()` utility — used by all admin Server Actions. Gets the current user from the server Supabase client, queries `customer_profiles.is_admin`, throws/redirects if not admin.

---

#### [NEW] [src/app/admin/layout.tsx](file:///home/om/EcomWeb/src/app/admin/layout.tsx)

Admin layout — standalone layout (no storefront Header/Footer). Contains:
- Left sidebar nav: Dashboard / Categories / Products / Orders / Coupons / Settings
- Top bar with admin name + logout
- Clean, professional design using the existing brand colors but styled as a tool UI (not a marketing site)

> [!TIP]
> The admin layout will NOT include the storefront's `<Header>`, `<Footer>`, or `<WhatsAppFAB>`. It uses its own minimal chrome.

---

#### [NEW] [src/app/admin/login/page.tsx](file:///home/om/EcomWeb/src/app/admin/login/page.tsx)

Simple email+password login form. On success, checks `is_admin`; if false, shows error "This account does not have admin access" and signs out. If true, redirects to `/admin`.

---

### Phase 2 — Supabase Storage Utilities

---

#### [NEW] [src/lib/supabase/storage.ts](file:///home/om/EcomWeb/src/lib/supabase/storage.ts)

Reusable upload/delete helpers wrapping the `product-images` bucket:
- `uploadProductImage(file: File, path: string)` — uploads to `product-images/{path}`, returns `{ publicUrl, storagePath }`
- `deleteProductImage(storagePath: string)` — removes from bucket
- `getPublicUrl(storagePath: string)` — generates the public URL

Used by every admin form that handles images.

---

#### [MODIFY] [next.config.ts](file:///home/om/EcomWeb/next.config.ts)

Add the Supabase Storage hostname to `images.remotePatterns` so `<Image>` works with uploaded images:
```ts
{ protocol: "https", hostname: "divasipicyworqvsnuyq.supabase.co" }
```

---

### Phase 3 — Categories CRUD

---

#### [NEW] [src/app/admin/categories/page.tsx](file:///home/om/EcomWeb/src/app/admin/categories/page.tsx)

List all categories with name, slug, product count, active status. Create/edit inline or in a modal. Delete button blocked if products are assigned (clear message: "Reassign or delete the N products in this category first").

#### [NEW] [src/app/admin/categories/actions.ts](file:///home/om/EcomWeb/src/app/admin/categories/actions.ts)

Server Actions: `createCategory`, `updateCategory`, `deleteCategory` (with product-count check + `revalidatePath`).

---

### Phase 4 — Products CRUD (the big one)

---

#### [NEW] [src/app/admin/products/page.tsx](file:///home/om/EcomWeb/src/app/admin/products/page.tsx)

Full product list with:
- **Server-side pagination** — `LIMIT`/`OFFSET` with page controls, 20 rows per page
- **Search** — debounced input → server query using `ILIKE` or trigram search
- **Filters** — category dropdown, active/inactive toggle, stock level (all / low stock / out of stock)
- **Sortable columns** — name, price, stock, date added (via query params)
- **Thumbnail** — small lazy-loaded primary image
- **Bulk actions** — checkbox select → bulk activate/deactivate, bulk category reassign, bulk delete
- Each row links to edit page

#### [NEW] [src/app/admin/products/actions.ts](file:///home/om/EcomWeb/src/app/admin/products/actions.ts)

Server Actions:
- `getProductsPage(page, search, filters, sort)` — paginated query
- `bulkUpdateProducts(ids, updates)` — bulk operations
- `deleteProduct(id)` — soft-delete via RPC

#### [NEW] [src/app/admin/products/new/page.tsx](file:///home/om/EcomWeb/src/app/admin/products/new/page.tsx)

Product creation form:
- Product info: name (auto-generates slug), description, category (dropdown from `categories` table), gender, frame shape, frame material, base_price, MRP, GST%, active/featured toggles
- Variants section: add multiple variants with color_name, color_hex (color picker), size, SKU, stock_quantity, price_override
- Images section per variant: file upload to Supabase Storage, preview, reorder (drag-and-drop or arrows), mark primary, delete
- **Atomic save**: calls the `admin_upsert_product` RPC or a server action that wraps everything in a transaction
- Inline validation: no empty name, price > 0, stock >= 0, at least one variant
- On success: `revalidatePath('/shop')`, `revalidatePath('/')`, redirect to product list

#### [NEW] [src/app/admin/products/[id]/edit/page.tsx](file:///home/om/EcomWeb/src/app/admin/products/%5Bid%5D/edit/page.tsx)

Same form as creation, pre-populated with existing data. Handles:
- Adding/removing variants
- Adding/removing images (with Storage cleanup on delete)
- Updating all fields
- Same atomic save pattern

#### [NEW] [src/app/admin/products/ProductForm.tsx](file:///home/om/EcomWeb/src/app/admin/products/ProductForm.tsx)

Shared form component used by both `new` and `edit` pages.

#### [NEW] [src/app/admin/products/ImageUploader.tsx](file:///home/om/EcomWeb/src/app/admin/products/ImageUploader.tsx)

Reusable image upload component with:
- File picker with preview
- Upload progress indicator
- Reorder via up/down arrows
- Primary image toggle
- Delete with confirmation

---

### Phase 5 — Dashboard

---

#### [NEW] [src/app/admin/page.tsx](file:///home/om/EcomWeb/src/app/admin/page.tsx)

Dashboard showing:
- Today's order count and revenue
- Recent orders (last 10)
- Low stock alerts (variants with `stock_quantity < 5`)
- Total product count (active vs total)
- Quick links to common actions

#### [NEW] [src/app/admin/dashboard-actions.ts](file:///home/om/EcomWeb/src/app/admin/dashboard-actions.ts)

Server Actions for dashboard data queries.

---

### Phase 6 — Orders Management

---

#### [NEW] [src/app/admin/orders/page.tsx](file:///home/om/EcomWeb/src/app/admin/orders/page.tsx)

Order list with:
- Filter by order_status (tabs or dropdown)
- Filter by payment_status
- Pagination
- Shows: order number, date, customer name, total, status, payment status

#### [NEW] [src/app/admin/orders/[id]/page.tsx](file:///home/om/EcomWeb/src/app/admin/orders/%5Bid%5D/page.tsx)

Order detail view:
- Line items with snapshots
- Customer info + shipping address
- Payment details
- Status update dropdown (with allowed transitions)
- Tracking number input
- Mark shipped/delivered buttons
- Cancel order (with stock restoration via `restore_stock_for_order` RPC)

#### [NEW] [src/app/admin/orders/actions.ts](file:///home/om/EcomWeb/src/app/admin/orders/actions.ts)

Server Actions: `getOrders`, `getOrderDetail`, `updateOrderStatus`, `addTrackingNumber`, `cancelOrder` (triggers stock restoration + `revalidatePath`).

---

### Phase 7 — Coupons CRUD

---

#### [NEW] [src/app/admin/coupons/page.tsx](file:///home/om/EcomWeb/src/app/admin/coupons/page.tsx)

Coupon list + create/edit modal:
- Code, type (percent/flat), value, min order, max discount, validity dates, usage limit/used count, active toggle
- Delete/deactivate with confirmation

#### [NEW] [src/app/admin/coupons/actions.ts](file:///home/om/EcomWeb/src/app/admin/coupons/actions.ts)

Server Actions: `getCoupons`, `createCoupon`, `updateCoupon`, `deleteCoupon` + `revalidatePath`.

---

### Phase 8 — Settings Page

---

#### [NEW] [src/app/admin/settings/page.tsx](file:///home/om/EcomWeb/src/app/admin/settings/page.tsx)

Key-value settings editor:
- GST % (default 18)
- Shipping fee (default ₹79)
- Free shipping threshold (default ₹999)
- WhatsApp number
- About page text
- FAQ page text
- Contact page text

#### [NEW] [src/app/admin/settings/actions.ts](file:///home/om/EcomWeb/src/app/admin/settings/actions.ts)

Server Actions: `getSettings`, `updateSettings` + cache invalidation.

#### [MODIFY] [src/app/api/checkout/create-order/route.ts](file:///home/om/EcomWeb/src/app/api/checkout/create-order/route.ts)

Read GST%, shipping fee, and free-shipping threshold from `site_settings` instead of hardcoded values.

#### [MODIFY] [src/app/api/checkout/cod-order/route.ts](file:///home/om/EcomWeb/src/app/api/checkout/cod-order/route.ts)

Same — dynamic settings.

---

### Phase 9 — Storefront Updates (Change 1 + Category FK)

---

#### [MODIFY] [src/app/page.tsx](file:///home/om/EcomWeb/src/app/page.tsx)

- Featured products section: already handles `length === 0` gracefully (hidden)
- Categories section: load from `categories` table instead of hardcoded array
- Add empty state for when no categories exist yet

#### [MODIFY] [src/app/shop/page.tsx](file:///home/om/EcomWeb/src/app/shop/page.tsx)

- Update query to join `categories` table instead of using the old `category` text column
- Empty state already exists ("No frames found") — enhance copy: "New arrivals coming soon! Our collection is being updated."

#### [MODIFY] [src/app/shop/[category]/page.tsx](file:///home/om/EcomWeb/src/app/shop/%5Bcategory%5D/page.tsx)

- Update to use `categories.slug` lookup instead of hardcoded `categoryMeta`
- Dynamic metadata from the categories table

#### [MODIFY] [src/app/product/[slug]/page.tsx](file:///home/om/EcomWeb/src/app/product/%5Bslug%5D/page.tsx)

- Update category reference to use joined category name
- Ensure `deleted_at IS NULL` filter is applied

#### [MODIFY] [src/lib/types.ts](file:///home/om/EcomWeb/src/lib/types.ts)

- Update `Product` interface: `category` → `category_id`, add `category?: CategoryRecord`
- Add `CategoryRecord` interface
- Add `SiteSetting` interface
- Update `OrderStatus` to include `refunded`

#### [MODIFY] [src/components/ProductCard.tsx](file:///home/om/EcomWeb/src/components/ProductCard.tsx)

- Update to use `product.category?.name` instead of `product.category`

#### [MODIFY] [src/components/ProductDetailClient.tsx](file:///home/om/EcomWeb/src/components/ProductDetailClient.tsx)

- Same category display update

#### [MODIFY] [src/components/ProductFilters.tsx](file:///home/om/EcomWeb/src/components/ProductFilters.tsx)

- Load categories from DB instead of hardcoded

#### [NEW] [supabase/clear_seed_data.sql](file:///home/om/EcomWeb/supabase/clear_seed_data.sql)

Script to delete all seed product data:
```sql
DELETE FROM product_images;
DELETE FROM product_variants;
DELETE FROM products;
DELETE FROM coupons;
```
This is a one-time script, not a migration — run it manually after the schema migration.

---

### Phase 10 — Cache Invalidation

---

#### [NEW] [src/lib/revalidate.ts](file:///home/om/EcomWeb/src/lib/revalidate.ts)

Central cache-busting helper:
```ts
export function revalidateStorefront() {
  revalidatePath('/');
  revalidatePath('/shop');
  revalidatePath('/shop/[category]', 'page');
}

export function revalidateProduct(slug: string) {
  revalidatePath(`/product/${slug}`);
  revalidateStorefront();
}
```

Called by every admin mutation that touches customer-facing data.

---

### Phase 11 — Admin UI Components

Shared components used across admin pages:

#### [NEW] [src/app/admin/components/AdminSidebar.tsx](file:///home/om/EcomWeb/src/app/admin/components/AdminSidebar.tsx)

Left sidebar navigation.

#### [NEW] [src/app/admin/components/AdminHeader.tsx](file:///home/om/EcomWeb/src/app/admin/components/AdminHeader.tsx)

Top bar with page title + admin user info + logout.

#### [NEW] [src/app/admin/components/DataTable.tsx](file:///home/om/EcomWeb/src/app/admin/components/DataTable.tsx)

Reusable data table with sorting, pagination, selection.

#### [NEW] [src/app/admin/components/ConfirmDialog.tsx](file:///home/om/EcomWeb/src/app/admin/components/ConfirmDialog.tsx)

Modal confirmation for destructive actions.

#### [NEW] [src/app/admin/components/FormField.tsx](file:///home/om/EcomWeb/src/app/admin/components/FormField.tsx)

Reusable form field with label + inline error display.

#### [NEW] [src/app/admin/components/StatusBadge.tsx](file:///home/om/EcomWeb/src/app/admin/components/StatusBadge.tsx)

Color-coded status badges for orders/products.

---

## Build Order

Following the CR's suggested order:

| Step | Phase | Est. Files |
|------|-------|-----------|
| 1 | DB migration + admin auth gate + login + layout shell | 5 |
| 2 | Storage upload/delete utility | 2 |
| 3 | Categories CRUD | 3 |
| 4 | Products CRUD (with pagination/search from the start) | 8 |
| 5 | Dashboard | 2 |
| 6 | Orders management | 4 |
| 7 | Coupons CRUD | 2 |
| 8 | Settings page + dynamic settings in checkout | 4 |
| 9 | Storefront updates (category FK, empty states, clear seed) | 8 |
| 10 | Data integrity pass (test atomic writes, stock race, category delete block) | — |

---

## Verification Plan

### Automated Tests

Tests will be verified by manually running through the functional checklist from the CR in the browser.

### Manual Verification

Matching the CR's functional checklist:

- [ ] Admin login blocks non-admin accounts
- [ ] Category CRUD works, delete blocked if products assigned
- [ ] Product create with 2+ variants and 2+ images, atomic save, storefront renders correctly
- [ ] Price edit reflects on storefront immediately (no stale cache)
- [ ] Image delete removes from Supabase Storage bucket
- [ ] Deactivated product hidden from storefront, visible in admin
- [ ] Order filters work, status/tracking updates reflect on customer order page
- [ ] Low-stock alerts show real data
- [ ] Coupon create/edit/deactivate reflected at checkout
- [ ] Form validation prevents bad data (negative price, empty name, etc.)
- [ ] Atomic rollback on partial failure
- [ ] Category delete with assigned products is blocked
- [ ] Soft-deleted product doesn't corrupt past order line items
- [ ] Stock never goes negative on concurrent orders
- [ ] Product list performant with 100+ rows
- [ ] Build succeeds with `next build`
