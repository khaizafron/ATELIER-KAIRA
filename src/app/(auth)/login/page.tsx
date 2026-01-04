"use client"

import { GlassCard, GlassButton } from "@/components/glass"
import { createClient } from "@/lib/supabase/client"
import { useState } from "react"
import { Lock } from "lucide-react"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      await new Promise(resolve => setTimeout(resolve, 500))
      window.location.href = "/admin/dashboard"
    }
  }

  const inputClass = "w-full rounded-2xl border border-black/10 bg-white/50 px-4 py-3 text-black/90 placeholder-black/40 backdrop-blur-sm transition-all focus:border-black/30 focus:outline-none focus:ring-0"

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-gray-100 to-zinc-100">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-gradient-to-br from-gray-200/50 to-slate-200/50 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-zinc-200/50 to-neutral-200/50 blur-3xl" />
      </div>

      <div className="w-full max-w-md px-4">
        <GlassCard className="p-8">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-black/5">
              <Lock className="h-8 w-8 text-black/70" />
            </div>
            <h1 className="mb-2 text-2xl font-semibold text-black/90">Admin Login</h1>
            <p className="text-sm text-black/60">Sign in to access the admin dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="rounded-2xl bg-red-50/80 p-3 text-sm text-red-600 backdrop-blur-sm">
                {error}
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-black/70">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="admin@ximyvault.com"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black/70">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            <GlassButton type="submit" disabled={loading} className="w-full">
              {loading ? "Signing in..." : "Sign In"}
            </GlassButton>
          </form>
        </GlassCard>

        <p className="mt-6 text-center text-sm text-black/50">
          Ximy Vault Admin Portal
        </p>
      </div>
    </div>
  )
}