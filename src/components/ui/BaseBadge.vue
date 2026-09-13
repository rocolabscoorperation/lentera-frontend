<script setup lang="ts">
interface Props {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
}

withDefaults(defineProps<Props>(), {
  variant: 'default',
})
</script>

<template>
  <span class="badge" :class="`badge--${variant}`">
    <slot />
  </span>
</template>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
}

.badge--default  { background: var(--color-surface-2); color: var(--color-text-2); }
.badge--primary  { background: var(--color-primary-light); color: var(--color-primary); }
.badge--success  { background: var(--color-success-bg); color: var(--color-success); }
.badge--warning  { background: var(--color-warning-bg); color: var(--color-warning); }
.badge--danger   { background: var(--color-danger-bg); color: var(--color-danger); }
.badge--info     { background: var(--color-info-bg); color: var(--color-info); }
</style>
