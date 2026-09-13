<script setup lang="ts">
interface Props {
  message?: string
  retryText?: string
}

const props = withDefaults(defineProps<Props>(), {
  message: 'Terjadi kesalahan. Silakan coba lagi.',
  retryText: 'Coba Lagi',
})

const emit = defineEmits<{ retry: [] }>()
</script>

<template>
  <div class="error-state" role="alert">
    <div class="error-icon" aria-hidden="true">⚠️</div>
    <p class="error-message">{{ props.message }}</p>
    <button class="error-retry" type="button" @click="emit('retry')">
      {{ props.retryText }}
    </button>
  </div>
</template>

<style scoped>
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.875rem;
  padding: 3rem 1rem;
  text-align: center;
}

.error-icon { font-size: 2.5rem; line-height: 1; }

.error-message {
  font-size: 0.9375rem;
  color: var(--color-danger);
  margin: 0;
  max-width: 360px;
}

.error-retry {
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 0.5rem 1.25rem;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  color: var(--color-text-2);
  transition: all 0.15s;
}

.error-retry:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}
</style>
