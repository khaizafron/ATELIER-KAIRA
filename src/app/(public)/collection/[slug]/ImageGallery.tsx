'use client'

import { useState } from 'react'
import Image from 'next/image'
import FluidGlassImage from '@/components/FluidGlassImage'

interface ItemImage {
  id: string
  image_url: string
  is_primary: boolean
}

interface ImageGalleryProps {
  images: ItemImage[]
  title: string
  isSold: boolean
}

export function ImageGallery({ images, title, isSold }: ImageGalleryProps) {
  const primaryImage = images?.find((img) => img.is_primary) || images?.[0]
  const [selectedImage, setSelectedImage] = useState(primaryImage?.image_url || '')

  if (!images || images.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-black/5">
        <span className="text-black/30">No image</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main image with FluidGlass effect */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl">
        <FluidGlassImage>
          <Image
            src={selectedImage}
            alt={title}
            fill
            className={`object-cover transition-opacity duration-300 ${isSold ? 'opacity-60' : ''}`}
            priority
          />
        </FluidGlassImage>
        
        {isSold && (
          <div className="absolute left-4 top-4 rounded-full bg-black/80 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm z-20">
            Sold
          </div>
        )}
      </div>
      
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((img) => (
            <button
              key={img.id}
              onClick={() => setSelectedImage(img.image_url)}
              className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all hover:scale-105 hover:opacity-100 ${
                selectedImage === img.image_url
                  ? 'border-black/30 opacity-100 ring-2 ring-black/20'
                  : 'border-transparent opacity-60'
              }`}
            >
              <Image
                src={img.image_url}
                alt=""
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}