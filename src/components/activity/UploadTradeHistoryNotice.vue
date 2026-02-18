<script setup>
defineProps({})
</script>

<template>
  <div class="upload-notice">
    <span class="upload-notice__icon">⚠️</span>
    <div class="upload-notice__content">
      <p>Activity shows presence. Trade history reveals deeper insights.</p>
      <a href="#" class="upload-notice__link">Upload Trade History →</a>
    </div>
  </div>
</template>

<style scoped>
.upload-notice {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  background: var(--surface-1);
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--surface-border);
}
.upload-notice__icon {
  font-size: 1.25rem;
}
.upload-notice__link {
  color: var(--accent-color);
  font-weight: 600;
}
</style>
