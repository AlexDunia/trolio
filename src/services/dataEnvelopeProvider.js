// src/services/dataEnvelopeProvider.js
import { fetchLocalDashboard } from '@/data/localDashboard'

// One in-memory cache for ALL pages, keyed by userId|from|to
const _cache = new Map()

export async function fetchEnvelope({ userId = 'current', from, to, periodLabel }) {
  const key = `${userId}|${from}|${to}`

  if (_cache.has(key)) return _cache.get(key)

  // today: local mock (tomorrow: swap to API without touching pages)
  const envelope = await fetchLocalDashboard({
    userId,
    from,
    to,
    period: periodLabel,
  })

  _cache.set(key, envelope)
  return envelope
}

// optional: allow manual cache clear when needed
export function clearEnvelopeCache() {
  _cache.clear()
}
