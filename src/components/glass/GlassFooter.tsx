"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

interface GlassFooterProps {
  className?: string
}

export function GlassFooter({ className }: GlassFooterProps) {
  return (
    <footer
      className={cn(
        "relative mx-auto mt-32 max-w-7xl px-4 pb-8 animate-fade-in",
        className
      )}
    >
      <div className="rounded-3xl border border-white/10 bg-white/40 px-8 py-12 shadow-2xl backdrop-blur-md dark:border-white/5 dark:bg-black/30 md:px-12 md:py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold tracking-tight text-black dark:text-white">
              Ximy Vault
            </h3>
            <p className="text-xs font-medium leading-relaxed text-black/50 dark:text-white/40">
              Curated vintage pieces.<br />Timeless style.
            </p>
            <p className="text-xs leading-relaxed text-black/40 dark:text-white/30">
              A carefully selected collection of vintage and modern pieces,
              chosen for quality, character, and individuality.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wide text-black/70 dark:text-white/60">
              Explore
            </h4>
            <nav className="flex flex-col gap-2.5">
              <Link
                href="/"
                className="text-xs text-black/50 transition-all hover:translate-x-0.5 hover:text-black dark:text-white/40 dark:hover:text-white"
              >
                Home
              </Link>
              <Link
                href="/collection"
                className="text-xs text-black/50 transition-all hover:translate-x-0.5 hover:text-black dark:text-white/40 dark:hover:text-white"
              >
                Collection
              </Link>
              <Link
                href="/about"
                className="text-xs text-black/50 transition-all hover:translate-x-0.5 hover:text-black dark:text-white/40 dark:hover:text-white"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-xs text-black/50 transition-all hover:translate-x-0.5 hover:text-black dark:text-white/40 dark:hover:text-white"
              >
                Contact
              </Link>
              <Link
                href="/visit-us"
                className="text-xs text-black/50 transition-all hover:translate-x-0.5 hover:text-black dark:text-white/40 dark:hover:text-white"
              >
                Visit Us
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wide text-black/70 dark:text-white/60">
              Contact
            </h4>
            <div className="flex flex-col gap-2.5 text-xs text-black/50 dark:text-white/40">
              <a
                href="mailto:admin@ximyvault.com"
                className="transition-all hover:translate-x-0.5 hover:text-black dark:hover:text-white"
              >
                ximyvault@gmail.com
              </a>
              <a
                href="https://wa.me/60149226456"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-all hover:translate-x-0.5 hover:text-black dark:hover:text-white"
              >
                +60 14-922 6456
              </a>
              <p>Johor Bahru, Malaysia</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wide text-black/70 dark:text-white/60">
              Follow Us
            </h4>
            <div className="flex flex-col gap-2.5 text-xs text-black/50 dark:text-white/40">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-all hover:translate-x-0.5 hover:text-black dark:hover:text-white"
              >
                Instagram
              </a>
              <a
                href="https://tiktok.com/@ximysthrifted13"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-all hover:translate-x-0.5 hover:text-black dark:hover:text-white"
              >
                TikTok
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-all hover:translate-x-0.5 hover:text-black dark:hover:text-white"
              >
                Facebook
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-black/5 pt-8 dark:border-white/5">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-xs text-black/40 dark:text-white/30">
              © {new Date().getFullYear()} Ximy Vault. All rights reserved.
            </p>
            <div className="flex gap-6 text-xs text-black/40 dark:text-white/30">
              <Link
                href="/privacy"
                className="transition-colors hover:text-black dark:hover:text-white"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="transition-colors hover:text-black dark:hover:text-white"
              >
                Terms of Use
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
