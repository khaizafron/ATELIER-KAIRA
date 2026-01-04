"use client"

export const dynamic = "force-dynamic"

import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { GlassCard, GlassButton } from "@/components/glass"
import { AddToCartButton } from "@/components/AddToCartButton"
import { ImageGallery } from "./ImageGallery"
import Link from "next/link"
import { ArrowLeft, MapPin, MessageCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"

interface ItemImage {
  id: string
  image_url: string
  is_primary: boolean
}

interface ItemMeasurement {
  pit_to_pit?: number
  body_length?: number
  shoulder_width?: number
  sleeve_length?: number
  armhole?: number
  bottom_hem?: number
}

interface Item {
  id: string
  title: string
  price: number
  description?: string
  status: string
  offline_location?: string
  slug: string
  images?: ItemImage[]
  measurements?: ItemMeasurement[]
}

function generateVisitorId() {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    return Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export default function ItemDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params?.slug as string
  
  const [item, setItem] = useState<Item | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchItem() {
      if (!slug) return
      
      try {
        // Create simple anon client - NO RLS auth check
        const supabase = createSupabaseClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          {
            auth: {
              persistSession: false,
              autoRefreshToken: false,
            }
          }
        )
        
        const { data, error } = await supabase
          .from("items")
          .select(`
            id,
            title,
            price,
            description,
            status,
            offline_location,
            slug,
            images:item_images(id, image_url, is_primary),
            measurements:item_measurements(pit_to_pit, body_length, shoulder_width, sleeve_length, armhole, bottom_hem)
          `)
          .eq("slug", slug)
          .single()

        console.log('Fetch result:', { data, error })

        if (error) {
          console.error('Supabase error:', error)
          // Try without relations if main query fails
          const { data: simpleData, error: simpleError } = await supabase
            .from("items")
            .select('*')
            .eq("slug", slug)
            .single()
          
          if (simpleError) {
            console.error('Simple query also failed:', simpleError)
            setLoading(false)
            return
          }
          
          setItem(simpleData as Item)
          setLoading(false)
          return
        }
        
        if (!data) {
          console.log('Item not found')
          router.push('/collection')
          return
        }

        setItem(data as Item)
      } catch (err) {
        console.error('Fetch error:', err)
        router.push('/collection')
      } finally {
        setLoading(false)
      }
    }

    fetchItem()
  }, [slug, router])

  const handleWhatsAppClick = () => {
    if (!item) return

    const primaryImage = item.images?.find((img) => img.is_primary) || item.images?.[0]
    
    const message = encodeURIComponent(
      `barang ni ada stok?\n\nItem: ${item.title}\nItem ID: ${item.id}${
        primaryImage ? `\nImage: ${primaryImage.image_url}` : ""
      }`
    )

    window.open(
      `https://wa.me/60149226456?text=${message}`,
      "_blank",
      "noopener,noreferrer"
    )

    try {
      const body = JSON.stringify({
        item_id: item.id,
        visitor_id: generateVisitorId(),
      })

      const blob = new Blob([body], { type: "application/json" })

      navigator.sendBeacon(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/whatsapp_clicks`,
        blob
      )
    } catch {
      // analytics must never break UX
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-black/10 border-t-black"></div>
      </div>
    )
  }

  if (!item) {
    return null
  }

  const primaryImage = item.images?.find((img) => img.is_primary) || item.images?.[0]
  const isSold = item.status === "sold" || item.status === "offline_sold"
const measurements =
  Array.isArray(item.measurements)
    ? item.measurements[0]
    : item.measurements ?? null


  const measurementLabels = [
    { key: "pit_to_pit" as const, label: "Pit to Pit" },
    { key: "body_length" as const, label: "Body Length" },
    { key: "shoulder_width" as const, label: "Shoulder Width" },
    { key: "sleeve_length" as const, label: "Sleeve Length" },
    { key: "armhole" as const, label: "Armhole" },
    { key: "bottom_hem" as const, label: "Bottom Hem" },
  ]

  return (
    <div className="mx-auto max-w-5xl px-4 pb-20">
      <Link
        href="/collection"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-black/60 hover:text-black"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Collection
      </Link>

      <div className="grid gap-10 lg:grid-cols-2">
        <GlassCard className="overflow-hidden p-0">
          <div className="p-4">
            <ImageGallery 
              images={item.images || []}
              title={item.title}
              isSold={isSold}
            />
          </div>
        </GlassCard>

        <div className="flex flex-col">
          <h1 className="text-3xl font-semibold">{item.title}</h1>

          <p className="mt-3 text-3xl font-semibold">
            RM {Number(item.price).toFixed(0)}
          </p>

          {item.description && (
            <p className="mt-6 text-black/70">{item.description}</p>
          )}

          {item.offline_location && (
            <div className="mt-6 flex items-center gap-2 text-sm text-black/60">
              <MapPin className="h-4 w-4" />
              {item.offline_location}
            </div>
          )}

          {measurements && (
            <GlassCard className="mt-8" hover={false}>
              <h2 className="mb-4 text-sm font-semibold uppercase text-black/60">
                Measurements (cm)
              </h2>

              <div className="grid grid-cols-2 gap-4">
                {measurementLabels.map(({ key, label }) => {
                  const value = measurements[key]
                  if (!value) return null
                  return (
                    <div key={key}>
                      <p className="text-sm text-black/50">{label}</p>
                      <p className="text-lg font-medium">{value}</p>
                    </div>
                  )
                })}
              </div>
            </GlassCard>
          )}

          <div className="mt-8 flex flex-col gap-3">
            {isSold ? (
              <GlassButton disabled className="w-full opacity-50">
                This item has been sold
              </GlassButton>
            ) : (
              <>
                <AddToCartButton 
                  item={{
                    id: item.id,
                    title: item.title,
                    price: item.price,
                    slug: item.slug
                  }}
                  imageUrl={primaryImage?.image_url}
                  size="lg"
                  className="w-full"
                />
                <GlassButton onClick={handleWhatsAppClick} className="w-full gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Buy via WhatsApp
                </GlassButton>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}