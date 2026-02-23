// Central period resolver — only place period logic lives
// Exports: periodToRange(period, anchor)
const MS_PER_DAY = 24 * 60 * 60 * 1000

const toUtcStartOfDay = (d) => {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0))
}

const toUtcEndOfDay = (d) => {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 23, 59, 59, 999))
}

const iso = (d) => d.toISOString()

/**
 * period: 'weekly' | 'monthly' | 'custom'
 * anchor: optional Date or ISO string or for custom an object { from, to }
 * returns: { from: ISOutc, to: ISOutc, label }
 */
export function periodToRange(period, anchor = undefined) {
  // anchor date in UTC (Date instance)
  let a
  if (!anchor) a = new Date()
  else if (typeof anchor === 'string') a = new Date(anchor)
  else if (anchor instanceof Date) a = anchor
  else if (
    anchor &&
    typeof anchor === 'object' &&
    anchor.from &&
    anchor.to &&
    period === 'custom'
  ) {
    // return custom range verbatim (assume anchor.from/to strings or Dates)
    const fromD = typeof anchor.from === 'string' ? new Date(anchor.from) : new Date(anchor.from)
    const toD = typeof anchor.to === 'string' ? new Date(anchor.to) : new Date(anchor.to)
    return {
      from: iso(toUtcStartOfDay(fromD)),
      to: iso(toUtcEndOfDay(toD)),
      label: 'Custom',
    }
  } else {
    a = new Date()
  }

  // normalize invalid date
  if (Number.isNaN(a.getTime())) a = new Date()

  if (period === 'monthly') {
    const y = a.getUTCFullYear()
    const m = a.getUTCMonth()
    const start = new Date(Date.UTC(y, m, 1, 0, 0, 0, 0))
    // last day of month: day 0 of next month
    const lastDay = new Date(Date.UTC(y, m + 1, 0, 23, 59, 59, 999))
    return { from: iso(start), to: iso(lastDay), label: 'Monthly' }
  }

  // default to weekly (ISO week Mon-Sun)
  // getUTCDay: 0=Sun,1=Mon,...6=Sat
  if (period === 'weekly') {
    const day = a.getUTCDay()
    // offset to Monday
    const offsetToMonday = day === 0 ? -6 : 1 - day
    const monday = new Date(
      Date.UTC(a.getUTCFullYear(), a.getUTCMonth(), a.getUTCDate(), 0, 0, 0, 0),
    )
    monday.setUTCDate(monday.getUTCDate() + offsetToMonday)
    const sunday = new Date(monday.getTime() + 6 * MS_PER_DAY)
    return { from: iso(toUtcStartOfDay(monday)), to: iso(toUtcEndOfDay(sunday)), label: 'Weekly' }
  }

  // fallback: return single-day range at anchor
  return {
    from: iso(toUtcStartOfDay(a)),
    to: iso(toUtcEndOfDay(a)),
    label: String(period || 'Range'),
  }
}

export default { periodToRange }
