import { createClient } from "@supabase/supabase-js"
import ReportClient from "./report-client"

type ItemStat = {
  id: string
  title: string
  slug: string
  price: number
  status: string
  viewCount: number
  clickCount: number
}

type SearchParams = {
  range?: 'today' | 'week' | 'month' | 'year' | 'all'
}

export default async function GenerateReportPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const dateRange = params.range || 'all'

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

  /* ---------------- DATE FILTER (ANALYTICS ONLY) ---------------- */
  const getDateFilter = () => {
    const now = new Date()
    switch (dateRange) {
      case 'today':
        return new Date(now.setHours(0, 0, 0, 0)).toISOString()
      case 'week':
        return new Date(now.setDate(now.getDate() - 7)).toISOString()
      case 'month':
        return new Date(now.setMonth(now.getMonth() - 1)).toISOString()
      case 'year':
        return new Date(now.setFullYear(now.getFullYear() - 1)).toISOString()
      default:
        return null
    }
  }

  const dateFilter = getDateFilter()

  /* ---------------- ITEMS = SOURCE OF TRUTH ---------------- */
  const { data: items, error } = await supabase
    .from("items")
    .select("*")

  if (error) {
    throw new Error("Failed to fetch items")
  }

  const safeItems = items || []

  /* ---------------- ITEM STATS (VIEWS & CLICKS) ---------------- */
  const itemsWithStats: ItemStat[] = await Promise.all(
    safeItems.map(async (item) => {
      let viewQuery = supabase
        .from("analytics_item_views")
        .select("*", { count: 'exact', head: true })
        .eq("item_id", item.id)

      if (dateFilter) viewQuery = viewQuery.gte("created_at", dateFilter)

      const { count: viewCount } = await viewQuery

      let clickQuery = supabase
        .from("whatsapp_clicks")
        .select("*", { count: 'exact', head: true })
        .eq("item_id", item.id)

      if (dateFilter) clickQuery = clickQuery.gte("created_at", dateFilter)

      const { count: clickCount } = await clickQuery

      return {
        id: item.id,
        title: item.title,
        slug: item.slug,
        price: Number(item.price || 0),
        status: item.status,
        viewCount: viewCount || 0,
        clickCount: clickCount || 0
      }
    })
  )

  /* ---------------- KPI: VIEWS / CLICKS ---------------- */
  const totalViews = itemsWithStats.reduce((s, i) => s + i.viewCount, 0)
  const totalClicks = itemsWithStats.reduce((s, i) => s + i.clickCount, 0)
  const conversionRate = totalViews ? (totalClicks / totalViews) * 100 : 0

  /* ---------------- SALES / REVENUE (FIXED) ---------------- */
  const soldItems = safeItems.filter(
    item =>
      item.status === "sold" &&
      item.price !== null &&
      !isNaN(Number(item.price))
  )

  const totalRevenue = soldItems.reduce(
    (sum, item) => sum + Number(item.price),
    0
  )

  const soldItemsCount = soldItems.length

  const avgSalePrice = soldItemsCount
    ? totalRevenue / soldItemsCount
    : 0

  /* ---------------- INVENTORY VALUE (FIXED) ---------------- */
  const availableItems = safeItems.filter(
    item =>
      item.status === "available" &&
      item.price !== null &&
      !isNaN(Number(item.price))
  )

  const availableItemsCount = availableItems.length

  const inventoryValue = availableItems.reduce(
    (sum, item) => sum + Number(item.price),
    0
  )

  const avgItemPrice = safeItems.length
    ? safeItems.reduce((s, i) => s + Number(i.price || 0), 0) / safeItems.length
    : 0

  /* ---------------- LABEL ---------------- */
  const getDateRangeLabel = () => {
    switch (dateRange) {
      case 'today': return 'Today'
      case 'week': return 'Last 7 Days'
      case 'month': return 'Last 30 Days'
      case 'year': return 'Last Year'
      default: return 'All Time'
    }
  }

  return (
    <ReportClient
      itemStats={itemsWithStats}
      totalViews={totalViews}
      totalClicks={totalClicks}
      conversionRate={conversionRate}
      totalRevenue={totalRevenue}
      soldItemsCount={soldItemsCount}
      availableItemsCount={availableItemsCount}
      inventoryValue={inventoryValue}
      avgItemPrice={avgItemPrice}
      avgSalePrice={avgSalePrice}
      dateRangeLabel={getDateRangeLabel()}
      currentRange={dateRange}
    />
  )
}
