"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  FileText,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useState } from "react"

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/items", label: "Items", icon: Package },
  { href: "/admin/reports", label: "Reports", icon: FileText },
]

export function GlassSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-white/80 px-4 py-3 backdrop-blur-xl lg:hidden">
        <span className="text-lg font-semibold">Ximy Admin</span>
        <button onClick={() => setOpen(true)}>
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* BACKDROP */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={cn(
          // DESKTOP: always visible
          "hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:flex lg:w-64 lg:flex-col lg:bg-white/90 lg:p-6 lg:backdrop-blur-2xl lg:border-r",

          // MOBILE: ONLY render when open
          open &&
            "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white/95 p-6 backdrop-blur-2xl lg:hidden"
        )}
      >
        {/* HEADER */}
        <div className="mb-10 flex items-center justify-between">
          <Link href="/admin/dashboard" className="text-2xl font-semibold">
            Ximy Admin
          </Link>
          <button onClick={() => setOpen(false)} className="lg:hidden">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* NAV */}
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                  isActive
                    ? "bg-black/10 text-black"
                    : "text-black/60 hover:bg-black/5 hover:text-black"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-black/60 hover:bg-black/5 hover:text-black"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </aside>
    </>
  )
}
