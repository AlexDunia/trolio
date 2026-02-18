import { ref } from 'vue'
import { useRoute } from 'vue-router'

const PLACEHOLDERS = [
  'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?auto=format&fit=crop&w=1200&q=60',
  'https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&w=1200&q=60',
  'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=60',
]

export function useActivityDetail() {
  const route = useRoute()
  const dayKey = route.params.dayKey || 'THUR'

  const topMetrics = ref([
    { title: 'Total Time Spent', value: '4h 25m', delta: '+10%' },
    { title: 'Active days', value: '4 / 5', delta: '+10%' },
    { title: 'Consistency Score', value: '4 / 5', delta: '+10%' },
  ])

  // Create mock trades
  const trades = ref([
    {
      id: 't1',
      symbol: 'EURUSD',
      timeLabel: '40:05 - Ongoing',
      tags: ['Fair Value Gaps', 'Mitigation Blocks'],
      narrativeBullets: [
        'FVG hit 50% fib level, and then went straight to Tp',
        'Mitigation Block was just around the corner',
      ],
      galleryUploads: [],
      placeholderImages: [PLACEHOLDERS[0], PLACEHOLDERS[1]],
    },
    {
      id: 't2',
      symbol: 'GBPUSD',
      timeLabel: '12:20 - Closed',
      tags: ['Mitigation Blocks'],
      narrativeBullets: ['Tight stop was respected', 'Good risk management'],
      galleryUploads: [],
      placeholderImages: [PLACEHOLDERS[1], PLACEHOLDERS[2]],
    },
    {
      id: 't3',
      symbol: 'USDJPY',
      timeLabel: '02:10 - Ongoing',
      tags: ['Fair Value Gaps'],
      narrativeBullets: ['Re-entry after pullback', 'Trailing stop used'],
      galleryUploads: [],
      placeholderImages: [PLACEHOLDERS[2], PLACEHOLDERS[0]],
    },
  ])

  const openTradeId = ref(null)

  const toggleTrade = (id) => {
    openTradeId.value = openTradeId.value === id ? null : id
  }

  const addImages = async (tradeId, fileList) => {
    try {
      if (!fileList || fileList.length === 0) return []
      const trade = trades.value.find((t) => t.id === tradeId)
      if (!trade) return []
      const created = []
      for (const file of Array.from(fileList)) {
        const url = URL.createObjectURL(file)
        trade.galleryUploads.push({ url, name: file.name })
        created.push(url)
      }
      return created
    } catch (e) {
      console.error('addImages error', e)
      return []
    }
  }

  const removeImages = (tradeId, urls = []) => {
    try {
      const trade = trades.value.find((t) => t.id === tradeId)
      if (!trade) return
      trade.galleryUploads = trade.galleryUploads.filter((u) => {
        if (urls.includes(u.url)) {
          try {
            URL.revokeObjectURL(u.url)
          } catch (e) {}
          return false
        }
        return true
      })
    } catch (e) {
      console.error('removeImages error', e)
    }
  }

  const getGalleryImages = (tradeId) => {
    const trade = trades.value.find((t) => t.id === tradeId)
    if (!trade) return []
    // merge uploads + placeholders
    const uploads = trade.galleryUploads.map((u) => u.url)
    return uploads.concat(trade.placeholderImages || [])
  }

  return {
    dayKey,
    topMetrics,
    trades,
    openTradeId,
    toggleTrade,
    addImages,
    removeImages,
    getGalleryImages,
  }
}

export default useActivityDetail
