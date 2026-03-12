<script setup>
import { reactive, computed, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import LeaderboardService from '@/services/LeaderboardService'

const router = useRouter()
const timeframeOptions = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
]
const sortOptions = [
  { value: 'most_active', label: 'Most active' },
  { value: 'most_profitable', label: 'Most profitable' },
]
const sortDropdownOpen = ref(false)
const sortDropdownRef = ref(null)
const sharePopupOpen = ref(false)
const shareFeedback = ref('')
const ogImageCache = ref('')
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

const currentShareUrl = computed(() => {
  if (typeof window === 'undefined') return '/leaderboards'
  const url = new URL(window.location.href)
  url.pathname = '/leaderboards'
  url.searchParams.set('sort', state.filters.sort)
  url.searchParams.set('timeframe', state.filters.timeframe)
  if (state.filters.search) url.searchParams.set('search', state.filters.search)
  url.searchParams.set('page', state.pagination.page.toString())
  return url.toString()
})
const shareDescription = computed(
  () =>
    `Live leaderboard snapshot for ${currentShareUrl.value.includes('most_profitable') ? 'most profitable' : 'most active'} ${currentTimeframeLabel.value.toLowerCase()} traders`,
)
const sharePlatforms = [
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'reddit', label: 'Reddit' },
  { id: 'x', label: 'X' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'telegram', label: 'Telegram' },
  { id: 'discord', label: 'Discord' },
]
const isEmpty = computed(() => !state.rows || state.rows.length === 0)
const currentSortLabel = computed(() => {
  const match = sortOptions.find((option) => option.value === state.filters.sort)
  return match ? match.label : sortOptions[0].label
})
const currentTimeframeLabel = computed(() => {
  const match = timeframeOptions.find((option) => option.value === state.filters.timeframe)
  return match ? match.label : timeframeOptions[0].label
})
const shareHeading = computed(
  () => `Global Ranking • ${currentSortLabel.value} • ${currentTimeframeLabel.value}`,
)
const shareMetaLabel = computed(() => `${currentSortLabel.value} · ${currentTimeframeLabel.value}`)
const shareRows = computed(() => {
  if (state.rows.length) return state.rows
  return [
    {
      rank: '-',
      name: 'Leaderboard empty',
      hoursOnChart: '—',
      dailyAverage: '—',
      pairsVisited: [],
      countryFlag: '',
    },
  ]
})

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

watch(
  () => state.filters.search,
  (value, oldValue) => {
    if (value === oldValue) return
    state.pagination.page = 1
    void load()
  },
)

watch(sharePopupOpen, (open) => {
  if (typeof document === 'undefined') return
  document.body.style.overflow = open ? 'hidden' : ''
})

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

function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}

async function buildLeaderboardShareBlob() {
  if (typeof document === 'undefined') return null
  const rows = shareRows.value
  const WIDTH = 1400
  const paddingX = 60
  const paddingY = 70
  const rowHeight = 90
  const titleY = paddingY + 80
  const chipsY = titleY + 90
  const tableY = chipsY + 80
  const tableBodyHeight = rows.length * rowHeight + 30
  const requiredHeight = paddingY * 2 + tableY + tableBodyHeight + 80
  const HEIGHT = Math.max(requiredHeight, 880)
  const DPI = window.devicePixelRatio || 1
  const canvas = document.createElement('canvas')
  canvas.width = WIDTH * DPI
  canvas.height = HEIGHT * DPI
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  ctx.scale(DPI, DPI)

  const cardWidth = WIDTH - paddingX * 2
  const cardHeight = HEIGHT - paddingY * 2

  const bgGradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT)
  bgGradient.addColorStop(0, '#eef4ff')
  bgGradient.addColorStop(1, '#fdf5ff')
  ctx.fillStyle = bgGradient
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  ctx.save()
  drawRoundedRect(ctx, paddingX - 10, paddingY - 10, cardWidth + 20, cardHeight + 20, 32)
  ctx.fillStyle = '#ffffff'
  ctx.shadowColor = 'rgba(15, 23, 42, 0.2)'
  ctx.shadowBlur = 40
  ctx.shadowOffsetY = 22
  ctx.fill()
  ctx.restore()

  ctx.save()
  drawRoundedRect(ctx, paddingX, paddingY, cardWidth, cardHeight, 26)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.97)'
  ctx.fill()
  ctx.lineWidth = 1.2
  ctx.strokeStyle = 'rgba(31, 131, 218, 0.18)'
  ctx.stroke()
  ctx.restore()

  const titleX = paddingX + 40
  ctx.fillStyle = '#0f172a'
  ctx.font = '600 42px Poppins, system-ui, sans-serif'
  ctx.fillText(shareHeading.value, titleX, titleY)

  ctx.font = '500 17px Poppins, system-ui, sans-serif'
  ctx.fillStyle = 'rgba(15, 23, 42, 0.72)'
  ctx.fillText(
    'Matches the live leaderboard content you see on the dashboard.',
    titleX,
    titleY + 44,
  )

  let chipX = titleX
  const drawChip = (text, accent) => {
    ctx.font = '600 14px Poppins, system-ui, sans-serif'
    const textWidth = ctx.measureText(text).width
    const chipWidth = textWidth + 32
    const chipHeight = 38
    ctx.save()
    drawRoundedRect(ctx, chipX, chipsY, chipWidth, chipHeight, 20)
    ctx.fillStyle = accent ? 'rgba(31, 131, 218, 0.14)' : 'rgba(15, 23, 42, 0.11)'
    ctx.fill()
    ctx.restore()
    ctx.fillStyle = accent ? '#1f83da' : '#0f172a'
    ctx.fillText(text, chipX + 16, chipsY + chipHeight / 2 + 6)
    chipX += chipWidth + 16
  }
  drawChip(currentTimeframeLabel.value, true)
  drawChip(currentSortLabel.value, false)

  const tableX = paddingX + 40
  const columns = [
    { label: 'Rank', width: 100 },
    { label: 'Name', width: 320 },
    { label: 'Hours on chart', width: 200 },
    { label: 'Daily average', width: 200 },
    { label: 'Pairs visited', width: 280 },
    { label: 'Flag', width: 60 },
  ]
  const columnPositions = []
  let cursor = tableX
  columns.forEach((column) => {
    columnPositions.push(cursor)
    cursor += column.width
  })
  const tableWidth = cursor - tableX

  ctx.font = '600 15px Poppins, system-ui, sans-serif'
  ctx.fillStyle = '#475467'
  columnPositions.forEach((colX, index) => {
    ctx.fillText(columns[index].label.toUpperCase(), colX + 10, tableY)
  })
  ctx.strokeStyle = 'rgba(31, 131, 218, 0.25)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(tableX - 10, tableY + 12)
  ctx.lineTo(tableX + tableWidth + 10, tableY + 12)
  ctx.stroke()

  const rowsStartY = tableY + 40
  rows.forEach((row, index) => {
    const y = rowsStartY + index * rowHeight
    ctx.fillStyle = index % 2 === 0 ? 'rgba(239, 244, 255, 0.9)' : 'rgba(255, 255, 255, 0.9)'
    ctx.fillRect(tableX - 10, y - 14, tableWidth + 20, rowHeight - 12)

    ctx.fillStyle = '#0f172a'
    ctx.font = '600 28px Poppins, system-ui, sans-serif'
    ctx.fillText(`${row.rank ?? '-'}`, columnPositions[0] + 12, y + 34)

    ctx.font = '600 22px Poppins, system-ui, sans-serif'
    ctx.fillText(row.name ?? '—', columnPositions[1] + 10, y + 34, columns[1].width - 20)

    ctx.font = '500 20px Poppins, system-ui, sans-serif'
    ctx.fillStyle = '#0f172a'
    ctx.fillText(row.hoursOnChart ?? '0hrs 0mins', columnPositions[2] + 10, y + 34)
    ctx.fillText(row.dailyAverage ?? '0hrs 0mins', columnPositions[3] + 10, y + 34)

    const pairsText = pairsLine(row.pairsVisited)
    ctx.font = '500 18px Poppins, system-ui, sans-serif'
    ctx.fillStyle = '#16a34a'
    ctx.fillText(pairsText || '—', columnPositions[4] + 10, y + 34, columns[4].width - 16)

    ctx.fillStyle = '#0f172a'
    ctx.font = '600 26px Poppins, system-ui, sans-serif'
    ctx.fillText(row.countryFlag ?? '', columnPositions[5] + 10, y + 34)
  })

  ctx.font = '500 16px Poppins, sans-serif'
  ctx.fillStyle = '#475467'
  ctx.fillText(shareMetaLabel.value, titleX, HEIGHT - paddingY - 18)

  ctx.font = '600 18px Poppins, sans-serif'
  ctx.fillText('Powered by trolio', WIDTH - paddingX - 220, HEIGHT - paddingY - 18)

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png')
  })
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

function setMetaTag(attrName, attrValue, content) {
  if (typeof document === 'undefined') return
  const selector = `${attrName === 'name' ? 'meta[name' : 'meta[property'}="${attrValue}"]`
  let meta = document.querySelector(selector)
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute(attrName, attrValue)
    document.head.appendChild(meta)
  }
  meta.setAttribute('content', content)
}

async function ensureOgMetadata() {
  setMetaTag('property', 'og:title', shareHeading.value)
  setMetaTag('property', 'og:description', shareDescription.value)
  setMetaTag('property', 'og:url', currentShareUrl.value)
  setMetaTag('property', 'og:type', 'website')
  setMetaTag('name', 'twitter:card', 'summary_large_image')
  setMetaTag('name', 'twitter:title', shareHeading.value)
  setMetaTag('name', 'twitter:description', shareDescription.value)

  if (!ogImageCache.value) {
    const blob = await buildLeaderboardShareBlob()
    if (blob) {
      ogImageCache.value = await blobToDataUrl(blob)
    }
  }
  if (ogImageCache.value) {
    setMetaTag('property', 'og:image', ogImageCache.value)
    setMetaTag('name', 'twitter:image', ogImageCache.value)
  }
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

async function saveShareImage() {
  try {
    const blob = await buildLeaderboardShareBlob()
    if (!blob) return
    downloadBlob(blob, 'trolio-leaderboard.png')
    shareFeedback.value = 'Image saved'
    setTimeout(() => {
      shareFeedback.value = ''
    }, 2200)
  } catch (err) {
    console.error(err)
    shareFeedback.value = 'Unable to save image'
  }
}

function closeSharePopup() {
  sharePopupOpen.value = false
}

async function openSharePopup() {
  sharePopupOpen.value = true
  shareFeedback.value = ''
  await ensureOgMetadata()
}

function getPlatformShareUrl(platform) {
  const url = encodeURIComponent(currentShareUrl.value)
  const title = encodeURIComponent(`${shareHeading.value} — ${shareMetaLabel.value}`)
  switch (platform) {
    case 'whatsapp':
      return `https://api.whatsapp.com/send?text=${title}%0A${url}`
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${url}`
    case 'reddit':
      return `https://www.reddit.com/submit?url=${url}&title=${title}`
    case 'x':
      return `https://x.com/intent/tweet?url=${url}&text=${title}`
    case 'linkedin':
      return `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
    case 'telegram':
      return `https://t.me/share/url?url=${url}&text=${title}`
    case 'discord':
      return `https://discord.com/share?url=${url}&text=${title}`
    default:
      return currentShareUrl.value
  }
}

function handlePlatformShare(platformId) {
  const shareUrl = getPlatformShareUrl(platformId)
  window.open(shareUrl, '_blank', 'noopener')
}

async function copyShareLink() {
  try {
    await navigator.clipboard.writeText(currentShareUrl.value)
    shareFeedback.value = 'Link copied'
    setTimeout(() => {
      shareFeedback.value = ''
    }, 2000)
  } catch (err) {
    console.error(err)
    shareFeedback.value = 'Clipboard unavailable'
  }
}

function pairsLine(pairsVisited) {
  const list = Array.isArray(pairsVisited) ? pairsVisited.filter(Boolean) : []
  return list.join(' ')
}

function updateFilter(field, value) {
  const changed = state.filters[field] !== value
  state.filters[field] = value
  sortDropdownOpen.value = false
  if (!changed) return
  state.pagination.page = 1
  void load()
}

function setTimeframe(value) {
  updateFilter('timeframe', value)
}

function selectSort(value) {
  updateFilter('sort', value)
}

function toggleSortDropdown(event) {
  event.stopPropagation()
  sortDropdownOpen.value = !sortDropdownOpen.value
}

function handleGlobalClick(event) {
  if (!sortDropdownOpen.value) return
  if (!sortDropdownRef.value?.contains(event.target)) {
    sortDropdownOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', handleGlobalClick)
  void load()
})

onBeforeUnmount(() => {
  window.removeEventListener('click', handleGlobalClick)
})

function goToTraderProfile(id) {
  if (!id) return
  void router.push({ name: 'leaderboard-profile', params: { id } })
}
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
            <div class="lbControls__filters">
              <div class="lbFilterGroup">
                <span class="lbFilterGroup__label">Timeframe</span>
                <div class="lbFilterGroup__options">
                  <button
                    v-for="option in timeframeOptions"
                    :key="option.value"
                    type="button"
                    class="lbFilterBtn"
                    :class="{ 'lbFilterBtn--active': state.filters.timeframe === option.value }"
                    @click="setTimeframe(option.value)"
                    :aria-pressed="state.filters.timeframe === option.value"
                  >
                    {{ option.label }}
                  </button>
                </div>
              </div>

              <div class="lbFilterGroup">
                <span class="lbFilterGroup__label">Sort</span>
                <div class="lbFilterGroup__options" ref="sortDropdownRef">
                  <button
                    type="button"
                    class="lbFilterBtn lbFilterBtn--dropdown"
                    aria-haspopup="listbox"
                    :aria-expanded="sortDropdownOpen"
                    @click.stop="toggleSortDropdown"
                  >
                    {{ currentSortLabel }}
                    <span
                      class="lbFilterBtn__chev"
                      :class="{ 'lbFilterBtn__chev--open': sortDropdownOpen }"
                    >
                      ▼
                    </span>
                  </button>

                  <div v-if="sortDropdownOpen" class="lbFilterDropdown" role="listbox">
                    <button
                      v-for="option in sortOptions"
                      :key="option.value"
                      type="button"
                      class="lbFilterDropdown__item"
                      :class="{
                        'lbFilterDropdown__item--active': state.filters.sort === option.value,
                      }"
                      :aria-current="state.filters.sort === option.value ? true : undefined"
                      @click.stop="selectSort(option.value)"
                    >
                      {{ option.label }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

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
              />
            </label>
          </div>

          <div class="lbControls__right">
            <button
              class="lbShare"
              type="button"
              @click="openSharePopup"
              aria-label="Open share options"
              :aria-expanded="sharePopupOpen"
            >
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

        <div
          v-if="sharePopupOpen"
          class="share-popup-overlay"
          @click.self="closeSharePopup"
          role="presentation"
        >
          <div
            class="share-popup"
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-popup-title"
          >
            <button
              class="share-popup__close"
              type="button"
              @click="closeSharePopup"
              aria-label="Close share dialog"
            >
              ×
            </button>
            <h3 id="share-popup-title">Share leaderboard</h3>
            <p class="share-popup__intro">
              Share the exact leaderboard view you are seeing, including the filters, top names, and
              timeframe.
            </p>
            <div class="share-popup__actions">
              <button class="share-popup__pill" type="button" @click="copyShareLink">
                Copy link
              </button>
              <button
                class="share-popup__pill share-popup__pill--ghost"
                type="button"
                @click="saveShareImage"
              >
                Save image
              </button>
            </div>
            <div class="share-popup__grid">
              <button
                v-for="platform in sharePlatforms"
                :key="platform.id"
                class="share-popup__platform"
                type="button"
                @click="handlePlatformShare(platform.id)"
              >
                {{ platform.label }}
              </button>
            </div>
            <div v-if="shareFeedback" class="share-popup__feedback">{{ shareFeedback }}</div>
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
                <tr
                  v-for="(row, idx) in state.rows"
                  :key="row.id"
                  class="lbRow"
                  tabindex="0"
                  role="button"
                  :aria-label="`View analytics for ${row.name}`"
                  @click="goToTraderProfile(row.id)"
                  @keydown.enter.prevent="goToTraderProfile(row.id)"
                >
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
.lbControls__filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}
.lbFilterGroup {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  letter-spacing: 0.08em;
  color: rgba(15, 23, 42, 0.6);
}
.lbFilterGroup__label {
  font-weight: 600;
}
.lbFilterGroup__options {
  display: inline-flex;
  gap: 6px;
  position: relative;
}
.lbFilterBtn {
  height: 34px;
  padding: 0 16px;
  border-radius: 10px;
  border: 1px solid var(--control-border);
  background: var(--control-bg);
  color: rgba(15, 23, 42, 0.72);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition:
    background 160ms ease,
    border-color 160ms ease,
    color 160ms ease,
    transform 200ms ease,
    box-shadow 200ms ease;
}
.lbFilterBtn--active {
  background: var(--primary);
  border-color: var(--primary);
  color: #fff;
  box-shadow: 0 12px 36px rgba(31, 131, 218, 0.18);
}
.lbFilterBtn:hover {
  border-color: rgba(31, 131, 218, 0.35);
  transform: translateY(-1px);
  box-shadow: 0 10px 30px rgba(31, 131, 218, 0.12);
}
.lbFilterBtn:focus-visible {
  outline: 2px solid rgba(31, 131, 218, 0.5);
  outline-offset: 2px;
}
.lbFilterBtn--dropdown {
  min-width: 160px;
  justify-content: space-between;
}
.lbFilterBtn__chev {
  margin-left: 8px;
  transition: transform 120ms ease;
  display: inline-flex;
  align-items: center;
}
.lbFilterBtn__chev--open {
  transform: rotate(180deg);
}
.lbFilterDropdown {
  position: absolute;
  top: 42px;
  left: 0;
  min-width: 180px;
  background: #fff;
  border: 1px solid #dfe6ee;
  border-radius: 10px;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.15);
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 0;
  z-index: 10;
  animation: appear 200ms ease;
}
.lbFilterDropdown__item {
  padding: 10px 18px;
  background: transparent;
  border: none;
  text-align: left;
  width: 100%;
  font-size: 13px;
  font-weight: 600;
  color: rgba(15, 23, 42, 0.8);
  cursor: pointer;
  transition:
    background 120ms ease,
    color 120ms ease;
}
.lbFilterDropdown__item:hover {
  background: rgba(31, 131, 218, 0.08);
}
.lbFilterDropdown__item--active {
  color: var(--primary);
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
  position: relative;
  overflow: hidden;
  will-change: transform;
  box-shadow: 0 12px 32px rgba(31, 131, 218, 0.25);
  transition:
    background 160ms ease,
    border-color 160ms ease,
    transform 160ms ease,
    box-shadow 200ms ease;
}
.lbShare::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top right, rgba(255, 255, 255, 0.35), transparent 60%);
  opacity: 0;
  transition: opacity 220ms ease;
}
.lbShare:hover {
  background: var(--primary-hover);
  border-color: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 20px 42px rgba(31, 131, 218, 0.35);
}
.lbShare:active {
  transform: translateY(1px);
}
.lbShare:hover::after {
  opacity: 1;
}
.lbShare:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.4);
}
.lbShare__icon {
  width: 16px;
  height: 16px;
}

.lbCard {
  transition:
    transform 220ms ease,
    box-shadow 240ms ease;
}
.lbCard:hover {
  transform: translateY(-2px);
  box-shadow: 0 30px 60px rgba(15, 23, 42, 0.14);
}
.lbRow {
  transition:
    background 180ms ease,
    transform 200ms ease;
}
.lbRow:hover {
  background: rgba(31, 131, 218, 0.05);
  transform: translateY(-1px);
}

@keyframes appear {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
.share-popup-overlay {
  position: fixed;
  inset: 0;
  backdrop-filter: blur(6px);
  background: rgba(5, 12, 31, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99;
}

.share-popup {
  width: min(540px, 90vw);
  padding: 32px;
  border-radius: 22px;
  background: #fff;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.25);
  position: relative;
  border: 1px solid rgba(31, 131, 218, 0.1);
}

.share-popup__close {
  position: absolute;
  top: 12px;
  right: 12px;
  border: none;
  background: transparent;
  font-size: 22px;
  cursor: pointer;
  color: rgba(15, 23, 42, 0.6);
}

.share-popup h3 {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  color: #0f172a;
}

.share-popup__intro {
  margin-top: 6px;
  margin-bottom: 18px;
  font-size: 14px;
  color: rgba(15, 23, 42, 0.7);
}

.share-popup__actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.share-popup__pill {
  padding: 10px 20px;
  border-radius: 12px;
  border: 1px solid #1f83da;
  background: #1f83da;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 180ms ease,
    box-shadow 220ms ease;
}

.share-popup__pill--ghost {
  border-color: rgba(15, 23, 42, 0.2);
  background: #fff;
  color: #0f172a;
  box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.08);
}

.share-popup__pill:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(31, 131, 218, 0.2);
}

.share-popup__grid {
  margin-top: 24px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
}

.share-popup__platform {
  border: 1px solid rgba(15, 23, 42, 0.12);
  border-radius: 10px;
  padding: 10px;
  background: #f7f9fd;
  cursor: pointer;
  font-weight: 600;
  color: #0f172a;
  transition:
    background 160ms ease,
    transform 160ms ease;
}

.share-popup__platform:hover {
  background: #e3edff;
  transform: translateY(-1px);
}

.share-popup__feedback {
  margin-top: 14px;
  font-size: 13px;
  color: #16a34a;
}

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
see
