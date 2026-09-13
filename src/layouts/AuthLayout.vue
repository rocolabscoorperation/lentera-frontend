<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="auth-layout">
    <div class="auth-card">
      <!-- Brand -->
      <div class="auth-brand">
        <RouterLink to="/" class="auth-brand-link">
          <span class="auth-brand-icon">💡</span>
          <span class="auth-brand-name">LENTERA</span>
        </RouterLink>
        <p class="auth-brand-tagline">Kenali Kebutuhan, Temukan Arah.</p>
      </div>

      <!-- Card content -->
      <div class="auth-content">
        <slot />
      </div>
    </div>

    <!-- Subtle footer -->
    <footer class="auth-footer">
      <p>Prototipe Sistem Pendukung Keputusan · Penelitian Skripsi</p>
    </footer>
  </div>
</template>

<style scoped>
.auth-layout {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 1rem;
  background: var(--color-background);
}

.auth-card {
  width: 100%;
  max-width: 420px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.auth-brand {
  padding: 2rem 2rem 1.5rem;
  text-align: center;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-primary-light);
}

.auth-brand-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
}

.auth-brand-icon {
  font-size: 1.75rem;
}

.auth-brand-name {
  font-size: 1.625rem;
  font-weight: 800;
  color: var(--color-primary);
  letter-spacing: -0.03em;
}

.auth-brand-tagline {
  margin: 0.5rem 0 0;
  font-size: 0.875rem;
  color: var(--color-muted);
  font-style: italic;
}

.auth-content {
  padding: 2rem;
}

.auth-footer {
  margin-top: 1.5rem;
  text-align: center;
}

.auth-footer p {
  font-size: 0.8125rem;
  color: var(--color-muted);
  margin: 0;
}
</style>
