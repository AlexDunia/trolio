<script setup>
import { reactive, computed, onMounted } from 'vue'
import LeaderboardService from '@/services/LeaderboardService'

const state = reactive({
  filters: {
    sort: 'most_active',
    timeframe: 'weekly',
    search: '',
  },
  pagination: {
    page: 1,
    perPage: 5,
    total: 0,
    lastPage: 1,
  },
  rows: [],
  isLoading: false,
  error: null,
})

const isEmpty = computed(() => !state.rows || state.rows.length === 0)

async function load() {
  state.isLoading = true
  state.error = null
  try {
    const res = await LeaderboardService.getLeaderboard({
      sort: state.filters.sort,
      timeframe: state.filters.timeframe,
      search: state.filters.search,
      page: state.pagination.page,
      perPage: state.pagination.perPage,
    })

    state.rows = res.data
    state.pagination.total = res.meta.total
    state.pagination.lastPage = res.meta.lastPage
  } catch (err) {
    state.error = err
  } finally {
    state.isLoading = false
  }
}

function applySearch(term) {
  state.filters.search = term
  state.pagination.page = 1
  void load()
}

function goToPage(p) {
  if (p < 1 || p > state.pagination.lastPage) return
  state.pagination.page = p
  void load()
}

function goToLast() {
  if (state.pagination.page === state.pagination.lastPage) return
  state.pagination.page = state.pagination.lastPage
  void load()
}

async function onShare() {
  try {
    const payload = await LeaderboardService.getSharePayload({ filters: state.filters })
    window.open(payload.url, '_blank')
  } catch (err) {
    console.error(err)
  }
}

function pairsLine(pairsVisited) {
  const list = Array.isArray(pairsVisited) ? pairsVisited.filter(Boolean) : []
  return list.join(' ')
}

onMounted(() => {
  void load()
})
</script>

<template>
  <main class="lb">
    <section class="lb__wrap">
      <div class="lbCard">
        <div class="lbCard__top">
          <h2 class="lbCard__title">
            Global Ranking <span class="lbCard__globe" aria-hidden>🌍</span>
          </h2>
        </div>

        <div class="lbControls">
          <div class="lbControls__left">
            <button class="lbSelect" type="button">
              <svg class="lbSelect__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M8 7V5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" stroke-width="2" />
                <path
                  d="M6 7h12v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7z"
                  stroke-width="2"
                  stroke-linejoin="round"
                />
              </svg>
              <span class="lbSelect__text">Most active</span>
              <svg class="lbSelect__chev" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M6 9l6 6 6-6" stroke-width="2" stroke-linecap="round" />
              </svg>
            </button>

            <button class="lbSelect" type="button">
              <svg class="lbSelect__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M7 3v3M17 3v3" stroke-width="2" stroke-linecap="round" />
                <path d="M4 8h16" stroke-width="2" stroke-linecap="round" />
                <path
                  d="M6 6h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"
                  stroke-width="2"
                  stroke-linejoin="round"
                />
              </svg>
              <span class="lbSelect__text">Weekly</span>
              <svg class="lbSelect__chev" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M6 9l6 6 6-6" stroke-width="2" stroke-linecap="round" />
              </svg>
            </button>

            <label class="lbSearch">
              <svg class="lbSearch__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="6" stroke-width="2" />
                <path d="M21 21l-4.35-4.35" stroke-width="2" stroke-linecap="round" />
              </svg>
              <input
                v-model="state.filters.search"
                class="lbSearch__input"
                type="search"
                placeholder="Search for user on leaderboard."
                @keyup.enter="applySearch(state.filters.search)"
              />
            </label>
          </div>

          <div class="lbControls__right">
            <button class="lbShare" type="button" @click="onShare">
              <svg class="lbShare__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path d="M16 6l-4-4-4 4" stroke-width="2" stroke-linecap="round" />
                <path d="M12 2v14" stroke-width="2" stroke-linecap="round" />
              </svg>
              <span class="lbShare__text">Share</span>
            </button>

            <div class="lbPager" aria-label="Pagination">
              <button
                class="lbPager__btn"
                type="button"
                @click="goToPage(state.pagination.page - 1)"
                aria-label="Prev"
              >
                ‹
              </button>
              <button class="lbPager__btn lbPager__btn--active" type="button">
                {{ state.pagination.page }}
              </button>
              <button
                class="lbPager__btn"
                type="button"
                @click="goToPage(state.pagination.page + 1)"
                aria-label="Next"
              >
                ›
              </button>
              <button class="lbPager__btn" type="button" @click="goToLast" aria-label="Last">
                »
              </button>
            </div>
          </div>
        </div>

        <div class="lbTableWrap">
          <table class="lbTable">
            <!-- ✅ Smarter widths that fit inside 90% container -->
            <colgroup>
              <col class="col-rank" />
              <col class="col-name" />
              <col class="col-hours" />
              <col class="col-daily" />
              <col class="col-pairs" />
              <col class="col-flag" />
            </colgroup>

            <thead>
              <tr class="lbTable__head">
                <th class="c-rank">
                  <span class="lbTh">
                    <svg class="lbTh__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path
                        d="M12 2l3 6 6 .5-4.5 3.9L18 20l-6-3.5L6 20l1.5-7.6L3 8.5 9 8z"
                        stroke-width="2"
                        stroke-linejoin="round"
                      />
                    </svg>
                    Rank
                  </span>
                </th>

                <th class="c-name">
                  <span class="lbTh">
                    <svg class="lbTh__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="8" r="4" stroke-width="2" />
                      <path
                        d="M20 21v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1"
                        stroke-width="2"
                        stroke-linecap="round"
                      />
                    </svg>
                    Name
                  </span>
                </th>

                <th class="c-hours">
                  <span class="lbTh">
                    <svg class="lbTh__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="9" stroke-width="2" />
                      <path d="M12 7v5l3 2" stroke-width="2" stroke-linecap="round" />
                    </svg>
                    Hours on Chart
                  </span>
                </th>

                <th class="c-daily">
                  <span class="lbTh">
                    <svg class="lbTh__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M5 20V10" stroke-width="2" stroke-linecap="round" />
                      <path d="M10 20V6" stroke-width="2" stroke-linecap="round" />
                      <path d="M15 20V13" stroke-width="2" stroke-linecap="round" />
                      <path d="M20 20V8" stroke-width="2" stroke-linecap="round" />
                    </svg>
                    Daily Average
                  </span>
                </th>

                <th class="c-pairs">
                  <span class="lbTh">
                    <svg class="lbTh__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path
                        d="M4 7h.01M4 12h.01M4 17h.01"
                        stroke-width="2"
                        stroke-linecap="round"
                      />
                      <path d="M7 7h13M7 12h13M7 17h13" stroke-width="2" stroke-linecap="round" />
                    </svg>
                    Pairs Visited
                  </span>
                </th>

                <th class="c-flag" aria-hidden></th>
              </tr>
            </thead>

            <tbody>
              <template v-if="state.isLoading">
                <tr v-for="n in 8" :key="'skel-' + n" class="lbRow lbRow--skel">
                  <td><span class="sk sk--pill" style="width: 44px; height: 14px"></span></td>
                  <td><span class="sk sk--line" style="width: 60%; height: 12px"></span></td>
                  <td><span class="sk sk--line" style="width: 70%; height: 12px"></span></td>
                  <td><span class="sk sk--line" style="width: 65%; height: 12px"></span></td>
                  <td><span class="sk sk--line" style="width: 92%; height: 12px"></span></td>
                  <td><span class="sk sk--pill" style="width: 18px; height: 12px"></span></td>
                </tr>
              </template>

              <template v-else>
                <tr v-for="(row, idx) in state.rows" :key="row.id" class="lbRow">
                  <td class="c-rank">
                    <span
                      class="rankStar"
                      :class="{
                        'rankStar--gold': idx === 0,
                        'rankStar--silver': idx === 1,
                        'rankStar--bronze': idx >= 2,
                      }"
                      aria-hidden
                      >★</span
                    >
                    <span class="rankNum">{{ row.rank }}</span>
                  </td>

                  <td class="c-name">
                    <div class="who">
                      <span class="who__avatar" aria-hidden></span>
                      <span class="who__name">{{ row.name }}</span>
                    </div>
                  </td>

                  <td class="c-hours">{{ row.hoursOnChart }}</td>
                  <td class="c-daily">{{ row.dailyAverage }}</td>

                  <!-- ✅ Wrap to 2 lines so it fits INSIDE 90% width without clipping flags -->
                  <td class="c-pairs">
                    <span class="pairsText" :title="pairsLine(row.pairsVisited)">
                      {{ pairsLine(row.pairsVisited) }}
                    </span>
                  </td>

                  <td class="c-flag">
                    <span class="flag">{{ row.countryFlag }}</span>
                  </td>
                </tr>

                <tr v-if="isEmpty" class="lbRow lbRow--empty">
                  <td class="empty" colspan="6">No users found.</td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.lb {
  --font: 'Poppins', system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;

  --card-bg: #ffffff;
  --card-border: #e9eef5;
  --card-radius: 12px;
  --card-shadow: 0 16px 40px rgba(16, 24, 40, 0.06);

  --top-strip: #f4f6f8;
  --text: rgba(15, 23, 42, 0.86);

  --control-border: #dfe6ee;
  --control-bg: #ffffff;
  --input-bg: #eef2f5;

  --primary: #1f83da;
  --primary-hover: #1873c3;

  --thead-bg: #f6f8fb;
  --sep: #eef2f7;

  --pairs-green: #2f9b52;

  font-family: var(--font);
  color: var(--text);
}

.lb__wrap {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
}

/* ✅ important: no inner max-width fights app-inner */
.lbCard {
  width: 100%;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--card-radius);
  box-shadow: var(--card-shadow);
  overflow: hidden;
}

.lbCard__top {
  background: var(--top-strip);
  padding: 18px 18px;
}
.lbCard__title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.01em;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}
.lbCard__globe {
  font-size: 18px;
  transform: translateY(1px);
}

/* ✅ tighter controls so everything fits into 90% container */
.lbControls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 12px 18px;
  border-bottom: 1px solid var(--sep);
  background: #fff;
}
.lbControls__left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}
.lbControls__right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.lbSelect {
  height: 36px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 0 12px;
  border: 1px solid var(--control-border);
  border-radius: 6px;
  background: var(--control-bg);
  color: rgba(15, 23, 42, 0.72);
  font-size: 13px;
  font-weight: 500;
  transition:
    background 160ms ease,
    border-color 160ms ease,
    transform 160ms ease;
}
.lbSelect__icon,
.lbSelect__chev {
  width: 14px;
  height: 14px;
  color: rgba(15, 23, 42, 0.45);
}
.lbSelect:hover {
  border-color: rgba(31, 131, 218, 0.35);
  background: rgba(246, 248, 251, 0.8);
}
.lbSelect:active {
  transform: translateY(1px);
}

.lbSearch {
  height: 36px;
  flex: 1 1 520px;
  min-width: 280px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 12px;
  border: 1px solid var(--control-border);
  border-radius: 6px;
  background: var(--input-bg);
}
.lbSearch__icon {
  width: 16px;
  height: 16px;
  color: rgba(15, 23, 42, 0.42);
}
.lbSearch__input {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: 13px;
  font-weight: 500;
  color: rgba(15, 23, 42, 0.72);
}
.lbSearch__input::placeholder {
  color: rgba(15, 23, 42, 0.38);
}

.lbShare {
  height: 36px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 0 16px;
  border-radius: 6px;
  border: 1px solid var(--primary);
  background: var(--primary);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  transition:
    background 160ms ease,
    border-color 160ms ease,
    transform 160ms ease;
}
.lbShare:hover {
  background: var(--primary-hover);
  border-color: var(--primary-hover);
}
.lbShare:active {
  transform: translateY(1px);
}
.lbShare__icon {
  width: 16px;
  height: 16px;
}

.lbPager {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.lbPager__btn {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: 1px solid var(--control-border);
  background: #fff;
  color: rgba(15, 23, 42, 0.62);
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition:
    background 160ms ease,
    border-color 160ms ease,
    transform 160ms ease;
}
.lbPager__btn:hover {
  border-color: rgba(31, 131, 218, 0.35);
  background: rgba(246, 248, 251, 0.9);
}
.lbPager__btn:active {
  transform: translateY(1px);
}
.lbPager__btn--active {
  background: var(--primary);
  border-color: var(--primary);
  color: #fff;
}

/* ✅ table scroll stays inside card */
.lbTableWrap {
  max-height: 520px;
  overflow-y: auto;
  overflow-x: hidden;
}

/* ✅ fixed layout guarantees the flag column always exists */
.lbTable {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
}

/* ✅ col widths that work inside 90% container */
.col-rank {
  width: 78px;
}
.col-name {
  width: 190px;
}
.col-hours {
  width: 140px;
}
.col-daily {
  width: 140px;
}
.col-flag {
  width: 52px;
}

.lbTable__head th {
  background: var(--thead-bg);
  border-bottom: 1px solid var(--sep);
  padding: 14px 18px;
  font-size: 12px;
  font-weight: 600;
  color: rgba(102, 119, 148, 0.95);
  text-align: left;
  white-space: nowrap;
  position: sticky;
  top: 0;
  z-index: 2;
}

.lbTh {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}
.lbTh__icon {
  width: 14px;
  height: 14px;
  color: rgba(102, 119, 148, 0.75);
}

.lbRow td {
  padding: 16px 18px; /* ✅ tighter than before */
  border-bottom: 1px solid var(--sep);
  font-size: 13px;
  font-weight: 500;
  color: rgba(15, 23, 42, 0.72);
  vertical-align: middle;
}
.lbRow:hover td {
  background: rgba(246, 248, 251, 0.65);
}

/* Rank */
.rankStar {
  margin-right: 10px;
  font-size: 13px;
}
.rankStar--gold {
  color: #ffb020;
}
.rankStar--silver {
  color: #b6c0cf;
}
.rankStar--bronze {
  color: #b07a3a;
}
.rankNum {
  font-weight: 600;
  color: rgba(15, 23, 42, 0.62);
}

/* Name */
.who {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}
.who__avatar {
  width: 18px;
  height: 18px;
  border-radius: 999px;
  border: 1px solid #e6ebf2;
  background:
    radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0) 45%),
    linear-gradient(135deg, rgba(31, 131, 218, 0.28), rgba(16, 185, 129, 0.22));
  box-shadow: 0 1px 0 rgba(16, 24, 40, 0.05);
}
.who__name {
  font-weight: 500;
  color: rgba(15, 23, 42, 0.74);
}

/* ✅ key: pairs now wrap (2 lines) so content fits and flags stay visible */
.pairsText {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  overflow: hidden;
  white-space: normal;
  word-break: break-word;

  color: var(--pairs-green);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.01em;
  line-height: 1.2;
}

/* Flag always visible */
.c-flag {
  text-align: right;
}
.flag {
  display: inline-flex;
  justify-content: flex-end;
  width: 100%;
  font-size: 14px;
}

/* Skeleton */
.lbRow--skel td {
  background: #fff;
}
.sk {
  display: inline-block;
  background: linear-gradient(
    90deg,
    rgba(15, 23, 42, 0.06),
    rgba(15, 23, 42, 0.03),
    rgba(15, 23, 42, 0.06)
  );
  background-size: 200% 100%;
  animation: sk 1.2s ease-in-out infinite;
}
.sk--line {
  border-radius: 10px;
}
.sk--pill {
  border-radius: 999px;
}
@keyframes sk {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.lbRow--empty:hover td {
  background: transparent;
}
.empty {
  padding: 22px !important;
  color: rgba(102, 119, 148, 0.85);
  font-size: 13px;
}

/* Responsive */
@media (max-width: 980px) {
  .lbControls {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  .lbControls__left {
    flex-wrap: wrap;
  }
  .lbControls__right {
    justify-content: space-between;
  }
  .lbSearch {
    min-width: 0;
    flex: 1 1 auto;
  }
}
</style>
