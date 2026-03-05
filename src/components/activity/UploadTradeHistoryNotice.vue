<script setup>
defineProps({})
</script>

<template>
  <div class="upload-notice">
    <span class="upload-notice__icon" aria-hidden="true">⚠️</span>
    <div class="upload-notice__content">
      <p class="upload-notice__text">
        Activity shows presence. Trade history reveals deeper insights.
      </p>
      <a href="#" class="upload-notice__link">Upload Trade History →</a>
    </div>
  </div>
</template>

<style scoped>
.upload-notice {
  display: flex;
  align-items: flex-start;
  gap: 0.9rem;
  background: #ffffff;
  border: 1px solid var(--callout-border);
  border-radius: 1.1rem;
  box-shadow: var(--callout-shadow);
  padding: 1.25rem 1.5rem;
  margin-top: 1.5rem;
}
.upload-notice__icon {
  font-size: 1.35rem;
  line-height: 1;
}
.upload-notice__text {
  margin: 0;
  color: var(--callout-text);
  font-size: 0.95rem;
  font-weight: 500;
}
.upload-notice__link {
  display: inline-flex;
  margin-top: 0.35rem;
  color: var(--accent-color);
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
}
</style>
