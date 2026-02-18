<script setup>
import { computed } from 'vue'
import BaseTabs from '@/components/shared/BaseTabs.vue'
import ActivityMetricsGrid from '@/components/activity/ActivityMetricsGrid.vue'
import ActivityCallout from '@/components/activity/ActivityCallout.vue'
import DailyActivityGrid from '@/components/activity/DailyActivityGrid.vue'
import UploadTradeHistoryNotice from '@/components/activity/UploadTradeHistoryNotice.vue'
import { useActivity } from '@/composables/useActivity'

const {
  tabs,
  selectedRange,
  topMetrics,
  secondaryMetrics,
  dailyActivity,
  callout,
  setRange,
  activeDayKey,
  setActiveDay,
} = useActivity()

const range = computed({
  get: () => selectedRange.value,
  set: (v) => setRange(v),
})
</script>

<template>
  <div class="activity-page">
    <BaseTabs :tabs="tabs" v-model="range" />

    <ActivityMetricsGrid :metrics="topMetrics" />

    <ActivityCallout :text="callout" />

    <ActivityMetricsGrid :metrics="secondaryMetrics" />

    <DailyActivityGrid :daily="dailyActivity" :activeKey="activeDayKey" @select="setActiveDay" />

    <UploadTradeHistoryNotice />
  </div>
</template>

<style scoped>
.activity-page {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.activity-page > * {
  width: 100%;
}

.page-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  padding: 1.25rem;
  border-radius: 0.5rem;
}
</style>
