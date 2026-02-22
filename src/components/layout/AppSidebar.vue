<script setup>
import { ref, onMounted, watch, nextTick, defineProps } from 'vue'
import { useRoute } from 'vue-router'

// 2 props
const props = defineProps({ open: { type: Boolean, default: false } })

const route = useRoute()

const mainNavItems = [
  { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
  { label: 'Activity & Performance', path: '/dashboard/activity', icon: 'activity' },
  { label: 'Trade History', path: '/dashboard/trade-history', icon: 'history' },
  { label: 'Leaderboards', path: '/leaderboards', icon: 'leaderboards' },
  { label: 'Profile', path: '/profile', icon: 'profile' },
  // prefer canonical /profile route so active matching works when user is at /profile
  // (keeps other dashboard links under /dashboard/*)
]

const accountNavItems = [{ label: 'Settings', path: '/dashboard/settings', icon: 'settings' }]

const isActive = (path) => {
  // Ensure /dashboard only matches exact dashboard path; other items match their own path or nested children
  if (path === '/dashboard') {
    return route.path === '/dashboard'
  }
  return route.path === path || route.path.startsWith(`${path}/`)
}

// Indicator refs & logic
const linkEls = ref([])
const navRef = ref(null)
const indicator = ref({ top: '0px', height: '0px', opacity: 0 })

const setLinkEl = (el, idx) => {
  const node = el && (el.$el || el)
  linkEls.value[idx] = node
}

const updateIndicator = async () => {
  await nextTick()
  const index = mainNavItems.findIndex((it) => isActive(it.path))
  if (index === -1) {
    indicator.value.opacity = 0
    return
  }
  const el = linkEls.value[index]
  if (!el || !navRef.value) return
  const navRect = navRef.value.getBoundingClientRect()
  const rect = el.getBoundingClientRect()
  const top = rect.top - navRect.top + navRef.value.scrollTop
  indicator.value = {
    top: `${top}px`,
    height: `${rect.height}px`,
    opacity: 1,
  }
}

onMounted(() => {
  updateIndicator()
})

watch(
  () => route.path,
  () => {
    updateIndicator()
  },
)

const ICONS = {
  dashboard: {
    viewBox: '0 0 24 24',
    path: 'M3 11l9-8 9 8v10a2 2 0 0 1-2 2h-4v-7H9v7H5a2 2 0 0 1-2-2V11z',
  },
  activity: {
    viewBox: '0 0 24 24',
    path: 'M3 12h4l2-6 4 12 2-6h6',
  },
  history: {
    viewBox: '0 0 24 24',
    path: 'M8 7h12M8 12h12M8 17h12M4 7h.01M4 12h.01M4 17h.01',
  },
  performance: {
    viewBox: '0 0 24 24',
    path: 'M4 19V5M4 19h16M8 15l3-3 3 2 4-6',
  },
  leaderboards: {
    viewBox: '0 0 24 24',
    path: 'M7 21V10M12 21V3M17 21v-7',
  },
  profile: {
    viewBox: '0 0 24 24',
    path: 'M20 21a8 8 0 0 0-16 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8',
  },
  settings: {
    viewBox: '0 0 24 24',
    path: 'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zm8.94-2.5a7.8 7.8 0 0 0 0-2l-2.12-.82a6.9 6.9 0 0 0-.72-1.24l.9-2.1a8.5 8.5 0 0 0-1.42-1.42l-2.1.9a6.9 6.9 0 0 0-1.24-.72L13 3.06a7.8 7.8 0 0 0-2 0L10.18 5.18a6.9 6.9 0 0 0-1.24.72l-2.1-.9A8.5 8.5 0 0 0 5.42 6.42l.9 2.1c-.27.39-.52.8-.72 1.24L3.06 11a7.8 7.8 0 0 0 0 2l2.12.82c.2.44.45.85.72 1.24l-.9 2.1c.4.52.9 1.02 1.42 1.42l2.1-.9c.39.27.8.52 1.24.72L11 20.94a7.8 7.8 0 0 0 2 0l.82-2.12c.44-.2.85-.45 1.24-.72l2.1.9c.52-.4 1.02-.9 1.42-1.42l-.9-2.1c.27-.39.52-.8.72-1.24L20.94 13z',
  },
}
</script>

<template>
  <aside class="sidebar" :class="{ 'sidebar--open': props.open }">
    <div
      class="sidebar__overlay"
      v-show="props.open"
      @click="$emit('close-sidebar')"
      aria-hidden="true"
    ></div>
    <div class="sidebar__brand">
      <div class="sidebar__logoMark" aria-hidden="true">t</div>
      <span class="sidebar__brandText">trolio</span>
    </div>

    <nav ref="navRef" class="sidebar__nav" aria-label="Primary navigation">
      <div
        class="sidebar__indicator"
        :style="{ top: indicator.top, height: indicator.height, opacity: indicator.opacity }"
        aria-hidden="true"
      />

      <router-link
        v-for="(item, idx) in mainNavItems"
        :key="item.path"
        :to="item.path"
        class="sidebar__link"
        :class="{ 'sidebar__link--active': isActive(item.path) }"
        :ref="(el) => setLinkEl(el, idx)"
        @click="updateIndicator"
      >
        <span class="sidebar__icon" aria-hidden="true">
          <svg
            :viewBox="ICONS[item.icon].viewBox"
            class="sidebar__svg"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path :d="ICONS[item.icon].path" />
          </svg>
        </span>
        <span class="sidebar__label">{{ item.label }}</span>
      </router-link>

      <div class="sidebar__section">
        <p class="sidebar__sectionTitle">Account Management</p>

        <router-link
          v-for="(item, idx) in accountNavItems"
          :key="item.path"
          :to="item.path"
          class="sidebar__link"
          :class="{ 'sidebar__link--active': isActive(item.path) }"
          :ref="(el) => setLinkEl(el, mainNavItems.length + idx)"
          @click="updateIndicator"
        >
          <span class="sidebar__icon" aria-hidden="true">
            <svg
              :viewBox="ICONS[item.icon].viewBox"
              class="sidebar__svg"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path :d="ICONS[item.icon].path" />
            </svg>
          </span>
          <span class="sidebar__label">{{ item.label }}</span>
        </router-link>
      </div>
    </nav>
  </aside>
</template>

<style scoped>
/* World-class base: calm, light, high clarity */
.sidebar {
  width: var(--sidebar-width, 15rem);
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.32); /* 32% white */
  border-right: 1px solid rgba(232, 236, 243, 0.45);

  /* Figma-like soft elevation */
  box-shadow: 0 16px 40px rgba(16, 24, 40, 0.08);

  /* glassy feel (optional but matches 32% opacity intent) */
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);

  padding: 1.25rem 1rem;
  display: flex;
  flex-direction: column;
  z-index: 50; /* sidebar overlays header */
}

/* Overlay shown on small screens when sidebar is open */
.sidebar__overlay {
  display: none;
}

/* Brand */
.sidebar__brand {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.35rem 0.5rem 1.25rem;
}

.sidebar__logoMark {
  width: 1.55rem;
  height: 1.55rem;
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--accent-color, #0b5cab);
  background: var(--logo-bg, #e9f2ff);
}

.sidebar__brandText {
  font-size: 1.05rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--brand-text, #5b677a);
}

/* Nav */
.sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding-top: 0.25rem;
  position: relative;
}

.sidebar__link {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.6rem 0.65rem;

  text-decoration: none;
  color: var(--link-color, #6f7d91);
  transition:
    background 160ms ease,
    color 160ms ease,
    transform 140ms ease;
  position: relative;
  z-index: 1;
}

.sidebar__link:hover {
  background: var(--link-hover-bg, #eef2f8);
  color: var(--link-hover-color, #415066);
  transform: translateY(-1px);
}

.sidebar__link--active:hover {
  background: var(--active-bg, #0b5cab);
  color: var(--active-foreground, #ffffff);
  transform: none;
}

.sidebar__link--active {
  background: var(--active-bg, #0b5cab);
  color: var(--active-foreground, #ffffff);

  /* IMPORTANT: remove borders/frames and any “card” feel */
  box-shadow: none;
  outline: none;
  border: none;
}

.sidebar__icon {
  width: 1.1rem;
  height: 1.1rem;
  display: grid;
  place-items: center;
  color: currentColor;
}

.sidebar__svg {
  width: 1rem;
  height: 1rem;
}

.sidebar__label {
  font-size: 0.86rem;
  font-weight: 500;
  letter-spacing: -0.01em;
  white-space: nowrap;
}

.sidebar__indicator {
  position: absolute;
  left: 0.3rem;
  right: 0.3rem;
  background: rgba(11, 92, 171, 0.06);
  /* border-radius: 0.6rem; */
  transition:
    top 180ms cubic-bezier(0.2, 0.9, 0.2, 1),
    height 180ms cubic-bezier(0.2, 0.9, 0.2, 1),
    opacity 160ms ease;
  pointer-events: none;
  z-index: 0;
}

/* Section */
.sidebar__section {
  margin-top: 1.25rem;
  padding-top: 1.1rem;
  border-top: 1px solid #e8ecf3;
}

.sidebar__sectionTitle {
  margin: 0 0 0.65rem;
  padding: 0 0.75rem;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--section-title, #7f8da3);
  letter-spacing: -0.01em;
}

.sidebar__indicator {
  position: absolute;
  left: 0.3rem;
  right: 0.3rem;
  background: var(--indicator-bg, rgba(11, 92, 171, 0.08));
  transition:
    top 180ms cubic-bezier(0.2, 0.9, 0.2, 1),
    height 180ms cubic-bezier(0.2, 0.9, 0.2, 1),
    opacity 160ms ease;
  pointer-events: none;
  z-index: 0;
}

/* Responsive behaviour: hide sidebar by default on small screens and slide in when open */
@media (max-width: 900px) {
  .sidebar {
    transform: translateX(-110%);
    transition: transform 220ms cubic-bezier(0.2, 0.9, 0.2, 1);
  }

  .sidebar.sidebar--open {
    transform: translateX(0);
    box-shadow: 0 24px 60px rgba(16, 24, 40, 0.24);
  }

  .sidebar__overlay {
    display: block;
    position: fixed;
    inset: 0 0 0 0;
    background: rgba(11, 16, 26, 0.35);
    z-index: 45;
  }
}
</style>
