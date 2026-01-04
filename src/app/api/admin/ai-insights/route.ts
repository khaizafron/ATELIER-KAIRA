import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST() {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const [itemsResult, visitorsResult, lastInsightResult] = await Promise.all([
      supabase.from('items').select('*'),
      supabase.from('visitors').select('*'),
      supabase
        .from('ai_insight_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single(),
    ]);

    const items = itemsResult.data || [];
    const visitors = visitorsResult.data || [];

    const totalItems = items.length;
    const totalVisitors = visitors.length;
    const availableItems = items.filter((item) => item.availability === 'available').length;
    const soldItems = items.filter((item) => item.availability === 'sold').length;
    const reservedItems = items.filter((item) => item.availability === 'reserved').length;

    const totalRevenue = items
      .filter((item) => item.availability === 'sold')
      .reduce((sum, item) => sum + (item.price || 0), 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayVisitors = visitors.filter((v) => new Date(v.visited_at) >= today).length;

    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    const weekVisitors = visitors.filter((v) => new Date(v.visited_at) >= last7Days).length;

    const collectionCounts: Record<string, number> = {};
    items.forEach((item) => {
      if (item.collection) {
        collectionCounts[item.collection] = (collectionCounts[item.collection] || 0) + 1;
      }
    });
    const topCollection = Object.entries(collectionCounts).sort((a, b) => b[1] - a[1])[0];

    const metrics = {
      totalItems,
      totalVisitors,
      availableItems,
      soldItems,
      reservedItems,
      totalRevenue,
      todayVisitors,
      weekVisitors,
      topCollection: topCollection ? topCollection[0] : 'N/A',
      topCollectionCount: topCollection ? topCollection[1] : 0,
    };

    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterApiKey) {
      return NextResponse.json(
        { error: 'OpenRouter API key not configured' },
        { status: 500 }
      );
    }

    const prompt = `You are an AI analyst for Ximy Vault, a collectible items store. Based on the following metrics, provide 3-4 concise, actionable business insights in Bahasa Malaysia (casual/trendy tone). Focus on trends, opportunities, and recommendations.

Metrics:
- Total Items: ${metrics.totalItems}
- Available: ${metrics.availableItems}, Sold: ${metrics.soldItems}, Reserved: ${metrics.reservedItems}
- Total Revenue: RM${metrics.totalRevenue.toLocaleString()}
- Total Visitors: ${metrics.totalVisitors}
- Today's Visitors: ${metrics.todayVisitors}
- Last 7 Days Visitors: ${metrics.weekVisitors}
- Top Collection: ${metrics.topCollection} (${metrics.topCollectionCount} items)

Provide insights in bullet points (•), keep it short and actionable.`;

    const aiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.3-70b-instruct:free',
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('OpenRouter API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to generate AI insights' },
        { status: 500 }
      );
    }

    const aiData = await aiResponse.json();
    const insightText = aiData.choices?.[0]?.message?.content || 'No insights generated';

    const { error: insertError } = await supabase.from('ai_insight_logs').insert({
      insight_text: insightText,
      metrics,
    });

    if (insertError) {
      console.error('Failed to log AI insight:', insertError);
    }

    return NextResponse.json({
      insight: insightText,
      metrics,
      cached: false,
    });
  } catch (error) {
    console.error('AI insights error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error } = await supabase
      .from('ai_insight_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return NextResponse.json({ cached: false });
    }

    const cacheAge = Date.now() - new Date(data.created_at).getTime();
    const maxCacheAge = 60 * 60 * 1000;

    if (cacheAge > maxCacheAge) {
      return NextResponse.json({ cached: false });
    }

    return NextResponse.json({
      insight: data.insight_text,
      metrics: data.metrics,
      cached: true,
      cachedAt: data.created_at,
    });
  } catch (error) {
    console.error('AI insights cache check error:', error);
    return NextResponse.json({ cached: false });
  }
}