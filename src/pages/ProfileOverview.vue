<template>
  <main class="profile">
    <section class="profile__card">
      <div class="profile__top">
        <aside class="profile__left">
          <div class="profile__avatar-wrap">
            <div class="profile__avatar" aria-hidden="true"></div>
          </div>
          <div class="profile__followers">
            <div class="profile__followers-count">5000</div>
            <div class="profile__followers-meta">
              <span class="profile__followers-label">Followers</span>
              <span class="profile__followers-badge">+1 Follower</span>
            </div>
          </div>
        </aside>

        <div class="profile__right">
          <h1 class="profile__name">Merlin Trader</h1>
          <p class="profile__bio">
            Six-figure trader and FundedNext Ambassador with a strong focus on precision,
            discipline, and consistent performance across the financial markets.
          </p>

          <div class="profile__controls">
            <label class="sr-only" for="period">Period</label>
            <select id="period" class="profile__select">
              <option>This month</option>
            </select>
          </div>

          <div class="profile__stats">
            <div class="stat-card stat-card--performance">
              <div class="stat-card__title">PERFORMANCE</div>
              <div class="stat-card__row stat-card__row--good">
                80% <span class="stat-card__label">Win Rate</span>
              </div>
              <div class="stat-card__row stat-card__row--bad">
                40% <span class="stat-card__label">Win Rate</span>
              </div>
            </div>

            <div class="stat-card stat-card--net">
              <div class="stat-card__title">NET RESULTS</div>
              <div class="stat-card__row">
                <span class="stat-card__value">$4,720</span>
                <span class="stat-card__label">Net Profit</span>
              </div>
              <div class="stat-card__row">
                <span class="stat-card__value">$4,720</span>
                <span class="stat-card__label">Net Loss</span>
              </div>
            </div>

            <div class="stat-card stat-card--assets">
              <div class="stat-card__title">MOST TRADED ASSETS</div>
              <ul class="stat-card__list">
                <li>EUR / USD</li>
                <li>XAU / USD</li>
                <li>NAS100</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="profile__tabs">
        <nav class="tabs">
          <button class="tabs__item tabs__item--active">Overview</button>
          <button class="tabs__item">Trade History</button>
        </nav>
      </div>

      <div class="profile__info-row">
        <div class="info-card">
          <div class="info-card__title">Most Traded Pair</div>
          <div class="info-card__value">EUR/NZD</div>
          <div class="info-card__meta"><span class="pill">+10%</span> Avg 40 mins / day</div>
        </div>

        <div class="info-card">
          <div class="info-card__title">Most Used Bias</div>
          <div class="info-card__value">Mitigation Blocks</div>
          <div class="info-card__meta"><span class="pill">+10%</span> Avg 40 mins / day</div>
        </div>
      </div>

      <div class="profile__heatmap">
        <h2 class="profile__heatmap-title">Activity Heatmap (Last 12 Weeks)</h2>
        <div class="profile__heatmap-sub">3,936 Hours, 164 days</div>

        <div class="heatmap">
          <div class="heatmap__months">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span
            ><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span
            ><span>Nov</span><span>Dec</span>
          </div>

          <div class="heatmap__grid">
            <template v-for="(cell, idx) in heatmapCells" :key="idx">
              <div class="heatmap__cell" :class="`heatmap__cell--lvl-${cell}`"></div>
            </template>
          </div>

          <div class="heatmap__legend">
            <div class="legend__label">Less</div>
            <div class="legend__swatches">
              <span class="swatch swatch--lvl-0"></span>
              <span class="swatch swatch--lvl-1"></span>
              <span class="swatch swatch--lvl-2"></span>
              <span class="swatch swatch--lvl-3"></span>
              <span class="swatch swatch--lvl-4"></span>
            </div>
            <div class="legend__label">More</div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
// imports
import { ref, computed } from 'vue'

// router / stores (none needed right now)

// state
const profile = ref({
  name: 'Merlin Trader',
  bio: 'Six-figure trader and FundedNext Ambassador with a strong focus on precision, discipline, and consistent performance across the financial markets.',
  followers: 5000,
})

// heatmap sample data (static for now)
const heatmapCells = ref(
  // small static sample, levels 0..4
  Array.from({ length: 12 * 7 }, (_, i) => i % 5),
)

// computed fields
const displayName = computed(() => profile.value.name)
</script>

<style scoped>
:root {
  --card-bg: #ffffff;
  --muted: #9aa4ae;
  --blue: #2563eb;
  --teal-50: #eef9fb;
  --green: #16a34a;
  --red: #ef4444;
  --radius: 10px;
  --gap: 16px;
  --shadow: 0 1px 2px rgba(16, 24, 40, 0.04), 0 4px 12px rgba(16, 24, 40, 0.06);
}

.profile {
  padding: 16px;
}

.profile__card {
  background: var(--card-bg);
  border-radius: var(--radius);
  padding: 20px;
  box-shadow: var(--shadow);
  border: 1px solid rgba(16, 24, 40, 0.04);
}

.profile__top {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.profile__left {
  background: linear-gradient(180deg, var(--teal-50), #f7feff);
  padding: 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.profile__avatar-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}
.profile__avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f3a4ff, #7dd3fc);
  box-shadow: 0 6px 18px rgba(16, 24, 40, 0.08);
}

.profile__followers {
  text-align: center;
}
.profile__followers-count {
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
}
.profile__followers-meta {
  color: var(--muted);
  font-size: 13px;
  display: flex;
  gap: 8px;
  justify-content: center;
}
.profile__followers-badge {
  color: var(--green);
  font-weight: 600;
}

.profile__right {
  padding: 6px 4px;
}
.profile__name {
  margin: 0;
  font-size: 22px;
  color: #0f172a;
}
.profile__bio {
  color: var(--muted);
  margin-top: 8px;
  line-height: 1.5;
}

.profile__controls {
  margin-top: 12px;
}
.profile__select {
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid rgba(16, 24, 40, 0.06);
  background: #fbfdff;
}

.profile__stats {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  flex-wrap: wrap;
}
.stat-card {
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  border: 1px solid rgba(16, 24, 40, 0.04);
  flex: 1;
  min-width: 160px;
}
.stat-card__title {
  font-size: 12px;
  color: var(--muted);
  font-weight: 600;
}
.stat-card__Row {
  margin-top: 8px;
  font-weight: 700;
}
.stat-card__row {
  margin-top: 8px;
  font-weight: 700;
}
.stat-card__row--good {
  color: var(--green);
}
.stat-card__row--bad {
  color: var(--red);
}
.stat-card__value {
  color: var(--blue);
  font-weight: 800;
}
.stat-card__list {
  margin: 8px 0 0 0;
  padding: 0;
  list-style: none;
  color: #0f172a;
}

.profile__tabs {
  margin-top: 18px;
  border-top: 1px solid rgba(16, 24, 40, 0.03);
  padding-top: 12px;
}
.tabs {
  display: flex;
  gap: 12px;
}
.tabs__item {
  background: none;
  border: none;
  padding: 8px 0;
  color: var(--muted);
  font-weight: 600;
  border-bottom: 3px solid transparent;
}
.tabs__item--active {
  color: var(--blue);
  border-bottom-color: var(--blue);
}

.profile__info-row {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  flex-wrap: wrap;
}
.info-card {
  flex: 1;
  min-width: 200px;
  padding: 12px;
  border-radius: 8px;
  background: #fff;
  border: 1px solid rgba(16, 24, 40, 0.04);
}
.info-card__title {
  font-size: 12px;
  color: var(--muted);
  font-weight: 600;
}
.info-card__value {
  color: var(--blue);
  font-weight: 700;
  margin-top: 6px;
}
.info-card__meta {
  margin-top: 8px;
  color: var(--muted);
  display: flex;
  gap: 8px;
  align-items: center;
}
.pill {
  background: #ecfdf5;
  color: var(--green);
  padding: 4px 8px;
  border-radius: 999px;
  font-weight: 700;
}

.profile__heatmap {
  margin-top: 20px;
}
.profile__heatmap-title {
  font-size: 14px;
  margin: 0 0 6px 0;
}
.profile__heatmap-sub {
  color: var(--muted);
  font-size: 13px;
  margin-bottom: 10px;
}
.heatmap {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}
.heatmap__months {
  display: flex;
  gap: 8px;
  color: var(--muted);
  font-size: 12px;
  flex-wrap: wrap;
}
.heatmap__grid {
  display: grid;
  grid-template-columns: repeat(84, 12px);
  grid-auto-rows: 12px;
  gap: 4px;
}
.heatmap__cell {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background: #f3f4f6;
}
.heatmap__cell--lvl-1 {
  background: #dbeafe;
}
.heatmap__cell--lvl-2 {
  background: #93c5fd;
}
.heatmap__cell--lvl-3 {
  background: #3b82f6;
}
.heatmap__cell--lvl-4 {
  background: #1e40af;
}

.heatmap__legend {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--muted);
  font-size: 12px;
}
.legend__swatches {
  display: flex;
  gap: 6px;
  align-items: center;
}
.swatch {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background: #f3f4f6;
}
.swatch--lvl-1 {
  background: #dbeafe;
}
.swatch--lvl-2 {
  background: #93c5fd;
}
.swatch--lvl-3 {
  background: #3b82f6;
}
.swatch--lvl-4 {
  background: #1e40af;
}

/* Responsive layout */
@media (min-width: 880px) {
  .profile__top {
    flex-direction: row;
  }
  .profile__left {
    flex: 0 0 240px;
    flex-direction: column;
    align-items: center;
  }
  .profile__right {
    flex: 1;
  }
  .heatmap__grid {
    grid-template-columns: repeat(84, 12px);
  }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
