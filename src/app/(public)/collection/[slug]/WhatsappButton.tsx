"use client"

import { GlassButton } from "@/components/glass"
import { MessageCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

/* helper kecil — mobile safe */
function generateVisitorId() {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    return Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  }

  // fallback terakhir (very rare)
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

interface WhatsAppButtonProps {
  item: {
    id: string
    title: string
  }
  primaryImage?: {
    image_url: string
  }
}

export function WhatsAppButton({
  item,
  primaryImage,
}: WhatsAppButtonProps) {
  const handleClick = () => {
    /* 1. bina mesej */
    const text = encodeURIComponent(
      `barang ni ada stok?\n\n` +
        `Item: ${item.title}\n` +
        `Item ID: ${item.id}` +
        (primaryImage ? `\nImage: ${primaryImage.image_url}` : "")
    )

    /* 2. BUKA WHATSAPP TERUS (WAJIB sync – mobile requirement) */
    window.open(
      `https://wa.me/60149226456?text=${text}`,
      "_blank",
      "noopener,noreferrer"
    )

    /* 3. TRACK BACKGROUND — SAFE (NO unhandled promise) */
const supabase = createClient()

;(async () => {
  try {
    await supabase.from("whatsapp_clicks").insert({
      item_id: item.id,
      visitor_id: generateVisitorId(),
    })
  } catch {
    // silent – analytics must NEVER crash UI
  }
})()

  }

  return (
    <GlassButton onClick={handleClick} className="w-full gap-2" size="lg">
      <MessageCircle className="h-5 w-5" />
      Buy via WhatsApp
    </GlassButton>
  )
}
