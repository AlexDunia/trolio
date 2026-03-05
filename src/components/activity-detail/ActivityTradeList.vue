<script setup>
import ActivityTradeRow from './ActivityTradeRow.vue'

const props = defineProps({
  trades: {
    type: Array,
    required: true,
  },
  expandedId: {
    type: [String, Number],
    default: null,
  },
})

const emit = defineEmits(['rowClick'])
</script>

<template>
  <section class="activity-trade-list" aria-label="Trade rows">
    <ActivityTradeRow
      v-for="trade in trades"
      :key="trade.id"
      :pair="trade.symbol"
      :duration="trade.duration"
      :status="trade.status"
      :is-expanded="trade.id === expandedId"
      @row-click="emit('rowClick', trade.id)"
    />
  </section>
</template>

<style scoped>
.activity-trade-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.4rem;
}
</style>
