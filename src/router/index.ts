import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
  // ── Public routes ────────────────────────────────────────────────────────
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { layout: 'main' },
  },
  {
    path: '/panduan',
    name: 'panduan',
    component: () => import('@/views/GuideView.vue'),
    meta: { layout: 'main' },
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('@/views/ContactView.vue'),
    meta: { layout: 'main' },
  },

  // ── Guest-only routes (redirect to /profile if already authenticated) ────
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { layout: 'auth', requiresGuest: true },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/auth/RegisterView.vue'),
    meta: { layout: 'auth', requiresGuest: true },
  },

  // ── Authenticated routes ──────────────────────────────────────────────────
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/profile/ParentProfileView.vue'),
    meta: { layout: 'main', requiresAuth: true },
  },
  {
    path: '/children',
    name: 'children',
    component: () => import('@/views/profile/ChildrenView.vue'),
    meta: { layout: 'main', requiresAuth: true },
  },
  {
    path: '/assessment',
    name: 'assessment',
    component: () => import('@/views/assessment/AssessmentView.vue'),
    meta: { layout: 'main', requiresAuth: true },
  },
  {
    path: '/assessment/history',
    name: 'assessment-history',
    component: () => import('@/views/assessment/AssessmentHistoryView.vue'),
    meta: { layout: 'main', requiresAuth: true },
  },
  {
    path: '/assessment/:id',
    name: 'assessment-intro',
    component: () => import('@/views/assessment/AssessmentIntroView.vue'),
    meta: { layout: 'main', requiresAuth: true },
  },
  {
    path: '/results',
    name: 'results',
    component: () => import('@/views/result/ResultView.vue'),
    meta: { layout: 'main', requiresAuth: true },
  },
  {
    path: '/results/:id',
    name: 'result-detail',
    component: () => import('@/views/result/ResultDetailView.vue'),
    meta: { layout: 'main', requiresAuth: true },
  },
  {
    path: '/schools/:resultId',
    name: 'school-recommendations',
    component: () => import('@/views/schools/SchoolRecommendationView.vue'),
    meta: { layout: 'main', requiresAuth: true },
  },

  // ── 404 fallback ──────────────────────────────────────────────────────────
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { layout: 'main' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
})

// ── Navigation guard ─────────────────────────────────────────────────────────
router.beforeEach(async (to) => {
  const auth = useAuthStore()

  // Bootstrap auth state once per app session (avoid repeated /auth/me calls)
  if (!auth.isInitialized) {
    await auth.initialize()
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.requiresGuest && auth.isAuthenticated) {
    return { name: 'profile' }
  }
})

export default router
