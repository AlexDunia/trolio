<script setup>
import { computed } from 'vue'

const props = defineProps({
  metrics: {
    type: Object,
    default: () => ({}),
  },
})

const cards = computed(() => [
  {
    label: 'Weekly hours',
    value: props.metrics.weeklyHours?.toFixed(1) ?? '0.0',
  },
  {
    label: 'Daily average',
    value: props.metrics.dailyAverage?.toFixed(1) ?? '0.0',
  },
  {
    label: 'Total hours',
    value: props.metrics.totalHours?.toFixed(1) ?? '0.0',
  },
  {
    label: 'Sessions this week',
    value: props.metrics.sessionsThisWeek ?? 0,
  },
])
</script>

<template>
  <div class="performance-snapshot">
    <div v-for="card in cards" :key="card.label" class="performance-snapshot__card">
      <span>{{ card.label }}</span>
      <strong>{{ card.value }}</strong>
    </div>
  </div>
</template>

<style scoped>
.performance-snapshot {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  margin-top: 12px;
}
.performance-snapshot__card {
  border: 1px solid rgba(15, 23, 42, 0.08);
  padding: 12px;
  border-radius: 10px;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 12px;
  color: rgba(15, 23, 42, 0.7);
}
.performance-snapshot__card strong {
  font-size: 16px;
  color: #0f172a;
}
</style>
