"use client"

import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export function GlassCard({ children, className, hover = true }: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-3xl border border-white/20 bg-white/70 p-6 shadow-xl backdrop-blur-xl",
        "dark:border-white/10 dark:bg-white/5",
        hover && "transition-all duration-300 hover:border-white/30 hover:bg-white/80 hover:shadow-2xl dark:hover:bg-white/10",
        className
      )}
    >
      {children}
    </div>
  )
}
