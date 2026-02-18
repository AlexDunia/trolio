<script setup>
import { ref } from 'vue'
import DashboardHero from '@/components/dashboard/DashboardHero.vue'
import BaseTabs from '@/components/shared/BaseTabs.vue'
import MetricCard from '@/components/analytics/MetricCard.vue'
import BehaviorChart from '@/components/analytics/BehaviorChart.vue'
import InsightCard from '@/components/insights/InsightCard.vue'
import SummaryMetric from '@/components/analytics/SummaryMetric.vue'

const activeTab = ref('weekly')

const tabs = [
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
]

const kpiCards = [
  { title: 'Win Rate', value: '68%', trend: '+5%' },
  { title: 'Total Trades', value: '142', trend: '+12' },
  { title: 'Avg Trade Return', value: '2.3%', trend: '+0.5%' },
]

const insights = [
  {
    title: 'Peak Performance Hour',
    description: 'Your best trades happen between 2-4 PM. Focus your energy there.',
  },
  {
    title: 'Consistency Milestone',
    description: "You've maintained a 14-day trading streak. Great discipline!",
  },
]

const summaryMetrics = [
  { title: 'Gross P&L', value: '$3,240', delta: '+$420' },
  { title: 'Risk/Reward Ratio', value: '1:2.5', delta: '+0.3' },
  { title: 'Drawdown', value: '8.5%', delta: '-1.2%' },
]
</script>

<template>
  <div class="dashboard-page">
    <!-- Hero Banner -->
    <DashboardHero name="Alex" subtitle="Track, analyze, and improve your trading consistency." />

    <!-- Tabs Section -->
    <BaseTabs :tabs="tabs" v-model="activeTab">
      <template #default="{ activeTab: tab }">
        <p class="tab-content-placeholder">Viewing {{ tab }} data</p>
      </template>
    </BaseTabs>

    <!-- KPI Cards Row -->
    <section class="kpi-section">
      <div class="section-header">
        <h2>Key Performance Indicators</h2>
      </div>
      <div class="cards-grid">
        <MetricCard v-for="(card, idx) in kpiCards" :key="idx" v-bind="card" />
      </div>
    </section>

    <!-- Behavior Chart -->
    <BehaviorChart />

    <!-- Insights Row -->
    <section class="insights-section">
      <div class="section-header">
        <h2>Insights & Recommendations</h2>
      </div>
      <div class="insights-grid">
        <InsightCard v-for="(insight, idx) in insights" :key="idx" v-bind="insight" />
      </div>
    </section>

    <!-- Summary Metrics Row -->
    <section class="summary-section">
      <div class="section-header">
        <h2>Summary</h2>
      </div>
      <div class="summary-grid">
        <SummaryMetric v-for="(metric, idx) in summaryMetrics" :key="idx" v-bind="metric" />
      </div>
    </section>
  </div>
</template>

<style scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.tab-content-placeholder {
  font-size: 0.95rem;
  color: #6b7280;
  margin: 0 0 1rem 0;
  padding: 1rem;
  background-color: #f3f4f6;
  border-radius: 0.375rem;
}

.section-header {
  margin-bottom: 1.5rem;
}

.section-header h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.kpi-section,
.insights-section,
.summary-section {
  display: flex;
  flex-direction: column;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
  gap: 1.5rem;
}

.insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
  gap: 1.5rem;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
  gap: 1rem;
}
</style>
