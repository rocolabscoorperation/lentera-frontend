<script setup lang="ts">
import { useId } from 'vue'

interface SelectOption {
  value: string
  label: string
}

interface Props {
  label: string
  modelValue?: string
  options: SelectOption[]
  placeholder?: string
  error?: string | null
  hint?: string
  required?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const id = useId()
</script>

<template>
  <div class="form-field">
    <label :for="id" class="form-label">
      {{ props.label }}
      <span v-if="props.required" class="form-required" aria-hidden="true">*</span>
    </label>
    <select
      :id="id"
      :value="props.modelValue"
      :required="props.required"
      :disabled="props.disabled"
      class="form-select"
      :class="{ 'form-select--error': props.error }"
      :aria-describedby="props.error ? `${id}-error` : undefined"
      :aria-invalid="!!props.error"
      @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option v-if="props.placeholder" value="" disabled :selected="!props.modelValue">
        {{ props.placeholder }}
      </option>
      <option
        v-for="opt in props.options"
        :key="opt.value"
        :value="opt.value"
      >
        {{ opt.label }}
      </option>
    </select>
    <p v-if="props.hint && !props.error" class="form-hint">{{ props.hint }}</p>
    <p v-if="props.error" :id="`${id}-error`" class="form-error" role="alert">
      {{ props.error }}
    </p>
  </div>
</template>

<style scoped>
.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.form-label {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-text-2);
}

.form-required {
  color: var(--color-danger);
  margin-left: 2px;
}

.form-select {
  width: 100%;
  padding: 0.6875rem 2rem 0.6875rem 0.875rem;
  font-family: inherit;
  font-size: 1rem;
  color: var(--color-text);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  outline: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  transition: border-color 0.15s, box-shadow 0.15s;
  min-height: 44px;
  cursor: pointer;
}

.form-select:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}

.form-select:disabled {
  background-color: var(--color-surface-2);
  color: var(--color-muted);
  cursor: not-allowed;
}

.form-select--error {
  border-color: var(--color-danger);
}

.form-hint { font-size: 0.875rem; color: var(--color-muted); margin: 0; }
.form-error { font-size: 0.875rem; color: var(--color-danger); margin: 0; }
</style>
