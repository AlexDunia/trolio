<script setup>
import { ref } from 'vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'

// local state to control sidebar open/close on small screens
const isSidebarOpen = ref(false)
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}
</script>

<template>
  <div class="dashboard-layout" :class="{ 'sidebar-open': isSidebarOpen }">
    <AppSidebar :open="isSidebarOpen" @close-sidebar="isSidebarOpen = false" />
    <div class="dashboard-main">
      <AppHeader :onToggleSidebar="toggleSidebar" :isSidebarOpen="isSidebarOpen" />
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
  padding-left: var(--sidebar-width);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.dashboard-content {
  flex: 1;
  overflow-y: auto;
  padding: 2rem 0;
}

/* Responsive: collapse sidebar on small screens */
@media (max-width: 900px) {
  .dashboard-main {
    padding-left: 0;
  }

  /* when sidebar open, prevent body scroll by making layout fixed */
  .dashboard-layout.sidebar-open .dashboard-main {
    position: fixed;
    inset: 0 0 0 0;
    overflow: hidden;
  }
}
</style>
