<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="generic-page">
    <h1>Welcome to {{ route.meta.title || route.name }}</h1>
    <p class="muted">
      This is a simple placeholder page for <strong>{{ route.meta.title || route.name }}</strong
      >.
    </p>
  </div>
</template>

<style scoped>
.generic-page {
  background: white;
  border-radius: 0.5rem;
  padding: 2rem;
  border: 1px solid #e5e7eb;
}

.muted {
  color: #6b7280;
}
</style>
