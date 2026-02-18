<script setup>
import { computed } from 'vue'

const props = defineProps({
  tabs: {
    type: Array,
    required: true,
    validator(value) {
      return Array.isArray(value) && value.length > 0
    },
  },
  modelValue: {
    type: String,
    required: true,
  },
})

const emit = defineEmits({
  'update:modelValue': (value) => typeof value === 'string' && value.length > 0,
})

const handleSelect = (id) => {
  if (id === props.modelValue) return
  emit('update:modelValue', id)
}

const getOrdinal = (day) => {
  if (day > 3 && day < 21) return `${day}th`
  switch (day % 10) {
    case 1:
      return `${day}st`
    case 2:
      return `${day}nd`
    case 3:
      return `${day}rd`
    default:
      return `${day}th`
  }
}

const formatReadableDate = (date) => {
  const day = getOrdinal(date.getDate())
  const month = date.toLocaleDateString(undefined, { month: 'short' }) // Jan, Feb, Mar
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}

const addDays = (date, days) => {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

/**
 * Right-side label: "Viewing weekly data · 26th Jan 2025 — 2nd Feb 2025"
 * or "Viewing monthly data · Jan 2025"
 */
const rightLabel = computed(() => {
  const now = new Date()

  if (props.modelValue === 'monthly') {
    const monthYear = now.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
    return `Viewing monthly data · ${monthYear}`
  }

  const start = now
  const end = addDays(now, 7)

  return `Viewing weekly data · ${formatReadableDate(start)} — ${formatReadableDate(end)}`
})
</script>

<template>
  <div class="tabs">
    <div class="tabs-header" role="tablist" aria-label="Tabs">
      <div class="tabs-header__left">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          class="tab-button"
          :class="{ 'tab-button--active': modelValue === tab.id }"
          role="tab"
          :aria-selected="modelValue === tab.id"
          @click="handleSelect(tab.id)"
        >
          <span class="tab-button__icon" aria-hidden="true">
            <!-- weekly icon -->
            <svg
              v-if="tab.id === 'weekly'"
              class="tab-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="3.5" y="5.5" width="17" height="15" rx="2" />
              <path d="M7.5 3.5v4M16.5 3.5v4M3.5 9.5h17" />
            </svg>

            <!-- monthly icon -->
            <svg
              v-else
              class="tab-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="4" y="4" width="7" height="7" rx="1.6" />
              <rect x="13" y="4" width="7" height="7" rx="1.6" />
              <rect x="4" y="13" width="7" height="7" rx="1.6" />
              <rect x="13" y="13" width="7" height="7" rx="1.6" />
            </svg>
          </span>

          <span class="tab-button__label">{{ tab.label }}</span>
        </button>
      </div>

      <!-- ✅ single-line label on the right: viewing + date/month -->
      <div class="tabs-header__right">
        <span class="tabs-date" aria-label="Viewing range">
          {{ rightLabel }}
        </span>
      </div>

      <span class="tabs-header__rule" aria-hidden="true"></span>
    </div>

    <div class="tabs-content">
      <slot :activeTab="modelValue" />
    </div>
  </div>
</template>

<style scoped>
.tabs {
  display: flex;
  flex-direction: column;
}

.tabs-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  padding: 0.85rem 1.1rem 1.25rem;
  border-radius: 0.65rem;
  background: #f3f5f8;
  border: 1px solid rgba(232, 236, 243, 1);
  box-shadow: 0 14px 26px rgba(16, 24, 40, 0.06);

  margin-bottom: 1.6rem;
}

.tabs-header__left {
  display: inline-flex;
  align-items: center;
  gap: 1.5rem;
}

.tabs-header__right {
  display: flex;
  align-items: center;
}

.tabs-date {
  font-family:
    'Poppins',
    system-ui,
    -apple-system,
    Segoe UI,
    Roboto,
    Arial,
    sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  color: rgba(15, 23, 42, 0.45);
  letter-spacing: -0.01em;
  white-space: nowrap;
}

.tabs-header__rule {
  position: absolute;
  left: 1.1rem;
  right: 1.1rem;
  bottom: 0.7rem;
  height: 1px;
  background: rgba(15, 23, 42, 0.08);
  pointer-events: none;
}

.tab-button {
  position: relative;
  border: 0;
  background: transparent;
  cursor: pointer;

  display: inline-flex;
  align-items: center;
  gap: 0.45rem;

  padding: 0.35rem 0.2rem;
  border-radius: 0.4rem;

  font-family:
    'Poppins',
    system-ui,
    -apple-system,
    Segoe UI,
    Roboto,
    Arial,
    sans-serif;
  font-size: 0.92rem;
  font-weight: 500;
  line-height: 1;

  color: rgba(15, 23, 42, 0.42);
  transition: color 160ms ease;
}

.tab-button:hover {
  color: rgba(15, 23, 42, 0.62);
}

.tab-button__icon {
  display: grid;
  place-items: center;
  width: 1rem;
  height: 1rem;
}

.tab-icon {
  width: 1rem;
  height: 1rem;
  color: currentColor;
}

.tab-button__label {
  white-space: nowrap;
}

.tab-button--active {
  color: var(--accent-color, #0b5cab);
  font-weight: 600;
}

.tab-button--active::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -0.9rem;
  height: 3px;
  background: var(--accent-color, #0b5cab);
  border-radius: 2px;
}

.tabs-content {
  display: flex;
  flex-direction: column;
}
</style>
