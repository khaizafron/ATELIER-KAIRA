import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST() {
  try {
    // =========================
    // 1. ITEMS
    // =========================
    const { data: items } = await supabase
      .from('items')
      .select('id, title, price, status')

    const totalItems = items?.length ?? 0
    const soldItems = items?.filter(i =>
      i.status === 'sold' || i.status === 'offline_sold'
    ) ?? []

    const availableItems = items?.filter(i => i.status === 'available') ?? []

    const totalRevenue = soldItems.reduce(
      (sum, i) => sum + Number(i.price || 0),
      0
    )

    // =========================
    // 2. WEEK VISITORS (REAL FIX)
    // =========================
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { data: views } = await supabase
      .from('analytics_item_views')
      .select('visitor_id, created_at')
      .gte('created_at', sevenDaysAgo.toISOString())

    const uniqueVisitors = new Set(
      (views ?? []).map(v => v.visitor_id)
    )

    const weekVisitors = uniqueVisitors.size

    // =========================
    // 3. TOP COLLECTION (SIMPLE)
    // =========================
    const topCollection =
      soldItems.length > 0 ? soldItems[0].title : 'N/A'

    // =========================
    // 4. METRICS OBJECT
    // =========================
    const metrics = {
      totalItems,
      availableItems: availableItems.length,
      soldItems: soldItems.length,
      totalRevenue,
      weekVisitors,
      topCollection,
    }

    // =========================
    // 5. AI PROMPT
    // =========================
    const prompt = `
Anda ialah AI Business Analyst untuk Kaira Atelier.

Data minggu ini:
- Total Items: ${totalItems}
- Available Items: ${availableItems.length}
- Sold Items: ${soldItems.length}
- Total Revenue: RM${totalRevenue}
- Weekly Visitors: ${weekVisitors}
- Top Collection: ${topCollection}

Berikan 3–4 insight ringkas, actionable, dan relevan dalam Bahasa Malaysia (tone santai tapi profesional).
Gunakan bullet points.
`

    const aiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.3-70b-instruct:free',
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const aiJson = await aiResponse.json()
    const insightText =
      aiJson.choices?.[0]?.message?.content ?? 'Tiada insight.'

    // =========================
    // 6. SAVE LOG
    // =========================
    await supabase.from('ai_insight_logs').insert({
      insight_text: insightText,
      metrics,
    })

    return NextResponse.json({
      insight: insightText,
      metrics,
      cached: false,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'AI insight failed' }, { status: 500 })
  }
}

export async function GET() {
  const { data } = await supabase
    .from('ai_insight_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!data) return NextResponse.json({ cached: false })

  return NextResponse.json({
    insight: data.insight_text,
    metrics: data.metrics,
    cached: true,
  })
}
