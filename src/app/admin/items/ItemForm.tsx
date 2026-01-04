"use client"

import { GlassButton } from "@/components/glass"
import { ImageUpload } from "@/components/ImageUpload"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface UploadedImage {
  id: string
  url: string
  file?: File
}

interface ItemFormProps {
  item?: {
    id: string
    title: string
    slug: string
    description: string | null
    price: number
    status: string
    offline_location: string | null
  }
  measurements?: {
    pit_to_pit: number | null
    body_length: number | null
    shoulder_width: number | null
    sleeve_length: number | null
    armhole: number | null
    bottom_hem: number | null
  }
}

// ========== IMAGE COMPRESSION HELPER ==========
async function compressImage(file: File, quality: number = 0.6, maxSize: number = 1600): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    
    reader.onload = (e) => {
      const img = new Image()
      img.src = e.target?.result as string
      
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!
        
        // Calculate dimensions (maintain aspect ratio)
        let width = img.width
        let height = img.height
        
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = (height / width) * maxSize
            width = maxSize
          } else {
            width = (width / height) * maxSize
            height = maxSize
          }
        }
        
        canvas.width = width
        canvas.height = height
        
        // Use better image smoothing
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, 0, 0, width, height)
        
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Compression failed'))
              return
            }
            
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            })
            
            resolve(compressedFile)
          },
          'image/jpeg',
          quality
        )
      }
      
      img.onerror = () => reject(new Error('Image load failed'))
    }
    
    reader.onerror = () => reject(new Error('File read failed'))
  })
}

export function ItemForm({ item, measurements }: ItemFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<UploadedImage[]>([])

  const [formData, setFormData] = useState({
    title: item?.title || "",
    description: item?.description || "",
    price: item?.price?.toString() || "",
    status: item?.status || "available",
    offline_location: item?.offline_location || "",
    pit_to_pit: measurements?.pit_to_pit?.toString() || "",
    body_length: measurements?.body_length?.toString() || "",
    shoulder_width: measurements?.shoulder_width?.toString() || "",
    sleeve_length: measurements?.sleeve_length?.toString() || "",
    armhole: measurements?.armhole?.toString() || "",
    bottom_hem: measurements?.bottom_hem?.toString() || "",
  })

  const generateSlug = (title: string) =>
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Prevent double submission
    if (loading) return
    
    setLoading(true)
    console.log("🚀 Form submit started")

    const slug = generateSlug(formData.title)

    try {
      if (item) {
        // UPDATE existing item
        const supabase = createClient()
        const { error: updateError } = await supabase
          .from("items")
          .update({
            title: formData.title,
            slug,
            description: formData.description || null,
            price: parseFloat(formData.price),
            status: formData.status,
            offline_location: formData.offline_location || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", item.id)

        if (updateError) {
          alert(`Update failed: ${updateError.message}`)
          return
        }

        const measurementData = {
          item_id: item.id,
          pit_to_pit: formData.pit_to_pit ? parseFloat(formData.pit_to_pit) : null,
          body_length: formData.body_length ? parseFloat(formData.body_length) : null,
          shoulder_width: formData.shoulder_width ? parseFloat(formData.shoulder_width) : null,
          sleeve_length: formData.sleeve_length ? parseFloat(formData.sleeve_length) : null,
          armhole: formData.armhole ? parseFloat(formData.armhole) : null,
          bottom_hem: formData.bottom_hem ? parseFloat(formData.bottom_hem) : null,
        }

        await supabase.from("item_measurements").upsert(measurementData, { onConflict: "item_id" })
      } else {
        // ✅ CREATE new item - GET TOKEN FIRST
        const supabase = createClient()
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        if (!session?.access_token || sessionError) {
          alert("Authentication failed. Please login again.")
          router.push("/admin/login")
          return
        }

        // Build FormData
        const fd = new FormData()
        Object.entries(formData).forEach(([k, v]) => fd.append(k, v as string))
        
        // ✅ AGGRESSIVE COMPRESSION - 10 IMAGES NO ERROR!
        console.log(`📸 Processing ${images.length} images...`)
        
        // Limit: 10 images max
        if (images.length > 10) {
          alert("Maximum 10 images allowed.")
          setLoading(false)
          return
        }
        
        let totalSize = 0
        const maxTotalSize = 3.5 * 1024 * 1024 // 3.5MB total limit (safer for mobile)
        
        for (let idx = 0; idx < images.length; idx++) {
          const img = images[idx]
          if (!img.file) continue
          
          let fileToUpload = img.file
          
          // ULTRA AGGRESSIVE for mobile: Compress ALL images
          console.log(`🗜️ Compressing image ${idx + 1} (${(img.file.size / 1024).toFixed(0)}KB)...`)
          
          try {
            // Dynamic quality based on file size AND total images
            let quality = 0.5 // Default 50% (ultra aggressive)
            let maxDimension = 1400 // Smaller for mobile
            
            // Adjust based on file size
            if (img.file.size > 3 * 1024 * 1024) {
              quality = 0.4 // Huge files: 40%
              maxDimension = 1200
            } else if (img.file.size > 2 * 1024 * 1024) {
              quality = 0.45 // Very large: 45%
              maxDimension = 1400
            } else if (img.file.size > 1 * 1024 * 1024) {
              quality = 0.5 // Large: 50%
            } else if (img.file.size > 500 * 1024) {
              quality = 0.55 // Medium: 55%
            } else {
              quality = 0.6 // Small: 60%
            }
            
            // Further reduce quality if many images
            if (images.length >= 8) {
              quality = quality * 0.85 // Reduce by 15% if 8+ images
              maxDimension = 1200
            }
            
            const compressed = await compressImage(img.file, quality, maxDimension)
            fileToUpload = compressed
            
            const originalKB = (img.file.size / 1024).toFixed(0)
            const compressedKB = (compressed.size / 1024).toFixed(0)
            const savings = ((1 - compressed.size / img.file.size) * 100).toFixed(0)
            
            console.log(`✅ Image ${idx + 1}: ${originalKB}KB → ${compressedKB}KB (saved ${savings}%)`)
          } catch (err) {
            console.error("Compression failed:", err)
            alert(`Failed to compress image ${idx + 1}. Try a smaller/different image.`)
            setLoading(false)
            return
          }
          
          // Hard limit per image: 800KB after compression (mobile friendly)
          if (fileToUpload.size > 800 * 1024) {
            alert(`Image ${idx + 1} is ${(fileToUpload.size / 1024).toFixed(0)}KB after compression. Max 800KB per image. Please use smaller images or reduce quantity.`)
            setLoading(false)
            return
          }
          
          totalSize += fileToUpload.size
          
          // Check total as we go (prevent memory issues on mobile)
          if (totalSize > maxTotalSize) {
            alert(`Total size reached ${(totalSize / 1024 / 1024).toFixed(1)}MB (max 3.5MB). Please remove some images or use smaller files.`)
            setLoading(false)
            return
          }
          
          fd.append(`image${idx}`, fileToUpload)
        }
        
        const totalMB = (totalSize / 1024 / 1024).toFixed(2)
        console.log(`📦 Total payload: ${totalMB}MB for ${images.length} images`)
        
        console.log(`✅ All ${images.length} images ready (${totalMB}MB total)`)

        // ✅ SEND REQUEST WITH TOKEN (3 methods untuk ensure compatibility)
        console.log("📡 Sending request...")
        const res = await fetch("/api/admin/items", {
          method: "POST",
          headers: {
            // Method 1: Authorization header (traditional)
            "Authorization": `Bearer ${session.access_token}`,
          },
          body: fd,
          credentials: "include", // Method 2: Send cookies (Vercel needs this)
        })

        console.log("📥 Response status:", res.status)

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ error: "Unknown error" }))
          throw new Error(errorData.error || `HTTP ${res.status}`)
        }

        const json = await res.json()
        if (!json.success) {
          throw new Error(json.error || "Create failed")
        }

        console.log("✅ Item created:", json.item)
      }

      alert(`Item "${formData.title}" ${item ? "updated" : "created"} successfully!`)
      
      // Force revalidate collection page
      router.push("/admin/items")
      router.refresh() // Refresh current route
      
      // Also revalidate collection page for public
      fetch("/api/revalidate?path=/collection", { method: "POST" }).catch(() => {})
      
    } catch (err: any) {
      console.error("❌ Form submission error:", err)
      alert(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    "w-full rounded-2xl border border-black/10 bg-white/50 px-4 py-3 text-black/90 placeholder-black/40 backdrop-blur-sm transition-all focus:border-black/30 focus:outline-none focus:ring-0"

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="mb-2 block text-sm font-medium text-black/70">Title *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className={inputClass}
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-black/70">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className={`${inputClass} min-h-24 resize-none`}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-black/70">Price (RM) *</label>
          <input
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-black/70">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className={inputClass}
          >
            <option value="available">Available</option>
            <option value="sold">Sold</option>
            <option value="offline_sold">Offline Sold</option>
          </select>
        </div>
      </div>

      {!item && (
        <div>
          <label className="mb-2 block text-sm font-medium text-black/70">
            Images (Max 10)
          </label>
          <ImageUpload images={images} onImagesChange={setImages} maxImages={10} />
          <p className="mt-2 text-xs text-black/50">
            Image usage is optimized to deliver the best experience on every device.
          </p>
        </div>
      )}

      <div>
        <label className="mb-2 block text-sm font-medium text-black/70">Offline Location</label>
        <input
          type="text"
          value={formData.offline_location}
          onChange={(e) => setFormData({ ...formData, offline_location: e.target.value })}
          className={inputClass}
          placeholder="e.g., Kuala Lumpur Store"
        />
      </div>

      <div className="border-t border-black/10 pt-6">
        <h3 className="mb-4 font-semibold text-black/80">Measurements (cm)</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {[
            { key: "pit_to_pit", label: "Pit to Pit" },
            { key: "body_length", label: "Body Length" },
            { key: "shoulder_width", label: "Shoulder Width" },
            { key: "sleeve_length", label: "Sleeve Length" },
            { key: "armhole", label: "Armhole" },
            { key: "bottom_hem", label: "Bottom Hem" },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="mb-2 block text-sm font-medium text-black/70">{label}</label>
              <input
                type="number"
                step="0.1"
                value={formData[key as keyof typeof formData]}
                onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                className={inputClass}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <GlassButton 
          type="submit" 
          disabled={loading}
          className="flex-1"
          onClick={(e) => {
            // Ensure button works on mobile
            if (loading) {
              e.preventDefault()
              e.stopPropagation()
            }
          }}
        >
          {loading ? "Saving..." : item ? "Update Item" : "Create Item"}
        </GlassButton>
        <GlassButton 
          type="button" 
          variant="secondary" 
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </GlassButton>
      </div>
    </form>
  )
}