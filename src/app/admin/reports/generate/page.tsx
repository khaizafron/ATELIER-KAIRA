import { createClient } from "@supabase/supabase-js"
import { GlassCard } from "@/components/glass"
import { Eye, MessageCircle, TrendingUp, Download, Printer, ArrowLeft, FileText, BarChart3, PieChart, DollarSign, Package, ShoppingCart } from "lucide-react"
import Link from "next/link"
import ReportClient from "./report-client"
import { redirect } from "next/navigation"

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

  const { data: items, error: itemsError } = await supabase
    .from("items")
    .select("*")
    .order("created_at", { ascending: false })

  if (itemsError) {
    console.error("Error fetching items:", itemsError)
    throw new Error("Failed to fetch items data")
  }

  const itemsWithStats = await Promise.all(
    (items || []).map(async (item) => {
      const viewQuery = supabase
        .from("analytics_item_views")
        .select("*", { count: 'exact', head: true })
        .eq('item_id', item.id)
      
      if (dateFilter) {
        viewQuery.gte('created_at', dateFilter)
      }
      
      const { count: viewCount } = await viewQuery

      const clickQuery = supabase
        .from("whatsapp_clicks")
        .select("*", { count: 'exact', head: true })
        .eq('item_id', item.id)
      
      if (dateFilter) {
        clickQuery.gte('created_at', dateFilter)
      }
      
      const { count: clickCount } = await clickQuery

      return {
        id: item.id,
        title: item.title,
        slug: item.slug,
        price: Number(item.price),
        status: item.status,
        viewCount: viewCount || 0,
        clickCount: clickCount || 0
      }
    })
  )

  const totalViews = itemsWithStats.reduce((sum, item) => sum + item.viewCount, 0)
  const totalClicks = itemsWithStats.reduce((sum, item) => sum + item.clickCount, 0)
  const conversionRate = totalViews ? (totalClicks / totalViews) * 100 : 0
  
  let salesQuery = supabase
    .from("sales")
    .select("sold_price, sold_at, item_id")
  
  if (dateFilter) {
    salesQuery = salesQuery.gte('sold_at', dateFilter)
  }

  const { data: salesData, error: salesError } = await salesQuery

  if (salesError) {
    console.error("Error fetching sales:", salesError)
  }

  const totalRevenue = (salesData || []).reduce((sum, sale) => sum + Number(sale.sold_price), 0)
  const soldItemsCount = (salesData || []).length
  const avgSalePrice = soldItemsCount > 0 ? totalRevenue / soldItemsCount : 0
  
  const availableItems = itemsWithStats.filter(item => item.status === 'available')
  const availableItemsCount = availableItems.length
  const inventoryValue = availableItems.reduce((sum, item) => sum + item.price, 0)
  const avgItemPrice = itemsWithStats.length > 0 ? itemsWithStats.reduce((sum, item) => sum + item.price, 0) / itemsWithStats.length : 0

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