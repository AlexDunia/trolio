<script setup>
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
</script>

<template>
  <div class="dashboard-layout">
    <AppSidebar />
    <div class="dashboard-main">
      <AppHeader />
      <main class="dashboard-content">
        <div class="app-inner">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.dashboard-layout {
  --sidebar-width: 14rem;
  display: block;
  min-height: 100vh;
  background-color: var(--page-bg);
}

.dashboard-main {
  /* keep the main content visually offset from the fixed sidebar
     but use padding so centered containers compute from the content area */
  padding-left: var(--sidebar-width);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.dashboard-content {
  flex: 1;
  overflow-y: auto;
  /* keep vertical spacing here; horizontal spacing comes from .app-inner */
  padding: 2rem 0;
}
</style>
