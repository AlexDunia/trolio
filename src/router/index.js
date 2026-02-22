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
  // Top-level profile route uses the DashboardLayout so sidebar/header remain consistent
  {
    path: '/profile',
    component: DashboardLayout,
    children: [
      {
        path: '',
        name: 'profile',
        component: () => import('@/pages/ProfileOverview.vue'),
        meta: {
          title: 'Profile',
          subtitle: 'Here you can add, remove, and edit properties on your profile',
        },
      },
    ],
  },
  {
    path: '/leaderboards',
    component: DashboardLayout,
    children: [
      {
        path: '',
        name: 'leaderboards',
        component: () => import('@/pages/LeaderboardsPage.vue'),
        meta: {
          title: 'Leaderboards',
          subtitle: 'Here you can add, remove, and edit properties on your profile',
        },
      },
    ],
  },
  {
    path: '/dashboard',
    component: DashboardLayout,
    children: [
      {
        path: '',
        name: 'dashboard',
        component: DashboardPage,
        meta: { title: 'Dashboard' },
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
        // redirect dashboard-scoped path to canonical top-level route
        redirect: '/leaderboards',
      },
      // removed dashboard-scoped leaderboards route — top-level /leaderboards added above
      // sidebar links expect /dashboard/profile — redirect to canonical /profile
      {
        path: 'profile',
        // keep unnamed to avoid duplicate route name with /profile
        redirect: '/profile',
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
