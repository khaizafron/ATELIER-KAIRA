"use client"

import Link from "next/link"
import Image from "next/image"
import { GlassCard } from "@/components/glass"
import { AddToCartButton } from "@/components/AddToCartButton"
import { getPublicImageUrl } from "@/lib/supabase/storage" // ✅ ADD THIS

interface ItemCardProps {
  item: {
    id: string
    title: string
    price: number
    slug: string
    status: string
    images?: Array<{
      id: string
      image_url: string
      is_primary: boolean
    }>
  }
  index?: number
}

export function ItemCardWithCart({ item, index = 0 }: ItemCardProps) {
  const primaryImage = item.images?.find((img) => img.is_primary) || item.images?.[0]
  const imageUrl = getPublicImageUrl(primaryImage?.image_url) // ✅ ADD THIS
  const isSold = item.status === 'sold' || item.status === 'offline_sold'

  return (
    <GlassCard 
      className="group overflow-hidden p-0 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl animate-scale-in" 
      style={{ animationDelay: `${index * 0.1}s`, opacity: 0 }}
    >
      <Link href={`/collection/${item.slug}`}>
        <div className="relative aspect-[3/4] w-full overflow-hidden">
          {imageUrl ? ( // ✅ CHANGE THIS
            <Image
              src={imageUrl} // ✅ CHANGE THIS
              alt={item.title}
              fill
              className={`object-cover transition-transform duration-700 group-hover:scale-110 ${isSold ? 'opacity-60' : ''}`}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-black/5 to-black/10">
              <span className="text-black/30 font-medium">No image</span>
            </div>
          )}
          {isSold && (
            <div className="absolute left-4 top-4 z-10 rounded-full bg-black/80 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              Sold
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </div>
      </Link>
      <div className="p-6 space-y-3">
        <Link href={`/collection/${item.slug}`}>
          <h3 className="text-lg font-semibold text-black/90 mb-2 group-hover:text-black transition-colors">{item.title}</h3>
          <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            RM {Number(item.price).toFixed(0)}
          </p>
        </Link>
        {!isSold && (
          <AddToCartButton 
            item={{
              id: item.id,
              title: item.title,
              price: item.price,
              slug: item.slug
            }}
            imageUrl={imageUrl} // ✅ CHANGE THIS
            size="sm"
            className="w-full"
          />
        )}
      </div>
    </GlassCard>
  )
}