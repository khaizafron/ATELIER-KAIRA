'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

const logos = Array.from({ length: 20 }, (_, i) => `/loop-logos/${i + 1}.png`)

export function LogoCarousel() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (!trackRef.current) return

    // total scroll width (duplicated content)
    const scrollWidth = trackRef.current.scrollWidth
    setWidth(scrollWidth / 2)
  }, [])

  return (
    <div className="relative w-full overflow-hidden py-16">
      {/* LEFT FADE */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 sm:w-24 lg:w-32 bg-gradient-to-r from-[#fafafa] to-transparent" />

      {/* RIGHT FADE */}
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 sm:w-24 lg:w-32 bg-gradient-to-l from-[#fafafa] to-transparent" />

      <motion.div
        ref={trackRef}
        className="flex items-center gap-16 w-max"
        animate={{ x: [0, -width] }}
        transition={{
          ease: 'linear',
          duration: 100, // ⬅ slow, premium motion
          repeat: Infinity
        }}
      >
        {/* duplicate ONCE for seamless loop */}
        {[...logos, ...logos].map((src, i) => (
          <div
            key={i}
            className="relative h-14 sm:h-16 w-32 sm:w-40 flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity duration-300"
          >
            <Image
              src={src}
              alt={`Brand logo ${i + 1}`}
              fill
              className="object-contain"
              priority={i < 6}
            />
          </div>
        ))}
      </motion.div>
    </div>
  )
}
