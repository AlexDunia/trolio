<script setup>
import { computed } from 'vue'

const props = defineProps({
  pairs: {
    type: Array,
    default: () => [],
  },
})

const maxHours = computed(() => {
  const values = props.pairs.map((entry) => entry.hours || 0)
  return Math.max(1, ...values)
})
</script>

<template>
  <div class="pair-focus">
    <div v-for="pair in pairs" :key="pair.pair" class="pair-focus__row">
      <div class="pair-focus__label">
        <span>{{ pair.pair }}</span>
        <strong>{{ pair.hours.toFixed(1) }}h</strong>
      </div>
      <div class="pair-focus__bar">
        <span class="pair-focus__fill" :style="{ width: `${(pair.hours / maxHours) * 100}%` }"></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pair-focus {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-top: 12px;
}
.pair-focus__row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.pair-focus__label {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: rgba(15, 23, 42, 0.8);
}
.pair-focus__bar {
  width: 100%;
  height: 8px;
  border-radius: 999px;
  background: rgba(223, 230, 242, 0.6);
  overflow: hidden;
}
.pair-focus__fill {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #1f83da, #2f9b52);
  border-radius: 999px;
}
</style>
