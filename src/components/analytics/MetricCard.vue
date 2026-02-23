<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  // allow number or string values from normalized data
  value: {
    type: [String, Number],
    required: true,
  },
  trend: {
    type: String,
    default: '',
  },
  /**
   * Optional icon control
   * Possible values: 'clock' | 'default' | 'trades' | 'pnl' | 'winrate' | 'star'
   */
  icon: {
    type: String,
    default: 'clock',
  },
})
</script>

<template>
  <div class="metric-card">
    <div class="metric-header">
      <span class="metric-icon" aria-hidden="true">
        <svg
          v-if="props.icon === 'clock'"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="metric-icon__svg"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
        <svg
          v-else-if="props.icon === 'trades'"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="metric-icon__svg"
        >
          <path d="M3 7h18" />
          <path d="M3 12h18" />
          <path d="M3 17h18" />
        </svg>
        <svg
          v-else-if="props.icon === 'pnl'"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="metric-icon__svg"
        >
          <path d="M12 1v22" />
          <path d="M17 5a5 5 0 0 0-10 0" />
        </svg>
        <svg
          v-else-if="props.icon === 'winrate'"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="metric-icon__svg"
        >
          <path d="M12 2l3 6 6 .5-4.5 3.9L18 20l-6-3.5L6 20l1.5-7.6L3 8.5 9 8z" />
        </svg>
        <svg
          v-else-if="props.icon === 'star'"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="metric-icon__svg"
        >
          <path
            d="M12 .587l3.668 7.431L24 9.75l-6 5.847 1.417 8.323L12 19.771 4.583 23.92 6 15.597 0 9.75l8.332-1.732z"
          />
        </svg>
        <span v-else class="metric-icon__dot"></span>
      </span>
      <h3 class="metric-title">{{ props.title }}</h3>
    </div>

    <div class="metric-main">
      <div class="metric-value">{{ props.value }}</div>
    </div>

    <div
      v-if="props.trend"
      class="metric-trend"
      :class="{ 'metric-trend--negative': props.trend.includes('-') }"
    >
      <span class="metric-trend__arrow" aria-hidden="true">{{
        props.trend.includes('-') ? '↓' : '↑'
      }}</span>
      <span class="metric-trend__text">{{ props.trend }}</span>
    </div>
  </div>
</template>

<style scoped>
.metric-card {
  /* Figma-like card */
  background: #ffffff;
  border: 1px solid rgba(232, 236, 243, 1);
  border-radius: 0.9rem;
  padding: 1.25rem 1.35rem;

  /* left accent line */
  box-shadow: 0 14px 28px rgba(16, 24, 40, 0.06);
  position: relative;
  overflow: hidden;
}

.metric-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: rgba(31, 131, 218, 0.25); /* light blue accent */
}

.metric-header {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  margin-bottom: 0.9rem;
}

.metric-title {
  margin: 0;
  font-family:
    'Poppins',
    system-ui,
    -apple-system,
    Segoe UI,
    Roboto,
    Arial,
    sans-serif;
  font-size: 0.82rem;
  font-weight: 500;
  line-height: 1.2;
  color: rgba(15, 23, 42, 0.72);
  letter-spacing: -0.01em;
}

.metric-main {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  justify-content: flex-start;
}

.metric-icon {
  width: 1.15rem;
  height: 1.15rem;
  display: grid;
  place-items: center;
  color: #1f83da; /* icon blue */
  flex: 0 0 auto;
}

.metric-icon__svg {
  width: 1.15rem;
  height: 1.15rem;
}

.metric-icon__dot {
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 999px;
  background: rgba(31, 131, 218, 0.28);
}

.metric-value {
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
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: rgba(15, 23, 42, 0.82);
}

.metric-trend {
  margin-top: 0.75rem;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;

  font-family:
    'Poppins',
    system-ui,
    -apple-system,
    Segoe UI,
    Roboto,
    Arial,
    sans-serif;
  font-size: 0.82rem;
  font-weight: 500;
  color: #16a34a; /* green like figma */
}

.metric-trend--negative {
  color: #dc2626;
}

.metric-trend__arrow {
  font-size: 0.85rem;
  line-height: 1;
}

.metric-trend__text {
  line-height: 1.2;
}
</style>
