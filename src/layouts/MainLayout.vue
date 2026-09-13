<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const navItems = [
  { name: 'Beranda', to: '/', icon: 'home', exact: true },
  { name: 'Anak', to: '/children', icon: 'users' },
  { name: 'Asesmen', to: '/assessment', icon: 'clipboard' },
  { name: 'Riwayat', to: '/results', icon: 'history' },
  { name: 'Panduan', to: '/panduan', icon: 'book' },
]

const isActive = (to: string, exact = false) => {
  if (exact) return route.path === to
  return route.path.startsWith(to)
}

async function handleLogout() {
  await auth.logout()
  router.push('/login')
}

const userInitial = computed(() =>
  auth.user?.phoneNumber?.slice(0, 1).toUpperCase() ?? 'U',
)
</script>

<template>
  <div class="layout-main">
    <!-- Top navigation bar -->
    <header class="navbar">
      <div class="navbar-inner">
        <!-- Brand -->
        <RouterLink to="/" class="navbar-brand">
          <span class="navbar-brand-icon">💡</span>
          <span class="navbar-brand-text">LENTERA</span>
        </RouterLink>

        <!-- Desktop nav links -->
        <nav class="navbar-links" aria-label="Navigasi utama">
          <RouterLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="navbar-link"
            :class="{ 'navbar-link--active': isActive(item.to, item.exact) }"
          >
            {{ item.name }}
          </RouterLink>
        </nav>

        <!-- Right side -->
        <div class="navbar-right">
          <RouterLink to="/profile" class="navbar-avatar" aria-label="Profil saya">
            {{ userInitial }}
          </RouterLink>
          <button class="navbar-logout" @click="handleLogout" aria-label="Keluar">
            Keluar
          </button>
        </div>
      </div>
    </header>

    <!-- Page content -->
    <main class="main-content">
      <slot />
    </main>

    <!-- Mobile bottom navigation -->
    <nav class="bottom-nav" aria-label="Navigasi bawah">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="bottom-nav-item"
        :class="{ 'bottom-nav-item--active': isActive(item.to, item.exact) }"
        :aria-current="isActive(item.to, item.exact) ? 'page' : undefined"
      >
        <span class="bottom-nav-icon" aria-hidden="true">
          <component :is="'span'" class="icon-placeholder">
            <template v-if="item.icon === 'home'">🏠</template>
            <template v-else-if="item.icon === 'users'">👶</template>
            <template v-else-if="item.icon === 'clipboard'">📋</template>
            <template v-else-if="item.icon === 'history'">📊</template>
            <template v-else-if="item.icon === 'book'">📖</template>
          </template>
        </span>
        <span class="bottom-nav-label">{{ item.name }}</span>
      </RouterLink>
    </nav>
  </div>
</template>

<style scoped>
.layout-main {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  padding-bottom: var(--bottom-nav-height);
}

/* ── Top navbar ── */
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  height: var(--nav-height);
}

.navbar-inner {
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 1rem;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  flex-shrink: 0;
}

.navbar-brand-icon {
  font-size: 1.25rem;
}

.navbar-brand-text {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-primary);
  letter-spacing: -0.02em;
}

.navbar-links {
  display: none;
  gap: 0.25rem;
  flex: 1;
}

.navbar-link {
  padding: 0.375rem 0.75rem;
  border-radius: var(--radius-sm);
  font-size: 0.9375rem;
  color: var(--color-text-2);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.15s, background-color 0.15s;
}

.navbar-link:hover {
  color: var(--color-primary);
  background: var(--color-primary-light);
  text-decoration: none;
}

.navbar-link--active {
  color: var(--color-primary);
  background: var(--color-primary-light);
  font-weight: 600;
}

.navbar-right {
  display: none;
  align-items: center;
  gap: 0.75rem;
  margin-left: auto;
}

.navbar-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--color-primary);
  color: #fff;
  font-weight: 700;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  flex-shrink: 0;
}

.navbar-logout {
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 0.375rem 0.875rem;
  font-size: 0.875rem;
  color: var(--color-muted);
  cursor: pointer;
  transition: all 0.15s;
}

.navbar-logout:hover {
  border-color: var(--color-danger);
  color: var(--color-danger);
}

/* ── Main content ── */
.main-content {
  flex: 1;
  width: 100%;
}

/* ── Bottom nav (mobile only) ── */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
  height: var(--bottom-nav-height);
  display: flex;
  align-items: stretch;
}

.bottom-nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  text-decoration: none;
  color: var(--color-muted);
  transition: color 0.15s;
  padding: 0.25rem 0;
}

.bottom-nav-item--active {
  color: var(--color-primary);
}

.bottom-nav-icon {
  font-size: 1.25rem;
  line-height: 1;
}

.bottom-nav-label {
  font-size: 0.6875rem;
  font-weight: 500;
  line-height: 1;
}

/* ── Desktop breakpoint ── */
@media (min-width: 768px) {
  .layout-main {
    padding-bottom: 0;
  }

  .navbar-links {
    display: flex;
  }

  .navbar-right {
    display: flex;
  }

  .bottom-nav {
    display: none;
  }
}
</style>
