import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function POST(request: Request) {
  try {
    const { itemIds } = await request.json()
    
    if (!Array.isArray(itemIds) || itemIds.length === 0) {
      return NextResponse.json({ validIds: [] })
    }

    const admin = createAdminClient()
    
    const { data: items, error } = await admin
      .from("items")
      .select("id, status")
      .in("id", itemIds)
    
    if (error) {
      console.error("Validation query error:", error)
      return NextResponse.json({ validIds: itemIds }) // Return all if query fails
    }
    
    // Only return IDs of available items
    const validIds = items
      ?.filter(item => item.status === "available")
      .map(item => item.id) || []
    
    return NextResponse.json({ validIds })
  } catch (error) {
    console.error("Cart validation API error:", error)
    return NextResponse.json({ error: "Validation failed" }, { status: 500 })
  }
}