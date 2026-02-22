<script setup>
// imports
import { computed } from 'vue'
import { useRoute } from 'vue-router'

// 2 props
const props = defineProps({
  onToggleSidebar: Function,
  isSidebarOpen: { type: Object, required: false },
})

// router
const route = useRoute()

// state
const userName = 'Alex Dunia'

// computed
const pageTitle = computed(() => {
  const t = route.meta && route.meta.title
  if (t) return t
  if (route.name) {
    // fall back to formatted route name
    return String(route.name)
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())
  }
  return ''
})

const pageSubtitle = computed(() => (route.meta && route.meta.subtitle) || '')
</script>
<template>
  <header class="app-header">
    <div class="app-header__inner app-inner">
      <div class="app-header__left">
        <button
          class="hamburger"
          type="button"
          @click="props.onToggleSidebar"
          aria-label="Toggle sidebar"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
        <h2 class="app-header__title">{{ pageTitle }}</h2>
        <p class="app-header__subtitle" v-if="pageSubtitle">{{ pageSubtitle }}</p>
      </div>

      <div class="app-header__right">
        <button type="button" class="user-pill">
          <span class="user-pill__avatar" aria-hidden="true"></span>
          <span class="user-pill__name">{{ userName }}</span>
          <span class="user-pill__chevron" aria-hidden="true">▼</span>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 40; /* header sits above page content but below the sidebar */
  background: #ffffff;
  border-bottom: 1px solid rgba(232, 236, 243, 0.9);
}

/* ✅ This is the “Figma width” fix:
   Constrain header content to the same width as the dashboard content. */
.app-header__inner {
  /* Use global `.app-inner` for sizing; keep layout responsibilities here */
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.1rem 0; /* vertical spacing only; horizontal handled by .app-inner */
}

.app-header__left {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.app-header__title {
  margin: 0;
  font-family:
    'Poppins',
    system-ui,
    -apple-system,
    Segoe UI,
    Roboto,
    Arial,
    sans-serif;
  font-size: 1.35rem;
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: #0f172a;
}

.app-header__subtitle {
  margin: 0;
  font-family:
    'Poppins',
    system-ui,
    -apple-system,
    Segoe UI,
    Roboto,
    Arial,
    sans-serif;
  font-size: 0.9rem;
  font-weight: 400;
  line-height: 1.35;
  color: rgba(15, 23, 42, 0.55);
}

/* Right side user pill */
.user-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;

  padding: 0.55rem 0.85rem;
  border-radius: 0.8rem;

  border: 1px solid rgba(232, 236, 243, 1);
  background: #ffffff;

  font-family:
    'Poppins',
    system-ui,
    -apple-system,
    Segoe UI,
    Roboto,
    Arial,
    sans-serif;
  cursor: pointer;
  transition:
    background 160ms ease,
    transform 140ms ease;
}

.user-pill:hover {
  background: rgba(246, 247, 251, 0.8);
  transform: translateY(-1px);
}

.user-pill__avatar {
  width: 1.65rem;
  height: 1.65rem;
  border-radius: 999px;
  background: rgba(11, 92, 171, 0.12);
}

.user-pill__name {
  font-size: 0.92rem;
  font-weight: 500;
  color: rgba(15, 23, 42, 0.8);
  white-space: nowrap;
}

.user-pill__chevron {
  font-size: 0.75rem;
  color: rgba(15, 23, 42, 0.55);
}

.hamburger {
  display: none;
  margin-right: 0.6rem;
  border: none;
  background: transparent;
  padding: 0.25rem;
}

.hamburger svg {
  stroke: rgba(15, 23, 42, 0.8);
}

/* Responsive */
@media (max-width: 640px) {
  .app-header__inner {
    padding: 0.9rem 1rem;
  }

  .app-header__subtitle {
    display: none;
  }
  .hamburger {
    display: inline-flex;
  }
}
</style>
