<script setup>
// Chart placeholder component - no heavy library yet
</script>

<template>
  <section class="behavior-chart">
    <div class="chart-header">
      <h2 class="chart-title">Behavior & Activity Patterns</h2>
      <p class="chart-subtitle">Your trading activity over time</p>
    </div>
    <div class="chart-placeholder">
      <div class="placeholder-bars">
        <div
          v-for="i in 12"
          :key="i"
          class="bar"
          :style="{ height: Math.random() * 80 + 20 + '%' }"
        />
      </div>
      <p class="placeholder-text">Chart visualization placeholder</p>
    </div>
  </section>
</template>

<style scoped>
.behavior-chart {
  background-color: var(--card-bg);
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 1px solid var(--card-border);
  margin-bottom: 2rem;
}

.chart-header {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.chart-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.chart-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.chart-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 12rem;
  background-color: var(--surface-1);
  border-radius: 0.5rem;
  border: 1px dashed var(--surface-border);
}

.placeholder-bars {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  height: 8rem;
  padding: 0 1rem;
}

.bar {
  flex: 1;
  background: linear-gradient(180deg, #3b82f6 0%, #60a5fa 100%);
  border-radius: 0.25rem 0.25rem 0 0;
  min-height: 1rem;
  transition: all 0.2s;
}

.bar:hover {
  opacity: 0.8;
}

.placeholder-text {
  font-size: 0.875rem;
  color: #9ca3af;
  margin: 1rem 0 0 0;
}
</style>
