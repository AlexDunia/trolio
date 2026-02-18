import { ref } from 'vue'

export function useActivity() {
  const selectedRange = ref('weekly')

  const tabs = [
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
  ]

  const topMetrics = ref([
    { title: 'Total Time Spent', value: '4h 25m', delta: '+10%', note: 'Avg 40 mins / day' },
    { title: 'Active days', value: '4 / 5', delta: '+10%', note: 'Avg 40 mins / day' },
    { title: 'Active days', value: '4 / 5', delta: '+10%', note: 'Avg 40 mins / day' },
    { title: 'Consistency Score', value: '4 / 5', delta: '+10%', note: 'Avg 40 mins / day' },
  ])

  const secondaryMetrics = ref([
    { title: 'Most Traded Pair', value: 'EUR/NZD', delta: '+10%', note: 'Avg 40 mins / day' },
    { title: 'Pairs Traded', value: '9', delta: '+10%', note: 'Avg 40 mins / day' },
    { title: 'Most Active Day', value: 'Tuesday', delta: '+10%', note: 'Avg 40 mins / day' },
    {
      title: 'Most Used Bias',
      value: 'Mitigation Blocks',
      delta: '+10%',
      note: 'Avg 40 mins / day',
    },
  ])

  const dailyActivity = ref([
    {
      key: 'MON',
      dayLabel: 'MON',
      dayNumber: 5,
      badge: '55m',
      rows: [
        { symbol: 'EURNZD', time: '40m' },
        { symbol: 'XAUUSD', time: '40m' },
        { symbol: 'EURNZD', time: '40m' },
      ],
      moreText: '+5 more →',
    },
    {
      key: 'TUE',
      dayLabel: 'TUE',
      dayNumber: 5,
      badge: '55m',
      rows: [
        { symbol: 'EURNZD', time: '40m' },
        { symbol: 'XAUUSD', time: '40m' },
        { symbol: 'EURNZD', time: '40m' },
      ],
      moreText: '+5 more →',
    },
    {
      key: 'WED',
      dayLabel: 'WED',
      dayNumber: 5,
      badge: '55m',
      rows: [
        { symbol: 'EURNZD', time: '40m' },
        { symbol: 'XAUUSD', time: '40m' },
        { symbol: 'EURNZD', time: '40m' },
      ],
      moreText: '+5 more →',
    },
    {
      key: 'THUR',
      dayLabel: 'THUR',
      dayNumber: 5,
      badge: '55m',
      rows: [
        { symbol: 'EURNZD', time: '40m' },
        { symbol: 'XAUUSD', time: '40m' },
        { symbol: 'EURNZD', time: '40m' },
      ],
      moreText: '+5 more →',
    },
  ])

  const callout = ref('Alex, this is where your attention went this week')

  const setRange = (value) => {
    if (value === 'weekly' || value === 'monthly') selectedRange.value = value
  }

  const activeDayKey = ref('THUR')
  const setActiveDay = (dayKey) => {
    activeDayKey.value = dayKey
  }

  return {
    tabs,
    selectedRange,
    topMetrics,
    secondaryMetrics,
    dailyActivity,
    callout,
    setRange,
    activeDayKey,
    setActiveDay,
  }
}

export default useActivity
