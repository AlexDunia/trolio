<script setup>
defineProps({
  dayLabel: { type: String, required: true },
  dayNumber: { type: [String, Number], required: true },
  badge: { type: String, required: true },
  rows: { type: Array, required: true },
  moreText: { type: String, default: '' },
  isActive: { type: Boolean, default: false },
})

defineEmits(['select'])
</script>

<template>
  <article :class="['daily-card', { 'daily-card--active': isActive }]" @click="$emit('select')">
    <div class="daily-card__top">
      <div>
        <p class="daily-card__label">{{ dayLabel }}</p>
        <p class="daily-card__num">{{ dayNumber }}</p>
      </div>
      <span class="daily-card__pill">{{ badge }}</span>
    </div>

    <div class="daily-card__divider" aria-hidden="true"></div>

    <ul class="daily-card__list">
      <li v-for="(r, i) in rows" :key="i" class="daily-card__row">
        <span class="daily-card__symbol">{{ r.symbol }}</span>
        <span class="daily-card__time">{{ r.time }}</span>
      </li>
    </ul>

    <p class="daily-card__more">{{ moreText }}</p>
  </article>
</template>

<style scoped>
.daily-card {
  background: var(--card-bg);
  border: 1px solid var(--daily-card-border);
  border-radius: 1.25rem;
  padding: 1.35rem;
  min-height: 260px;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  box-shadow: var(--daily-card-shadow);
  cursor: pointer;
  transition:
    transform 130ms ease,
    box-shadow 130ms ease;
}
.daily-card:hover {
  transform: translateY(-2px);
}
.daily-card--active {
  background: var(--daily-card-active-bg);
  border-color: var(--daily-card-active-bg);
  color: var(--daily-card-active-text);
  box-shadow: var(--daily-card-active-shadow);
}
.daily-card__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}
.daily-card__label {
  margin: 0;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  font-weight: 600;
  color: #4b5563;
  text-transform: uppercase;
}
.daily-card__num {
  margin: 0.05rem 0 0;
  font-size: 1.9rem;
  font-weight: 600;
  color: #111827;
}
.daily-card--active .daily-card__label,
.daily-card--active .daily-card__num {
  color: rgba(255, 255, 255, 0.92);
}
.daily-card__pill {
  align-self: flex-start;
  padding: 0.25rem 0.85rem;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.85rem;
  background: var(--daily-card-pill-bg);
  color: var(--daily-card-pill-text);
}
.daily-card--active .daily-card__pill {
  background: rgba(255, 255, 255, 0.25);
  color: var(--daily-card-pill-text);
}
.daily-card__divider {
  height: 1px;
  background: var(--daily-card-divider);
  margin-top: 0.1rem;
}
.daily-card--active .daily-card__divider {
  background: var(--daily-card-active-divider);
}
.daily-card__list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
}
.daily-card__row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.95rem;
}
.daily-card__symbol {
  color: var(--daily-card-symbol);
}
.daily-card__time {
  color: var(--daily-card-time);
  font-weight: 600;
  letter-spacing: -0.02em;
}
.daily-card--active .daily-card__symbol,
.daily-card--active .daily-card__time {
  color: var(--daily-card-active-text);
}
.daily-card__more {
  margin: 0;
  text-align: center;
  font-size: 0.85rem;
  color: #4b5563;
  font-weight: 600;
  margin-top: auto;
}
.daily-card--active .daily-card__more {
  color: rgba(255, 255, 255, 0.92);
}
</style>
