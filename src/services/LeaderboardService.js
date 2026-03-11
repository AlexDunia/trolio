import {
  aggregateLeaderboard,
  filterSessionsByTimeframe,
  getSessionDurationMs,
  groupSessionsByUser,
  formatDurationMs,
  getTimeframeWindow,
} from '@/utils/leaderboard/aggregateLeaderboard'
import { telemetrySessions } from '@/data/localTelemetry'

const MS_PER_MINUTE = 1000 * 60
const MS_PER_HOUR = MS_PER_MINUTE * 60
const MS_PER_DAY = MS_PER_HOUR * 24
const WEEK_DAY_ORDER = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const TRADER_PROFILES = {
  merlin: {
    location: 'London, UK',
    joinedDate: 'March 01, 2018',
    badges: ['Precision Strategist', 'Trolio Elite'],
    performance: { score: 91, trend: 'rising', change: '+3.1%' },
  },
  techraze: {
    location: 'Berlin, Germany',
    joinedDate: 'June 11, 2019',
    badges: ['Chart Whisperer', 'Momentum Leader'],
    performance: { score: 92, trend: 'rising', change: '+4.2%' },
  },
  stargirl: {
    location: 'Osaka, Japan',
    joinedDate: 'August 03, 2020',
    badges: ['Steady Navigator', 'Trend Hunter'],
    performance: { score: 85, trend: 'steady', change: '+1.7%' },
  },
  tony: {
    location: 'Chicago, USA',
    joinedDate: 'February 21, 2021',
    badges: ['Range Specialist'],
    performance: { score: 79, trend: 'steady', change: '+0.8%' },
  },
  atlas: {
    location: 'Toronto, Canada',
    joinedDate: 'November 02, 2022',
    badges: ['Macro Scout'],
    performance: { score: 74, trend: 'steady', change: '-0.3%' },
  },
  nova: {
    location: 'London, UK',
    joinedDate: 'April 14, 2021',
    badges: ['Breakout Guru'],
    performance: { score: 88, trend: 'rising', change: '+2.5%' },
  },
  piper: {
    location: 'Sydney, Australia',
    joinedDate: 'January 09, 2023',
    badges: ['Riskologist', 'Pairs Detective'],
    performance: { score: 80, trend: 'steady', change: '+0.6%' },
  },
}

const DEFAULT_PROFILE = {
  location: 'Remote',
  joinedDate: 'January 01, 2022',
  badges: ['Active Trader'],
  performance: { score: 70, trend: 'steady', change: '+0.1%' },
}

function getLatestSessionTimestamp(sessions = []) {
  let latest = null
  sessions.forEach((session) => {
    const candidate = new Date(session.endedAt ?? session.startedAt)
    if (Number.isNaN(candidate.getTime())) return
    if (!latest || candidate > latest) {
      latest = candidate
    }
  })
  return latest
}

function normalizeTimeframe(input = 'weekly') {
  if (input === 'daily') return 'daily'
  if (input === 'monthly') return 'monthly'
  return 'weekly'
}

function buildHeatmap(sessions = []) {
  const buckets = {}
  sessions.forEach((session) => {
    const started = new Date(session.startedAt)
    if (Number.isNaN(started.getTime())) return
    const day = started.toLocaleDateString('en-US', { weekday: 'short' })
    const minutes = Math.round((session.durationMs ?? 0) / MS_PER_MINUTE)
    buckets[day] = (buckets[day] ?? 0) + minutes
  })

  return WEEK_DAY_ORDER.map((day) => ({
    day,
    minutes: buckets[day] ?? 0,
  }))
}

function formatSessionPayload(session) {
  const durationMs = session.durationMs ?? getSessionDurationMs(session) ?? 0
  return {
    pair: session.pair,
    startedAt: session.startedAt,
    endedAt: session.endedAt,
    durationLabel: formatDurationMs(durationMs),
    durationMinutes: Math.round(durationMs / MS_PER_MINUTE),
  }
}

function mergePerformanceDefaults(metadata, row) {
  const base = metadata?.performance ?? DEFAULT_PROFILE.performance
  return {
    score:
      base.score ?? Math.min(99, Math.max(55, Math.round((row.totalMs / MS_PER_HOUR) * 2))),
    trend: base.trend ?? (row.rank <= 3 ? 'rising' : 'steady'),
    change: base.change ?? `${Math.max(2, 8 - row.rank)}%`,
  }
}

export default {
  async getLeaderboard(options = {}) {
    try {
      const { referenceDate: requestedReferenceDate, metadataLookup, ...restOptions } = options
      const referenceDate =
        requestedReferenceDate ?? getLatestSessionTimestamp(telemetrySessions) ?? new Date()
      return aggregateLeaderboard({
        sessions: telemetrySessions,
        referenceDate,
        ...restOptions,
        metadataLookup: metadataLookup ?? TRADER_PROFILES,
      })
    } catch (err) {
      console.error('LeaderboardService.getLeaderboard error', err)
      throw err
    }
  },

  async getTraderLeaderboardProfile({ id, timeframe = 'weekly' } = {}) {
    try {
      if (!id) return null
      const normalizedWindow = normalizeTimeframe(timeframe)
      const referenceDate = getLatestSessionTimestamp(telemetrySessions) ?? new Date()
      const timeframeSessions = filterSessionsByTimeframe(
        telemetrySessions,
        normalizedWindow,
        referenceDate
      )
      const timeframeBounds = getTimeframeWindow(normalizedWindow, referenceDate)
      const daysInWindow = Math.max(
        1,
        Math.ceil((timeframeBounds.end.getTime() - timeframeBounds.start.getTime()) / MS_PER_DAY)
      )
      const grouped = groupSessionsByUser(timeframeSessions, daysInWindow)
      const row = grouped.find((entry) => entry.userId === id)
      if (!row) return null

      const metadata = TRADER_PROFILES[id] ?? DEFAULT_PROFILE
      const traderSessions = timeframeSessions.filter((entry) => entry.userId === id)
      const chartSessions = traderSessions
        .map(formatSessionPayload)
        .sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt))

      const weeklyMs = traderSessions.reduce((sum, session) => sum + (session.durationMs ?? 0), 0)
      const lifetimeMs = telemetrySessions.reduce((sum, session) => {
        if (session.userId !== id) return sum
        return sum + (getSessionDurationMs(session) ?? 0)
      }, 0)

      const chartMetrics = {
        weeklyHours: Number((weeklyMs / MS_PER_HOUR).toFixed(2)),
        dailyAverage: Number(((weeklyMs / daysInWindow) / MS_PER_HOUR).toFixed(2)),
        totalHours: Number((lifetimeMs / MS_PER_HOUR).toFixed(2)),
      }

      return {
        id: row.id,
        name: row.name,
        avatar: row.avatar,
        countryFlag: row.countryFlag,
        location: metadata.location,
        joinedDate: metadata.joinedDate,
        badges: metadata.badges,
        chartMetrics,
        pairsStudied: row.pairsVisited,
        tradingSessions: chartSessions,
        heatmapActivity: buildHeatmap(traderSessions),
        performance: mergePerformanceDefaults(metadata, row),
      }
    } catch (err) {
      console.error('LeaderboardService.getTraderLeaderboardProfile error', err)
      throw err
    }
  },

  async getSharePayload({ filters = {} } = {}) {
    try {
      return {
        url: `${window.location.origin}/leaderboards?${new URLSearchParams(filters).toString()}`,
      }
    } catch (err) {
      console.error('LeaderboardService.getSharePayload error', err)
      throw err
    }
  },
}
