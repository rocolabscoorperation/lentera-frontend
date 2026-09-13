<script setup lang="ts">
interface Props {
  title?: string
  message?: string
  ctaText?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Data belum tersedia',
  message: 'Belum ada data yang dapat ditampilkan.',
})

const emit = defineEmits<{ action: [] }>()
</script>

<template>
  <div class="empty-state">
    <div class="empty-icon" aria-hidden="true">📭</div>
    <h3 class="empty-title">{{ props.title }}</h3>
    <p class="empty-message">{{ props.message }}</p>
    <slot name="action">
      <button
        v-if="props.ctaText"
        class="empty-cta"
        type="button"
        @click="emit('action')"
      >
        {{ props.ctaText }}
      </button>
    </slot>
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 3rem 1rem;
  text-align: center;
}

.empty-icon { font-size: 2.5rem; line-height: 1; }

.empty-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
}

.empty-message {
  font-size: 0.9375rem;
  color: var(--color-muted);
  margin: 0;
  max-width: 360px;
}

.empty-cta {
  margin-top: 0.5rem;
  background: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: var(--radius-md);
  padding: 0.625rem 1.25rem;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: background-color 0.15s;
}

.empty-cta:hover { background: var(--color-primary-hover); }
</style>
