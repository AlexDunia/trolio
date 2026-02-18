<script setup>
defineProps({ bullets: { type: Array, required: true } })
</script>

<template>
  <div class="trade-narrative">
    <h4>Trade Narrative +</h4>
    <ul>
      <li v-for="(b, i) in bullets" :key="i">{{ b }}</li>
    </ul>
  </div>
</template>

<style scoped>
.trade-narrative h4 {
  margin: 0 0 0.5rem 0;
  font-size: 0.95rem;
}
.trade-narrative ul {
  margin: 0;
  padding-left: 1.25rem;
  color: var(--page-text);
}
.trade-narrative li {
  margin-bottom: 0.35rem;
}
</style>
