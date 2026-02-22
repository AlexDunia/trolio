<script setup>
// 1 imports
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LeaderboardService from '@/services/LeaderboardService'

// 2 props (none)

// 3 emits (none)

// 4 router/route
const route = useRoute()
const router = useRouter()

// 5 stores (none)

// 6 reactive state
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

// 7 computed
const isEmpty = computed(() => !state.rows || state.rows.length === 0)

// 8 methods
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

async function onShare() {
  try {
    const payload = await LeaderboardService.getSharePayload({ filters: state.filters })
    // for now just open the generated URL in a new tab
    window.open(payload.url, '_blank')
  } catch (err) {
    console.error(err)
  }
}

// 9 watchers (none)

// 10 lifecycle
onMounted(() => {
  void load()
})
</script>

<template>
  <main class="leaderboards-page page-card-wrap">
    <header class="leaderboards__header">
      <h1 class="leaderboards__title">
        Leaderboards <span class="leaderboards__star" aria-hidden>⭐</span>
      </h1>
      <p class="leaderboards__subtitle">
        Here you can add, remove, and edit properties on your profile
      </p>
    </header>

    <section class="leaderboards__container">
      <div class="leaderboards__card">
        <div class="leaderboards__sectionBanner">
          <div class="leaderboards__sectionHeader">
            <h2 class="leaderboards__sectionTitle">
              Global Ranking <span aria-hidden class="leaderboards__globe">🌍</span>
            </h2>
          </div>
        </div>

        <div class="leaderboards__controls">
          <div class="controls__left">
            <div class="controls__select">
              <button class="controls__selectBtn">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M8 7v-2a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
                </svg>
                <span>Most active</span>
                <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
            </div>

            <div class="controls__select">
              <button class="controls__selectBtn">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M3 7h18M3 11h18M3 15h18" />
                </svg>
                <span>Weekly</span>
                <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
            </div>

            <div class="controls__search">
              <label class="search__wrap">
                <svg class="icon search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 21l-4.35-4.35" />
                  <circle cx="11" cy="11" r="6" />
                </svg>
                <input
                  type="search"
                  class="search__input"
                  placeholder="Search for user on leaderboard."
                  v-model="state.filters.search"
                  @keyup.enter="applySearch(state.filters.search)"
                />
              </label>
            </div>
          </div>

          <div class="controls__right">
            <button class="btn btn--primary btn--share" @click="onShare">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" />
                <path d="M16 6l-4-4-4 4" />
              </svg>
              <span>Share</span>
            </button>

            <div class="controls__pager">
              <button class="pager__btn" @click="goToPage(state.pagination.page - 1)">‹</button>
              <button class="pager__btn pager__btn--active">1</button>
              <button class="pager__btn">2</button>
              <button class="pager__btn" @click="goToPage(state.pagination.page + 1)">›</button>
              <button class="pager__btn">»</button>
            </div>
          </div>
        </div>

        <div class="leaderboards__tableWrap">
          <table class="leaderboards__table">
            <thead>
              <tr>
                <th class="col-rank">Rank</th>
                <th class="col-name">Name</th>
                <th class="col-hours">Hours on Chart</th>
                <th class="col-daily">Daily Average</th>
                <th class="col-pairs">Pairs Visited</th>
                <th class="col-flag" aria-hidden></th>
              </tr>
            </thead>
            <tbody>
              <template v-if="state.isLoading">
                <tr v-for="n in 5" :key="'skel-' + n" class="table__row table__skeleton">
                  <td class="col-rank">
                    <span
                      class="skeleton skeleton-circle"
                      style="width: 28px; height: 20px; border-radius: 4px; display: inline-block"
                    ></span>
                  </td>
                  <td class="col-name">
                    <div style="display: flex; align-items: center; gap: 0.6rem">
                      <span
                        class="skeleton skeleton-circle"
                        style="width: 34px; height: 34px"
                      ></span>
                      <div style="flex: 1">
                        <div
                          class="skeleton skeleton-line"
                          style="width: 40%; height: 0.95rem; margin-bottom: 6px"
                        ></div>
                        <div
                          class="skeleton skeleton-line"
                          style="width: 28%; height: 0.85rem"
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td class="col-hours">
                    <span class="skeleton skeleton-line" style="width: 62%"></span>
                  </td>
                  <td class="col-daily">
                    <span class="skeleton skeleton-line" style="width: 48%"></span>
                  </td>
                  <td class="col-pairs">
                    <div style="display: flex; gap: 6px; flex-wrap: wrap">
                      <span
                        class="skeleton"
                        style="width: 56px; height: 18px; border-radius: 8px; display: inline-block"
                      ></span>
                      <span
                        class="skeleton"
                        style="width: 56px; height: 18px; border-radius: 8px; display: inline-block"
                      ></span>
                      <span
                        class="skeleton"
                        style="width: 56px; height: 18px; border-radius: 8px; display: inline-block"
                      ></span>
                    </div>
                  </td>
                  <td class="col-flag">
                    <span
                      class="skeleton skeleton-circle"
                      style="width: 20px; height: 14px; border-radius: 3px; display: inline-block"
                    ></span>
                  </td>
                </tr>
              </template>

              <tr v-for="row in state.rows" :key="row.id" class="table__row">
                <td class="col-rank">
                  <span class="rank__star">★</span>
                  <span class="rank__num">{{ row.rank }}</span>
                </td>
                <td class="col-name">
                  <div class="name__wrap">
                    <div class="avatar" aria-hidden>
                      <span>A</span>
                    </div>
                    <div class="name__text">{{ row.name }}</div>
                  </div>
                </td>
                <td class="col-hours">{{ row.hoursOnChart }}</td>
                <td class="col-daily">{{ row.dailyAverage }}</td>
                <td class="col-pairs">
                  <div class="pairs__wrap">
                    <span v-for="(p, i) in row.pairsVisited" :key="p + i" class="pair__tag">{{
                      p
                    }}</span>
                  </div>
                </td>
                <td class="col-flag">{{ row.countryFlag }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
/* Mobile-first */
:root {
  --card-bg: var(--card-bg, #ffffff);
  --card-border: var(--card-border, #e8ecf3);
  --shadow: 0 8px 30px rgba(16, 24, 40, 0.06);
  --primary: var(--accent-color, #0b5cab);
  --muted: var(--section-title, #7f8da3);
  --tag-green-bg: #e8fbef;
  --tag-green-text: #1b7b3a;
}

.leaderboards-page {
  padding: 1rem;
}

.leaderboards__header {
  margin-bottom: 1rem;
}

.leaderboards__title {
  font-size: 1.15rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.leaderboards__subtitle {
  margin: 0.35rem 0 0;
  color: var(--muted);
  font-size: 0.92rem;
}

.leaderboards__container {
  display: flex;
  justify-content: center;
}

.leaderboards__card {
  width: 100%;
  max-width: 1060px;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  box-shadow: var(--shadow);
  border-radius: 8px;
  padding: 1rem;
}

.leaderboards__sectionHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.leaderboards__sectionTitle {
  font-size: 1rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.leaderboards__sectionBanner {
  background: rgba(242, 245, 248, 0.9);
  border-radius: 6px;
  padding: 0.6rem 0.75rem;
  margin-bottom: 0.85rem;
}

.leaderboards__controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.65rem;
  margin-bottom: 1rem;
}

.controls__left {
  display: flex;
  gap: 0.6rem;
  align-items: center;
  flex: 1;
}
.controls__right {
  display: flex;
  gap: 0.6rem;
  align-items: center;
}

.controls__selectBtn {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.4rem 0.55rem;
  border-radius: 8px;
  border: 1px solid var(--card-border);
  background: #fff;
  color: inherit;
  font-size: 0.92rem;
}

.controls__search {
  flex: 1 1 420px;
  min-width: 180px;
}
.search__wrap {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid var(--card-border);
  padding: 0.45rem 0.6rem;
  border-radius: 8px;
  background: #f7f9fb;
}
.search__input {
  border: none;
  outline: none;
  flex: 1;
  font-size: 0.95rem;
  background: transparent;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.75rem;
  border-radius: 8px;
  border: 1px solid var(--card-border);
  background: transparent;
}
.btn--primary {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
}

.controls__pager {
  display: flex;
  gap: 0.4rem;
  align-items: center;
}
.pager__btn {
  padding: 0.28rem 0.56rem;
  border-radius: 999px;
  border: 1px solid var(--card-border);
  background: transparent;
  font-size: 0.92rem;
}
.pager__btn--active {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
}

.leaderboards__tableWrap {
  overflow-x: auto;
}
.leaderboards__table {
  width: 100%;
  border-collapse: collapse;
  min-width: 980px;
}
thead th {
  text-align: left;
  padding: 0.75rem 0.5rem;
  color: var(--muted);
  font-weight: 600;
  font-size: 0.85rem;
  border-bottom: 1px solid var(--card-border);
}
tbody td {
  padding: 0.85rem 0.5rem;
  border-bottom: 1px solid #f3f6f9;
  vertical-align: middle;
}

.rank__star {
  margin-right: 0.35rem;
  color: #ffb020;
  font-size: 1rem;
}
.name__wrap {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 0 rgba(16, 24, 40, 0.04);
  border: 1px solid #eef3f6;
  display: grid;
  place-items: center;
  font-weight: 600;
  color: #3b4958;
}
.pair__tag {
  display: inline-block;
  background: var(--tag-green-bg);
  color: var(--tag-green-text);
  padding: 0.18rem 0.4rem;
  border-radius: 10px;
  font-size: 0.78rem;
  margin-right: 0.35rem;
  margin-bottom: 0.2rem;
}

/* Desktop layout adjustments */
@media (min-width: 800px) {
  .leaderboards__controls {
    flex-direction: row;
    align-items: center;
  }
  .controls__group {
    flex: 1;
  }
}
</style>
