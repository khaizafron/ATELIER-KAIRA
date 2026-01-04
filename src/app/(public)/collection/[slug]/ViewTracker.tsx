"use client"

import { useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

/* mobile-safe visitor id */
function generateVisitorId() {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    return Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("")
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

interface ViewTrackerProps {
  itemId: string
}

export function ViewTracker({ itemId }: ViewTrackerProps) {
  useEffect(() => {
    try {
      const supabase = createClient()

      supabase.from("analytics_item_views").insert({
        item_id: itemId,
        visitor_id: generateVisitorId(),
      })
    } catch {
      // silent – analytics tak boleh rosakkan UX
    }
  }, [itemId])

  return null
}
