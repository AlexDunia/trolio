<script setup>
defineProps({ tags: { type: Array, required: true } })
</script>

<template>
  <div class="trade-tags">
    <span v-for="(t, i) in tags" :key="i" class="trade-tag">{{ t }}</span>
    <button class="trade-tag trade-tag--add">+ Add Tags</button>
  </div>
</template>

<style scoped>
.trade-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.trade-tag {
  background: #ecfdf5;
  color: #065f46;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.85rem;
}
.trade-tag--add {
  background: #f3f4f6;
  color: #374151;
  border: none;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  cursor: pointer;
}
</style>
