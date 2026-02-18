<script setup>
import MetricCard from '@/components/analytics/MetricCard.vue'

defineProps({
  metrics: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <section class="activity-metrics">
    <div class="metrics-grid">
      <MetricCard v-for="(m, idx) in metrics" :key="idx" v-bind="m" />
    </div>
  </section>
</template>

<style scoped>
.activity-metrics {
  display: block;
}
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

/* make the 4th card span full width on its row (3 + 1 layout) */
.metrics-grid > *:nth-child(4) {
  grid-column: 1 / span 1;
}

@media (max-width: 900px) {
  .metrics-grid {
    grid-template-columns: 1fr;
  }
}
</style>
