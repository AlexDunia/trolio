<script setup>
import { computed } from 'vue'

const props = defineProps({
  days: {
    type: Array,
    default: () => [],
  },
})

const maxMinutes = computed(() => {
  const minutes = props.days.map((entry) => entry.minutes || 0)
  return Math.max(1, ...minutes)
})

const gridDays = computed(() =>
  props.days.map((entry) => {
    const value = entry.minutes || 0
    const level = Math.min(4, Math.floor((value / maxMinutes.value) * 4))
    return {
      ...entry,
      level,
      label: new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 3),
    }
  })
)
</script>

<template>
  <div class="heatmap-grid">
    <div
      v-for="day in gridDays"
      :key="day.date"
      class="heatmap-grid__cell"
      :class="`level-${day.level}`"
      :title="`${day.label} ${day.date} • ${day.minutes} mins`"
    >
      {{ day.label }}
    </div>
  </div>
</template>

<style scoped>
.heatmap-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(26px, 1fr));
  gap: 4px;
}
.heatmap-grid__cell {
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
  color: rgba(15, 23, 42, 0.7);
}
.level-0 {
  background: #f4f6f8;
}
.level-1 {
  background: #cce0ff;
}
.level-2 {
  background: #7cb2ff;
}
.level-3 {
  background: #2f7ff6;
  color: #fff;
}
.level-4 {
  background: #1f5cd8;
  color: #fff;
}
</style>
