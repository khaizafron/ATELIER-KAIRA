"use client"

import { useState, useCallback } from "react"
import { X, Upload, GripVertical } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface UploadedImage {
  id: string
  url: string
  file?: File
}

interface ImageUploadProps {
  images: UploadedImage[]
  onImagesChange: (images: UploadedImage[]) => void
  maxImages?: number
}

export function ImageUpload({ images, onImagesChange, maxImages = 10 }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleFileChange = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    if (images.length >= maxImages) {
      alert(`Maximum ${maxImages} images allowed`)
      return
    }

    const newFiles = Array.from(files).slice(0, maxImages - images.length)
    const newImages: UploadedImage[] = newFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      file,
    }))

    onImagesChange([...images, ...newImages])
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      handleFileChange(e.dataTransfer.files)
    },
    [images, maxImages]
  )

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const removeImage = (id: string) => {
    const image = images.find((img) => img.id === id)
    if (image?.url.startsWith("blob:")) {
      URL.revokeObjectURL(image.url)
    }
    onImagesChange(images.filter((img) => img.id !== id))
  }

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...images]
    const [removed] = newImages.splice(fromIndex, 1)
    newImages.splice(toIndex, 0, removed)
    onImagesChange(newImages)
  }

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
          isDragging
            ? "border-black/40 bg-black/5"
            : "border-black/20 bg-white/50 hover:border-black/30"
        }`}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFileChange(e.target.files)}
          className="absolute inset-0 cursor-pointer opacity-0"
          disabled={images.length >= maxImages}
        />
        <div className="pointer-events-none">
          <Upload className="mx-auto mb-3 h-10 w-10 text-black/40" />
          <p className="mb-1 text-sm font-medium text-black/70">
            {images.length >= maxImages
              ? `Maximum ${maxImages} images reached`
              : "Drop images here or click to upload"}
          </p>
          <p className="text-xs text-black/50">
            {images.length} / {maxImages} images uploaded
          </p>
        </div>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="group relative aspect-square overflow-hidden rounded-2xl bg-black/5"
              draggable
              onDragStart={(e) => {
                e.dataTransfer.effectAllowed = "move"
                e.dataTransfer.setData("text/plain", index.toString())
              }}
              onDragOver={(e) => {
                e.preventDefault()
                e.dataTransfer.dropEffect = "move"
              }}
              onDrop={(e) => {
                e.preventDefault()
                const fromIndex = parseInt(e.dataTransfer.getData("text/plain"))
                if (fromIndex !== index) {
                  moveImage(fromIndex, index)
                }
              }}
            >
              <img
                src={image.url}
                alt={`Upload ${index + 1}`}
                className="h-full w-full object-cover"
              />
              {index === 0 && (
                <div className="absolute left-2 top-2 rounded-lg bg-black/70 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  Primary
                </div>
              )}
              <div className="absolute right-2 top-2 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => removeImage(image.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/90 text-white backdrop-blur-sm transition-colors hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="absolute bottom-2 right-2 cursor-move opacity-0 transition-opacity group-hover:opacity-100">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/70 text-white backdrop-blur-sm">
                  <GripVertical className="h-4 w-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
