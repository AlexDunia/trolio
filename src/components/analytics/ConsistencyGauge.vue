<script setup>
import { computed } from 'vue'

const props = defineProps({
  weeklyHours: {
    type: Number,
    default: 0,
  },
  dailyAverage: {
    type: Number,
    default: 0,
  },
  totalHours: {
    type: Number,
    default: 0,
  },
  targetHours: {
    type: Number,
    default: 40,
  },
})

const radius = 40
const circumference = 2 * Math.PI * radius

const progress = computed(() => Math.min(100, (props.weeklyHours / Math.max(props.targetHours, 1)) * 100))
const dashOffset = computed(() => circumference * (1 - progress.value / 100))
</script>

<template>
  <div class="consistency-gauge">
    <svg :width="120" :height="120" viewBox="0 0 120 120">
      <circle
        cx="60"
        cy="60"
        :r="radius"
        stroke="rgba(15, 23, 42, 0.1)"
        stroke-width="10"
        fill="none"
      />
      <circle
        cx="60"
        cy="60"
        :r="radius"
        stroke="#1f83da"
        stroke-width="10"
        fill="none"
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
        transform="rotate(-90 60 60)"
      />
      <text x="60" y="60" text-anchor="middle" dy="6" font-size="20" fill="#0f172a">
        {{ Math.round(progress) }}%
      </text>
    </svg>
    <div class="consistency-gauge__legend">
      <div>
        <small>Weekly hours</small>
        <strong>{{ weeklyHours.toFixed(1) }}h</strong>
      </div>
      <div>
        <small>Daily avg</small>
        <strong>{{ dailyAverage.toFixed(1) }}h</strong>
      </div>
      <div>
        <small>Total hours</small>
        <strong>{{ totalHours.toFixed(1) }}h</strong>
      </div>
    </div>
  </div>
</template>

<style scoped>
.consistency-gauge {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 18px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 14px;
  background: #fff;
}
.consistency-gauge__legend {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 12px;
  font-size: 12px;
  color: rgba(15, 23, 42, 0.7);
}
.consistency-gauge__legend strong {
  display: block;
  font-size: 14px;
  color: #0f172a;
}
</style>
