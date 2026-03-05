// src/composables/useActivity.js
import { ref, computed, watch } from 'vue'
import { periodToRange } from '@/utils/period'
import { fetchEnvelope } from '@/services/dataEnvelopeProvider'

// Optional: cache normalized activity view by `${userId}|${from}|${to}`
const _activityCache = new Map()

const clamp = (n, min, max) => Math.max(min, Math.min(max, n))

const formatDuration = (ms) => {
  const safe = Number(ms) || 0
  const totalMins = Math.round(safe / 60000)
  const h = Math.floor(totalMins / 60)
  const m = totalMins % 60
  if (h <= 0) return `${m}m`
  return `${h}h ${String(m).padStart(2, '0')}m`
}

const weekdayKey = (isoDate) =>
  new Date(isoDate).toLocaleDateString(undefined, { weekday: 'short' }).toUpperCase()

const weekdayName = (isoDate) =>
  new Date(isoDate).toLocaleDateString(undefined, { weekday: 'long' })

const getDayNumber = (isoDate) => {
  const d = new Date(isoDate)
  return Number.isNaN(d.getTime()) ? 0 : d.getDate()
}

const topSymbolsFromBySymbol = (bySymbol = {}) => {
  const entries = Object.entries(bySymbol || {})
    .filter(([sym]) => sym && sym !== 'null')
    .map(([symbol, totalMs]) => ({ symbol, totalMs: Number(totalMs) || 0 }))
    .sort((a, b) => b.totalMs - a.totalMs)
  return entries
}

export function useActivity({ userId = import.meta.env.VITE_USER_ID ?? 'current' } = {}) {
  // ✅ Keep the ref (tabs mutate this), but now it DRIVES data
  const selectedRange = ref('weekly')
  const anchor = ref(undefined)

  // ✅ BaseTabs contract: id + label (no `value`)
  const tabs = [
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' },
  ]

  const range = computed(() => periodToRange(selectedRange.value, anchor.value))

  const envelope = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  const activeDayKey = ref('') // we’ll set this once we have data

  const setRange = (value) => {
    if (value === 'weekly' || value === 'monthly') selectedRange.value = value
  }

  const setActiveDay = (dayKey) => {
    activeDayKey.value = dayKey
  }

  const normalizeActivity = (env) => {
    const behavior = env?.behavior || {}
    const daily = Array.isArray(behavior.daily) ? behavior.daily : []
    const topSymbols = Array.isArray(behavior.topSymbols) ? behavior.topSymbols : []

    const totalMsAll = daily.reduce((s, d) => s + (Number(d.totalMs) || 0), 0)
    const daysWithAnyTime = daily.reduce((s, d) => s + ((Number(d.totalMs) || 0) > 0 ? 1 : 0), 0)
    const pairsTraded = daily.reduce((s, d) => {
      const symbols = Object.keys(d.bySymbol || {}).filter((k) => k && k !== 'null')
      return s + symbols.length
    }, 0)

    const avgPerDayMs = daily.length ? totalMsAll / daily.length : 0

    // Most traded pair: prefer provider topSymbols if available, else aggregate from bySymbol
    let mostTradedPair = topSymbols[0]?.symbol
    if (!mostTradedPair) {
      const agg = new Map()
      daily.forEach((d) => {
        Object.entries(d.bySymbol || {}).forEach(([sym, ms]) => {
          if (!sym || sym === 'null') return
          agg.set(sym, (agg.get(sym) || 0) + (Number(ms) || 0))
        })
      })
      mostTradedPair = [...agg.entries()].sort((a, b) => (b[1] || 0) - (a[1] || 0))[0]?.[0] || '—'
    }

    // Most active day: max totalMs
    const mostActive = daily.reduce(
      (best, d) => ((Number(d.totalMs) || 0) > (Number(best.totalMs) || 0) ? d : best),
      daily[0] || { date: '', totalMs: 0 },
    )
    const mostActiveDay = mostActive?.date ? weekdayName(mostActive.date) : '—'

    // Simple consistency score (frontend-only heuristic): active days / total days
    const consistencyScore = daily.length ? Math.round((daysWithAnyTime / daily.length) * 5) : 0
    const consistencyLabel = daily.length ? `${clamp(consistencyScore, 0, 5)} / 5` : '—'

    // Daily grid
    const dailyActivity = daily.map((d) => {
      const key = weekdayKey(d.date)
      const dayLabel = key
      const dayNumber = getDayNumber(d.date)
      const badge = formatDuration(d.totalMs)

      const ranked = topSymbolsFromBySymbol(d.bySymbol)
      const rows = ranked.slice(0, 3).map((r) => ({
        symbol: r.symbol,
        time: formatDuration(r.totalMs),
      }))

      const extraCount = Math.max(0, ranked.length - rows.length)
      const moreText = extraCount > 0 ? `+${extraCount} more →` : ''

      return { key, dayLabel, dayNumber, badge, rows, moreText }
    })

    const topMetrics = [
      {
        title: 'Total Time Spent',
        value: formatDuration(totalMsAll),
        delta: '',
        note: daily.length ? `Avg ${formatDuration(avgPerDayMs)} / day` : '',
        icon: 'clock',
      },
      {
        title: 'Active days',
        value: daily.length ? `${daysWithAnyTime} / ${daily.length}` : '—',
        delta: '',
        note: daily.length ? 'Days with any chart time' : '',
        icon: 'activity',
      },
      {
        title: 'Pairs Traded',
        value: String(
          new Set(
            daily.flatMap((d) => Object.keys(d.bySymbol || {})).filter((k) => k && k !== 'null'),
          ).size,
        ),
        delta: '',
        note: 'Distinct symbols in range',
        icon: 'pairs',
      },
      {
        title: 'Consistency Score',
        value: consistencyLabel,
        delta: '',
        note: 'Based on active days',
        icon: 'consistency',
      },
    ]

    // NOTE: pairsTraded variable kept in case you use it later, but distinct count is what you display above
    void pairsTraded

    const secondaryMetrics = [
      {
        title: 'Most Traded Pair',
        value: mostTradedPair || '—',
        delta: '',
        note: '',
        icon: 'most_pair',
      },
      {
        title: 'Pairs Traded',
        value: String(
          new Set(
            daily.flatMap((d) => Object.keys(d.bySymbol || {})).filter((k) => k && k !== 'null'),
          ).size,
        ),
        delta: '',
        note: '',
        icon: 'pairs',
      },
      { title: 'Most Active Day', value: mostActiveDay, delta: '', note: '', icon: 'calendar' },
      {
        title: 'Most Used Bias',
        value: '—',
        delta: '',
        note: 'Coming from strategy tagging later',
        icon: 'bias',
      },
    ]

    const label = env?.period?.label || range.value?.label || selectedRange.value
    const callout = `Alex, this is where your attention went (${label})`

    return { topMetrics, secondaryMetrics, dailyActivity, callout }
  }

  async function fetchActivity() {
    const r = range.value
    if (!r) return null

    const key = `${userId}|${r.from}|${r.to}`

    if (_activityCache.has(key)) {
      envelope.value = _activityCache.get(key)
      return envelope.value
    }

    isLoading.value = true
    error.value = null

    try {
      const env = await fetchEnvelope({
        userId,
        from: r.from,
        to: r.to,
        periodLabel: r.label,
      })
      envelope.value = env
      _activityCache.set(key, env)
      return env
    } catch (e) {
      error.value = e
      envelope.value = null
      return null
    } finally {
      isLoading.value = false
    }
  }

  // ✅ Fetch when range changes (this replaces hardcoded arrays)
  watch(
    [selectedRange, anchor],
    () => {
      void fetchActivity()
    },
    { immediate: true },
  )

  // ✅ Derived outputs (same names, same shapes, UI unchanged)
  const derived = computed(() => normalizeActivity(envelope.value))

  const topMetrics = computed(() => derived.value?.topMetrics || [])
  const secondaryMetrics = computed(() => derived.value?.secondaryMetrics || [])
  const dailyActivity = computed(() => derived.value?.dailyActivity || [])
  const callout = computed(() => derived.value?.callout || '')

  // ✅ Keep activeDayKey sensible when data loads/changes
  watch(
    dailyActivity,
    (list) => {
      if (!Array.isArray(list) || list.length === 0) return
      if (!activeDayKey.value) activeDayKey.value = list[list.length - 1].key // latest day
      const exists = list.some((d) => d.key === activeDayKey.value)
      if (!exists) activeDayKey.value = list[list.length - 1].key
    },
    { immediate: true },
  )

  return {
    tabs,
    selectedRange, // kept (ActivityPage uses it via v-model wrapper)
    topMetrics,
    secondaryMetrics,
    dailyActivity,
    callout,
    setRange,
    activeDayKey,
    setActiveDay,

    // optional (won't break UI): useful for later
    isLoading,
    error,
    fetchActivity,
  }
}

export default useActivity
