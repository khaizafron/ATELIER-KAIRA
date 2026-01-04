import { GlassNavbar, GlassFooter } from "@/components/glass"
import { CartProvider } from "@/components/contexts/CartContext"
import { Caveat } from 'next/font/google'

const caveat = Caveat({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-hand'
})

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CartProvider>
      {/* ⬇️ THIS IS THE CRITICAL LINE */}
     <div className={`${caveat.variable} min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20`}>

        
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-gradient-to-br from-blue-100/50 to-purple-100/50 blur-3xl" />
          <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-pink-100/50 to-orange-100/50 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-cyan-100/30 to-teal-100/30 blur-3xl" />
        </div>

        <GlassNavbar />
        <main className="pt-24">
          {children}
          <GlassFooter />
        </main>

      </div>
    </CartProvider>
  )
}
