export const dynamic = 'force-dynamic'
export const revalidate = 0

import { createAdminClient } from "@/lib/supabase/admin"
import CollectionClient from "./CollectionClient"

export default async function ItemsPage() {
  const supabase = createAdminClient()

  const { data: items } = await supabase
    .from("items")
    .select(
      `
      *,
      images:item_images(*)
    `
    )
    .order("created_at", { ascending: false })

  return <CollectionClient items={items ?? []} />
}
