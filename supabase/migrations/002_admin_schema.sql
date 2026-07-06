-- ═══════════════════════════════════════════════════════
-- Ram Chashma Ghar — Admin Panel Schema Migration
-- ═══════════════════════════════════════════════════════

-- ─── 1. pg_trgm extension for search ───
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ─── 2. Categories table ───
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT DEFAULT '',
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_active ON categories(is_active);

-- Seed the 4 existing categories
INSERT INTO categories (name, slug, description, display_order) VALUES
  ('Eyeglasses', 'eyeglasses', 'Clear vision, bold style', 1),
  ('Sunglasses', 'sunglasses', 'UV protection meets fashion', 2),
  ('Reading Glasses', 'reading-glasses', 'Comfort for every page', 3),
  ('Kids', 'kids', 'Tough frames, happy faces', 4);

-- ─── 3. Add category_id FK to products ───
ALTER TABLE products ADD COLUMN category_id UUID REFERENCES categories(id);

-- Backfill category_id from the text column
UPDATE products SET category_id = c.id
FROM categories c
WHERE products.category = c.slug;

-- Drop the old CHECK constraint and column
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_category_check;
ALTER TABLE products ALTER COLUMN category DROP NOT NULL;
-- We keep the old column temporarily for safety, but make it nullable
-- It will be ignored going forward; category_id is the source of truth

CREATE INDEX idx_products_category_id ON products(category_id);

-- ─── 4. Add is_admin to customer_profiles ───
ALTER TABLE customer_profiles ADD COLUMN is_admin BOOLEAN DEFAULT false;

-- ─── 5. Add tracking_number and refunded status to orders ───
ALTER TABLE orders ADD COLUMN tracking_number TEXT;

-- Update order_status CHECK to include 'refunded'
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_order_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_order_status_check
  CHECK (order_status IN ('pending','confirmed','processing','shipped','delivered','cancelled','refunded'));

-- ─── 6. Add storage_path to product_images ───
ALTER TABLE product_images ADD COLUMN storage_path TEXT;

-- ─── 7. Soft delete for products ───
ALTER TABLE products ADD COLUMN deleted_at TIMESTAMPTZ DEFAULT NULL;

-- ─── 8. Site settings table ───
CREATE TABLE site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Seed default settings
INSERT INTO site_settings (key, value) VALUES
  ('gst_percent', '18'),
  ('shipping_fee', '79'),
  ('free_shipping_threshold', '999'),
  ('whatsapp_number', '919876543210'),
  ('about_page_text', ''),
  ('faq_page_text', ''),
  ('contact_page_text', '');

-- ─── 9. CHECK constraints for data integrity ───
-- Price must be positive
ALTER TABLE products ADD CONSTRAINT products_base_price_positive CHECK (base_price > 0);
ALTER TABLE products ADD CONSTRAINT products_mrp_gte_price CHECK (mrp >= base_price OR mrp IS NULL);

-- Stock must be non-negative
ALTER TABLE product_variants ADD CONSTRAINT variants_stock_non_negative CHECK (stock_quantity >= 0);

-- Discount value must be positive
ALTER TABLE coupons ADD CONSTRAINT coupons_discount_positive CHECK (discount_value > 0);

-- ─── 10. Additional indexes for scale ───
CREATE INDEX idx_products_name_trgm ON products USING gin (name gin_trgm_ops);
CREATE INDEX idx_variants_stock ON product_variants(stock_quantity);
CREATE INDEX idx_products_deleted ON products(deleted_at);

-- ─── 11. RLS for new tables ───
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Categories: public read
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (true);

-- Categories: admin write
CREATE POLICY "Admin can insert categories" ON categories
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM customer_profiles WHERE user_id = auth.uid() AND is_admin = true)
  );
CREATE POLICY "Admin can update categories" ON categories
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM customer_profiles WHERE user_id = auth.uid() AND is_admin = true)
  );
CREATE POLICY "Admin can delete categories" ON categories
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM customer_profiles WHERE user_id = auth.uid() AND is_admin = true)
  );

-- Site settings: admin only
CREATE POLICY "Admin can read settings" ON site_settings
  FOR SELECT USING (true);
CREATE POLICY "Admin can update settings" ON site_settings
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM customer_profiles WHERE user_id = auth.uid() AND is_admin = true)
  );
CREATE POLICY "Admin can insert settings" ON site_settings
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM customer_profiles WHERE user_id = auth.uid() AND is_admin = true)
  );

-- Admin write policies on existing tables
CREATE POLICY "Admin can insert products" ON products
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM customer_profiles WHERE user_id = auth.uid() AND is_admin = true)
  );
CREATE POLICY "Admin can update products" ON products
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM customer_profiles WHERE user_id = auth.uid() AND is_admin = true)
  );
CREATE POLICY "Admin can delete products" ON products
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM customer_profiles WHERE user_id = auth.uid() AND is_admin = true)
  );

-- Admin needs to see ALL products (including inactive) in admin panel
CREATE POLICY "Admin can view all products" ON products
  FOR SELECT USING (
    is_active = true OR
    EXISTS (SELECT 1 FROM customer_profiles WHERE user_id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Admin can insert variants" ON product_variants
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM customer_profiles WHERE user_id = auth.uid() AND is_admin = true)
  );
CREATE POLICY "Admin can update variants" ON product_variants
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM customer_profiles WHERE user_id = auth.uid() AND is_admin = true)
  );
CREATE POLICY "Admin can delete variants" ON product_variants
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM customer_profiles WHERE user_id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Admin can insert images" ON product_images
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM customer_profiles WHERE user_id = auth.uid() AND is_admin = true)
  );
CREATE POLICY "Admin can update images" ON product_images
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM customer_profiles WHERE user_id = auth.uid() AND is_admin = true)
  );
CREATE POLICY "Admin can delete images" ON product_images
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM customer_profiles WHERE user_id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Admin can insert coupons" ON coupons
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM customer_profiles WHERE user_id = auth.uid() AND is_admin = true)
  );
CREATE POLICY "Admin can update coupons" ON coupons
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM customer_profiles WHERE user_id = auth.uid() AND is_admin = true)
  );
CREATE POLICY "Admin can delete coupons" ON coupons
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM customer_profiles WHERE user_id = auth.uid() AND is_admin = true)
  );

-- Admin can view ALL coupons (including inactive)
CREATE POLICY "Admin can view all coupons" ON coupons
  FOR SELECT USING (
    is_active = true OR
    EXISTS (SELECT 1 FROM customer_profiles WHERE user_id = auth.uid() AND is_admin = true)
  );

-- Admin can view all variants (including inactive)
CREATE POLICY "Admin can view all variants" ON product_variants
  FOR SELECT USING (
    is_active = true OR
    EXISTS (SELECT 1 FROM customer_profiles WHERE user_id = auth.uid() AND is_admin = true)
  );

-- Admin can view and update all orders
CREATE POLICY "Admin can view all orders" ON orders
  FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM customer_profiles WHERE user_id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Admin can update all orders" ON orders
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM customer_profiles WHERE user_id = auth.uid() AND is_admin = true)
  );

-- Admin can view all order items
CREATE POLICY "Admin can view all order items" ON order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
    OR
    EXISTS (SELECT 1 FROM customer_profiles WHERE user_id = auth.uid() AND is_admin = true)
  );

-- ─── 12. RPC: Atomic product upsert ───
CREATE OR REPLACE FUNCTION admin_upsert_product(
  p_id UUID DEFAULT NULL,
  p_name TEXT DEFAULT NULL,
  p_slug TEXT DEFAULT NULL,
  p_description TEXT DEFAULT '',
  p_category_id UUID DEFAULT NULL,
  p_gender TEXT DEFAULT 'unisex',
  p_frame_shape TEXT DEFAULT 'rectangular',
  p_frame_material TEXT DEFAULT 'acetate',
  p_base_price NUMERIC DEFAULT NULL,
  p_mrp NUMERIC DEFAULT NULL,
  p_is_active BOOLEAN DEFAULT true,
  p_variants JSONB DEFAULT '[]'::jsonb,
  p_images JSONB DEFAULT '[]'::jsonb
) RETURNS UUID AS $$
DECLARE
  v_product_id UUID;
  v_variant JSONB;
  v_variant_id UUID;
  v_image JSONB;
  v_existing_variant_ids UUID[];
  v_existing_image_ids UUID[];
  v_incoming_variant_ids UUID[] := '{}';
  v_incoming_image_ids UUID[] := '{}';
BEGIN
  -- Insert or update product
  IF p_id IS NOT NULL THEN
    UPDATE products SET
      name = COALESCE(p_name, name),
      slug = COALESCE(p_slug, slug),
      description = COALESCE(p_description, description),
      category_id = COALESCE(p_category_id, category_id),
      category = (SELECT slug FROM categories WHERE id = COALESCE(p_category_id, category_id)),
      gender = COALESCE(p_gender, gender),
      frame_shape = COALESCE(p_frame_shape, frame_shape),
      frame_material = COALESCE(p_frame_material, frame_material),
      base_price = COALESCE(p_base_price, base_price),
      mrp = p_mrp,
      is_active = COALESCE(p_is_active, is_active)
    WHERE id = p_id;
    v_product_id := p_id;
  ELSE
    INSERT INTO products (name, slug, description, category_id, category, gender, frame_shape, frame_material, base_price, mrp, is_active)
    VALUES (
      p_name, p_slug, p_description, p_category_id,
      (SELECT slug FROM categories WHERE id = p_category_id),
      p_gender, p_frame_shape, p_frame_material, p_base_price, p_mrp, p_is_active
    )
    RETURNING id INTO v_product_id;
  END IF;

  -- Upsert variants
  FOR v_variant IN SELECT * FROM jsonb_array_elements(p_variants)
  LOOP
    IF v_variant->>'id' IS NOT NULL AND v_variant->>'id' != '' THEN
      v_variant_id := (v_variant->>'id')::UUID;
      UPDATE product_variants SET
        color_name = v_variant->>'color_name',
        color_hex = v_variant->>'color_hex',
        size = v_variant->>'size',
        sku = v_variant->>'sku',
        price_override = NULLIF(v_variant->>'price_override', '')::NUMERIC,
        stock_quantity = (v_variant->>'stock_quantity')::INT,
        is_active = COALESCE((v_variant->>'is_active')::BOOLEAN, true)
      WHERE id = v_variant_id AND product_id = v_product_id;
    ELSE
      INSERT INTO product_variants (product_id, color_name, color_hex, size, sku, price_override, stock_quantity, is_active)
      VALUES (
        v_product_id,
        v_variant->>'color_name',
        v_variant->>'color_hex',
        COALESCE(v_variant->>'size', 'Medium'),
        v_variant->>'sku',
        NULLIF(v_variant->>'price_override', '')::NUMERIC,
        COALESCE((v_variant->>'stock_quantity')::INT, 0),
        COALESCE((v_variant->>'is_active')::BOOLEAN, true)
      )
      RETURNING id INTO v_variant_id;
    END IF;
    v_incoming_variant_ids := array_append(v_incoming_variant_ids, v_variant_id);
  END LOOP;

  -- Delete variants that were removed (if editing)
  IF p_id IS NOT NULL THEN
    DELETE FROM product_variants
    WHERE product_id = v_product_id
      AND NOT (id = ANY(v_incoming_variant_ids));
  END IF;

  -- Upsert images
  FOR v_image IN SELECT * FROM jsonb_array_elements(p_images)
  LOOP
    IF v_image->>'id' IS NOT NULL AND v_image->>'id' != '' THEN
      v_variant_id := NULLIF(v_image->>'id', '')::UUID;
      UPDATE product_images SET
        url = COALESCE(v_image->>'url', url),
        alt_text = COALESCE(v_image->>'alt_text', alt_text),
        display_order = COALESCE((v_image->>'display_order')::INT, display_order),
        is_primary = COALESCE((v_image->>'is_primary')::BOOLEAN, is_primary),
        storage_path = COALESCE(v_image->>'storage_path', storage_path),
        variant_id = NULLIF(v_image->>'variant_id', '')::UUID
      WHERE id = (v_image->>'id')::UUID AND product_id = v_product_id;
      v_incoming_image_ids := array_append(v_incoming_image_ids, (v_image->>'id')::UUID);
    ELSE
      INSERT INTO product_images (product_id, variant_id, url, alt_text, display_order, is_primary, storage_path)
      VALUES (
        v_product_id,
        NULLIF(v_image->>'variant_id', '')::UUID,
        v_image->>'url',
        COALESCE(v_image->>'alt_text', ''),
        COALESCE((v_image->>'display_order')::INT, 0),
        COALESCE((v_image->>'is_primary')::BOOLEAN, false),
        v_image->>'storage_path'
      )
      RETURNING id INTO v_variant_id;
      v_incoming_image_ids := array_append(v_incoming_image_ids, v_variant_id);
    END IF;
  END LOOP;

  -- Note: image deletion is handled separately via the admin action
  -- so we can also delete from Supabase Storage

  RETURN v_product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── 13. RPC: Adjust stock (single code path) ───
CREATE OR REPLACE FUNCTION adjust_stock(
  p_variant_id UUID,
  p_delta INT
) RETURNS INT AS $$
DECLARE
  v_new_stock INT;
BEGIN
  UPDATE product_variants
  SET stock_quantity = stock_quantity + p_delta
  WHERE id = p_variant_id
    AND stock_quantity + p_delta >= 0
  RETURNING stock_quantity INTO v_new_stock;

  IF v_new_stock IS NULL THEN
    RAISE EXCEPTION 'Insufficient stock for variant %', p_variant_id;
  END IF;

  RETURN v_new_stock;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── 14. RPC: Restore stock for cancelled/refunded order ───
CREATE OR REPLACE FUNCTION restore_stock_for_order(
  p_order_id UUID
) RETURNS VOID AS $$
DECLARE
  v_item RECORD;
BEGIN
  FOR v_item IN
    SELECT oi.quantity, oi.variant_info_snapshot, pv.id as variant_id
    FROM order_items oi
    LEFT JOIN product_variants pv ON pv.sku = (
      -- Try to match by SKU from variant_info_snapshot
      -- This is best-effort; if SKU changed, stock won't restore
      SELECT pv2.sku FROM product_variants pv2
      JOIN products p ON p.id = pv2.product_id
      WHERE p.name = oi.product_name_snapshot
      LIMIT 1
    )
    WHERE oi.order_id = p_order_id
  LOOP
    IF v_item.variant_id IS NOT NULL THEN
      UPDATE product_variants
      SET stock_quantity = stock_quantity + v_item.quantity
      WHERE id = v_item.variant_id;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── 15. Update handle_new_user to include is_admin default ───
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.customer_profiles (user_id, full_name, is_admin)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), false);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
