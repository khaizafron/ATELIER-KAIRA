"use client"

import { cn } from "@/lib/utils"
import { ButtonHTMLAttributes, ReactNode } from "react"
import GlassSurface from "@/components/ui/glass-surface"

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: "primary" | "secondary" | "ghost" | "outline"
  size?: "sm" | "md" | "lg"
}

export function GlassButton({
  children,
  className,
  variant = "primary",
  size = "md",
  disabled,
  ...props
}: GlassButtonProps) {

  /* ================= SIZE ================= */

  const getSizeConfig = () => {
    switch (size) {
      case "sm":
        return { height: 40, padding: "px-4", text: "text-xs" }
      case "lg":
        return { height: 56, padding: "px-6", text: "text-sm" }
      case "md":
      default:
        return { height: 48, padding: "px-5", text: "text-sm" }
    }
  }

  /* ================= VARIANT ================= */

  const getVariantProps = () => {
    switch (variant) {
      case "primary":
        return {
          brightness: 0,
          opacity: 1,
          blur: 10,
          backgroundOpacity: 0.85,
          saturation: 1,
        }
      case "secondary":
        return {
          brightness: 80,
          opacity: 0.75,
          blur: 14,
          backgroundOpacity: 0.35,
          saturation: 1.4,
        }
      case "ghost":
        return {
          brightness: 55,
          opacity: 0.45,
          blur: 16,
          backgroundOpacity: 0.15,
          saturation: 1,
        }
      case "outline":
        return {
          brightness: 95,
          opacity: 0.25,
          blur: 18,
          backgroundOpacity: 0.08,
          saturation: 1.6,
        }
      default:
        return {}
    }
  }

  const { height, padding, text } = getSizeConfig()

  return (
    <button
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center",
        "rounded-[9999px]",
        "transition-all duration-300",
        "hover:scale-[1.02] active:scale-[0.98]",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "bg-transparent border-none",
        className
      )}
      {...props}
    >
      <GlassSurface
        height={height}
        borderRadius={9999}
        {...getVariantProps()}
        className={cn(
          "relative flex items-center justify-center gap-2",
          "whitespace-nowrap",
          padding,
          text,

          /* ===== DESKTOP BEHAVIOUR (ORIGINAL, UNTOUCHED) ===== */
          variant === "primary" && "bg-black/80 text-white"
        )}
      >
        {/* ===== MOBILE / TABLET FIX (NO DESKTOP EFFECT) ===== */}
        {variant === "primary" && (
          <div
            className="
              absolute inset-0 rounded-[inherit]
              bg-black
              opacity-95
              sm:hidden
              pointer-events-none
            "
          />
        )}

        {/* CONTENT */}
        <span className="relative z-10 inline-flex items-center gap-2">
          {children}
        </span>
      </GlassSurface>
    </button>
  )
}
