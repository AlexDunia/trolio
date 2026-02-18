<script setup>
import { useRouter } from 'vue-router'
import { useActivityDetail } from '@/composables/useActivityDetail'
import ActivityTopMetrics from '@/components/activity-detail/ActivityTopMetrics.vue'
import TradeAccordion from '@/components/activity-detail/TradeAccordion.vue'

const router = useRouter()

const {
  dayKey,
  topMetrics,
  trades,
  openTradeId,
  toggleTrade,
  addImages,
  removeImages,
  getGalleryImages,
} = useActivityDetail()

// optional: navigate back to /dashboard/activity
const backToActivity = () => router.push('/dashboard/activity')
</script>

<template>
  <div class="activity-detail-page">
    <button class="btn-back" @click="backToActivity">← Back</button>
    <h1>Activity — {{ dayKey }}</h1>

    <ActivityTopMetrics :metrics="topMetrics" />

    <TradeAccordion
      :trades="trades"
      :openId="openTradeId"
      :getImagesFn="getGalleryImages"
      :addImagesFn="addImages"
      :removeImagesFn="removeImages"
      @toggle="toggleTrade"
    />
  </div>
</template>

<style scoped>
.activity-detail-page {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.btn-back {
  background: none;
  border: none;
  color: var(--accent-color);
  cursor: pointer;
  font-weight: 600;
}
h1 {
  margin: 0 0 0.5rem 0;
}
</style>
