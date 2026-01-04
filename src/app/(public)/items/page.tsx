import { createClient } from "@/lib/supabase/server"
import { GlassCard } from "@/components/glass"
import Link from "next/link"
import Image from "next/image"

export default async function ItemsPage() {
  const supabase = await createClient()
  
  const { data: items } = await supabase
    .from("items")
    .select(`
      *,
      images:item_images(*)
    `)
    .order("created_at", { ascending: false })

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-black/90">Collection</h1>
        <p className="mt-2 text-black/60">Browse our curated selection of vintage pieces</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items?.map((item) => {
          const primaryImage = item.images?.find((img: { is_primary: boolean }) => img.is_primary) || item.images?.[0]
          const isSold = item.status === 'sold' || item.status === 'offline_sold'
          
          return (
            <Link key={item.id} href={`/items/${item.slug}`}>
              <GlassCard className="group relative overflow-hidden p-0">
                {isSold && (
                  <div className="absolute left-4 top-4 z-10 rounded-full bg-black/80 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                    Sold
                  </div>
                )}
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-t-3xl">
                  {primaryImage ? (
                    <Image
                      src={primaryImage.image_url}
                      alt={item.title}
                      fill
                      className={`object-cover transition-transform duration-500 group-hover:scale-105 ${isSold ? 'opacity-60' : ''}`}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-black/5">
                      <span className="text-black/30">No image</span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-medium text-black/90">{item.title}</h3>
                  <p className="mt-1 text-lg font-semibold text-black">
                    RM {Number(item.price).toFixed(0)}
                  </p>
                </div>
              </GlassCard>
            </Link>
          )
        })}
      </div>

      {(!items || items.length === 0) && (
        <GlassCard className="py-20 text-center">
          <p className="text-black/60">No items available at the moment.</p>
        </GlassCard>
      )}
    </div>
  )
}
