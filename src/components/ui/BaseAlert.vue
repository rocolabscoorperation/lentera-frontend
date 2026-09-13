<script setup lang="ts">
interface Props {
  variant?: 'info' | 'success' | 'warning' | 'danger'
  dismissible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'info',
  dismissible: false,
})

const emit = defineEmits<{ dismiss: [] }>()
</script>

<template>
  <div class="alert" :class="`alert--${props.variant}`" role="alert">
    <div class="alert-body">
      <slot />
    </div>
    <button
      v-if="props.dismissible"
      class="alert-dismiss"
      type="button"
      aria-label="Tutup"
      @click="emit('dismiss')"
    >
      ×
    </button>
  </div>
</template>

<style scoped>
.alert {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  font-size: 0.9375rem;
  line-height: 1.5;
}

.alert-body { flex: 1; }

.alert--info    { background: var(--color-info-bg);    color: var(--color-info);    border-color: #bae6fd; }
.alert--success { background: var(--color-success-bg); color: var(--color-success); border-color: #bbf7d0; }
.alert--warning { background: var(--color-warning-bg); color: var(--color-warning); border-color: #fde68a; }
.alert--danger  { background: var(--color-danger-bg);  color: var(--color-danger);  border-color: #fecaca; }

.alert-dismiss {
  background: none;
  border: none;
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;
  color: currentColor;
  opacity: 0.6;
  padding: 0;
  flex-shrink: 0;
}
.alert-dismiss:hover { opacity: 1; }
</style>
