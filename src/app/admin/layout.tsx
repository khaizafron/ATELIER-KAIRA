import { GlassSidebar } from "@/components/glass"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-zinc-100">
      <GlassSidebar />

      {/* 
        IMPORTANT:
        - Mobile: NO left margin
        - Desktop: ml-64
      */}
      <main className="min-h-screen p-4 pt-20 lg:ml-64 lg:p-8 lg:pt-8">
        {children}
      </main>
    </div>
  )
}
