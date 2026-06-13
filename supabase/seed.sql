-- ═══════════════════════════════════════════════════════
-- Ram Chashma Ghar — Seed Data
-- ═══════════════════════════════════════════════════════

-- ─── EYEGLASSES ───

INSERT INTO products (id, name, slug, description, category, gender, frame_shape, frame_material, base_price, mrp) VALUES
('11111111-1111-1111-1111-111111111101', 'Horizon Classic', 'horizon-classic', 'A timeless rectangular frame handcrafted from premium Italian acetate. Subtle temple detailing adds character without shouting. Perfect for boardrooms and beyond.', 'eyeglasses', 'men', 'rectangular', 'acetate', 2499, 3999),
('11111111-1111-1111-1111-111111111102', 'Luna Round', 'luna-round', 'Retro-inspired round frames in lightweight titanium. The ultra-thin profile sits comfortably all day while the spring hinges ensure a customised fit.', 'eyeglasses', 'women', 'round', 'titanium', 3299, 4999),
('11111111-1111-1111-1111-111111111103', 'Metro Square', 'metro-square', 'Bold square frames for those who mean business. TR90 material makes them virtually indestructible while keeping the weight feather-light.', 'eyeglasses', 'unisex', 'square', 'tr90', 1899, 2999),
('11111111-1111-1111-1111-111111111104', 'Reva Cat-Eye', 'reva-cat-eye', 'Elegant cat-eye silhouette with a modern edge. Acetate construction with gold-tipped temples. A head-turner at every gathering.', 'eyeglasses', 'women', 'cat-eye', 'acetate', 2799, 4499),
('11111111-1111-1111-1111-111111111105', 'Arjun Aviator', 'arjun-aviator', 'The classic aviator, reimagined for everyday optical wear. Brushed metal frame with adjustable nose pads for the perfect Indian fit.', 'eyeglasses', 'men', 'aviator', 'metal', 2199, 3499),
('11111111-1111-1111-1111-111111111106', 'Oval Lite', 'oval-lite', 'Minimalist oval frames that disappear on your face. Ultra-light metal with flexible temples. So comfortable you will forget you are wearing them.', 'eyeglasses', 'unisex', 'oval', 'metal', 1699, 2499),
('11111111-1111-1111-1111-111111111107', 'Prism Geometric', 'prism-geometric', 'Stand out with these geometric mixed-material frames. Acetate front with titanium temples create a unique layered aesthetic.', 'eyeglasses', 'unisex', 'geometric', 'mixed', 3499, 5499),
('11111111-1111-1111-1111-111111111108', 'Windsor Heritage', 'windsor-heritage', 'Round metal frames with a bridge bar, inspired by vintage British eyewear. Thin titanium construction keeps it modern and wearable.', 'eyeglasses', 'men', 'round', 'titanium', 3799, 5999);

-- ─── SUNGLASSES ───

INSERT INTO products (id, name, slug, description, category, gender, frame_shape, frame_material, base_price, mrp) VALUES
('22222222-2222-2222-2222-222222222201', 'Coastal Wayfarer', 'coastal-wayfarer', 'The undisputed king of sunglasses silhouettes. Our wayfarer comes with UV400 polarised lenses that cut glare without dulling colours.', 'sunglasses', 'unisex', 'wayfarer', 'acetate', 2999, 4499),
('22222222-2222-2222-2222-222222222202', 'Summit Aviator', 'summit-aviator', 'Polarised aviator sunglasses with gradient lenses. The double-bridge design and spring-loaded temples ensure comfort during long drives.', 'sunglasses', 'men', 'aviator', 'metal', 3499, 5499),
('22222222-2222-2222-2222-222222222203', 'Diva Oversized', 'diva-oversized', 'Make an entrance with these oversized square sunglasses. Bold acetate frames with gradient brown lenses. Celebrity-approved and road-trip-ready.', 'sunglasses', 'women', 'square', 'acetate', 2799, 3999),
('22222222-2222-2222-2222-222222222204', 'Drift Sport', 'drift-sport', 'Wraparound sport sunglasses built for action. TR90 frame flexes without breaking, polarised lenses reduce eye strain during outdoor activities.', 'sunglasses', 'men', 'rectangular', 'tr90', 1999, 2999),
('22222222-2222-2222-2222-222222222205', 'Blossom Cat-Eye', 'blossom-cat-eye', 'Floral-inspired cat-eye sunglasses with rose-tinted gradient lenses. Lightweight acetate frame with delicate temple engraving.', 'sunglasses', 'women', 'cat-eye', 'acetate', 2599, 3999),
('22222222-2222-2222-2222-222222222206', 'Eclipse Round', 'eclipse-round', 'John Lennon meets 2024. Perfectly round metal frames with flat mirror lenses. Unisex styling that works with everything from kurtas to jackets.', 'sunglasses', 'unisex', 'round', 'metal', 2299, 3499);

-- ─── READING GLASSES ───

INSERT INTO products (id, name, slug, description, category, gender, frame_shape, frame_material, base_price, mrp) VALUES
('33333333-3333-3333-3333-333333333301', 'Scholar Half-Rim', 'scholar-half-rim', 'Professional half-rimmed reading glasses in brushed gunmetal. Anti-glare coated lenses make screen time easier on your eyes. Available in +1.0 to +3.0 powers.', 'reading-glasses', 'unisex', 'rectangular', 'metal', 999, 1499),
('33333333-3333-3333-3333-333333333302', 'Cozy Round Reader', 'cozy-round-reader', 'Vintage round reading glasses in warm tortoiseshell acetate. Spring hinges ensure a snug fit. Your new favourite companion for evening reading.', 'reading-glasses', 'unisex', 'round', 'acetate', 1299, 1999),
('33333333-3333-3333-3333-333333333303', 'SlimFold Compact', 'slimfold-compact', 'Ultra-compact folding reading glasses that fit in your shirt pocket. TR90 frame with built-in case. Carry your reading clarity everywhere.', 'reading-glasses', 'unisex', 'rectangular', 'tr90', 799, 1299),
('33333333-3333-3333-3333-333333333304', 'Heritage Oval Reader', 'heritage-oval-reader', 'Classic oval reading glasses with a keyhole bridge. Metal frame with acetate temple tips for comfort during extended reading sessions.', 'reading-glasses', 'unisex', 'oval', 'mixed', 1199, 1799);

-- ─── KIDS ───

INSERT INTO products (id, name, slug, description, category, gender, frame_shape, frame_material, base_price, mrp) VALUES
('44444444-4444-4444-4444-444444444401', 'Junior Explorer', 'junior-explorer', 'Tough-as-nails kids frames that survive playground battles. Flexible TR90 material bends without breaking. Fun colours that kids actually want to wear.', 'kids', 'kids', 'rectangular', 'tr90', 999, 1499),
('44444444-4444-4444-4444-444444444402', 'Mini Aviator', 'mini-aviator', 'Tiny aviator frames for tiny faces. Stainless steel construction with silicone nose pads for comfort. Because style has no age limit.', 'kids', 'kids', 'aviator', 'metal', 1299, 1999);

-- ═══════════════════════════════════════════════════════
-- Variants
-- ═══════════════════════════════════════════════════════

-- Horizon Classic variants
INSERT INTO product_variants (id, product_id, color_name, color_hex, size, sku, stock_quantity) VALUES
('aaaa0001-0001-0001-0001-000000000001', '11111111-1111-1111-1111-111111111101', 'Matte Black', '#1A1A1A', 'Medium', 'HC-BLK-M', 15),
('aaaa0001-0001-0001-0001-000000000002', '11111111-1111-1111-1111-111111111101', 'Tortoise Brown', '#8B4513', 'Medium', 'HC-TRT-M', 12),
('aaaa0001-0001-0001-0001-000000000003', '11111111-1111-1111-1111-111111111101', 'Navy Blue', '#1B3A5C', 'Large', 'HC-NVY-L', 8);

-- Luna Round variants
INSERT INTO product_variants (id, product_id, color_name, color_hex, size, sku, stock_quantity) VALUES
('aaaa0002-0002-0002-0002-000000000001', '11111111-1111-1111-1111-111111111102', 'Rose Gold', '#B76E79', 'Small', 'LR-RSG-S', 10),
('aaaa0002-0002-0002-0002-000000000002', '11111111-1111-1111-1111-111111111102', 'Silver', '#C0C0C0', 'Medium', 'LR-SLV-M', 14);

-- Metro Square variants
INSERT INTO product_variants (id, product_id, color_name, color_hex, size, sku, stock_quantity) VALUES
('aaaa0003-0003-0003-0003-000000000001', '11111111-1111-1111-1111-111111111103', 'Charcoal', '#2D2D2D', 'Medium', 'MS-CHR-M', 20),
('aaaa0003-0003-0003-0003-000000000002', '11111111-1111-1111-1111-111111111103', 'Clear Grey', '#B0B0B0', 'Medium', 'MS-CLR-M', 18),
('aaaa0003-0003-0003-0003-000000000003', '11111111-1111-1111-1111-111111111103', 'Forest Green', '#2D5F2D', 'Large', 'MS-FGN-L', 10);

-- Reva Cat-Eye variants
INSERT INTO product_variants (id, product_id, color_name, color_hex, size, sku, stock_quantity) VALUES
('aaaa0004-0004-0004-0004-000000000001', '11111111-1111-1111-1111-111111111104', 'Burgundy', '#722F37', 'Small', 'RC-BRG-S', 12),
('aaaa0004-0004-0004-0004-000000000002', '11111111-1111-1111-1111-111111111104', 'Honey Tortoise', '#CD853F', 'Medium', 'RC-HNY-M', 9);

-- Arjun Aviator variants
INSERT INTO product_variants (id, product_id, color_name, color_hex, size, sku, stock_quantity) VALUES
('aaaa0005-0005-0005-0005-000000000001', '11111111-1111-1111-1111-111111111105', 'Gunmetal', '#5A5A5A', 'Medium', 'AA-GUN-M', 16),
('aaaa0005-0005-0005-0005-000000000002', '11111111-1111-1111-1111-111111111105', 'Gold', '#C9A96E', 'Medium', 'AA-GLD-M', 11);

-- Oval Lite variants
INSERT INTO product_variants (id, product_id, color_name, color_hex, size, sku, stock_quantity) VALUES
('aaaa0006-0006-0006-0006-000000000001', '11111111-1111-1111-1111-111111111106', 'Silver', '#C0C0C0', 'Small', 'OL-SLV-S', 22),
('aaaa0006-0006-0006-0006-000000000002', '11111111-1111-1111-1111-111111111106', 'Black', '#1A1A1A', 'Medium', 'OL-BLK-M', 18);

-- Prism Geometric variants
INSERT INTO product_variants (id, product_id, color_name, color_hex, size, sku, stock_quantity) VALUES
('aaaa0007-0007-0007-0007-000000000001', '11111111-1111-1111-1111-111111111107', 'Crystal Blue', '#4A90D9', 'Medium', 'PG-CBL-M', 7),
('aaaa0007-0007-0007-0007-000000000002', '11111111-1111-1111-1111-111111111107', 'Smoke Grey', '#6B6B6B', 'Medium', 'PG-SMK-M', 10);

-- Windsor Heritage variants
INSERT INTO product_variants (id, product_id, color_name, color_hex, size, sku, stock_quantity) VALUES
('aaaa0008-0008-0008-0008-000000000001', '11111111-1111-1111-1111-111111111108', 'Antique Gold', '#B8860B', 'Medium', 'WH-AGD-M', 8),
('aaaa0008-0008-0008-0008-000000000002', '11111111-1111-1111-1111-111111111108', 'Brushed Silver', '#A8A8A8', 'Medium', 'WH-BSL-M', 13);

-- Coastal Wayfarer variants
INSERT INTO product_variants (id, product_id, color_name, color_hex, size, sku, stock_quantity) VALUES
('bbbb0001-0001-0001-0001-000000000001', '22222222-2222-2222-2222-222222222201', 'Classic Black', '#1A1A1A', 'Medium', 'CW-BLK-M', 25),
('bbbb0001-0001-0001-0001-000000000002', '22222222-2222-2222-2222-222222222201', 'Tortoise', '#8B4513', 'Medium', 'CW-TRT-M', 18),
('bbbb0001-0001-0001-0001-000000000003', '22222222-2222-2222-2222-222222222201', 'Ocean Blue', '#2B547E', 'Large', 'CW-OCN-L', 12);

-- Summit Aviator variants
INSERT INTO product_variants (id, product_id, color_name, color_hex, size, sku, stock_quantity) VALUES
('bbbb0002-0002-0002-0002-000000000001', '22222222-2222-2222-2222-222222222202', 'Gold/Green', '#C9A96E', 'Large', 'SA-GGN-L', 14),
('bbbb0002-0002-0002-0002-000000000002', '22222222-2222-2222-2222-222222222202', 'Silver/Blue', '#C0C0C0', 'Medium', 'SA-SBL-M', 11);

-- Diva Oversized variants
INSERT INTO product_variants (id, product_id, color_name, color_hex, size, sku, stock_quantity) VALUES
('bbbb0003-0003-0003-0003-000000000001', '22222222-2222-2222-2222-222222222203', 'Glossy Black', '#0A0A0A', 'Large', 'DO-GBK-L', 16),
('bbbb0003-0003-0003-0003-000000000002', '22222222-2222-2222-2222-222222222203', 'Tortoise Fade', '#A0522D', 'Large', 'DO-TFD-L', 9);

-- Drift Sport variants
INSERT INTO product_variants (id, product_id, color_name, color_hex, size, sku, stock_quantity) VALUES
('bbbb0004-0004-0004-0004-000000000001', '22222222-2222-2222-2222-222222222204', 'Matte Black', '#1A1A1A', 'Medium', 'DS-MBK-M', 22),
('bbbb0004-0004-0004-0004-000000000002', '22222222-2222-2222-2222-222222222204', 'Red/Black', '#CC3333', 'Medium', 'DS-RBK-M', 14);

-- Blossom Cat-Eye variants
INSERT INTO product_variants (id, product_id, color_name, color_hex, size, sku, stock_quantity) VALUES
('bbbb0005-0005-0005-0005-000000000001', '22222222-2222-2222-2222-222222222205', 'Rose Pink', '#E8B4B8', 'Small', 'BC-RSP-S', 13),
('bbbb0005-0005-0005-0005-000000000002', '22222222-2222-2222-2222-222222222205', 'Lavender', '#9B7CB8', 'Medium', 'BC-LVN-M', 10);

-- Eclipse Round variants
INSERT INTO product_variants (id, product_id, color_name, color_hex, size, sku, stock_quantity) VALUES
('bbbb0006-0006-0006-0006-000000000001', '22222222-2222-2222-2222-222222222206', 'Gold/Mirror', '#C9A96E', 'Medium', 'ER-GMR-M', 17),
('bbbb0006-0006-0006-0006-000000000002', '22222222-2222-2222-2222-222222222206', 'Black/Smoke', '#1A1A1A', 'Medium', 'ER-BSM-M', 14);

-- Scholar Half-Rim variants
INSERT INTO product_variants (id, product_id, color_name, color_hex, size, sku, price_override, stock_quantity) VALUES
('cccc0001-0001-0001-0001-000000000001', '33333333-3333-3333-3333-333333333301', 'Gunmetal +1.0', '#5A5A5A', '+1.0', 'SH-GUN-10', 999, 20),
('cccc0001-0001-0001-0001-000000000002', '33333333-3333-3333-3333-333333333301', 'Gunmetal +2.0', '#5A5A5A', '+2.0', 'SH-GUN-20', 999, 18),
('cccc0001-0001-0001-0001-000000000003', '33333333-3333-3333-3333-333333333301', 'Black +1.5', '#1A1A1A', '+1.5', 'SH-BLK-15', 999, 15);

-- Cozy Round Reader variants
INSERT INTO product_variants (id, product_id, color_name, color_hex, size, sku, stock_quantity) VALUES
('cccc0002-0002-0002-0002-000000000001', '33333333-3333-3333-3333-333333333302', 'Warm Tortoise +1.5', '#CD853F', '+1.5', 'CR-TRT-15', 12),
('cccc0002-0002-0002-0002-000000000002', '33333333-3333-3333-3333-333333333302', 'Warm Tortoise +2.5', '#CD853F', '+2.5', 'CR-TRT-25', 10);

-- SlimFold Compact variants
INSERT INTO product_variants (id, product_id, color_name, color_hex, size, sku, stock_quantity) VALUES
('cccc0003-0003-0003-0003-000000000001', '33333333-3333-3333-3333-333333333303', 'Black +1.0', '#1A1A1A', '+1.0', 'SF-BLK-10', 25),
('cccc0003-0003-0003-0003-000000000002', '33333333-3333-3333-3333-333333333303', 'Black +2.0', '#1A1A1A', '+2.0', 'SF-BLK-20', 22),
('cccc0003-0003-0003-0003-000000000003', '33333333-3333-3333-3333-333333333303', 'Brown +1.5', '#6B4226', '+1.5', 'SF-BRN-15', 16);

-- Heritage Oval Reader variants
INSERT INTO product_variants (id, product_id, color_name, color_hex, size, sku, stock_quantity) VALUES
('cccc0004-0004-0004-0004-000000000001', '33333333-3333-3333-3333-333333333304', 'Bronze +1.5', '#8B6914', '+1.5', 'HO-BRZ-15', 14),
('cccc0004-0004-0004-0004-000000000002', '33333333-3333-3333-3333-333333333304', 'Bronze +2.0', '#8B6914', '+2.0', 'HO-BRZ-20', 11);

-- Junior Explorer variants
INSERT INTO product_variants (id, product_id, color_name, color_hex, size, sku, stock_quantity) VALUES
('dddd0001-0001-0001-0001-000000000001', '44444444-4444-4444-4444-444444444401', 'Electric Blue', '#0066FF', 'Kids', 'JE-EBL-K', 20),
('dddd0001-0001-0001-0001-000000000002', '44444444-4444-4444-4444-444444444401', 'Cherry Red', '#DC143C', 'Kids', 'JE-CRD-K', 18),
('dddd0001-0001-0001-0001-000000000003', '44444444-4444-4444-4444-444444444401', 'Lime Green', '#32CD32', 'Kids', 'JE-LGN-K', 15);

-- Mini Aviator variants
INSERT INTO product_variants (id, product_id, color_name, color_hex, size, sku, stock_quantity) VALUES
('dddd0002-0002-0002-0002-000000000001', '44444444-4444-4444-4444-444444444402', 'Silver', '#C0C0C0', 'Kids', 'MA-SLV-K', 16),
('dddd0002-0002-0002-0002-000000000002', '44444444-4444-4444-4444-444444444402', 'Rose Gold', '#B76E79', 'Kids', 'MA-RSG-K', 13);

-- ═══════════════════════════════════════════════════════
-- Images (using Unsplash placeholder URLs)
-- ═══════════════════════════════════════════════════════

INSERT INTO product_images (product_id, variant_id, url, alt_text, display_order, is_primary) VALUES
-- Horizon Classic
('11111111-1111-1111-1111-111111111101', NULL, 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&h=600&fit=crop', 'Horizon Classic rectangular eyeglasses', 0, true),
('11111111-1111-1111-1111-111111111101', NULL, 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=600&h=600&fit=crop', 'Horizon Classic side view', 1, false),
-- Luna Round
('11111111-1111-1111-1111-111111111102', NULL, 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=600&h=600&fit=crop', 'Luna Round titanium eyeglasses', 0, true),
-- Metro Square
('11111111-1111-1111-1111-111111111103', NULL, 'https://images.unsplash.com/photo-1614715838608-dd527c46231d?w=600&h=600&fit=crop', 'Metro Square TR90 eyeglasses', 0, true),
-- Reva Cat-Eye
('11111111-1111-1111-1111-111111111104', NULL, 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=600&fit=crop', 'Reva Cat-Eye acetate eyeglasses', 0, true),
-- Arjun Aviator
('11111111-1111-1111-1111-111111111105', NULL, 'https://images.unsplash.com/photo-1510686015-cf8d5bfa2732?w=600&h=600&fit=crop', 'Arjun Aviator metal eyeglasses', 0, true),
-- Oval Lite
('11111111-1111-1111-1111-111111111106', NULL, 'https://images.unsplash.com/photo-1632006117871-7ee817160f94?w=600&h=600&fit=crop', 'Oval Lite minimalist eyeglasses', 0, true),
-- Prism Geometric
('11111111-1111-1111-1111-111111111107', NULL, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop', 'Prism Geometric mixed material eyeglasses', 0, true),
-- Windsor Heritage
('11111111-1111-1111-1111-111111111108', NULL, 'https://images.unsplash.com/photo-1483120261983-6561db29ceb2?w=600&h=600&fit=crop', 'Windsor Heritage round eyeglasses', 0, true),
-- Coastal Wayfarer
('22222222-2222-2222-2222-222222222201', NULL, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop', 'Coastal Wayfarer sunglasses', 0, true),
('22222222-2222-2222-2222-222222222201', NULL, 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600&h=600&fit=crop', 'Coastal Wayfarer on model', 1, false),
-- Summit Aviator
('22222222-2222-2222-2222-222222222202', NULL, 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=600&fit=crop', 'Summit Aviator polarised sunglasses', 0, true),
-- Diva Oversized
('22222222-2222-2222-2222-222222222203', NULL, 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=600&h=600&fit=crop', 'Diva Oversized sunglasses', 0, true),
-- Drift Sport
('22222222-2222-2222-2222-222222222204', NULL, 'https://images.unsplash.com/photo-1556306535-38febf6782e7?w=600&h=600&fit=crop', 'Drift Sport wraparound sunglasses', 0, true),
-- Blossom Cat-Eye
('22222222-2222-2222-2222-222222222205', NULL, 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=600&h=600&fit=crop', 'Blossom Cat-Eye sunglasses', 0, true),
-- Eclipse Round
('22222222-2222-2222-2222-222222222206', NULL, 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&h=600&fit=crop', 'Eclipse Round mirror sunglasses', 0, true),
-- Scholar Half-Rim
('33333333-3333-3333-3333-333333333301', NULL, 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=600&h=600&fit=crop', 'Scholar Half-Rim reading glasses', 0, true),
-- Cozy Round Reader
('33333333-3333-3333-3333-333333333302', NULL, 'https://images.unsplash.com/photo-1614715838608-dd527c46231d?w=600&h=600&fit=crop', 'Cozy Round Reader glasses', 0, true),
-- SlimFold Compact
('33333333-3333-3333-3333-333333333303', NULL, 'https://images.unsplash.com/photo-1632006117871-7ee817160f94?w=600&h=600&fit=crop', 'SlimFold Compact reading glasses', 0, true),
-- Heritage Oval Reader
('33333333-3333-3333-3333-333333333304', NULL, 'https://images.unsplash.com/photo-1483120261983-6561db29ceb2?w=600&h=600&fit=crop', 'Heritage Oval Reader glasses', 0, true),
-- Junior Explorer
('44444444-4444-4444-4444-444444444401', NULL, 'https://images.unsplash.com/photo-1510686015-cf8d5bfa2732?w=600&h=600&fit=crop', 'Junior Explorer kids eyeglasses', 0, true),
-- Mini Aviator
('44444444-4444-4444-4444-444444444402', NULL, 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600&h=600&fit=crop', 'Mini Aviator kids eyeglasses', 0, true);

-- ═══════════════════════════════════════════════════════
-- Coupons
-- ═══════════════════════════════════════════════════════

INSERT INTO coupons (code, discount_type, discount_value, min_order_value, max_discount, valid_from, valid_until, usage_limit) VALUES
('WELCOME10', 'percent', 10, 999, 500, '2024-01-01', '2026-12-31', 1000),
('FLAT200', 'flat', 200, 1999, NULL, '2024-01-01', '2026-12-31', 500),
('SUMMER15', 'percent', 15, 2499, 750, '2024-04-01', '2026-09-30', 300);
