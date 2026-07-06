// ─── Database types for Ram Chashma Ghar ───

export type CategorySlug = 'eyeglasses' | 'sunglasses' | 'reading-glasses' | 'kids' | string;
export type Gender = 'men' | 'women' | 'unisex' | 'kids';
export type FrameShape = 'round' | 'rectangular' | 'aviator' | 'cat-eye' | 'wayfarer' | 'square' | 'oval' | 'geometric';
export type FrameMaterial = 'acetate' | 'metal' | 'titanium' | 'tr90' | 'wood' | 'mixed';
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'razorpay' | 'cod';
export type DiscountType = 'percent' | 'flat';

export interface CategoryRecord {
  id: string;
  name: string;
  slug: string;
  description: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  product_count?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string; // kept for backward compat
  category_id: string | null;
  gender: Gender;
  frame_shape: FrameShape;
  frame_material: FrameMaterial;
  base_price: number;
  mrp: number | null;
  is_active: boolean;
  deleted_at: string | null;
  created_at: string;
  variants?: ProductVariant[];
  images?: ProductImage[];
  categories?: CategoryRecord; // joined
}

export interface ProductVariant {
  id: string;
  product_id: string;
  color_name: string;
  color_hex: string;
  size: string;
  sku: string;
  price_override: number | null;
  stock_quantity: number;
  is_active: boolean;
}

export interface ProductImage {
  id: string;
  product_id: string;
  variant_id: string | null;
  url: string;
  alt_text: string;
  display_order: number;
  is_primary: boolean;
  storage_path: string | null;
}

export interface CustomerProfile {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  is_admin: boolean;
  created_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  label: string;
  full_name: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: DiscountType;
  discount_value: number;
  min_order_value: number;
  max_discount: number | null;
  valid_from: string;
  valid_until: string;
  usage_limit: number;
  times_used: number;
  is_active: boolean;
}

export interface Order {
  id: string;
  user_id: string | null;
  guest_email: string | null;
  guest_phone: string | null;
  order_number: string;
  shipping_address_snapshot: AddressSnapshot;
  subtotal: number;
  discount_amount: number;
  coupon_code_used: string | null;
  gst_amount: number;
  shipping_cost: number;
  total: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  razorpay_signature: string | null;
  order_status: OrderStatus;
  tracking_number: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  customer_profiles?: CustomerProfile;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_name_snapshot: string;
  variant_info_snapshot: string;
  product_slug_snapshot: string;
  image_url_snapshot: string;
  quantity: number;
  unit_price_snapshot: number;
  total_price: number;
}

export interface AddressSnapshot {
  full_name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface SiteSetting {
  key: string;
  value: string;
  updated_at: string;
}

// ─── Cart types (client-side) ───

export interface CartItem {
  product_id: string;
  variant_id: string;
  product_name: string;
  product_slug: string;
  variant_info: string;
  color_name: string;
  color_hex: string;
  size: string;
  image_url: string;
  price: number;
  mrp: number | null;
  quantity: number;
  stock_quantity: number;
}

// ─── Filter types ───

export interface ProductFilters {
  category?: string;
  gender?: Gender;
  frame_shape?: FrameShape;
  price_min?: number;
  price_max?: number;
  search?: string;
}

// ─── Admin types ───

export interface AdminProductListItem {
  id: string;
  name: string;
  slug: string;
  base_price: number;
  mrp: number | null;
  is_active: boolean;
  deleted_at: string | null;
  created_at: string;
  category_id: string | null;
  categories: CategoryRecord | null;
  variants: { id: string; stock_quantity: number; sku: string }[];
  images: { id: string; url: string; is_primary: boolean }[];
}

export interface AdminProductFormData {
  id?: string;
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
  variants: AdminVariantFormData[];
  images: AdminImageFormData[];
}

export interface AdminVariantFormData {
  id?: string;
  color_name: string;
  color_hex: string;
  size: string;
  sku: string;
  price_override: number | null;
  stock_quantity: number;
  is_active: boolean;
}

export interface AdminImageFormData {
  id?: string;
  url: string;
  alt_text: string;
  display_order: number;
  is_primary: boolean;
  storage_path: string | null;
  variant_id: string | null;
  file?: File; // for new uploads
}
