import { createClient } from "@/lib/supabase/server"
import { GlassCard, GlassButton } from "@/components/glass"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, MessageCircle, MapPin } from "lucide-react"
import { WhatsAppButton } from "../../items/[slug]/WhatsAppButton"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function ItemDetailPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()
  
  const { data: item } = await supabase
    .from("items")
    .select(`
      *,
      images:item_images(*),
      measurements:item_measurements(*)
    `)
    .eq("slug", slug)
    .single()

  if (!item) {
    notFound()
  }

  const primaryImage = item.images?.find((img: { is_primary: boolean }) => img.is_primary) || item.images?.[0]
  const isSold = item.status === 'sold' || item.status === 'offline_sold'
  const measurements = item.measurements?.[0] || item.measurements

  const measurementLabels = [
    { key: 'pit_to_pit', label: 'Pit to Pit' },
    { key: 'body_length', label: 'Body Length' },
    { key: 'shoulder_width', label: 'Shoulder Width' },
    { key: 'sleeve_length', label: 'Sleeve Length' },
    { key: 'armhole', label: 'Armhole' },
    { key: 'bottom_hem', label: 'Bottom Hem' },
  ]

  return (
    <div className="mx-auto max-w-5xl px-4 pb-20">
      <Link 
        href="/items" 
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-black/60 transition-colors hover:text-black"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Collection
      </Link>

      <div className="grid gap-10 lg:grid-cols-2">
        <GlassCard className="overflow-hidden p-0">
          <div className="relative aspect-[3/4] w-full">
            {primaryImage ? (
              <Image
                src={primaryImage.image_url}
                alt={item.title}
                fill
                className={`object-cover ${isSold ? 'opacity-60' : ''}`}
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-black/5">
                <span className="text-black/30">No image</span>
              </div>
            )}
            {isSold && (
              <div className="absolute left-4 top-4 rounded-full bg-black/80 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                Sold
              </div>
            )}
          </div>
          
          {item.images && item.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto p-4">
              {item.images.map((img: { id: string; image_url: string }) => (
                <div key={img.id} className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src={img.image_url}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </GlassCard>

        <div className="flex flex-col">
          <h1 className="text-3xl font-semibold text-black/90">{item.title}</h1>
          <p className="mt-3 text-3xl font-semibold text-black">
            RM {Number(item.price).toFixed(0)}
          </p>
          
          {item.description && (
            <p className="mt-6 leading-relaxed text-black/70">{item.description}</p>
          )}

          {item.offline_location && (
            <div className="mt-6 flex items-center gap-2 text-sm text-black/60">
              <MapPin className="h-4 w-4" />
              <span>Available at: {item.offline_location}</span>
            </div>
          )}

          {measurements && (
            <GlassCard className="mt-8" hover={false}>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-black/60">
                Measurements (cm)
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {measurementLabels.map(({ key, label }) => {
                  const value = measurements[key as keyof typeof measurements]
                  if (!value) return null
                  return (
                    <div key={key}>
                      <p className="text-sm text-black/50">{label}</p>
                      <p className="text-lg font-medium text-black/90">{value}</p>
                    </div>
                  )
                })}
              </div>
            </GlassCard>
          )}

          <div className="mt-8">
            {isSold ? (
              <GlassButton disabled className="w-full cursor-not-allowed opacity-50">
                This item has been sold
              </GlassButton>
            ) : (
              <WhatsAppButton item={item} primaryImage={primaryImage} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
