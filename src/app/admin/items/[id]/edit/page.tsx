import { createClient } from "@/lib/supabase/server"
import { GlassCard } from "@/components/glass"
import { ItemForm } from "../../ItemForm"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditItemPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: item } = await supabase
    .from("items")
    .select(`
      *,
      measurements:item_measurements(*)
    `)
    .eq("id", id)
    .single()

  if (!item) {
    notFound()
  }

  const measurements = item.measurements?.[0] || item.measurements

  return (
    <div className="mx-auto max-w-3xl">
      <Link 
        href="/admin/items" 
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-black/60 transition-colors hover:text-black"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Items
      </Link>

      <h1 className="mb-8 text-3xl font-semibold text-black/90">Edit Item</h1>

      <GlassCard>
        <ItemForm item={item} measurements={measurements} />
      </GlassCard>
    </div>
  )
}
