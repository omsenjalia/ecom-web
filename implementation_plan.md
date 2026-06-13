# Ram Chashma Ghar — Ecommerce Website

Build a complete, production-grade ecommerce website for an Indian eyewear brand using Next.js (App Router), Supabase, Razorpay, and Tailwind CSS. The site must handle the full purchase flow — browsing, filtering, cart, checkout with Razorpay/COD, order tracking — and look like an intentionally-designed brand site, not a template.

## User Review Required

> [!IMPORTANT]
> **Supabase & Razorpay credentials**: I'll scaffold the `.env.local` file with placeholder keys. You'll need to:
> 1. Create a Supabase project at [supabase.com](https://supabase.com) and paste the `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
> 2. Get Razorpay **test mode** keys from [dashboard.razorpay.com](https://dashboard.razorpay.com) — `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`
> 3. Run the SQL migration I generate to set up the database schema

> [!WARNING]
> **Email**: Order confirmation emails require an email service (e.g. Resend). I'll wire up the API route but leave the actual email provider for you to configure — or I can use Resend if you have a key.

---

## Design Direction

**Aesthetic**: *"Warm Indian Luxe"* — earthy, confident, premium

| Token | Value |
|---|---|
| **Palette** | Deep charcoal `#1A1A1A` body, warm cream `#FAF5EF` cards, burnt amber `#D4782F` accent, muted sage `#8A9A7B` secondary, gold `#C9A96E` highlights |
| **Type** | Display: **DM Serif Display** (warm, editorial serif). Body: **Plus Jakarta Sans** (clean, modern, not overused). Both from Google Fonts |
| **Bold design choice** | A horizontal scroll product showcase on the homepage — an infinite ticker/marquee of featured frames that reacts to hover with parallax card tilt. Mobile gets a swipeable carousel instead |
| **Motion** | Subtle but intentional. Scroll-reveal sections, smooth page transitions via `next/navigation`, hover card lifts. No GSAP/Lenis — keeping bundle light for an ecommerce site |
| **Texture** | Subtle noise grain overlay on hero section. Soft gradient mesh backgrounds on feature sections |

---

## Proposed Changes

### Project Initialization

#### [NEW] Next.js App (root of `/home/om/EcomWeb`)

Initialize with `npx create-next-app@latest ./ --ts --tailwind --eslint --app --src-dir --import-alias "@/*"`.

Install dependencies:
- `@supabase/supabase-js`, `@supabase/ssr` — Supabase client + server-side auth
- `razorpay` — server-side Razorpay SDK
- `zustand` — lightweight cart state management
- `react-hot-toast` — toast notifications
- `zod` — form validation schemas
- `lucide-react` — icons

---

### Design System & Layout

#### [NEW] `tailwind.config.ts`
Extended theme with brand colors, fonts, spacing tokens.

#### [NEW] `src/app/layout.tsx`
Root layout with Google Fonts, global providers, metadata.

#### [NEW] `src/app/globals.css`
Tailwind directives + custom CSS (noise texture, scrollbar, brand utilities).

#### [NEW] `src/components/layout/Header.tsx`
Sticky header with logo, nav links (Shop, About, Contact), cart icon with item count badge, account/login link. Mobile hamburger menu.

#### [NEW] `src/components/layout/Footer.tsx`
Brand info, quick links, trust signals (returns policy, GST info, contact), WhatsApp link, social media.

#### [NEW] `src/components/layout/MobileNav.tsx`
Full-screen mobile navigation overlay.

#### [NEW] `src/components/layout/WhatsAppFAB.tsx`
Floating WhatsApp button on all pages (bottom-right corner, always visible).

---

### Supabase Backend

#### [NEW] `supabase/migrations/001_schema.sql`
Complete database schema:

```sql
-- Products
products (id, name, slug, description, category, gender, frame_shape, frame_material, 
  base_price, mrp, is_active, created_at)

-- Product variants (color/size combos)  
product_variants (id, product_id, color_name, color_hex, size, sku, price_override, 
  stock_quantity, is_active)

-- Product images
product_images (id, product_id, variant_id, url, alt_text, display_order, is_primary)

-- Customers (extends Supabase auth.users)
customer_profiles (id, user_id, full_name, phone, created_at)

-- Addresses
addresses (id, user_id, label, full_name, phone, line1, line2, city, state, 
  pincode, is_default)

-- Coupons
coupons (id, code, discount_type, discount_value, min_order_value, 
  max_discount, valid_from, valid_until, usage_limit, times_used, is_active)

-- Orders (snapshots everything at purchase time)
orders (id, user_id, guest_email, guest_phone, order_number,
  shipping_address_snapshot, subtotal, discount_amount, coupon_code_used,
  gst_amount, shipping_cost, total, payment_method, payment_status, 
  razorpay_order_id, razorpay_payment_id, razorpay_signature,
  order_status, created_at, updated_at)

-- Order line items (price/name snapshot)
order_items (id, order_id, product_name_snapshot, variant_info_snapshot, 
  product_slug_snapshot, image_url_snapshot, quantity, unit_price_snapshot, 
  total_price)
```

Row Level Security policies for all tables.

#### [NEW] `supabase/seed.sql`
~20 realistic products across 4 categories with proper Indian brand feel:
- Eyeglasses (8): Various frame shapes, materials, for men/women/unisex
- Sunglasses (6): Polarized options, fashion + sport styles
- Reading Glasses (4): Different powers, styles
- Kids (2): Durable, colorful frames

Each with 2-3 color variants, stock, images (placeholder URLs from Unsplash or similar).

#### [NEW] `src/lib/supabase/client.ts`
Browser-side Supabase client.

#### [NEW] `src/lib/supabase/server.ts`
Server-side Supabase client for API routes and server components.

#### [NEW] `src/lib/supabase/middleware.ts`
Supabase auth middleware for protected routes.

---

### Core Pages

#### [NEW] `src/app/page.tsx` — Homepage
- Hero section: Bold headline, CTA to shop, hero image
- Category cards (Eyeglasses, Sunglasses, Reading Glasses, Kids)
- Featured products marquee / horizontal scroll
- Trust signals bar (Free Shipping, Easy Returns, COD Available, GST Invoice)
- Brand story teaser
- Newsletter signup

#### [NEW] `src/app/shop/page.tsx` — Full Catalog
Server component fetching all products with filters. Sidebar/top filter bar for: category, price range, frame shape, gender. Grid of product cards.

#### [NEW] `src/app/shop/[category]/page.tsx` — Category Catalog
Same as shop but pre-filtered by category. Dynamic metadata.

#### [NEW] `src/app/product/[slug]/page.tsx` — Product Detail
- Image gallery (main image + thumbnails)
- Variant selector (color swatches, size)
- Price display (MRP strikethrough + sale price if applicable)
- GST-inclusive price label
- Stock availability indicator
- Add to cart button
- Product details accordion (description, specs, shipping info)

#### [NEW] `src/app/cart/page.tsx` — Cart
- Line items with image, name, variant info, quantity controls, remove
- Coupon code input with validation
- Order summary: subtotal, discount, GST breakdown, total
- Proceed to checkout CTA
- Continue shopping link

#### [NEW] `src/app/checkout/page.tsx` — Checkout
- Address form with Zod validation (name, phone, address lines, city, state, pincode)
- Option to select saved address (if logged in)
- Order review summary
- Payment method selection: Razorpay (UPI/Card/Netbanking) or Cash on Delivery
- Place Order button

#### [NEW] `src/app/order/success/page.tsx` — Order Confirmation
- Order number, items summary, payment status
- Estimated delivery info
- Continue shopping link

#### [NEW] `src/app/order/[id]/page.tsx` — Order Status
- Order details with status timeline
- Items list, address, payment info

---

### Cart State Management

#### [NEW] `src/store/cart.ts`
Zustand store with `persist` middleware (localStorage):
- `items[]`, `addItem()`, `removeItem()`, `updateQuantity()`, `clearCart()`
- Computed: `itemCount`, `subtotal`

---

### API Routes (Server-Side)

#### [NEW] `src/app/api/checkout/create-order/route.ts`
1. Validate cart items against current DB prices/stock
2. Create Razorpay order (if not COD)
3. Return order ID + Razorpay checkout options

#### [NEW] `src/app/api/checkout/verify-payment/route.ts`
1. Verify Razorpay payment signature server-side (HMAC SHA256)
2. Create order in DB with snapshots
3. Deduct stock
4. Return order confirmation

#### [NEW] `src/app/api/checkout/cod-order/route.ts`
1. Validate cart items
2. Create order with `payment_method: 'cod'`, `payment_status: 'pending'`
3. Deduct stock
4. Return order confirmation

#### [NEW] `src/app/api/coupons/validate/route.ts`
Validate coupon code against DB: check existence, validity window, usage limits, min order value. Return discount details.

#### [NEW] `src/app/api/orders/[id]/route.ts`
Fetch order details (with auth check for logged-in users, or by order number for guests).

---

### Auth Pages

#### [NEW] `src/app/login/page.tsx`
Email + password login with Supabase Auth. Link to register. Redirect to account or checkout.

#### [NEW] `src/app/register/page.tsx`
Registration form. Auto-create customer_profile on signup.

---

### Account Pages

#### [NEW] `src/app/account/page.tsx`
Profile info. Protected route (redirect to login if not authed).

#### [NEW] `src/app/account/orders/page.tsx`
Order history list. Click through to `/order/[id]`.

#### [NEW] `src/app/account/addresses/page.tsx`
Saved addresses with add/edit/delete/set-default functionality.

---

### Static/Info Pages

#### [NEW] `src/app/about/page.tsx`
Brand story, values, team.

#### [NEW] `src/app/contact/page.tsx`
Contact form, store address (Gujarat), phone, WhatsApp, email, map embed.

#### [NEW] `src/app/faq/page.tsx`
Accordion FAQ covering shipping, returns, payments, prescriptions, care.

---

### Shared Components

#### [NEW] `src/components/ProductCard.tsx`
Reusable product card: image, name, price (with MRP strikethrough), category badge. Hover effect with subtle lift.

#### [NEW] `src/components/ProductFilters.tsx`
Filter sidebar/bar for shop pages.

#### [NEW] `src/components/ImageGallery.tsx`
Product image gallery with thumbnail navigation.

#### [NEW] `src/components/VariantSelector.tsx`  
Color swatches + size selector.

#### [NEW] `src/components/AddressForm.tsx`
Reusable address form with Zod validation.

#### [NEW] `src/components/CouponInput.tsx`
Coupon code input with instant validation.

#### [NEW] `src/components/OrderSummary.tsx`
Reusable order total breakdown (subtotal, discount, GST, total).

#### [NEW] `src/components/TrustBadges.tsx`
Trust signals strip (Free Shipping, COD Available, Easy Returns, etc.).

---

## Verification Plan

### Browser Testing (Primary)
Since this is a full-stack web app, verification is primarily through the browser:

1. **Dev server**: Run `npm run dev` and open `http://localhost:3000`
2. **Homepage**: Verify hero section renders, categories show, products display, responsive at 360px/768px/1920px
3. **Shop flow**: Navigate to `/shop`, apply filters, verify products filter correctly
4. **Product page**: Click a product, switch variants, verify image/price/stock changes
5. **Cart flow**: Add items to cart, refresh page (verify persistence), adjust quantities, remove items
6. **Checkout flow**:
   - Fill address form → verify validation fires on invalid inputs
   - Apply a coupon code → verify discount applies
   - Select Razorpay → verify Razorpay modal opens in test mode
   - Select COD → verify order is placed
7. **Order confirmation**: Verify order success page shows correct details
8. **Auth**: Register a new account, log in, verify account pages work
9. **Account**: Check order history, manage addresses

### Build Verification
```bash
npm run build
```
Ensures no TypeScript errors, all pages build correctly.

### Manual Verification by User
- **Razorpay**: Use Razorpay test card `4111 1111 1111 1111` to verify payment flow end-to-end
- **Supabase**: Check the Supabase dashboard to verify orders are created with correct snapshots
- **Mobile**: Open on a real phone or Chrome DevTools mobile emulator — verify no horizontal scroll, all interactions work on touch
