import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '@/pages/LandingPage.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import DashboardPage from '@/pages/DashboardPage.vue'

const routes = [
  {
    path: '/',
    name: 'landing',
    component: LandingPage,
  },
  {
    path: '/dashboard',
    component: DashboardLayout,
    children: [
      {
        path: '',
        name: 'dashboard',
        component: DashboardPage,
      },
      // generic child routes for sidebar items
      {
        path: 'activity',
        name: 'activity',
        component: () => import('@/pages/ActivityPage.vue'),
        meta: { title: 'Activity' },
      },
      {
        path: 'activity/:dayKey',
        name: 'activity-detail',
        component: () => import('@/pages/ActivityDetailPage.vue'),
        meta: { title: 'Activity Detail' },
      },
      {
        path: 'trade-history',
        name: 'trade-history',
        component: () => import('@/pages/TradeHistoryPage.vue'),
        meta: { title: 'Trade History' },
      },
      {
        path: 'performance',
        name: 'performance',
        component: () => import('@/pages/PerformancePage.vue'),
        meta: { title: 'Performance' },
      },
      {
        path: 'leaderboards',
        name: 'leaderboards',
        component: () => import('@/pages/LeaderboardsPage.vue'),
        meta: { title: 'Leaderboards' },
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('@/pages/ProfilePage.vue'),
        meta: { title: 'Profile' },
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('@/pages/SettingsPage.vue'),
        meta: { title: 'Settings' },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
