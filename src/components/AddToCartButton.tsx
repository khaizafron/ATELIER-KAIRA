"use client"

import { useCart } from "@/components/contexts/CartContext"
import { GlassButton } from "@/components/glass"
import { ShoppingCart, Check } from "lucide-react"
import { useState, useEffect } from "react"

interface AddToCartButtonProps {
  item: {
    id: string
    title: string
    price: number
    slug: string
  }
  imageUrl?: string
  variant?: "default" | "outline"
  size?: "default" | "lg" | "sm"
  className?: string
}

export function AddToCartButton({ item, imageUrl, variant = "default", size = "default", className }: AddToCartButtonProps) {
  const { addToCart, cartItems, isLoading } = useCart()
  const [justAdded, setJustAdded] = useState(false)
  
  const isInCart = !isLoading && cartItems.some((i) => i.id === item.id)

  useEffect(() => {
    if (!isInCart) {
      setJustAdded(false)
    }
  }, [isInCart])

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isInCart || isLoading) return
    
    addToCart({
      id: item.id,
      title: item.title,
      price: item.price,
      slug: item.slug,
      image_url: imageUrl,
    })
    
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 2000)
  }

  if (isLoading) {
    return (
      <GlassButton
        variant={variant}
        size={size}
        className={`gap-2 ${className}`}
        disabled
      >
        <ShoppingCart className="h-4 w-4" />
        Loading...
      </GlassButton>
    )
  }

  if (isInCart) {
    return (
      <GlassButton
        variant="outline"
        size={size}
        className={`gap-2 ${className}`}
        disabled
      >
        <Check className="h-4 w-4" />
        In Cart
      </GlassButton>
    )
  }

  return (
    <GlassButton
      variant={variant}
      size={size}
      onClick={handleAddToCart}
      className={`gap-2 ${className} ${justAdded ? 'bg-green-500/20' : ''}`}
    >
      <ShoppingCart className="h-4 w-4" />
      {justAdded ? "Added!" : "Add to Cart"}
    </GlassButton>
  )
}