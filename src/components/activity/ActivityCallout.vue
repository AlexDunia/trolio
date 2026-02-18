<script setup>
defineProps({
  text: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="activity-callout">
    <p>{{ text }}</p>
  </div>
</template>

<style scoped>
.activity-callout {
  background: var(--surface-1);
  padding: 1rem 1.25rem;
  border-radius: 0.5rem;
  color: var(--page-text);
}
</style>
