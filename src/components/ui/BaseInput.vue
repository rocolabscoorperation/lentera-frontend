<script setup lang="ts">
import { useId } from 'vue'

interface Props {
  label: string
  modelValue?: string
  type?: string
  placeholder?: string
  error?: string | null
  hint?: string
  required?: boolean
  disabled?: boolean
  autocomplete?: string
  max?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
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
    <input
      :id="id"
      :type="props.type"
      :value="props.modelValue"
      :placeholder="props.placeholder"
      :required="props.required"
      :disabled="props.disabled"
      :autocomplete="props.autocomplete"
      :max="props.max"
      class="form-input"
      :class="{ 'form-input--error': props.error }"
      :aria-describedby="props.error ? `${id}-error` : props.hint ? `${id}-hint` : undefined"
      :aria-invalid="!!props.error"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <p v-if="props.hint && !props.error" :id="`${id}-hint`" class="form-hint">
      {{ props.hint }}
    </p>
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

.form-input {
  width: 100%;
  padding: 0.6875rem 0.875rem;
  font-family: inherit;
  font-size: 1rem;
  color: var(--color-text);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  min-height: 44px;
}

.form-input::placeholder {
  color: var(--color-muted);
}

.form-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}

.form-input:disabled {
  background: var(--color-surface-2);
  color: var(--color-muted);
  cursor: not-allowed;
}

.form-input--error {
  border-color: var(--color-danger);
}

.form-input--error:focus {
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.12);
}

.form-hint {
  font-size: 0.875rem;
  color: var(--color-muted);
  margin: 0;
}

.form-error {
  font-size: 0.875rem;
  color: var(--color-danger);
  margin: 0;
}
</style>
