<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="insight-card">
    <div class="insight-icon">💡</div>
    <div class="insight-content">
      <h3 class="insight-title">{{ title }}</h3>
      <p class="insight-description">{{ description }}</p>
    </div>
  </div>
</template>

<style scoped>
.insight-card {
  background-color: var(--card-bg);
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 1px solid var(--card-border);
  display: flex;
  gap: 1rem;
  transition: all 0.2s;
}

.insight-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-color: #d1d5db;
}

.insight-icon {
  font-size: 1.75rem;
  flex-shrink: 0;
}

.insight-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.insight-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.insight-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
}
</style>
