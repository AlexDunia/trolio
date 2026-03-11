<template>
  <main class="profile">
    <section class="profile__card">
      <div class="profile__top">
        <aside class="profile__left">
          <div class="profile__avatar-wrap">
            <div class="profile__avatar" aria-hidden="true"></div>
          </div>
          <div class="profile__followers">
            <div class="profile__followers-count">{{ profile.followers }}</div>
            <div class="profile__followers-meta">
              <span class="profile__followers-label">Followers</span>
              <span class="profile__followers-badge">+1 Follower</span>
            </div>
          </div>
        </aside>

        <div class="profile__right">
          <h1 class="profile__name">{{ profile.name }}</h1>
          <p class="profile__bio">{{ profile.bio }}</p>

          <div class="profile__controls">
            <label class="sr-only" for="period">Period</label>
            <select id="period" class="profile__select">
              <option>This month</option>
            </select>
          </div>

          <div class="profile__stats">
            <div class="stat-card stat-card--performance">
              <div class="stat-card__title">PERFORMANCE</div>
              <div class="stat-card__row stat-card__row--good">
                80% <span class="stat-card__label">Win Rate</span>
              </div>
              <div class="stat-card__row stat-card__row--bad">
                40% <span class="stat-card__label">Win Rate</span>
              </div>
            </div>

            <div class="stat-card stat-card--net">
              <div class="stat-card__title">NET RESULTS</div>
              <div class="stat-card__row">
                <span class="stat-card__value">$4,720</span>
                <span class="stat-card__label">Net Profit</span>
              </div>
              <div class="stat-card__row">
                <span class="stat-card__value">$4,720</span>
                <span class="stat-card__label">Net Loss</span>
              </div>
            </div>

            <div class="stat-card stat-card--assets">
              <div class="stat-card__title">MOST TRADED ASSETS</div>
              <ul class="stat-card__list">
                <li>EUR / USD</li>
                <li>XAU / USD</li>
                <li>NAS100</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="profile__tabs">
        <nav class="tabs">
          <button class="tabs__item tabs__item--active">Overview</button>
          <button class="tabs__item">Trade History</button>
        </nav>
      </div>

      <div class="profile__info-row">
        <div class="info-card">
          <div class="info-card__title">Most Traded Pair</div>
          <div class="info-card__value">EUR/NZD</div>
          <div class="info-card__meta"><span class="pill">+10%</span> Avg 40 mins / day</div>
        </div>

        <div class="info-card">
          <div class="info-card__title">Most Used Bias</div>
          <div class="info-card__value">Mitigation Blocks</div>
          <div class="info-card__meta"><span class="pill">+10%</span> Avg 40 mins / day</div>
        </div>
      </div>

      <section v-if="statusMessage && !trader" class="profile__analytics-status">
        {{ statusMessage }}
      </section>

      <div class="profile__heatmap">
        <h2 class="profile__heatmap-title">Activity Heatmap (Last 12 Weeks)</h2>
        <div class="profile__heatmap-sub">{{ heatmapSubtitle }}</div>
        <div class="profile__heatmap-body">
          <ActivityHeatmap v-if="heatmapDays.length" :days="heatmapDays" />
          <div v-else class="profile__analytics-empty">
            {{ statusMessage ?? 'No activity yet. Leaderboard telemetry is still warming up.' }}
          </div>
        </div>
      </div>

      <section class="profile__analytics-row">
        <div class="profile__module">
          <h3>Pairs studied</h3>
          <div class="chip-row">
            <span v-for="pair in trader?.pairsStudied ?? []" :key="pair" class="chip">{{
              pair
            }}</span>
          </div>
          <PairFocusChart :pairs="pairDistribution" />
        </div>

        <div class="profile__module">
          <h3>Recent sessions</h3>
          <RecentSessions :sessions="trader?.tradingSessions ?? []" />
        </div>
      </section>

      <section class="profile__analytics-row profile__analytics-row--triple">
        <div class="profile__module">
          <h3>Performance snapshot</h3>
          <PerformanceSnapshot :metrics="performanceMetrics" />
        </div>
        <div class="profile__module">
          <h3>Weekly activity trend</h3>
          <WeeklyTrendChart :series="weeklyTrendSeries" />
        </div>
        <div class="profile__module">
          <h3>Consistency gauge</h3>
          <ConsistencyGauge
            :weekly-hours="consistencyData.weeklyHours"
            :daily-average="consistencyData.dailyAverage"
            :total-hours="consistencyData.totalHours"
            :target-hours="GAUGE_TARGET"
          />
        </div>
      </section>
    </section>
  </main>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import LeaderboardService from '@/services/LeaderboardService'
import { fetchEnvelope } from '@/services/dataEnvelopeProvider'
import ActivityHeatmap from '@/components/analytics/ActivityHeatmap.vue'
import WeeklyTrendChart from '@/components/analytics/WeeklyTrendChart.vue'
import PairFocusChart from '@/components/analytics/PairFocusChart.vue'
import RecentSessions from '@/components/analytics/RecentSessions.vue'
import ConsistencyGauge from '@/components/analytics/ConsistencyGauge.vue'
import PerformanceSnapshot from '@/components/analytics/PerformanceSnapshot.vue'

const route = useRoute()
const WEEK_RANGE_DAYS = 6
const GAUGE_TARGET = 35
const DEFAULT_TRADER_ID = 'merlin'

const profile = ref({
  name: 'Merlin Trader',
  bio: 'Six-figure trader and FundedNext Ambassador with a strong focus on precision, discipline, and consistent performance across the financial markets.',
  followers: 5000,
})

const trader = ref(null)
const envelope = ref(null)
const isLoading = ref(false)
const error = ref(null)

const activeTraderId = computed(() => route.query.trader?.toString() || DEFAULT_TRADER_ID)
const timeframe = computed(() => (route.query.timeframe === 'daily' ? 'daily' : 'weekly'))

const heatmapDays = computed(() => {
  const days = envelope.value?.behavior?.daily ?? []
  return days.map((entry) => ({
    date: entry.date,
    minutes: Math.round((entry.totalMs ?? 0) / (1000 * 60)),
  }))
})

const weeklyTrendSeries = computed(() =>
  heatmapDays.value.map((entry) => ({
    day: new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' }),
    hours: Number(((entry.minutes || 0) / 60).toFixed(2)),
  })),
)

const pairDistribution = computed(() => {
  const sessionList = trader.value?.tradingSessions ?? []
  const pairMap = {}
  sessionList.forEach((session) => {
    const minutes = session.durationMinutes ?? 0
    if (!session.pair) return
    pairMap[session.pair] = (pairMap[session.pair] || 0) + minutes
  })
  const pairs = Object.entries(pairMap).map(([pair, minutes]) => ({
    pair,
    hours: Number((minutes / 60).toFixed(1)),
  }))
  return pairs.sort((a, b) => b.hours - a.hours)
})

const performanceMetrics = computed(() => ({
  weeklyHours: trader.value?.chartMetrics.weeklyHours ?? 0,
  dailyAverage: trader.value?.chartMetrics.dailyAverage ?? 0,
  totalHours: trader.value?.chartMetrics.totalHours ?? 0,
  sessionsThisWeek: trader.value?.tradingSessions?.length ?? 0,
}))

const consistencyData = computed(() => ({
  weeklyHours: performanceMetrics.value.weeklyHours,
  dailyAverage: performanceMetrics.value.dailyAverage,
  totalHours: performanceMetrics.value.totalHours,
}))

const heatmapSubtitle = computed(() => {
  if (!trader.value) return 'Leaderboard telemetry drives this dashboard.'
  const hours = performanceMetrics.value.weeklyHours
  const sessions = performanceMetrics.value.sessionsThisWeek
  return `${hours.toFixed(1)} hrs logged • ${sessions} sessions this week`
})

const statusMessage = computed(() => {
  if (isLoading.value) return 'Loading leaderboard analytics…'
  if (error.value) return error.value
  if (!trader.value) return 'Leaderboard analytics are unavailable.'
  return null
})

const formatIso = (value) => value.toISOString().slice(0, 10)

function weekRange() {
  const to = new Date()
  const from = new Date(to)
  from.setDate(to.getDate() - WEEK_RANGE_DAYS)
  return { from: formatIso(from), to: formatIso(to) }
}

async function loadEnvelopeForUser(userId) {
  const { from, to } = weekRange()
  try {
    envelope.value = await fetchEnvelope({ userId, from, to, periodLabel: 'week' })
  } catch (err) {
    console.error('ProfileOverview heatmap load error', err)
    envelope.value = null
  }
}

async function loadProfile() {
  const id = activeTraderId.value
  if (!id) {
    trader.value = null
    envelope.value = null
    error.value = 'No trader selected'
    return
  }

  isLoading.value = true
  error.value = null
  trader.value = null
  envelope.value = null

  try {
    const profilePromise = LeaderboardService.getTraderLeaderboardProfile({
      id,
      timeframe: timeframe.value,
    })
    const envelopePromise = loadEnvelopeForUser(id)
    const profileData = await profilePromise
    await envelopePromise
    trader.value = profileData
    if (!profileData) {
      error.value = 'Trader not found'
    }
  } catch (err) {
    console.error('ProfileOverview load error', err)
    error.value = 'Unable to load trader analytics'
  } finally {
    isLoading.value = false
  }
}

watch(
  () => [activeTraderId.value, timeframe.value],
  () => {
    void loadProfile()
  },
  { immediate: true },
)
</script>

<style scoped>
:root {
  --card-bg: #ffffff;
  --muted: #9aa4ae;
  --blue: #2563eb;
  --teal-50: #eef9fb;
  --green: #16a34a;
  --red: #ef4444;
  --radius: 10px;
  --gap: 16px;
  --shadow: 0 1px 2px rgba(16, 24, 40, 0.04), 0 4px 12px rgba(16, 24, 40, 0.06);
}

.profile {
  padding: 16px;
}

.profile__card {
  background: var(--card-bg);
  border-radius: var(--radius);
  padding: 20px;
  box-shadow: var(--shadow);
  border: 1px solid rgba(16, 24, 40, 0.04);
}

.profile__top {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.profile__left {
  background: linear-gradient(180deg, var(--teal-50), #f7feff);
  padding: 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.profile__avatar-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}
.profile__avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f3a4ff, #7dd3fc);
  box-shadow: 0 6px 18px rgba(16, 24, 40, 0.08);
}

.profile__followers {
  text-align: center;
}
.profile__followers-count {
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
}
.profile__followers-meta {
  color: var(--muted);
  font-size: 13px;
  display: flex;
  gap: 8px;
  justify-content: center;
}
.profile__followers-badge {
  color: var(--green);
  font-weight: 600;
}

.profile__right {
  padding: 6px 4px;
}
.profile__name {
  margin: 0;
  font-size: 22px;
  color: #0f172a;
}
.profile__bio {
  color: var(--muted);
  margin-top: 8px;
  line-height: 1.5;
}

.profile__controls {
  margin-top: 12px;
}
.profile__select {
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid rgba(16, 24, 40, 0.06);
  background: #fbfdff;
}

.profile__stats {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  flex-wrap: wrap;
}
.stat-card {
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  border: 1px solid rgba(16, 24, 40, 0.04);
  flex: 1;
  min-width: 160px;
}
.stat-card__title {
  font-size: 12px;
  color: var(--muted);
  font-weight: 600;
}
.stat-card__row {
  margin-top: 8px;
  font-weight: 700;
}
.stat-card__row--good {
  color: var(--green);
}
.stat-card__row--bad {
  color: var(--red);
}
.stat-card__value {
  color: var(--blue);
  font-weight: 800;
}
.stat-card__list {
  margin: 8px 0 0 0;
  padding: 0;
  list-style: none;
  color: #0f172a;
}

.profile__tabs {
  margin-top: 18px;
  border-top: 1px solid rgba(16, 24, 40, 0.03);
  padding-top: 12px;
}
.tabs {
  display: flex;
  gap: 12px;
}
.tabs__item {
  background: none;
  border: none;
  padding: 8px 0;
  color: var(--muted);
  font-weight: 600;
  border-bottom: 3px solid transparent;
}
.tabs__item--active {
  color: var(--blue);
  border-bottom-color: var(--blue);
}

.profile__info-row {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  flex-wrap: wrap;
}
.info-card {
  flex: 1;
  min-width: 200px;
  padding: 12px;
  border-radius: 8px;
  background: #fff;
  border: 1px solid rgba(16, 24, 40, 0.04);
}
.info-card__title {
  font-size: 12px;
  color: var(--muted);
  font-weight: 600;
}
.info-card__value {
  color: var(--blue);
  font-weight: 700;
  margin-top: 6px;
}
.info-card__meta {
  margin-top: 8px;
  color: var(--muted);
  display: flex;
  gap: 8px;
  align-items: center;
}
.pill {
  background: #ecfdf5;
  color: var(--green);
  padding: 4px 8px;
  border-radius: 999px;
  font-weight: 700;
}

.profile__heatmap {
  margin-top: 20px;
}
.profile__heatmap-title {
  font-size: 14px;
  margin: 0 0 6px 0;
}
.profile__heatmap-sub {
  color: var(--muted);
  font-size: 13px;
  margin-bottom: 10px;
}
.profile__heatmap-body {
  margin-top: 12px;
  min-height: 170px;
  border-radius: 12px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  padding: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

.profile__analytics-status {
  margin-top: 20px;
  padding: 12px;
  border-radius: 10px;
  background: #f8fafc;
  border: 1px solid rgba(15, 23, 42, 0.08);
  color: rgba(15, 23, 42, 0.76);
  font-size: 13px;
  text-align: center;
}

.profile__analytics-empty {
  color: rgba(15, 23, 42, 0.6);
  font-size: 13px;
  text-align: center;
}

.chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}
.chip {
  border-radius: 999px;
  border: 1px solid rgba(15, 23, 42, 0.15);
  padding: 4px 10px;
  font-size: 12px;
  color: rgba(15, 23, 42, 0.7);
}

.profile__analytics-row {
  margin-top: 20px;
  display: grid;
  gap: 20px;
}
.profile__analytics-row--triple {
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}
.profile__module {
  background: #fff;
  border-radius: 12px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  padding: 18px;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.08);
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.profile__module h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}

@media (min-width: 880px) {
  .profile__top {
    flex-direction: row;
  }
  .profile__left {
    flex: 0 0 240px;
    flex-direction: column;
    align-items: center;
  }
  .profile__right {
    flex: 1;
  }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
