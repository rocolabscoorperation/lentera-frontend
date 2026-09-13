<script setup lang="ts">
interface Props {
  value: number
  max?: number
  label?: string
  showText?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  max: 100,
  showText: true,
})

const percentage = () => Math.min(100, Math.max(0, (props.value / props.max) * 100))
</script>

<template>
  <div class="progress-wrapper">
    <div v-if="props.label || props.showText" class="progress-header">
      <span v-if="props.label" class="progress-label">{{ props.label }}</span>
      <span v-if="props.showText" class="progress-text">
        {{ props.value }} / {{ props.max }}
      </span>
    </div>
    <div
      class="progress-track"
      role="progressbar"
      :aria-valuenow="props.value"
      :aria-valuemin="0"
      :aria-valuemax="props.max"
      :aria-label="props.label"
    >
      <div
        class="progress-fill"
        :style="{ width: `${percentage()}%` }"
      />
    </div>
  </div>
</template>

<style scoped>
.progress-wrapper { display: flex; flex-direction: column; gap: 0.375rem; }

.progress-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.progress-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-2);
}

.progress-text {
  font-size: 0.8125rem;
  color: var(--color-muted);
}

.progress-track {
  height: 8px;
  background: var(--color-border);
  border-radius: 9999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: 9999px;
  transition: width 0.3s ease;
}
</style>
