import { createClient } from "@supabase/supabase-js"
import { GlassCard } from "@/components/glass"
import { Package, Eye, MessageCircle, DollarSign } from "lucide-react"
import DashboardClient from "./dashboard-client"
import AIInsightsCard from "@/components/AIInsightsCard"

export default async function AdminDashboardPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
  
  const [
    { count: totalItems },
    { count: availableItems },
    { count: soldItems },
    { count: totalViews },
    { count: totalWhatsAppClicks },
  ] = await Promise.all([
    supabase.from("items").select("*", { count: "exact", head: true }),
    supabase.from("items").select("*", { count: "exact", head: true }).eq("status", "available"),
    supabase.from("items").select("*", { count: "exact", head: true }).in("status", ["sold", "offline_sold"]),
    supabase.from("analytics_item_views").select("*", { count: "exact", head: true }),
    supabase.from("whatsapp_clicks").select("*", { count: "exact", head: true }),
  ])

  const { data: recentItems } = await supabase
    .from("items")
    .select("id, title, slug, price, status, created_at")
    .order("created_at", { ascending: false })
    .limit(5)

  const { data: cachedInsight } = await supabase
    .from("ai_insight_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  const stats = [
    { label: "Total Items", value: totalItems || 0, icon: Package, color: "text-blue-600" },
    { label: "Available", value: availableItems || 0, icon: DollarSign, color: "text-green-600" },
    { label: "Sold", value: soldItems || 0, icon: Package, color: "text-orange-600" },
    { label: "Total Views", value: totalViews || 0, icon: Eye, color: "text-purple-600" },
    { label: "WhatsApp Clicks", value: totalWhatsAppClicks || 0, icon: MessageCircle, color: "text-emerald-600" },
  ]

  return (
    <DashboardClient>
      <div className="mb-10">
        <AIInsightsCard
          initialInsight={cachedInsight?.insight_text}
          initialMetrics={cachedInsight?.metrics}
          cached={!!cachedInsight}
        />
      </div>

      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <GlassCard key={stat.label} className="flex items-center gap-4">
            <div className={`rounded-2xl bg-black/5 p-3 ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-black/60">{stat.label}</p>
              <p className="text-2xl font-semibold text-black/90">{stat.value}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      <GlassCard>
        <h2 className="mb-6 text-xl font-semibold text-black/90">Recent Items</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-black/10 text-left text-sm text-black/60">
                <th className="pb-4 font-medium">Title</th>
                <th className="pb-4 font-medium">Price</th>
                <th className="pb-4 font-medium">Status</th>
                <th className="pb-4 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {recentItems?.map((item) => (
                <tr key={item.id} className="border-b border-black/5">
                  <td className="py-4 font-medium text-black/90">{item.title}</td>
                  <td className="py-4 text-black/70">RM {Number(item.price).toFixed(0)}</td>
                  <td className="py-4">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      item.status === 'available' 
                        ? 'bg-green-100 text-green-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 text-black/60">
                    {new Date(item.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </DashboardClient>
  )
}