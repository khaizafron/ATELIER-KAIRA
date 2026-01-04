'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ShieldCheck, Globe, ShoppingBag } from "lucide-react"
import { motion, useScroll, useSpring } from 'framer-motion'
import { Background3D } from "@/components/Background3D"
import { CustomCursor } from "@/components/CustomCursor"
import { HeroSection } from "@/components/HeroSection"
import { PremiumCard } from "@/components/PremiumCard"
import { MagneticButton } from "@/components/MagneticButton"
import { GlassButton } from "@/components/glass"
import { LogoCarousel } from "@/components/LogoCarousel"

export default function HomePage() {
  const [latestItems, setLatestItems] = useState<any[]>([])

  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    async function fetchItems() {
      const { data } = await supabase
        .from("items")
        .select(`
          *,
          images:item_images(*)
        `)
        .not("status", "in", '("sold","offline_sold")')
        .order("created_at", { ascending: false })
        .limit(3)
      
      if (data) setLatestItems(data)
    }
    
    fetchItems()
  }, [])

  return (
    <div className="relative min-h-screen bg-[#fafafa] selection:bg-purple-100 selection:text-purple-600">
      <CustomCursor />
      <Background3D />
      
      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 origin-left z-50"
        style={{ scaleX }}
      />

      <HeroSection />
      <LogoCarousel />


      <main className="relative z-10 px-4 md:px-8">
        {/* ===== LATEST ARRIVALS ===== */}
        <section className="py-32 max-w-7xl mx-auto">
          <div className="mb-20 space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 text-purple-600 font-bold tracking-widest text-xs uppercase"
            >
              <div className="w-8 h-px bg-purple-600" />
              New Curation
            </motion.div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-5xl font-bold text-black"
              >
                Latest Arrivals
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-md text-black/40 text-lg"
              >
                Discover the latest additions to our vault, meticulously selected for their timeless appeal and quality.
              </motion.p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {latestItems.map((item, index) => {
              const formattedItem = {
                id: item.id,
                title: item.title,
                slug: item.slug,
                description: item.description,
                price: item.price,
                status: item.status,
                offline_location: item.offline_location,
                created_at: item.created_at,
                updated_at: item.updated_at,
                images: item.images?.map((img: any) => ({
                  id: img.id,
                  item_id: img.item_id,
                  image_url: img.image_url,
                  is_primary: img.is_primary,
                  display_order: img.display_order,
                  created_at: img.created_at
                })) || [],
                measurements: null
              }

              return (
                <Link
  key={item.id}
  href={`/collection/${item.slug}`}
  className="block"
>
  <PremiumCard item={formattedItem} index={index} />
</Link>

              )
            })}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 flex justify-center"
          >
            <MagneticButton>
              <Link href="/collection">
                <GlassButton size="lg" variant="outline" className="gap-3 shadow-xl hover:shadow-2xl">
                  <span className="font-bold uppercase tracking-wider text-sm">View Full Collection</span>
                  <ShoppingBag className="h-5 w-5" />
                </GlassButton>
              </Link>
            </MagneticButton>
          </motion.div>
        </section>

{/* ===== FEATURES / WHY CHOOSE ===== */}
<section className="py-24 md:py-40 max-w-7xl mx-auto px-2">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start lg:items-center">

    {/* LEFT CONTENT */}
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl md:text-6xl font-bold leading-tight text-black">
          Authenticity is <br />
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            our foundation.
          </span>
        </h2>

        <p className="mt-4 text-base md:text-xl text-black/50 leading-relaxed max-w-lg">
          Every piece in Ximy Vault undergoes a rigorous verification process.
          We don’t just sell vintage; we preserve legacy.
        </p>
      </motion.div>

      {/* FEATURE CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {[
          {
            icon: ShieldCheck,
            title: "Verified",
            desc: "Expert authentication for every single item."
          },
          {
            icon: Globe,
            title: "Curated",
            desc: "Sourced globally from the finest collections."
          }
        ].map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="flex gap-4 p-5 rounded-2xl bg-white/50 backdrop-blur-md border border-white shadow-lg"
          >
            <div className="w-11 h-11 flex-shrink-0 rounded-xl bg-black flex items-center justify-center text-white">
              <feature.icon className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-base font-bold">{feature.title}</h4>
              <p className="text-sm text-black/40 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>

    {/* RIGHT IMAGE */}
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="relative aspect-[4/5] lg:aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl"
    >
      <Image
        src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=1200"
        alt="Vintage Showcase"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6 md:p-10">
        <h3 className="text-white text-2xl font-bold mb-1">
          Visit Our Atelier
        </h3>
        <p className="text-white/70 text-sm mb-4">
          Experience the texture and history in person.
        </p>
        <Link href="/visit-us">
          <GlassButton
            variant="outline"
            className="gap-2 bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-md"
          >
            Locations <ArrowRight className="h-4 w-4" />
          </GlassButton>
        </Link>
      </div>
    </motion.div>

  </div>
</section>
      </main>
    </div>
  )
}