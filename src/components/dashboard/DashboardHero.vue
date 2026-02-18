<script setup>
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <section class="dashboard-hero" aria-label="Dashboard greeting">
    <div class="dashboard-hero__inner">
      <h1 class="dashboard-hero__title">Hello {{ props.name }} 👋</h1>
      <p class="dashboard-hero__subtitle">
        {{ props.subtitle || "Here's an overview of your account" }}
      </p>
    </div>
  </section>
</template>

<style scoped>
.dashboard-hero {
  --hero-radius: 1rem;
  --hero-shadow: 0 18px 48px rgba(16, 24, 40, 0.16);
  --hero-padding-y: 2.15rem;
  --hero-padding-x: 2.6rem;
  --hero-min-height: 8.25rem;

  background:
    /* soft sparkle highlight */
    radial-gradient(
      600px 200px at 85% 15%,
      rgba(255, 255, 255, 0.35),
      rgba(255, 255, 255, 0.15) 35%,
      transparent 70%
    ),
    /* diagonal glossy sheen */
    linear-gradient(
        115deg,
        rgba(255, 255, 255, 0.18) 0%,
        rgba(255, 255, 255, 0.08) 25%,
        transparent 45%
      ),
    /* base brand gradient */ linear-gradient(135deg, #1f83da 0%, #1a76cc 55%, #1768b8 100%);

  border-radius: var(--hero-radius);
  box-shadow: var(--hero-shadow);
  padding: var(--hero-padding-y) var(--hero-padding-x);
  min-height: var(--hero-min-height);
  display: flex;
  align-items: center;
  color: #ffffff;
  margin-bottom: 2rem;

  position: relative;
  overflow: hidden;
}

.dashboard-hero__inner {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  align-items: center;
  text-align: center;
}

.dashboard-hero__title {
  margin: 0;
  font-family:
    'Poppins',
    system-ui,
    -apple-system,
    Segoe UI,
    Roboto,
    Arial,
    sans-serif;
  font-size: 1.75rem;
  font-weight: 600;
  line-height: 1.18;
  letter-spacing: -0.02em;
}

.dashboard-hero__subtitle {
  margin: 0;
  font-family:
    'Poppins',
    system-ui,
    -apple-system,
    Segoe UI,
    Roboto,
    Arial,
    sans-serif;
  font-size: 0.98rem;
  font-weight: 400;
  line-height: 1.45;
  letter-spacing: -0.01em;
  opacity: 0.95;
}

@media (max-width: 640px) {
  .dashboard-hero {
    --hero-padding-y: 1.5rem;
    --hero-padding-x: 1.5rem;
    --hero-min-height: 7.25rem;
  }

  .dashboard-hero__title {
    font-size: 1.4rem;
  }
}
</style>
