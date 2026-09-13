<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue'

interface Props {
  title?: string
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
})

const emit = defineEmits<{ close: [] }>()
const box = ref<HTMLElement | null>(null)
let previousFocus: HTMLElement | null = null

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => {
  previousFocus = document.activeElement as HTMLElement | null
  document.addEventListener('keydown', handleKeydown)
  document.body.style.overflow = 'hidden'
  nextTick(() => {
    const target = box.value?.querySelector<HTMLElement>('input, select, textarea')
      ?? box.value?.querySelector<HTMLElement>('button')
    target?.focus()
  })
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
  previousFocus?.focus()
})
</script>

<template>
  <Teleport to="body">
    <div
      class="modal-overlay"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="props.title ? 'modal-title' : undefined"
      @click.self="emit('close')"
    >
      <div ref="box" class="modal-box" :class="`modal-box--${props.size}`">
        <!-- Header -->
        <div v-if="props.title || $slots.header" class="modal-header">
          <slot name="header">
            <h2 id="modal-title" class="modal-title">{{ props.title }}</h2>
          </slot>
          <button class="modal-close" type="button" aria-label="Tutup" @click="emit('close')">
            ×
          </button>
        </div>

        <!-- Body -->
        <div class="modal-body">
          <slot />
        </div>

        <!-- Footer -->
        <div v-if="$slots.footer" class="modal-footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(15, 23, 42, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  animation: fadeIn 0.15s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.modal-box {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-height: 90dvh;
  overflow-y: auto;
}

.modal-box--sm { max-width: 360px; }
.modal-box--md { max-width: 520px; }
.modal-box--lg { max-width: 720px; }

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--color-border);
}

.modal-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  color: var(--color-muted);
  padding: 0.25rem;
  border-radius: var(--radius-sm);
  transition: color 0.15s, background-color 0.15s;
}

.modal-close:hover {
  color: var(--color-text);
  background: var(--color-surface-2);
}

.modal-body { padding: 1.5rem; }

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--color-border);
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}
</style>
