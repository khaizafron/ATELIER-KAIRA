'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/glass';
import { Sparkles, RefreshCw, Loader2 } from 'lucide-react';

interface AIInsightsCardProps {
  initialInsight?: string;
  initialMetrics?: Record<string, any>;
  cached?: boolean;
}

export default function AIInsightsCard({
  initialInsight,
  initialMetrics,
  cached = false,
}: AIInsightsCardProps) {
  const [insight, setInsight] = useState(initialInsight || '');
  const [metrics, setMetrics] = useState(initialMetrics || null);
  const [loading, setLoading] = useState(false);
  const [isCached, setIsCached] = useState(cached);

  const generateInsights = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/ai-insights', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to generate insights');
      }

      const data = await response.json();
      setInsight(data.insight);
      setMetrics(data.metrics);
      setIsCached(false);
    } catch (error) {
      console.error('Error generating insights:', error);
      setInsight('⚠️ Maaf, gagal generate insights. Cuba lagi sekejap.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassCard className="relative overflow-hidden">
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-gradient-to-tr from-blue-400/20 to-cyan-400/20 blur-3xl" />

      <div className="relative">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 p-3 shadow-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-black/90">AI Business Insights</h2>
              <p className="text-sm text-black/60">
                {isCached ? 'Cached insights (auto-refresh hourly)' : 'Fresh AI-generated insights'}
              </p>
            </div>
          </div>
          <button
            onClick={generateInsights}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-black/5 px-4 py-2 text-sm font-medium text-black/80 transition-all hover:bg-black/10 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Refresh
              </>
            )}
          </button>
        </div>

        {insight ? (
          <div className="space-y-4">
            <div className="rounded-2xl bg-gradient-to-br from-white/60 to-white/30 p-6 backdrop-blur-sm">
              <div className="whitespace-pre-wrap text-black/80 leading-relaxed">
                {insight}
              </div>
            </div>

            {metrics && (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl bg-white/40 p-4 backdrop-blur-sm">
                  <p className="text-xs text-black/60">Total Items</p>
                  <p className="text-2xl font-bold text-black/90">{metrics.totalItems}</p>
                </div>
                <div className="rounded-xl bg-white/40 p-4 backdrop-blur-sm">
                  <p className="text-xs text-black/60">Revenue</p>
                  <p className="text-2xl font-bold text-green-700">
                    RM{metrics.totalRevenue?.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-xl bg-white/40 p-4 backdrop-blur-sm">
                  <p className="text-xs text-black/60">Week Visitors</p>
                  <p className="text-2xl font-bold text-purple-700">{metrics.weekVisitors}</p>
                </div>
                <div className="rounded-xl bg-white/40 p-4 backdrop-blur-sm">
                  <p className="text-xs text-black/60">Top Collection</p>
                  <p className="truncate text-lg font-bold text-black/90">
                    {metrics.topCollection}
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white/40 py-12 backdrop-blur-sm">
            <Sparkles className="mb-4 h-12 w-12 text-black/30" />
            <p className="mb-4 text-center text-black/60">
              Belum ada insights. Klik Refresh untuk generate!
            </p>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
