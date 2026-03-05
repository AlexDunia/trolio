import { ref, computed } from 'vue'
import { periodToRange } from '@/utils/period'
import { fetchEnvelope } from '@/services/dataEnvelopeProvider'

// ✅ Optional but good: cache NORMALIZED results only
// keyed by `${userId}|${from}|${to}`
const _normalizedCache = new Map()

export default function useDashboard({ userId = import.meta.env.VITE_USER_ID ?? 'current' } = {}) {
  const activePeriod = ref('weekly')
  const anchor = ref(undefined)

  const range = computed(() => periodToRange(activePeriod.value, anchor.value))

  const dashboardData = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  const normalize = (envelope) => {
    if (!envelope) return null
    const period = envelope.period || range.value || { from: '', to: '', label: '' }

    const behavior = envelope.behavior || {}
    const daily = Array.isArray(behavior.daily) ? behavior.daily : []

    const chartPoints = daily.map((d) => ({
      date: d.date,
      dayLabel: new Date(d.date).toLocaleDateString(undefined, { weekday: 'short' }),
      hours: Number(d.totalMs || 0) / 3600000,
      totalMs: Number(d.totalMs || 0),
      unknownMs: Number(d.unknownMs || 0),
      bySymbol: d.bySymbol || {},
    }))

    const rawInsights = Array.isArray(envelope.insights) ? envelope.insights : []
    const insights = rawInsights.map((it, idx) => ({
      key: it.key ?? it.title ?? `insight-${idx}`,
      title: it.title ?? it.key ?? it.name ?? it.heading ?? '',
      description: it.description ?? it.body ?? it.message ?? '',
      score: typeof it.score === 'number' ? it.score : undefined,
    }))

    // aggregate totals
    const totalMsAll = daily.reduce((s, d) => s + (Number(d.totalMs) || 0), 0)
    const totalHours = totalMsAll / 3600000

    // tradesExecuted heuristic: sum of distinct symbols per day (proxy)
    const tradesExecuted = daily.reduce((s, d) => s + Object.keys(d.bySymbol || {}).length, 0)

    // net PnL heuristic (dev): $50 per hour
    const netPnlValue = Math.round(totalHours * 50)

    // win rate heuristic: base 40% + topSymbolShare * 60%
    const topTotal = (behavior.topSymbols || [])[0]?.totalMs || 0
    const topShare = totalMsAll > 0 ? topTotal / totalMsAll : 0
    const winRate = Math.min(0.95, 0.4 + topShare * 0.6)

    // most visited symbol
    const mostVisited = (behavior.topSymbols || [])[0]?.symbol ?? '—'

    const kpi = [
      {
        key: 'time_on_chart',
        title: 'Time on Chart',
        value: `${totalHours.toFixed(1)}h`,
        icon: 'clock',
      },
      {
        key: 'trades_executed',
        title: 'Trades Executed',
        value: String(tradesExecuted),
        icon: 'trades',
      },
      {
        key: 'net_pnl',
        title: 'Net PnL',
        value: new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 0,
        }).format(netPnlValue),
        icon: 'pnl',
      },
      {
        key: 'win_rate',
        title: 'Win Rate',
        value: `${Math.round(winRate * 100)}%`,
        icon: 'winrate',
      },
      { key: 'most_visited', title: 'MOST VISITED SYMBOL', value: mostVisited, icon: 'star' },
    ]

    return {
      raw: envelope,
      period,
      behavior: { daily, topSymbols: behavior.topSymbols || [] },
      dailyTotals: daily,
      chartPoints,
      topSymbols: behavior.topSymbols || [],
      kpi,
      chart: envelope.chart || {},
      summary: Array.isArray(envelope.summary) ? envelope.summary : [],
      insights,
    }
  }

  async function fetchDashboard() {
    const currentRange = range.value
    if (!currentRange) return null

    const key = `${userId}|${currentRange.from}|${currentRange.to}`

    // ✅ fast path: already normalized
    if (_normalizedCache.has(key)) {
      dashboardData.value = _normalizedCache.get(key)
      return dashboardData.value
    }

    isLoading.value = true
    error.value = null

    try {
      const envelope = await fetchEnvelope({
        userId,
        from: currentRange.from,
        to: currentRange.to,
        periodLabel: currentRange.label,
      })

      const normalized = normalize(envelope)
      dashboardData.value = normalized
      _normalizedCache.set(key, normalized)
      return normalized
    } catch (err) {
      error.value = err

      const fallback = {
        raw: null,
        period: currentRange,
        behavior: { daily: [], topSymbols: [] },
        dailyTotals: [],
        chartPoints: [],
        topSymbols: [],
        kpi: [],
        chart: {},
        summary: [],
        insights: [
          {
            key: 'insight-peak-hour',
            title: 'Peak Performance Hour',
            description: 'Your best trades happen between 2-4 PM. Focus your energy there.',
          },
          {
            key: 'insight-streak',
            title: 'Consistency Milestone',
            description: "You've maintained a 14-day trading streak. Great discipline!",
          },
        ],
      }

      dashboardData.value = fallback
      _normalizedCache.set(key, fallback)
      return fallback
    } finally {
      isLoading.value = false
    }
  }

  return {
    activePeriod,
    anchor,
    range,
    dashboardData,
    isLoading,
    error,
    fetchDashboard,
  }
}
