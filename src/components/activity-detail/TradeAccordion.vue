<script setup>
import TradeAccordionItem from './TradeAccordionItem.vue'
import { computed } from 'vue'

defineProps({
  trades: { type: Array, required: true },
  openId: { type: [String, null], default: null },
  getImagesFn: { type: Function, required: true },
  addImagesFn: { type: Function, required: true },
  removeImagesFn: { type: Function, required: true },
})

defineEmits(['toggle'])
</script>

<template>
  <section class="trade-accordion">
    <div class="accordion-list">
      <TradeAccordionItem
        v-for="t in trades"
        :key="t.id"
        :trade="t"
        :isOpen="openId === t.id"
        :getImages="getImagesFn"
        :addImagesFn="addImagesFn"
        :removeImagesFn="removeImagesFn"
        @toggle="$emit('toggle', $event)"
      />
    </div>
  </section>
</template>

<style scoped>
.trade-accordion {
  display: block;
}
.accordion-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
</style>
