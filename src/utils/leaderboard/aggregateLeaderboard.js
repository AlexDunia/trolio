const MS_PER_MINUTE = 1000 * 60
const MS_PER_HOUR = MS_PER_MINUTE * 60
const MS_PER_DAY = MS_PER_HOUR * 24

function safeDate(value) {
  if (!value) return null
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function normalizeTimeframe(rawTimeframe) {
  if (rawTimeframe === 'daily') return 'daily'
  if (rawTimeframe === 'monthly') return 'monthly'
  return 'weekly'
}

export function getSessionDurationMs(session) {
  if (!session) return null
  const startedAt = safeDate(session.startedAt)
  const endedAt = safeDate(session.endedAt)
  if (!startedAt || !endedAt) return null
  const delta = endedAt.getTime() - startedAt.getTime()
  return delta > 0 ? delta : null
}

export function getTimeframeWindow(timeframe = 'weekly', referenceDate = new Date()) {
  const normalized = normalizeTimeframe(timeframe)
  const now = new Date(referenceDate)
  const end = new Date(now)
  const midnight = new Date(now)
  midnight.setHours(0, 0, 0, 0)

  if (normalized === 'daily') {
    // Daily window uses local timezone 'today' (midnight until now) so the leaderboard shows the current day's activity.
    return { start: midnight, end }
  }

  if (normalized === 'monthly') {
    const monthStart = new Date(midnight)
    monthStart.setDate(1)
    return { start: monthStart, end }
  }

  const dayOfWeek = now.getDay()
  const diffToMonday = (dayOfWeek + 6) % 7
  const weekStart = new Date(midnight)
  weekStart.setDate(midnight.getDate() - diffToMonday)
  // Weekly window covers the current local week (Monday at 00:00 through the present moment).
  return { start: weekStart, end }
}

function clampSessionToWindow(session, windowBounds) {
  const sessionStart = session.start || safeDate(session.startedAt)
  const sessionEnd = session.end || safeDate(session.endedAt)
  if (!sessionStart || !sessionEnd || !windowBounds?.start || !windowBounds?.end) return null
  const clampedStart = sessionStart < windowBounds.start ? windowBounds.start : sessionStart
  const clampedEnd = sessionEnd > windowBounds.end ? windowBounds.end : sessionEnd
  if (clampedEnd <= clampedStart) return null
  return { ...session, durationMs: clampedEnd.getTime() - clampedStart.getTime() }
}

function normalizeSessions(sessions) {
  if (!Array.isArray(sessions)) return []
  return sessions
    .map((session) => {
      const durationMs = getSessionDurationMs(session)
      if (durationMs === null) return null
      const start = safeDate(session.startedAt)
      const end = safeDate(session.endedAt)
      if (!start || !end) return null
      return { ...session, start, end, durationMs }
    })
    .filter(Boolean)
}

export function filterSessionsByTimeframe(sessions, timeframe = 'weekly', referenceDate = new Date()) {
  const windowBounds = getTimeframeWindow(timeframe, referenceDate)
  return normalizeSessions(sessions)
    .map((session) => clampSessionToWindow(session, windowBounds))
    .filter(Boolean)
}

export function formatDurationMs(ms) {
  if (!Number.isFinite(ms) || ms <= 0) {
    return '0hrs 0mins'
  }
  const totalMinutes = Math.round(ms / MS_PER_MINUTE)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${hours}hrs ${minutes}mins`
}

export function groupSessionsByUser(sessions, dayCount = 7) {
  const safeDayCount = Number.isFinite(dayCount) && dayCount > 0 ? dayCount : 7
  const groups = new Map()

  sessions.forEach((session) => {
    const userId = session.userId
    if (!userId) return
    const duration = session.durationMs
    if (!Number.isFinite(duration) || duration <= 0) return

    const entry = groups.get(userId) || {
      userId,
      name: session.name || 'Anonymous',
      avatar: session.avatar ?? null,
      countryFlag: session.countryFlag || '',
      totalMs: 0,
      pairDurations: new Map(),
    }

    entry.totalMs += duration
    if (session.pair) {
      const previous = entry.pairDurations.get(session.pair) || 0
      entry.pairDurations.set(session.pair, previous + duration)
    }

    groups.set(userId, entry)
  })

  return Array.from(groups.values()).map((entry) => {
    const pairsVisited = Array.from(entry.pairDurations.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([pair]) => pair)
      .slice(0, 8)

    const averageMs = entry.totalMs / safeDayCount
    return {
      id: entry.userId,
      userId: entry.userId,
      name: entry.name,
      avatar: entry.avatar,
      countryFlag: entry.countryFlag,
      pairsVisited,
      totalMs: entry.totalMs,
      hoursOnChart: formatDurationMs(entry.totalMs),
      dailyAverage: formatDurationMs(averageMs),
    }
  })
}

function getPerformanceScore(row, metadataLookup = {}) {
  const metadata = metadataLookup[row.userId ?? row.id]
  const score = metadata?.performance?.score
  return Number.isFinite(score) ? score : null
}

export function sortLeaderboardRows(rows, sort = 'most_active', metadataLookup = {}) {
  if (!Array.isArray(rows)) return []
  const sorted = [...rows]
  if (sort === 'most_profitable') {
    sorted.sort((a, b) => {
      const scoreA = getPerformanceScore(a, metadataLookup) ?? 0
      const scoreB = getPerformanceScore(b, metadataLookup) ?? 0
      if (scoreB === scoreA) {
        return b.totalMs - a.totalMs
      }
      return scoreB - scoreA
    })
  } else {
    sorted.sort((a, b) => b.totalMs - a.totalMs)
  }
  return sorted
}

export function assignRanks(rows) {
  if (!Array.isArray(rows)) return []
  return rows.map((row, idx) => ({ ...row, rank: idx + 1 }))
}

export function applySearchFilter(rows, search = '') {
  if (!Array.isArray(rows)) return []
  const term = (search || '').trim().toLowerCase()
  if (!term) return rows
  return rows.filter((row) => (row.name || '').toLowerCase().includes(term))
}

export function paginateLeaderboard(rows, page = 1, perPage = 10) {
  const safeRows = Array.isArray(rows) ? rows : []
  const safePerPage = Number.isFinite(perPage) && perPage > 0 ? Math.floor(perPage) : 10
  const total = safeRows.length
  const lastPage = Math.max(1, Math.ceil(total / safePerPage) || 1)
  const safePage = Math.max(1, Math.min(Number.isFinite(page) ? Math.floor(page) : 1, lastPage))
  const start = (safePage - 1) * safePerPage
  return {
    data: safeRows.slice(start, start + safePerPage),
    meta: { total, page: safePage, perPage: safePerPage, lastPage },
  }
}

export function aggregateLeaderboard({
  sessions = [],
  sort = 'most_active',
  timeframe = 'weekly',
  search = '',
  page = 1,
  perPage = 10,
  referenceDate = new Date(),
  metadataLookup = {},
} = {}) {
  const normalizedTimeframe = normalizeTimeframe(timeframe)
  const windowBounds = getTimeframeWindow(normalizedTimeframe, referenceDate)
  const timeframeSessions = filterSessionsByTimeframe(sessions, normalizedTimeframe, referenceDate)
  const daysInWindow = Math.max(
    1,
    Math.ceil((windowBounds.end.getTime() - windowBounds.start.getTime()) / MS_PER_DAY)
  )
  let rows = groupSessionsByUser(timeframeSessions, daysInWindow)
  rows = sortLeaderboardRows(rows, sort, metadataLookup)
  rows = assignRanks(rows)
  const searched = applySearchFilter(rows, search)
  return paginateLeaderboard(searched, page, perPage)
}
