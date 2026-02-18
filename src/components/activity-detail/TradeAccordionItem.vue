<script setup>
import TradeTags from './TradeTags.vue'
import TradeNarrative from './TradeNarrative.vue'
import TradeGallery from './TradeGallery.vue'

defineProps({
  trade: { type: Object, required: true },
  isOpen: { type: Boolean, default: false },
  getImages: { type: Function, required: true },
  addImagesFn: { type: Function, required: true },
  removeImagesFn: { type: Function, required: true },
})

defineEmits(['toggle'])
</script>

<template>
  <div class="accordion-item" :class="{ 'accordion-item--open': isOpen }">
    <header class="accordion-header" @click="$emit('toggle', trade.id)">
      <div class="accordion-left">
        <a class="symbol">{{ trade.symbol }}</a>
        <div class="time">{{ trade.timeLabel }}</div>
      </div>
      <div class="accordion-right">▾</div>
    </header>

    <div class="accordion-body" v-show="isOpen">
      <div class="left-col">
        <TradeTags :tags="trade.tags" />
        <TradeNarrative :bullets="trade.narrativeBullets" />
      </div>
      <div class="right-col">
        <TradeGallery
          :tradeId="trade.id"
          :getImages="getImages"
          :addImagesFn="addImagesFn"
          :removeImagesFn="removeImagesFn"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.accordion-item {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-left: 4px solid transparent;
  border-radius: 0.5rem;
  overflow: hidden;
}
.accordion-item--open {
  border-left-color: #10b981;
}
.accordion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.85rem 1rem;
  cursor: pointer;
}
.accordion-left {
  display: flex;
  flex-direction: column;
}
.symbol {
  color: var(--accent-color);
  font-weight: 700;
}
.time {
  color: var(--section-title);
  font-size: 0.9rem;
}
.accordion-body {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-top: 1px solid var(--surface-border);
}
.left-col {
  flex: 1;
}
.right-col {
  flex: 1;
}
@media (max-width: 900px) {
  .accordion-body {
    flex-direction: column;
  }
}
</style>
