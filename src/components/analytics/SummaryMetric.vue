<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  delta: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="summary-metric">
    <div class="summary-header">
      <h4 class="summary-title">{{ title }}</h4>
      <span v-if="delta" :class="['summary-delta', { negative: delta.includes('-') }]">
        {{ delta }}
      </span>
    </div>
    <div class="summary-value">{{ value }}</div>
  </div>
</template>

<style scoped>
.summary-metric {
  background-color: var(--card-bg);
  border-radius: 0.5rem;
  padding: 1rem;
  border: 1px solid var(--card-border);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.summary-delta {
  font-size: 0.75rem;
  font-weight: 600;
  color: #10b981;
}

.summary-delta.negative {
  color: #ef4444;
}

.summary-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
}
</style>
