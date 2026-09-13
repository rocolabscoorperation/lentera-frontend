<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  loading?: boolean
  disabled?: boolean
  full?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  loading: false,
  disabled: false,
  full: false,
})
</script>

<template>
  <button
    :type="props.type"
    class="base-btn"
    :class="[
      `base-btn--${props.variant}`,
      `base-btn--${props.size}`,
      { 'base-btn--full': props.full, 'base-btn--loading': props.loading },
    ]"
    :disabled="props.disabled || props.loading"
    :aria-busy="props.loading"
  >
    <span v-if="props.loading" class="btn-spinner" aria-hidden="true" />
    <slot />
  </button>
</template>

<style scoped>
.base-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: inherit;
  font-weight: 600;
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  cursor: pointer;
  transition: background-color 0.15s, color 0.15s, border-color 0.15s, opacity 0.15s;
  white-space: nowrap;
  line-height: 1;
}

.base-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

/* Sizes */
.base-btn--sm { padding: 0.5rem 1rem; font-size: 0.875rem; min-height: 36px; }
.base-btn--md { padding: 0.625rem 1.25rem; font-size: 1rem; min-height: 44px; }
.base-btn--lg { padding: 0.875rem 1.75rem; font-size: 1.0625rem; min-height: 52px; }

/* Variants */
.base-btn--primary {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
}
.base-btn--primary:hover:not(:disabled) {
  background: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
}

.base-btn--secondary {
  background: var(--color-surface);
  color: var(--color-primary);
  border-color: var(--color-primary);
}
.base-btn--secondary:hover:not(:disabled) {
  background: var(--color-primary-light);
}

.base-btn--ghost {
  background: transparent;
  color: var(--color-text-2);
  border-color: var(--color-border);
}
.base-btn--ghost:hover:not(:disabled) {
  background: var(--color-surface-2);
}

.base-btn--danger {
  background: var(--color-danger-bg);
  color: var(--color-danger);
  border-color: var(--color-danger);
}
.base-btn--danger:hover:not(:disabled) {
  background: var(--color-danger);
  color: #fff;
}

/* Full width */
.base-btn--full { width: 100%; }

/* Loading spinner */
.btn-spinner {
  width: 1em;
  height: 1em;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  flex-shrink: 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
