<script setup>
import MetricCard from '@/components/analytics/MetricCard.vue'

defineProps({
  metrics: { type: Array, required: true },
})
</script>

<template>
  <section class="activity-top-metrics">
    <div class="top-grid">
      <MetricCard v-for="(m, i) in metrics" :key="i" v-bind="m" />
    </div>
  </section>
</template>

<style scoped>
.top-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
}
@media (max-width: 900px) {
  .top-grid {
    grid-template-columns: 1fr;
  }
}
</style>
