"use client"

import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import { GlassCard } from "@/components/glass"
import { ItemCardWithCart } from "@/components/ItemCardWithCart"

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

export default function CollectionClient({
  items,
}: {
  items: any[]
}) {
  const [query, setQuery] = useState("")

  const filteredItems = useMemo(() => {
    const q = normalize(query)
    if (!q) return items

    return items.filter((item) => {
      // 🔥 USE REAL DB COLUMN: title
      const searchable = normalize(
        `${item.title ?? ""} ${item.description ?? ""}`
      )

      return searchable.includes(q)
    })
  }, [query, items])

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20">
      <div className="mb-12">
        <h1 className="text-3xl font-semibold text-black/90">
          Collection
        </h1>
        <p className="mt-2 text-black/60">
          Search by brand, material, or style
        </p>
      </div>

      <div className="mb-12">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-black/40" />
          <input
            type="search"
            placeholder="Search ZARA, PRADA, Louis, jacket…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="
              w-full rounded-2xl border border-black/10
              bg-white/70 px-12 py-4 text-sm
              text-black placeholder:text-black/40
              shadow-sm backdrop-blur-md
              transition
              focus:border-black/30 focus:outline-none
            "
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item, index) => (
          <ItemCardWithCart
            key={item.id}
            item={item}
            index={index}
          />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <GlassCard className="py-24 text-center">
          <p className="text-black/60">
            No items match your search.
          </p>
        </GlassCard>
      )}
    </div>
  )
}
