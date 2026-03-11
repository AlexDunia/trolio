<script setup>
const props = defineProps({
  sessions: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <div class="recent-sessions">
    <ul>
      <li v-for="session in sessions" :key="session.pair + session.startedAt">
        <div>
          <strong>{{ session.pair }}</strong>
          <p class="muted">
            {{ new Date(session.startedAt).toLocaleString() }} • {{ session.durationLabel }}
          </p>
        </div>
        <span class="duration">{{ session.durationMinutes }} min</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.recent-sessions ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.recent-sessions li {
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 10px;
  padding: 12px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
}
.recent-sessions .muted {
  margin: 4px 0 0;
  color: rgba(15, 23, 42, 0.56);
  font-size: 12px;
}
.duration {
  font-size: 12px;
  color: rgba(31, 131, 218, 0.9);
  font-weight: 600;
}
</style>
