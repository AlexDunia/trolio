import { ref, computed } from 'vue'
import { periodToRange } from '@/utils/period'
import { fetchLocalDashboard } from '@/data/localDashboard'

// In-memory cache keyed by `${userId}|${from}|${to}` to avoid duplicate calls
const _cache = new Map()

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

    return {
      raw: envelope,
      period,
      behavior: { daily, topSymbols: behavior.topSymbols || [] },
      dailyTotals: daily,
      chartPoints,
      topSymbols: behavior.topSymbols || [],
      kpi: Array.isArray(envelope.kpi) ? envelope.kpi : [],
      chart: envelope.chart || {},
      summary: Array.isArray(envelope.summary) ? envelope.summary : [],
      insights,
    }
  }

  async function fetchDashboard() {
    const currentRange = range.value
    if (!currentRange) return null

    const key = `${userId}|${currentRange.from}|${currentRange.to}`
    if (_cache.has(key)) {
      dashboardData.value = _cache.get(key)
      return dashboardData.value
    }

    isLoading.value = true
    error.value = null

    try {
      // use local mock provider for deterministic dev data
      const envelope = await fetchLocalDashboard({
        from: currentRange.from,
        to: currentRange.to,
        period: currentRange.label,
        userId,
      })
      const normalized = normalize(envelope)
      dashboardData.value = normalized
      _cache.set(key, normalized)
      return normalized
    } catch (err) {
      // preserve error but provide a small non-invasive fallback so the UI isn't empty
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
      _cache.set(key, fallback)
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
