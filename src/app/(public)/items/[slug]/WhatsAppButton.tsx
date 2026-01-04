"use client"

import { GlassButton } from "@/components/glass"
import { MessageCircle } from "lucide-react"

/* visitor id mobile-safe */
function generateVisitorId() {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    return Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  }

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

export function WhatsAppButton({ item, primaryImage }: WhatsAppButtonProps) {
  const handleClick = () => {
    /* 1️⃣ bina mesej */
    const message = encodeURIComponent(
      `barang ni ada stok?\n\nItem: ${item.title}\nItem ID: ${item.id}${
        primaryImage ? `\nImage: ${primaryImage.image_url}` : ""
      }`
    )

    /* 2️⃣ buka WhatsApp dulu (WAJIB untuk mobile) */
    window.open(
      `https://wa.me/60149226456?text=${message}`,
      "_blank",
      "noopener,noreferrer"
    )

    /* 3️⃣ analytics (sendBeacon + Supabase REST) */
    try {
      const body = JSON.stringify({
        item_id: item.id,
        visitor_id: generateVisitorId(),
      })

      const blob = new Blob([body], {
        type: "application/json",
      })

      navigator.sendBeacon(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/whatsapp_clicks`,
        blob
      )
    } catch {
      // analytics must NEVER break UX
    }
  }

  return (
    <GlassButton onClick={handleClick} className="w-full gap-2" size="md">
      <MessageCircle className="h-5 w-5" />
      Buy via WhatsApp
    </GlassButton>
  )
}
