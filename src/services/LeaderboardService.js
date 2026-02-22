import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '/',
})

export default {
  async getLeaderboard({
    sort = 'most_active',
    timeframe = 'weekly',
    search = '',
    page = 1,
    perPage = 10,
  } = {}) {
    try {
      // TODO: replace with real API call when available
      // const res = await API.get('/leaderboards', { params: { sort, timeframe, search, page, perPage } })
      // return res.data

      // Mocked response shaped like a backend payload
      const mockRow = (i = 1) => ({
        id: i,
        rank: 17,
        name: 'Daniel Peters',
        avatar: null,
        hoursOnChart: '44hrs 17mins',
        dailyAverage: '4hrs 17mins',
        pairsVisited: [
          'USD/JPY',
          'CAD/USD',
          'GBP/AUD',
          'USD/NZD',
          'USD/JPY',
          'CAD/USD',
          'GBP/AUD',
          'USD/NZD',
        ],
        countryFlag: '🇩🇪',
      })

      const rows = Array.from({ length: perPage }).map((_, idx) => mockRow(idx + 1))
      const total = 42
      const lastPage = Math.ceil(total / perPage)

      return {
        data: rows,
        meta: { total, page, perPage, lastPage },
      }
    } catch (err) {
      console.error('LeaderboardService.getLeaderboard error', err)
      throw err
    }
  },

  async getSharePayload({ filters = {} } = {}) {
    try {
      // stubbed share payload — backend integration point
      return {
        url: `${window.location.origin}/leaderboards?${new URLSearchParams(filters).toString()}`,
      }
    } catch (err) {
      console.error('LeaderboardService.getSharePayload error', err)
      throw err
    }
  },
}
