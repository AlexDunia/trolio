<script setup>
import DailyActivityCard from './DailyActivityCard.vue'

defineProps({
  daily: { type: Array, required: true },
  activeKey: { type: String, required: true },
})

import { useRouter } from 'vue-router'

const router = useRouter()

defineEmits(['select'])
</script>

<template>
  <section class="daily-grid">
    <div class="daily-grid__header">
      <h3 class="daily-grid__title">Daily activity</h3>
    </div>
    <div class="daily-grid__cards">
      <DailyActivityCard
        v-for="item in daily"
        :key="item.key"
        v-bind="{ ...item, isActive: item.key === activeKey }"
        @select="
          () => {
            $emit('select', item.key)
            router.push(`/dashboard/activity/${item.key}`)
          }
        "
      />
    </div>
  </section>
</template>

<style scoped>
.daily-grid {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.daily-grid__header {
  width: 100%;
}
.daily-grid__title {
  font-size: 1.125rem;
  color: #4b5563;
  font-weight: 600;
  margin: 0;
}
.daily-grid__cards {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
}

@media (max-width: 1100px) {
  .daily-grid__cards {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }
}
</style>
