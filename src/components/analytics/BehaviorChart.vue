<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'

/**
 * BehaviorChart.vue (single-file, no heavy chart libs)
 * - White + blue look (Trolio style)
 * - Smooth line + soft area fill (Time on chart)
 * - Light bars (Trades executed)
 * - Hover: vertical guide + active dot + tooltip (dark card like your reference)
 * - Tooltip shows: time spent, trades executed, trades closed, avg hold, top strategy
 *
 * Clean code, deterministic mock data (replace with API later)
 */

const props = defineProps({
  /**
   * Optional external data. If empty, component uses mockData.
   * Expected shape:
   * [
   *  { dayLabel: 'Mon', date: '2026-02-16', hours: 4.2, tradesExecuted: 2, tradesClosed: 1, avgHoldDays: 1.3, topStrategy: 'FVG', notes?: string }
   * ]
   */
  data: {
    type: Array,
    default: () => [],
  },
  title: {
    type: String,
    default: 'Behavior Pattern',
  },
  subtitle: {
    type: String,
    default: 'Presence over time (hours on chart + trades executed)',
  },
})

const mockData = [
  {
    dayLabel: 'Mon',
    date: '2026-02-16',
    hours: 3.1,
    tradesExecuted: 1,
    tradesClosed: 1,
    avgHoldDays: 0.6,
    topStrategy: 'Mitigation Blocks',
  },
  {
    dayLabel: 'Tue',
    date: '2026-02-17',
    hours: 3.8,
    tradesExecuted: 2,
    tradesClosed: 1,
    avgHoldDays: 1.2,
    topStrategy: 'Fair Value Gaps',
  },
  {
    dayLabel: 'Wed',
    date: '2026-02-18',
    hours: 4.4,
    tradesExecuted: 0,
    tradesClosed: 1,
    avgHoldDays: 2.1,
    topStrategy: 'No trade',
  },
  {
    dayLabel: 'Thu',
    date: '2026-02-19',
    hours: 6.3,
    tradesExecuted: 3,
    tradesClosed: 2,
    avgHoldDays: 1.9,
    topStrategy: 'Mitigation Blocks',
  },
  {
    dayLabel: 'Fri',
    date: '2026-02-20',
    hours: 5.4,
    tradesExecuted: 1,
    tradesClosed: 0,
    avgHoldDays: 3.0,
    topStrategy: 'Order Block',
  },
  {
    dayLabel: 'Sat',
    date: '2026-02-21',
    hours: 5.9,
    tradesExecuted: 2,
    tradesClosed: 2,
    avgHoldDays: 0.9,
    topStrategy: 'Fair Value Gaps',
  },
  {
    dayLabel: 'Sun',
    date: '2026-02-22',
    hours: 7.1,
    tradesExecuted: 2,
    tradesClosed: 1,
    avgHoldDays: 1.6,
    topStrategy: 'Mitigation Blocks',
  },
]

const points = computed(() => {
  const src = props.data?.length ? props.data : mockData
  return src.map((d) => ({
    ...d,
    hours: Number(d.hours) || 0,
    tradesExecuted: Number(d.tradesExecuted) || 0,
    tradesClosed: Number(d.tradesClosed) || 0,
    avgHoldDays: Number(d.avgHoldDays) || 0,
  }))
})

/** Layout */
const W = 980
const H = 320
const P = { top: 22, right: 22, bottom: 44, left: 54 }
const innerW = W - P.left - P.right
const innerH = H - P.top - P.bottom

/** Scales */
const maxHours = computed(() => Math.max(8, ...points.value.map((p) => p.hours)))
const maxTrades = computed(() => Math.max(4, ...points.value.map((p) => p.tradesExecuted)))

const xForIndex = (i) => P.left + (innerW * i) / Math.max(1, points.value.length - 1)
const yForHours = (hours) => {
  const t = hours / maxHours.value
  return P.top + (1 - t) * innerH
}
const barHeightForTrades = (count) => {
  const t = count / maxTrades.value
  return Math.max(4, t * (innerH * 0.55))
}

/** Path builders */
const linePath = computed(() => {
  const pts = points.value
  if (!pts.length) return ''
  const d = pts
    .map((p, i) => {
      const x = xForIndex(i)
      const y = yForHours(p.hours)
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
    })
    .join(' ')
  return d
})

const areaPath = computed(() => {
  const pts = points.value
  if (!pts.length) return ''
  const startX = xForIndex(0)
  const endX = xForIndex(pts.length - 1)
  const baseY = P.top + innerH
  return `${linePath.value} L ${endX.toFixed(2)} ${baseY.toFixed(2)} L ${startX.toFixed(
    2,
  )} ${baseY.toFixed(2)} Z`
})

/** Hover + tooltip */
const containerRef = ref(null)
const hoverIndex = ref(-1)
const tooltip = ref({
  visible: false,
  x: 0,
  y: 0,
})

const clamp = (n, min, max) => Math.max(min, Math.min(max, n))

const formatDateHuman = (iso) => {
  // e.g. "Thursday, 20 Feb"
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' })
}

const formatHours = (hours) => {
  const totalMins = Math.round(hours * 60)
  const h = Math.floor(totalMins / 60)
  const m = totalMins % 60
  if (h <= 0) return `${m}m`
  return `${h}h ${String(m).padStart(2, '0')}m`
}

const hoveredPoint = computed(() => {
  if (hoverIndex.value < 0) return null
  return points.value[hoverIndex.value] || null
})

const onMouseLeave = () => {
  hoverIndex.value = -1
  tooltip.value.visible = false
}

const onMouseMove = (e) => {
  const el = containerRef.value
  if (!el) return

  const rect = el.getBoundingClientRect()
  const mx = e.clientX - rect.left
  const my = e.clientY - rect.top

  // Find nearest point by x
  const pts = points.value
  if (!pts.length) return

  const xs = pts.map((_, i) => {
    // map svg x to CSS x based on viewBox scaling
    // since we're using 100% width with a fixed viewBox, ratio is consistent
    const svgX = xForIndex(i)
    return (svgX / W) * rect.width
  })

  let nearest = 0
  let best = Infinity
  for (let i = 0; i < xs.length; i += 1) {
    const dist = Math.abs(mx - xs[i])
    if (dist < best) {
      best = dist
      nearest = i
    }
  }

  hoverIndex.value = nearest
  tooltip.value.visible = true

  // Tooltip position: float near cursor but keep inside card
  // Tooltip position: float near cursor but keep inside card
  const pad = 14
  const tW = 300
  const tH = 178

  // Anchor to the active point (stable & predictable)
  const px = (xForIndex(nearest) / W) * rect.width
  const py = (yForHours(pts[nearest].hours) / H) * rect.height

  // Decide left/right placement
  const prefersLeft = px > rect.width * 0.62
  const prefersRight = px < rect.width * 0.38

  // Default: place to the right, above
  let tx = px + 16
  let ty = py - tH - 14

  // If point is on right side, place tooltip to the left
  if (prefersLeft) tx = px - tW - 16

  // If too close to left edge, force right
  if (prefersRight) tx = px + 16

  // If tooltip would go above container, push below point
  if (ty < pad) ty = py + 14

  // If tooltip would go below container, pull above point
  if (ty + tH > rect.height - pad) ty = py - tH - 14

  // Hard clamp (never escape container)
  tooltip.value.x = clamp(tx, pad, rect.width - tW - pad)
  tooltip.value.y = clamp(ty, pad, rect.height - tH - pad)
}

const onKeyDown = (e) => {
  // accessibility: arrow keys move hover focus if desired
  if (!points.value.length) return
  if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return

  e.preventDefault()
  if (hoverIndex.value < 0) hoverIndex.value = 0
  hoverIndex.value =
    e.key === 'ArrowLeft'
      ? Math.max(0, hoverIndex.value - 1)
      : Math.min(points.value.length - 1, hoverIndex.value + 1)

  tooltip.value.visible = true
  // place tooltip near active point center
  const el = containerRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const px = (xForIndex(hoverIndex.value) / W) * rect.width
  const pad = 14
  const tW = 300
  const tH = 178

  const py = (yForHours(points.value[hoverIndex.value].hours) / H) * rect.height

  const prefersLeft = px > rect.width * 0.62
  let tx = prefersLeft ? px - tW - 16 : px + 16
  let ty = py - tH - 14
  if (ty < pad) ty = py + 14

  tooltip.value.x = clamp(tx, pad, rect.width - tW - pad)
  tooltip.value.y = clamp(ty, pad, rect.height - tH - pad)
}

onBeforeUnmount(() => {
  // nothing to cleanup here
})
</script>

<template>
  <section class="behavior-card">
    <header class="behavior-card__header">
      <div class="behavior-card__titles">
        <h2 class="behavior-card__title">{{ title }}</h2>
        <p class="behavior-card__subtitle">{{ subtitle }}</p>
      </div>

      <div class="behavior-card__legend">
        <span class="legend-item">
          <span class="legend-dot legend-dot--line" aria-hidden="true"></span>
          <span class="legend-text">Time on chart (hours)</span>
        </span>
        <span class="legend-item">
          <span class="legend-dot legend-dot--bars" aria-hidden="true"></span>
          <span class="legend-text">Trades executed</span>
        </span>
      </div>
    </header>

    <div
      ref="containerRef"
      class="chart-shell"
      tabindex="0"
      role="group"
      aria-label="Behavior pattern chart"
      @mousemove="onMouseMove"
      @mouseleave="onMouseLeave"
      @keydown="onKeyDown"
    >
      <svg class="chart" :viewBox="`0 0 ${W} ${H}`" preserveAspectRatio="none">
        <!-- Grid -->
        <g class="grid">
          <line
            v-for="i in 4"
            :key="i"
            :x1="P.left"
            :x2="W - P.right"
            :y1="P.top + (innerH * i) / 4"
            :y2="P.top + (innerH * i) / 4"
          />
        </g>

        <!-- Y labels (hours) -->
        <g class="y-axis">
          <text
            v-for="tick in 4"
            :key="tick"
            :x="P.left - 10"
            :y="P.top + (innerH * tick) / 4 + 4"
            text-anchor="end"
          >
            {{ Math.round((maxHours - (maxHours * tick) / 4) * 10) / 10 }}
          </text>
        </g>

        <!-- Bars: trades executed -->
        <g class="bars">
          <rect
            v-for="(p, i) in points"
            :key="p.date + i"
            :x="xForIndex(i) - 14"
            :y="P.top + innerH - barHeightForTrades(p.tradesExecuted)"
            width="28"
            :height="barHeightForTrades(p.tradesExecuted)"
            :class="['bar', { 'bar--active': hoverIndex === i }]"
            rx="6"
          />
        </g>

        <!-- Area fill under line -->
        <path class="area" :d="areaPath" />

        <!-- Line -->
        <path class="line" :d="linePath" />

        <!-- Active vertical guide + dot -->
        <g v-if="hoverIndex >= 0" class="hover">
          <line
            class="hover-line"
            :x1="xForIndex(hoverIndex)"
            :x2="xForIndex(hoverIndex)"
            :y1="P.top"
            :y2="P.top + innerH"
          />

          <circle
            class="hover-dot"
            :cx="xForIndex(hoverIndex)"
            :cy="yForHours(hoveredPoint?.hours || 0)"
            r="6"
          />
          <circle
            class="hover-dotRing"
            :cx="xForIndex(hoverIndex)"
            :cy="yForHours(hoveredPoint?.hours || 0)"
            r="12"
          />
        </g>

        <!-- X labels -->
        <g class="x-axis">
          <text
            v-for="(p, i) in points"
            :key="p.dayLabel + i"
            :x="xForIndex(i)"
            :y="H - 16"
            text-anchor="middle"
          >
            {{ p.dayLabel }}
          </text>
        </g>
      </svg>

      <!-- Tooltip (dark card, like your reference) -->
      <div
        v-if="tooltip.visible && hoveredPoint"
        class="tooltip"
        :style="{ transform: `translate(${tooltip.x}px, ${tooltip.y}px)` }"
        role="status"
        aria-live="polite"
      >
        <div class="tooltip__date">{{ formatDateHuman(hoveredPoint.date) }}</div>

        <div class="tooltip__row">
          <span class="tooltip__swatch tooltip__swatch--line" aria-hidden="true"></span>
          <div class="tooltip__label">Time on chart</div>
          <div class="tooltip__value">{{ formatHours(hoveredPoint.hours) }}</div>
        </div>

        <div class="tooltip__row">
          <span class="tooltip__swatch tooltip__swatch--bars" aria-hidden="true"></span>
          <div class="tooltip__label">Trades executed</div>
          <div class="tooltip__value">{{ hoveredPoint.tradesExecuted }}</div>
        </div>

        <div class="tooltip__row">
          <span class="tooltip__swatch tooltip__swatch--muted" aria-hidden="true"></span>
          <div class="tooltip__label">Trades closed</div>
          <div class="tooltip__value">{{ hoveredPoint.tradesClosed }}</div>
        </div>

        <div class="tooltip__row tooltip__row--thin">
          <div class="tooltip__label">Held for (avg)</div>
          <div class="tooltip__value">{{ hoveredPoint.avgHoldDays.toFixed(1) }}d</div>
        </div>

        <div class="tooltip__divider" />

        <div class="tooltip__meta">
          <div class="tooltip__metaLabel">Top strategy</div>
          <div class="tooltip__metaValue">{{ hoveredPoint.topStrategy }}</div>
        </div>

        <div class="tooltip__hint">Hover other days to compare</div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* =========================
   Card shell (matches your dashboard style)
   ========================= */
.behavior-card {
  background: #ffffff;
  border: 1px solid rgba(232, 236, 243, 1);
  border-radius: 0.9rem;
  box-shadow: 0 16px 40px rgba(16, 24, 40, 0.06);
  padding: 1.25rem 1.35rem 1.35rem;
}

.behavior-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.9rem;
}

.behavior-card__titles {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.behavior-card__title {
  margin: 0;
  font-family:
    'Poppins',
    system-ui,
    -apple-system,
    Segoe UI,
    Roboto,
    Arial,
    sans-serif;
  font-size: 1.02rem;
  font-weight: 600;
  color: rgba(15, 23, 42, 0.86);
  letter-spacing: -0.02em;
}

.behavior-card__subtitle {
  margin: 0;
  font-family:
    'Poppins',
    system-ui,
    -apple-system,
    Segoe UI,
    Roboto,
    Arial,
    sans-serif;
  font-size: 0.86rem;
  font-weight: 400;
  color: rgba(15, 23, 42, 0.5);
}

/* Legend (top-right) */
.behavior-card__legend {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  flex-wrap: wrap;
  justify-content: flex-end;
  padding-top: 0.2rem;
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
}

.legend-dot--line {
  background: #0b5cab;
}

.legend-dot--bars {
  background: rgba(11, 92, 171, 0.25);
}

.legend-text {
  font-family:
    'Poppins',
    system-ui,
    -apple-system,
    Segoe UI,
    Roboto,
    Arial,
    sans-serif;
  font-size: 0.82rem;
  font-weight: 500;
  color: rgba(15, 23, 42, 0.52);
}

/* =========================
   Chart shell & hover feel (like your reference)
   ========================= */
.chart-shell {
  position: relative;
  border-radius: 0.75rem;
  background: linear-gradient(180deg, rgba(248, 250, 252, 0.9) 0%, rgba(255, 255, 255, 1) 100%);
  border: 1px solid rgba(232, 236, 243, 1);
  overflow: hidden;
  padding: 0.75rem 0.75rem 0.35rem;

  transition:
    transform 160ms ease,
    box-shadow 160ms ease;
}

.chart-shell:focus {
  outline: none;
  box-shadow:
    0 0 0 3px rgba(11, 92, 171, 0.14),
    0 18px 40px rgba(16, 24, 40, 0.08);
}

.chart-shell:hover {
  box-shadow: 0 18px 44px rgba(16, 24, 40, 0.09);
  transform: translateY(-1px);
}

.chart {
  width: 100%;
  height: 330px;
  display: block;
}

/* Grid + axes */
.grid line {
  stroke: rgba(15, 23, 42, 0.06);
  stroke-width: 1;
}

.y-axis text,
.x-axis text {
  font-family:
    'Poppins',
    system-ui,
    -apple-system,
    Segoe UI,
    Roboto,
    Arial,
    sans-serif;
  font-size: 12px;
  fill: rgba(15, 23, 42, 0.45);
}

/* Bars */
.bar {
  fill: rgba(11, 92, 171, 0.12);
  transition:
    fill 160ms ease,
    opacity 160ms ease;
}
.bar--active {
  fill: rgba(11, 92, 171, 0.22);
}

/* Area & line */
.area {
  fill: rgba(11, 92, 171, 0.08);
}

.line {
  fill: none;
  stroke: #0b5cab;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* Hover guide */
.hover-line {
  stroke: rgba(15, 23, 42, 0.14);
  stroke-width: 1;
  stroke-dasharray: 4 6;
}

.hover-dot {
  fill: #0b5cab;
}

.hover-dotRing {
  fill: rgba(11, 92, 171, 0.12);
}

/* =========================
   Tooltip (dark card like your screenshots)
   ========================= */
.tooltip {
  position: absolute;
  top: 0;
  left: 0;
  width: 300px;
  border-radius: 14px;
  background: rgba(16, 18, 20, 0.92);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 0.9rem 0.95rem;
  color: rgba(255, 255, 255, 0.92);
  transform-origin: top left;
  pointer-events: none;
}

.tooltip__date {
  font-family:
    'Poppins',
    system-ui,
    -apple-system,
    Segoe UI,
    Roboto,
    Arial,
    sans-serif;
  font-size: 0.86rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  margin-bottom: 0.65rem;
}

.tooltip__row {
  display: grid;
  grid-template-columns: 12px 1fr auto;
  align-items: center;
  gap: 0.55rem;
  padding: 0.34rem 0;
}

.tooltip__row--thin {
  grid-template-columns: 1fr auto;
  padding-top: 0.45rem;
}

.tooltip__swatch {
  width: 10px;
  height: 10px;
  border-radius: 3px;
}

.tooltip__swatch--line {
  background: #67b4ff;
}
.tooltip__swatch--bars {
  background: rgba(103, 180, 255, 0.35);
}
.tooltip__swatch--muted {
  background: rgba(255, 255, 255, 0.12);
}

.tooltip__label {
  font-family:
    'Poppins',
    system-ui,
    -apple-system,
    Segoe UI,
    Roboto,
    Arial,
    sans-serif;
  font-size: 0.82rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
}

.tooltip__value {
  font-family:
    'Poppins',
    system-ui,
    -apple-system,
    Segoe UI,
    Roboto,
    Arial,
    sans-serif;
  font-size: 0.84rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
}

.tooltip__divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
  margin: 0.55rem 0 0.6rem;
}

.tooltip__meta {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
}

.tooltip__metaLabel {
  font-family:
    'Poppins',
    system-ui,
    -apple-system,
    Segoe UI,
    Roboto,
    Arial,
    sans-serif;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: rgba(255, 255, 255, 0.58);
  text-transform: uppercase;
}

.tooltip__metaValue {
  font-family:
    'Poppins',
    system-ui,
    -apple-system,
    Segoe UI,
    Roboto,
    Arial,
    sans-serif;
  font-size: 0.84rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
  text-align: right;
}

.tooltip__hint {
  margin-top: 0.55rem;
  font-family:
    'Poppins',
    system-ui,
    -apple-system,
    Segoe UI,
    Roboto,
    Arial,
    sans-serif;
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.55);
}
</style>
