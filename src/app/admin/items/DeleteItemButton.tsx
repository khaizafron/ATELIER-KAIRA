"use client"

import { GlassButton } from "@/components/glass"
import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface DeleteItemButtonProps {
  itemId: string
  itemTitle: string
}

export function DeleteItemButton({ itemId, itemTitle }: DeleteItemButtonProps) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Delete "${itemTitle}"? This cannot be undone.`)) return

    setDeleting(true)
    
    try {
      const response = await fetch(`/api/admin/items/${itemId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        alert(`Failed to delete item: ${data.error || "Unknown error"}`)
        setDeleting(false)
        return
      }

      alert(`Item "${itemTitle}" deleted successfully!`)
      router.refresh()
    } catch (error) {
      console.error("Delete request failed:", error)
      alert(`Failed to delete item: ${error}`)
      setDeleting(false)
    }
  }

  return (
    <GlassButton 
      variant="ghost" 
      size="sm" 
      onClick={handleDelete} 
      disabled={deleting}
      className="text-red-600 hover:bg-red-50 disabled:opacity-50"
    >
      <Trash2 className="h-4 w-4" />
    </GlassButton>
  )
}