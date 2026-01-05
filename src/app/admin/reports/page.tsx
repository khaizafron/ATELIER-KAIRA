import { createClient } from "@supabase/supabase-js"
import { GlassCard } from "@/components/glass"
import { Eye, MessageCircle, TrendingUp, Download, Printer, Filter, Calendar, BarChart3, PieChart, ArrowUpRight, ArrowDownRight, DollarSign } from "lucide-react"
import Link from "next/link"

type ItemRelation = { title: string } | { title: string }[] | null

function getItemTitle(item: ItemRelation): string {
  if (!item) return 'Unknown'
  if (Array.isArray(item)) return item[0]?.title || 'Unknown'
  return item.title || 'Unknown'
}

type ItemStat = {
  id: string
  title: string
  slug: string
  price: number
  status: string
  views: { count: number }[]
  clicks: { count: number }[]
}

type ViewData = {
  id: string
  created_at: string
  item: ItemRelation
}

type ClickData = {
  id: string
  created_at: string
  item: ItemRelation
}

export default async function AdminReportsPage() {
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

  const { data: items, error: itemsError } = await supabase
    .from("items")
    .select("*")
    .order("created_at", { ascending: false })

  if (itemsError) {
    console.error("Error fetching items:", itemsError)
    throw new Error("Failed to fetch items")
  }

  const itemsWithStats = await Promise.all(
    (items || []).map(async (item) => {
      const { count: viewCount } = await supabase
        .from("analytics_item_views")
        .select("*", { count: 'exact', head: true })
        .eq('item_id', item.id)
      
      const { count: clickCount } = await supabase
        .from("whatsapp_clicks")
        .select("*", { count: 'exact', head: true })
        .eq('item_id', item.id)

      return {
        ...item,
        views: Array(viewCount || 0).fill({}),
        clicks: Array(clickCount || 0).fill({})
      }
    })
  )

  const { data: views } = await supabase
    .from("analytics_item_views")
    .select(`id, created_at, item:items(title)`)
    .order("created_at", { ascending: false })
    .limit(10)

  const { data: clicks } = await supabase
    .from("whatsapp_clicks")
    .select(`id, created_at, item:items(title)`)
    .order("created_at", { ascending: false })
    .limit(10)

  const { count: totalViewsCount } = await supabase
    .from("analytics_item_views")
    .select("*", { count: 'exact', head: true })

  const { count: totalClicksCount } = await supabase
    .from("whatsapp_clicks")
    .select("*", { count: 'exact', head: true })

 

  const totalViews = totalViewsCount || 0
  const totalClicks = totalClicksCount || 0
  const conversionRate = totalViews ? (totalClicks / totalViews) * 100 : 0
  const totalRevenue = (items || [])
  .filter(item => item.status === "sold" || item.status === "offline_sold")
  .reduce((sum, item) => sum + Number(item.price || 0), 0)

 

  return (
    <div className="min-h-screen">
      <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-2 text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Analytics & Reports
          </h1>
          <p className="text-black/60">Comprehensive insights and performance metrics</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/reports/generate"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-500/50"
          >
            <BarChart3 className="h-5 w-5" />
            Generate Report
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <GlassCard className="group relative overflow-hidden transition-all hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="relative">
            <div className="mb-3 flex items-center justify-between">
              <div className="rounded-lg bg-purple-100 p-2">
                <Eye className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <p className="mb-1 text-sm text-black/60">Total Views</p>
            <p className="text-3xl font-bold text-black/90">{totalViews.toLocaleString()}</p>
          </div>
        </GlassCard>

        <GlassCard className="group relative overflow-hidden transition-all hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="relative">
            <div className="mb-3 flex items-center justify-between">
              <div className="rounded-lg bg-emerald-100 p-2">
                <MessageCircle className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
            <p className="mb-1 text-sm text-black/60">WhatsApp Clicks</p>
            <p className="text-3xl font-bold text-black/90">{totalClicks.toLocaleString()}</p>
          </div>
        </GlassCard>

        <GlassCard className="group relative overflow-hidden transition-all hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="relative">
            <div className="mb-3 flex items-center justify-between">
              <div className="rounded-lg bg-blue-100 p-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <p className="mb-1 text-sm text-black/60">Conversion Rate</p>
            <p className="text-3xl font-bold text-black/90">{conversionRate.toFixed(1)}%</p>
          </div>
        </GlassCard>

        <GlassCard className="group relative overflow-hidden transition-all hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="relative">
            <div className="mb-3 flex items-center justify-between">
              <div className="rounded-lg bg-pink-100 p-2">
                <DollarSign className="h-5 w-5 text-pink-600" />
              </div>
            </div>
            <p className="mb-1 text-sm text-black/60">Total Revenue</p>
            <p className="text-3xl font-bold text-black/90">RM {totalRevenue.toLocaleString()}</p>
          </div>
        </GlassCard>
      </div>

      {/* Item Performance Table */}
      <div className="mb-10">
        <GlassCard>
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 p-2">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-black/90">Item Performance</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-black/10 text-left text-sm text-black/60">
                  <th className="pb-4 font-semibold">Item</th>
                  <th className="pb-4 font-semibold">Price</th>
                  <th className="pb-4 font-semibold">Status</th>
                  <th className="pb-4 font-semibold text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Eye className="h-4 w-4" />
                      Views
                    </div>
                  </th>
                  <th className="pb-4 font-semibold text-center">
                    <div className="flex items-center justify-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      Clicks
                    </div>
                  </th>
                  <th className="pb-4 font-semibold text-center">CTR</th>
                </tr>
              </thead>
              <tbody>
                {itemsWithStats?.map((item) => {
                  const viewCount = Array.isArray(item.views) ? item.views.length : 0
                  const clickCount = Array.isArray(item.clicks) ? item.clicks.length : 0
                  const ctr = viewCount > 0 ? ((clickCount / viewCount) * 100).toFixed(1) : '0'
                  return (
                    <tr key={item.id} className="group border-b border-black/5 transition-colors hover:bg-black/5">
                      <td className="py-4 font-semibold text-black/90">{item.title}</td>
                      <td className="py-4 text-black/70">RM {Number(item.price).toFixed(0)}</td>
                      <td className="py-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          item.status === 'available' 
                            ? 'bg-green-100 text-green-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 text-center font-semibold text-black/70">{viewCount}</td>
                      <td className="py-4 text-center font-semibold text-black/70">{clickCount}</td>
                      <td className="py-4 text-center">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          parseFloat(ctr) > 10 
                            ? 'bg-green-100 text-green-700'
                            : parseFloat(ctr) > 5
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {ctr}%
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard>
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 p-2">
              <Eye className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-black/90">Recent Views</h2>
          </div>
          
          <div className="space-y-3">
            {views?.map((view) => (
              <div key={view.id} className="group flex items-center justify-between rounded-lg border border-black/5 p-3 transition-all hover:border-purple-200 hover:bg-purple-50/50">
                <span className="font-semibold text-black/80">
                  {getItemTitle(view.item as ItemRelation)}
                </span>
                <span className="text-sm text-black/50">
                  {new Date(view.created_at).toLocaleString()}
                </span>
              </div>
            ))}
            {(!views || views.length === 0) && (
              <p className="py-8 text-center text-black/50">No views recorded yet</p>
            )}
          </div>
        </GlassCard>

        <GlassCard>
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 p-2">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-black/90">Recent WhatsApp Clicks</h2>
          </div>
          
          <div className="space-y-3">
            {clicks?.map((click) => (
              <div key={click.id} className="group flex items-center justify-between rounded-lg border border-black/5 p-3 transition-all hover:border-emerald-200 hover:bg-emerald-50/50">
                <span className="font-semibold text-black/80">
                  {getItemTitle(click.item as ItemRelation)}
                </span>
                <span className="text-sm text-black/50">
                  {new Date(click.created_at).toLocaleString()}
                </span>
              </div>
            ))}
            {(!clicks || clicks.length === 0) && (
              <p className="py-8 text-center text-black/50">No clicks recorded yet</p>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}