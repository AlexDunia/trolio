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
    <header class="daily-card__head">
      <div class="daily-card__date">
        <span class="daily-card__label">{{ dayLabel }}</span>
        <span class="daily-card__num">{{ dayNumber }}</span>
      </div>
      <div class="daily-card__badge">{{ badge }}</div>
    </header>

    <ul class="daily-card__list">
      <li v-for="(r, i) in rows" :key="i" class="daily-card__row">
        <span class="daily-card__symbol">{{ r.symbol }}</span>
        <span class="daily-card__time">{{ r.time }}</span>
      </li>
    </ul>

    <footer class="daily-card__more">{{ moreText }}</footer>
  </article>
</template>

<style scoped>
.daily-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  padding: 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition:
    transform 120ms ease,
    box-shadow 160ms ease;
}
.daily-card:hover {
  transform: translateY(-4px);
}
.daily-card--active {
  background: var(--active-bg);
  color: var(--active-foreground);
  box-shadow: 0 8px 24px rgba(16, 24, 40, 0.08);
}
.daily-card__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}
.daily-card__label {
  font-size: 0.75rem;
  font-weight: 700;
}
.daily-card__num {
  display: block;
  font-size: 1.25rem;
  font-weight: 700;
}
.daily-card__badge {
  background: var(--surface-1);
  padding: 0.25rem 0.6rem;
  border-radius: 0.5rem;
  font-weight: 700;
}
.daily-card__list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.daily-card__row {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
}
.daily-card__more {
  margin-top: 0.75rem;
  font-size: 0.875rem;
  color: var(--section-title);
}
</style>
