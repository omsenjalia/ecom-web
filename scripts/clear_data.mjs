import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function clearData() {
  console.log('WARNING: This will delete ALL products, variants, and product images from your database.');
  console.log('Orders, users, and categories will be retained.');
  
  if (process.argv[2] !== '--confirm') {
    console.log('\nPlease run with --confirm to execute: node scripts/clear_data.mjs --confirm');
    process.exit(0);
  }

  console.log('Starting data deletion...');

  try {
    // 1. Delete product images
    const { error: imagesError } = await supabase.from('product_images').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (imagesError) throw new Error(`Failed to delete images: ${imagesError.message}`);
    console.log('✅ Product images deleted (DB records only, storage files must be deleted manually if needed)');

    // 2. Delete product variants
    const { error: variantsError } = await supabase.from('product_variants').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (variantsError) throw new Error(`Failed to delete variants: ${variantsError.message}`);
    console.log('✅ Product variants deleted');

    // 3. Delete products
    const { error: productsError } = await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (productsError) throw new Error(`Failed to delete products: ${productsError.message}`);
    console.log('✅ Products deleted');

    console.log('\n🎉 Storefront is now empty and ready for real catalog data.');
  } catch (err) {
    console.error('❌ Error during deletion:', err);
    process.exit(1);
  }
}

clearData();
