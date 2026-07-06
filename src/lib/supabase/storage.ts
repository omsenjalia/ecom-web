import { createAdminClient } from './admin';

const BUCKET = 'product-images';

export async function uploadProductImage(
  file: File,
  path: string
): Promise<{ publicUrl: string; storagePath: string }> {
  const supabase = createAdminClient();

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(data.path);

  return {
    publicUrl: urlData.publicUrl,
    storagePath: data.path,
  };
}

export async function deleteProductImage(storagePath: string): Promise<void> {
  const supabase = createAdminClient();

  const { error } = await supabase.storage
    .from(BUCKET)
    .remove([storagePath]);

  if (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
}

export function getPublicUrl(storagePath: string): string {
  const supabase = createAdminClient();
  const { data } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(storagePath);
  return data.publicUrl;
}

export async function uploadProductImageFromBuffer(
  buffer: ArrayBuffer,
  path: string,
  contentType: string
): Promise<{ publicUrl: string; storagePath: string }> {
  const supabase = createAdminClient();

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, {
      cacheControl: '3600',
      upsert: false,
      contentType,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(data.path);

  return {
    publicUrl: urlData.publicUrl,
    storagePath: data.path,
  };
}
