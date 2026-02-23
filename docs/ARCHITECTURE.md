# Trolio — Architecture, Data Flow and Component Guide

This document is a comprehensive, end-to-end architecture guide for the Trolio application in this repository. It's written as a practical, story-like reference so you (or any developer) can re-create and operate the system from scratch.

Table of contents

- **Overview**
- **High-level architecture**
- **Data model & backend contracts**
- **API design and examples**
- **Frontend architecture (folder-by-folder)**
- **Component-by-component reference**
- **State, reactivity & data flow**
- **Filtering, time handling & period semantics**
- **Performance & aggregation strategy**
- **Caching, offline & sync**
- **Testing, observability & deployment**
- **Appendix: Code examples**

**Overview**

- **Product intent**: Trolio is a trading dashboard/analytics SPA designed to present KPIs, charts, insights and summaries for a user over selectable periods (weekly/monthly/custom). The UI is reactive and data-driven; the backend provides time-series data and pre-aggregated metrics.
- **Primary goals**: predictable data contracts, consistent period semantics across the app, performant reads for dashboard views, and a single source of truth for period->range mapping.

**High-level architecture**

- **Client**: Vue 3 SPA (Composition API, `script setup`) living in `src/`. Components render based on data returned from the backend. Data fetching and period interpretation centralized in composables/services.
- **Backend**: REST (or GraphQL) service exposing dashboard endpoints. Persists raw event data (trades, actions, metric events) with timestamps. Background workers build aggregates (daily/hourly) into dedicated tables or materialized views.
- **Datastore**: Relational DB (Postgres) or specialized time-series DB (ClickHouse, InfluxDB) depending on scale. Schema keeps raw events + aggregation tables.
- **Caching layer**: Redis for cached aggregates and rate-limiting; CDN for static assets.

**Data model & backend contracts**

- **Event row (raw)**
  - **id**: uuid
  - **user_id**: uuid
  - **type**: string (trade, session, other)
  - **payload**: jsonb (raw details)
  - **occurred_at**: timestamptz (ISO-8601 UTC) — primary time column
  - **created_at**: timestamptz
  - Indexes: `(user_id, occurred_at)`, `(type, occurred_at)`

- **Aggregate row (daily/hourly)**
  - **id**: uuid
  - **user_id**: uuid
  - **bucket_start**: date or timestamptz (UTC aligned)
  - **granularity**: enum('hour', 'day')
  - **metrics**: jsonb { win_rate, total_trades, avg_return, pnl, ... }
  - Indexes: `(user_id, granularity, bucket_start)`

- **Dashboard response (contract)** — backend returns a single JSON envelope per period request. Example:
  {
  "period": {"from":"2026-02-16","to":"2026-02-22","label":"Weekly"},
  "kpi": [ {"key":"win_rate","value":0.68,"delta":0.05}, ... ],
  "chart": { "series": [{"name":"return","points":[{"t":"2026-02-16T00:00:00Z","v":1.2}, ...]} ] },
  "insights": [{"title":"Peak Performance Hour","description":"...","score":0.92}],
  "summary": [{"title":"Gross P&L","value":3240,"delta":420}],
  "meta": {"fetchedAt":"2026-02-23T12:00:00Z","timezone":"UTC"}
  }

Notes:

- Numeric values are raw (floats/integers). Formatting (currency, percent) is done client-side.
- Times are ISO-8601 UTC.

**API design and examples**

- GET /api/dashboard?period=weekly&anchor=2026-02-23&userId=... — named periods + anchor date
- GET /api/dashboard?from=2026-02-01&to=2026-02-28&userId=... — explicit range
- Query params: `period` (weekly|monthly|daily|custom), `anchor` (ISO date), `from`, `to`, `userId`.
- Response: JSON envelope as shown above.
- Error handling: return HTTP 400 for invalid dates/periods, 401 for auth, 500 for server errors. Include `error.code` and `error.message` in body.

**Frontend architecture (folder-by-folder)**

- **src/pages/** — route/page-level components; orchestrate data fetches and pass props to children.
  - `DashboardPage.vue` — the primary page showing `DashboardHero`, `BaseTabs`, KPI sections, charts, insights and summary.
- **src/components/** — UI components split by feature area:
  - `dashboard/` — `DashboardHero.vue` (static header)
  - `shared/` — `BaseTabs.vue` (v-model wrapper for tab selection), `BaseButton`, etc.
  - `analytics/` — `MetricCard.vue`, `BehaviorChart.vue`, `SummaryMetric.vue` — visual renderers.
  - `insights/` — `InsightCard.vue` — text-based findings.
  - `activity/`, `activity-detail/` — related UIs for activity/transactions.
- **src/composables/** — data and logic hooks:
  - `useActivity.js`, `useActivityDetail.js` — existing hooks for activity flows.
  - (add) `useDashboard.js` — recommended: central fetching, caching and period mapping.
- **src/services/** — thin wrappers that call REST APIs and transform network payloads to client models.
  - `DashboardService.js` — `fetchDashboard({from,to,period,anchor,userId})` returns normalized data.
- **src/stores/** — Pinia/Vuex stores (this repo has a `counter.js` store). Use a store for cross-page caching and session-level preferences (e.g., timezone)
- **src/router/** — route definitions.

**Component-by-component reference**

- `BaseTabs.vue`
  - Props: `tabs: Array<{id,label}>`
  - v-model: binds selected `id` via `modelValue` + `update:modelValue` event (standard `v-model` API)
  - Emits: `update:modelValue` with selected tab id
  - UX: should display loading/active states and accept keyboard navigation
- `MetricCard.vue`
  - Props: `title`, `value`, `trend`
  - Renders a small KPI card. Accepts numeric `value` OR preformatted string.
- `BehaviorChart.vue`
  - Props: `series` or `points` (array of {t, v})
  - Renders chart (Chart.js or ECharts). Purely presentational — data supplied by page or composable.
- `InsightCard.vue`
  - Props: `title`, `description`, optional `score`
  - Static rendering and CTA slot.
- `SummaryMetric.vue`
  - Props: `title`, `value`, `delta`

For each presentational component:

- The component should accept raw values (numbers) and formatting should be done inside or via a small utility `formatNumber(value, options)` so the backend stays unopinionated.
- Components should be stateless: rely on props only and emit events for user interactions.

**State, reactivity & data flow**

- **Page-level orchestration**: Page components (e.g., `DashboardPage.vue`) hold local reactive state like `activeTab` (a `ref`) and fetched `dashboardData` (a `ref` or reactive object).
- **Composables**: `useDashboard()` exposes `dashboardData`, `loading`, `error`, and `fetchDashboard(params)`.
  - Internally uses `ref`/`reactive` and `watch` to react to `activeTab` or explicit range changes.
  - Exposes `invalidate(periodKey)` to clear caches.
- **v-model**: `BaseTabs` uses `v-model` to change `activeTab`. `DashboardPage` `watch(activeTab, handler)` triggers data fetch.
- **Props down, events up**: Page passes fetched data as props to components. Components emit interactions (e.g., `select-point`) back to page for drilldowns.
- **Cross-page sharing**: Use a Pinia store for session-level data (e.g., last selected period, timezone). Keep large fetched datasets in composable caches (or in store if multiple pages reuse them frequently).

**Filtering, time handling & period semantics**

- **Canonical timestamp**: `occurred_at` in UTC (timestamptz) on all backend records.
- **Period naming**: `weekly` means an ISO-week (Mon–Sun) by default OR last 7 days depending on product decision. Pick one and centralize logic.
- **Anchors**: Provide an `anchor` date for relative periods (e.g., anchor=2026-02-23), so `weekly` can resolve to `2026-02-17..2026-02-23`.
- **Client handling**:
  - Centralize `periodToRange(period, anchor)` in a single util used by backend and frontend tests.
  - Convert user's timezone only for display; server aggregation stays in UTC.
  - All network queries should be by `from`/`to` (UTC ISO strings) to avoid ambiguity.

**Performance & aggregation strategy**

- **Small data volumes**: On-the-fly aggregation (`GROUP BY date_trunc('day', occurred_at)`) is fine.
- **Medium/large scale**: Pre-aggregate into daily/hourly aggregates via background jobs. Store aggregates in a dedicated table and query that for dashboard reads.
- **Materialized views**: Use materialized views for business-critical metrics and refresh them incrementally.
- **Time-series DB**: For very high volumes, use ClickHouse or InfluxDB for fast aggregation.

**Caching, offline & sync**

- **HTTP caching**: Use `Cache-Control` / ETags for static dashboards per user+period key.
- **Client cache**: Cache fetched dashboard data in composable with TTL. Use `userId|from|to` as cache key.
- **Offline**: Not required for initial MVP. If needed, cache last-good snapshot and indicate staleness.

**Testing, observability & deployment**

- **Unit tests**: Test `periodToRange`, `useDashboard` logic, and API service transforms.
- **Integration tests**: Mock backend and validate page renders for `weekly` and `monthly` responses (Cypress or Playwright).
- **Monitoring**: Log API latency, cache hit rate, background job failures. Add dashboards for aggregate freshness.
- **Deployment**: Standard Node backend + Postgres; frontend built by Vite and served via CDN. Use CI to run tests and lint.

**Appendix: Code examples**

- **periodToRange util**

```js
import { startOfISOWeek, endOfISOWeek, startOfMonth, endOfMonth } from 'date-fns'

export function periodToRange(period, anchor = new Date()) {
  if (period === 'weekly') {
    const from = startOfISOWeek(anchor)
    const to = endOfISOWeek(anchor)
    return { from: from.toISOString(), to: to.toISOString(), label: 'Weekly' }
  }
  if (period === 'monthly') {
    const from = startOfMonth(anchor)
    const to = endOfMonth(anchor)
    return { from: from.toISOString(), to: to.toISOString(), label: 'Monthly' }
  }
  // custom / fallback
  return { from: anchor.toISOString(), to: anchor.toISOString(), label: 'Custom' }
}
```

- **useDashboard composable (sketch)**

```js
import { ref } from 'vue'
import DashboardService from '@/services/DashboardService'
import { periodToRange } from '@/utils/period'

export default function useDashboard() {
  const dashboardData = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const cache = new Map()

  async function fetchDashboard({ period, anchor, from, to, userId }) {
    loading.value = true
    error.value = null
    try {
      if (!from || !to) {
        const range = periodToRange(period, anchor ? new Date(anchor) : new Date())
        from = range.from
        to = range.to
      }
      const key = `${userId}|${from}|${to}`
      if (cache.has(key)) {
        dashboardData.value = cache.get(key)
        loading.value = false
        return dashboardData.value
      }
      const resp = await DashboardService.fetch({ from, to, userId })
      cache.set(key, resp)
      dashboardData.value = resp
      return resp
    } catch (e) {
      error.value = e
      throw e
    } finally {
      loading.value = false
    }
  }

  function invalidate(key) {
    cache.delete(key)
  }

  return { dashboardData, loading, error, fetchDashboard, invalidate }
}
```

- **Wiring `activeTab` in `DashboardPage.vue` (sketch)**

```html
<script setup>
  import { ref, watch, onMounted } from 'vue'
  import useDashboard from '@/composables/useDashboard'

  const activeTab = ref('weekly')
  const { dashboardData, loading, fetchDashboard } = useDashboard()

  async function load() {
    await fetchDashboard({
      period: activeTab.value,
      anchor: new Date().toISOString(),
      userId: 'current',
    })
  }
  watch(activeTab, load)
  onMounted(load)
</script>

<template>
  <BaseTabs :tabs="tabs" v-model="activeTab" />
  <MetricCard
    v-for="m in dashboardData.kpi"
    :key="m.key"
    :title="m.key"
    :value="m.value"
    :trend="m.delta"
  />
</template>
```

**Guidelines & checklist for re-creation**

- Always use UTC timestamps throughout the ingestion and aggregation pipeline.
- Centralize `periodToRange` in a single module that both backend tests and frontend import.
- Use a single `DashboardService` contract and a `useDashboard` composable for all pages needing dashboard data.
- Render all UI from the server-provided envelope; only format values in the client.
- Keep presentational components stateless, and put business logic into composables/services.

**Where to extend**

- Add a `date-range` picker component that maps to the same `periodToRange` util.
- Add server-side pagination for chart points if requested range becomes very large.
- Add feature flags for experimental insights and background jobs to recompute them.

---

If you need, I can now:

- implement `useDashboard.js` in `src/composables/`
- implement `DashboardService.js` in `src/services/`
- wire `DashboardPage.vue` to call the composable and pass data to components
- or expand any section of this doc into a separate README or design diagram

Tell me which next step you'd like me to take and I will proceed.
