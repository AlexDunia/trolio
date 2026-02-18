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
    <h3 class="daily-grid__title">Daily activity</h3>
    <div class="daily-grid__row">
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
.daily-grid__title {
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 0.75rem 0;
}
.daily-grid__row {
  display: flex;
  gap: 1rem;
}
@media (max-width: 900px) {
  .daily-grid__row {
    flex-direction: column;
  }
}
</style>
