<script setup>
const props = defineProps({
  pair: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: '',
  },
  isExpanded: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits({
  'row-click': () => true,
})
</script>

<template>
  <article
    class="activity-trade-row"
    :class="{ 'activity-trade-row--expanded': isExpanded }"
    role="button"
    :aria-pressed="isExpanded"
    :aria-expanded="isExpanded"
    tabindex="0"
    @click="emit('row-click')"
    @keydown.enter.prevent="emit('row-click')"
    @keydown.space.prevent="emit('row-click')"
  >
    <span class="activity-trade-row__accent" aria-hidden="true"></span>
    <div class="activity-trade-row__content">
      <p class="activity-trade-row__pair">{{ pair }}</p>
      <p class="activity-trade-row__meta">
        <span>{{ duration }}</span>
        <span v-if="status" class="activity-trade-row__meta-status">– {{ status }}</span>
      </p>
    </div>
    <span class="activity-trade-row__chevron" aria-hidden="true">
      <svg viewBox="0 0 12 8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
        <path d="M1 1l5 5 5-5" />
      </svg>
    </span>
  </article>
</template>

<style scoped>
.activity-trade-row {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 1rem 1.3rem;
  background: var(--trade-card-bg);
  border-radius: var(--trade-card-radius);
  box-shadow: var(--trade-card-shadow);
  gap: 1rem;
  cursor: pointer;
  transition:
    transform 160ms ease,
    box-shadow 160ms ease;
  min-height: 72px;
}
.activity-trade-row:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.1);
}
.activity-trade-row--expanded {
  box-shadow: 0 14px 28px rgba(15, 23, 42, 0.12);
}
.activity-trade-row__accent {
  width: 4px;
  border-top-left-radius: var(--trade-card-radius);
  border-bottom-left-radius: var(--trade-card-radius);
  background: var(--trade-accent);
  align-self: stretch;
  flex-shrink: 0;
}
.activity-trade-row__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}
.activity-trade-row__pair {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--accent-color);
  letter-spacing: 0.03em;
}
.activity-trade-row__meta {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 400;
  color: var(--trade-meta-color);
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  line-height: 1.5;
}
.activity-trade-row__meta-status {
  font-weight: 500;
}
.activity-trade-row__chevron {
  color: var(--trade-chevron-color);
  display: grid;
  place-items: center;
  width: 1.25rem;
  height: 100%;
  flex-shrink: 0;
}
.activity-trade-row__chevron svg {
  width: 0.95rem;
  height: 0.95rem;
}
</style>
