"use client"

import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/components/contexts/CartContext"
import { useState } from "react"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/collection", label: "Collection" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/visit-us", label: "Visit Us" },
]

export function GlassNavbar() {
  const { cartCount, isLoading } = useCart()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      <nav className="fixed left-0 right-0 top-0 z-50 mx-auto mt-4 max-w-5xl px-4">
        <div className="rounded-full border border-white/20 bg-white/70 px-6 py-3 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-black/50">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-xl font-semibold tracking-tight text-black dark:text-white"
            >
              Ximy Vault
            </Link>

            <div className="hidden items-center gap-6 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium transition-colors text-black/70 hover:text-black dark:text-white/70 dark:hover:text-white"
                >
                  {link.label}
                </Link>
              ))}

              <Link href="/cart">
                <button className="relative rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 p-2.5 shadow-lg transition-all hover:shadow-xl">
                  <ShoppingCart className="h-4 w-4 text-white" />
                  {!isLoading && cartCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                      {cartCount}
                    </span>
                  )}
                </button>
              </Link>
            </div>

            <div className="flex items-center gap-3 md:hidden">
              <Link href="/cart">
                <button className="relative rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 p-2.5 shadow-lg">
                  <ShoppingCart className="h-4 w-4 text-white" />
                  {!isLoading && cartCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                      {cartCount}
                    </span>
                  )}
                </button>
              </Link>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
                className="flex flex-col items-center justify-center gap-1.5"
              >
                <span
                  className={`h-0.5 w-5 rounded-full bg-black transition-all dark:bg-white ${
                    isMenuOpen ? "translate-y-2 rotate-45" : ""
                  }`}
                />
                <span
                  className={`h-0.5 w-5 rounded-full bg-black transition-all dark:bg-white ${
                    isMenuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`h-0.5 w-5 rounded-full bg-black transition-all dark:bg-white ${
                    isMenuOpen ? "-translate-y-2 -rotate-45" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      <div
        className={`fixed right-0 top-0 z-40 h-full w-64 border-l border-white/20 bg-white/90 shadow-2xl backdrop-blur-2xl transition-transform duration-300 dark:border-white/10 dark:bg-black/90 md:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col px-6 py-20">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="border-b border-black/10 py-4 text-base font-medium transition-all hover:translate-x-1 dark:border-white/10 text-black/70 dark:text-white/70"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}