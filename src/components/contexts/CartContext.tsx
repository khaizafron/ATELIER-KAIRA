"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface CartItem {
  id: string
  title: string
  price: number
  slug: string
  image_url?: string
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (itemId: string) => void
  clearCart: () => void
  cartCount: number
  isLoading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Validate cart items against database
  const validateCart = async (items: CartItem[]) => {
    if (items.length === 0) return items

    try {
      const itemIds = items.map(item => item.id)
      
      // Use API route to validate (bypasses RLS)
      const response = await fetch('/api/cart/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemIds })
      })
      
      if (!response.ok) {
        console.error("Cart validation API error")
        return items
      }
      
      const { validIds } = await response.json()
      
      return items.filter(item => validIds.includes(item.id))
    } catch (error) {
      console.error("Cart validation failed:", error)
      return items // Keep items if validation fails
    }
  }

  useEffect(() => {
    const loadCart = async () => {
      // Check version - force clear old carts
      const cartVersion = localStorage.getItem("ximy-cart-version")
      if (cartVersion !== "2") {
        localStorage.removeItem("ximy-cart")
        localStorage.setItem("ximy-cart-version", "2")
        setIsLoading(false)
        return
      }

      const saved = localStorage.getItem("ximy-cart")
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          const validated = await validateCart(parsed)
          setCartItems(validated)
          
          // Update localStorage if items were removed
          if (validated.length !== parsed.length) {
            localStorage.setItem("ximy-cart", JSON.stringify(validated))
          }
        } catch (e) {
          console.error("Failed to load cart", e)
        }
      }
      setIsLoading(false)
    }

    loadCart()
  }, [])

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("ximy-cart", JSON.stringify(cartItems))
    }
  }, [cartItems, isLoading])

  const addToCart = async (item: CartItem) => {
    // Verify item is still available before adding
    try {
      const response = await fetch('/api/cart/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemIds: [item.id] })
      })
      
      if (!response.ok) {
        // Add anyway if API fails
        setCartItems((prev) => {
          if (prev.find((i) => i.id === item.id)) return prev
          return [...prev, item]
        })
        return
      }
      
      const { validIds } = await response.json()
      
      if (!validIds.includes(item.id)) {
        alert("This item is no longer available")
        return
      }

      setCartItems((prev) => {
        if (prev.find((i) => i.id === item.id)) {
          return prev
        }
        return [...prev, item]
      })
    } catch (error) {
      console.error("Add to cart failed:", error)
      // Add anyway if validation fails
      setCartItems((prev) => {
        if (prev.find((i) => i.id === item.id)) return prev
        return [...prev, item]
      })
    }
  }

  const removeFromCart = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId))
  }

  const clearCart = () => {
    setCartItems([])
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        cartCount: cartItems.length,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}