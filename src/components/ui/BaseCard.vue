<script setup lang="ts">
interface Props {
  padding?: 'sm' | 'md' | 'lg'
  border?: boolean
}

withDefaults(defineProps<Props>(), {
  padding: 'md',
  border: true,
})
</script>

<template>
  <div class="base-card" :class="[`base-card--${padding}`, { 'base-card--border': border }]">
    <slot />
  </div>
</template>

<style scoped>
.base-card {
  background: var(--color-surface);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.base-card--border {
  border: 1px solid var(--color-border);
}

.base-card--sm { padding: 1rem; }
.base-card--md { padding: 1.5rem; }
.base-card--lg { padding: 2rem; }
</style>
