"use client"

import { useCart } from "@/components/contexts/CartContext"
import { GlassCard, GlassButton } from "@/components/glass"
import Image from "next/image"
import Link from "next/link"
import { Trash2, ShoppingBag, MessageCircle } from "lucide-react"

export default function CartPage() {
  const { cartItems, removeFromCart, clearCart, isLoading } = useCart()

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 pb-20">
        <h1 className="text-3xl font-semibold text-black/90 mb-10">Your Cart</h1>
        <GlassCard className="py-20 text-center">
          <p className="text-black/50">Loading cart...</p>
        </GlassCard>
      </div>
    )
  }

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0)

  const handleWhatsAppAll = () => {
    const baseUrl = window.location.origin
    const itemLinks = cartItems
      .map((item) => `${baseUrl}/collection/${item.slug}`)
      .join("\n")
    
    const message = `Hai! Barang ni masih ada?\n\n${itemLinks}\n\nTotal: RM ${totalPrice.toFixed(0)}`
    const whatsappUrl = `https://wa.me/60149226456?text=${encodeURIComponent(message)}`
    
    window.open(whatsappUrl, '_blank')
  }

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 pb-20">
        <h1 className="text-3xl font-semibold text-black/90 mb-10">Your Cart</h1>
        <GlassCard className="py-20 text-center">
          <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-black/20" />
          <h2 className="text-xl font-medium text-black/70 mb-2">Your cart is empty</h2>
          <p className="text-black/50 mb-6">Start adding items to your cart!</p>
          <Link href="/collection">
            <GlassButton>Browse Collection</GlassButton>
          </Link>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 pb-20">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-semibold text-black/90">Your Cart</h1>
        <GlassButton variant="outline" onClick={clearCart} className="gap-2">
          <Trash2 className="h-4 w-4" />
          Clear All
        </GlassButton>
      </div>

      <div className="space-y-6">
        {cartItems.map((item) => (
          <GlassCard key={item.id} className="overflow-hidden p-0">
            <div className="flex gap-4 p-4">
              <Link href={`/collection/${item.slug}`} className="flex-shrink-0">
                <div className="relative h-32 w-32 overflow-hidden rounded-2xl">
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-black/5">
                      <span className="text-black/30 text-xs">No image</span>
                    </div>
                  )}
                </div>
              </Link>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <Link href={`/collection/${item.slug}`}>
                    <h3 className="font-semibold text-black/90 hover:text-black transition-colors">
                      {item.title}
                    </h3>
                  </Link>
                  <p className="text-xl font-bold text-black/80 mt-1">
                    RM {Number(item.price).toFixed(0)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <GlassButton
                    variant="outline"
                    size="sm"
                    onClick={() => removeFromCart(item.id)}
                    className="gap-2"
                  >
                    <Trash2 className="h-3 w-3" />
                    Remove
                  </GlassButton>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <span className="text-lg font-medium text-black/70">Total</span>
          <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            RM {totalPrice.toFixed(0)}
          </span>
        </div>
        
        {cartItems.length >= 2 && (
          <GlassButton
            className="w-full gap-2"
            size="lg"
            onClick={handleWhatsAppAll}
          >
            <MessageCircle className="h-5 w-5" />
            Bring these items to the seller
          </GlassButton>
        )}
        
        {cartItems.length === 1 && (
          <Link href={`/collection/${cartItems[0].slug}`}>
            <GlassButton className="w-full gap-2" size="lg">
              <MessageCircle className="h-5 w-5" />
              View Item Details
            </GlassButton>
          </Link>
        )}
      </GlassCard>
    </div>
  )
}