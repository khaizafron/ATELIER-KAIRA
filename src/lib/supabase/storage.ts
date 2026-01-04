export function getPublicImageUrl(imagePath: string | null | undefined): string {
  if (!imagePath) return ''
  
  // If it's already a full URL, return it
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  
  // Otherwise, construct the public URL
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  return `${supabaseUrl}/storage/v1/object/public/item-images/${imagePath}`
}