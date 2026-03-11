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

const WEEK_RANGE_DAYS = 6
const GAUGE_TARGET = 35

const route = useRoute()
const trader = ref(null)
const envelope = ref(null)
const isLoading = ref(false)
const error = ref(null)

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
  }))
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
    console.error('LeaderboardProfile load envelope error', err)
    envelope.value = null
  }
}

async function loadProfile() {
  const id = route.params.id?.toString()
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
      timeframe: route.query.timeframe ?? 'weekly',
    })
    const envelopePromise = loadEnvelopeForUser(id)
    const profileData = await profilePromise
    await envelopePromise
    trader.value = profileData
    if (!profileData) {
      error.value = 'Trader not found'
    }
  } catch (err) {
    console.error(err)
    error.value = 'Unable to load trader details'
  } finally {
    isLoading.value = false
  }
}

watch(
  () => [route.params.id, route.query.timeframe],
  () => {
    void loadProfile()
  },
  { immediate: true }
)
</script>

<template>
  <main class="leaderboard-profile">
    <section v-if="isLoading" class="status">Loading trader analytics...</section>
    <section v-else-if="error" class="status">{{ error }}</section>
    <section v-else-if="!trader" class="status">Trader not found.</section>
    <section v-else class="profile-shell">
      <header class="identity">
        <div class="identity__avatar">
          <span class="flag" aria-hidden>{{ trader.countryFlag }}</span>
        </div>
        <div>
          <h1>{{ trader.name }}</h1>
          <p class="muted">{{ trader.location }}</p>
          <p class="muted">Joined {{ trader.joinedDate }}</p>
        </div>
        <div class="identity__metrics">
          <div>
            <span>Weekly hours</span>
            <strong>{{ trader.chartMetrics.weeklyHours }} hrs</strong>
          </div>
          <div>
            <span>Daily average</span>
            <strong>{{ trader.chartMetrics.dailyAverage }} hrs</strong>
          </div>
          <div>
            <span>Total hours</span>
            <strong>{{ trader.chartMetrics.totalHours }} hrs</strong>
          </div>
        </div>
      </header>

      <div class="badges">
        <span v-for="badge in trader.badges" :key="badge" class="badge">{{ badge }}</span>
      </div>

      <section class="section">
        <h2>Pairs studied</h2>
        <div class="chip-row">
          <span v-for="pair in trader.pairsStudied" :key="pair" class="chip">{{ pair }}</span>
        </div>
        <PairFocusChart :pairs="pairDistribution" />
      </section>

      <section class="section">
        <h2>Recent sessions</h2>
        <RecentSessions :sessions="trader.tradingSessions" />
      </section>

      <section class="section section--grid">
        <div>
          <h3>Activity heatmap</h3>
          <ActivityHeatmap :days="heatmapDays" />
        </div>
        <div>
          <h3>Performance snapshot</h3>
          <PerformanceSnapshot :metrics="performanceMetrics" />
        </div>
      </section>

      <section class="section module-grid module-grid--two">
        <div>
          <h3>Weekly activity trend</h3>
          <WeeklyTrendChart :series="weeklyTrendSeries" />
        </div>
        <div>
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

<style scoped>
.leaderboard-profile {
  padding: 24px;
}
.profile-shell {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.identity {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.identity__avatar {
  font-size: 48px;
}
.identity__metrics {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(3, minmax(90px, 1fr));
  text-align: right;
}
.muted {
  color: rgba(15, 23, 42, 0.56);
  margin: 4px 0 0;
}
.badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.badge {
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(31, 131, 218, 0.12);
  color: #1f83da;
  font-size: 12px;
}
.section {
  border-top: 1px solid rgba(15, 23, 42, 0.08);
  padding-top: 16px;
}
.chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}
.chip {
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid rgba(15, 23, 42, 0.2);
  font-size: 12px;
}
.module-grid {
  display: grid;
  gap: 16px;
}
.module-grid--two {
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}
.session-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.section--grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
}
.status {
  padding: 32px;
  text-align: center;
  color: rgba(15, 23, 42, 0.76);
  font-size: 16px;
}
</style>
