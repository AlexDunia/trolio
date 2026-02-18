<script setup>
const title = 'Settings'
</script>

<template>
  <div class="page-card">
    <h1>{{ title }}</h1>
    <p class="muted">Adjust application settings here.</p>
  </div>
</template>

<style scoped>
.page-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  padding: 1.5rem;
  border-radius: 0.5rem;
  color: var(--page-text);
}
.muted {
  color: var(--section-title);
}
</style>
