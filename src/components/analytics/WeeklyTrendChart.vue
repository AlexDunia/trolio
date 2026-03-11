<script setup>
import { computed } from 'vue'

const props = defineProps({
  series: {
    type: Array,
    default: () => [],
  },
})

const WIDTH = 320
const HEIGHT = 150
const PADDING = 20

const maxValue = computed(() => {
  const values = props.series.map((entry) => entry.hours || 0)
  return Math.max(1, ...values)
})

const points = computed(() => {
  if (!props.series.length) return []
  const step = (WIDTH - PADDING * 2) / Math.max(1, props.series.length - 1)
  return props.series.map((entry, index) => {
    const value = entry.hours || 0
    const x = PADDING + step * index
    const y = HEIGHT - PADDING - (value / maxValue.value) * (HEIGHT - PADDING * 2)
    return { x, y, day: entry.day, value }
  })
})

const pointsAttr = computed(() => points.value.map((point) => `${point.x},${point.y}`).join(' '))
</script>

<template>
  <div class="weekly-trend">
    <svg :width="WIDTH" :height="HEIGHT" role="img" aria-label="Weekly activity trend">
      <polyline
        v-if="points.length"
        :points="pointsAttr"
        fill="none"
        stroke="#1f83da"
        stroke-width="3"
        stroke-linejoin="round"
        stroke-linecap="round"
      />
      <circle
        v-for="point in points"
        :key="point.day"
        :cx="point.x"
        :cy="point.y"
        r="4"
        fill="#fff"
        stroke="#1f83da"
        stroke-width="2"
      >
        <title>{{ point.day }} — {{ point.value }} hrs</title>
      </circle>
    </svg>
    <div class="weekly-trend__labels">
      <span v-for="point in points" :key="point.day">{{ point.day }}</span>
    </div>
  </div>
</template>

<style scoped>
.weekly-trend {
  background: #fff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 12px;
  padding: 12px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
}
.weekly-trend__labels {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  margin-top: 8px;
  color: rgba(15, 23, 42, 0.62);
}
</style>
