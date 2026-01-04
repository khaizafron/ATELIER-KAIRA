import { GlassCard } from "@/components/glass"
import { ItemForm } from "../ItemForm"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NewItemPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <Link 
        href="/admin/items" 
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-black/60 transition-colors hover:text-black"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Items
      </Link>

      <h1 className="mb-8 text-3xl font-semibold text-black/90">Add New Item</h1>

      <GlassCard>
        <ItemForm />
      </GlassCard>
    </div>
  )
}
