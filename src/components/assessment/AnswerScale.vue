<script setup lang="ts">
import { useId } from 'vue'
import type { EntityId } from '@/types/common'

interface Props {
  questionId: EntityId
  modelValue?: number | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const groupId = useId()

const scaleValues = [1, 2, 3, 4, 5]
</script>

<template>
  <fieldset class="answer-scale" :aria-labelledby="`assessment-question-${props.questionId}`">
    <legend class="visually-hidden">Pilih jawaban angka 1 sampai 5</legend>
    <div class="scale-options">
      <label
        v-for="val in scaleValues"
        :key="val"
        class="scale-option"
        :class="{ 'scale-option--selected': props.modelValue === val }"
      >
        <input
          type="radio"
          :name="`question-${groupId}`"
          :value="val"
          :checked="props.modelValue === val"
          class="scale-radio"
          @change="emit('update:modelValue', val)"
        />
        <span class="scale-value">{{ val }}</span>
      </label>
    </div>
    <p class="scale-hint">Makna setiap angka mengikuti petunjuk asesmen yang diberikan penyelenggara.</p>
  </fieldset>
</template>

<style scoped>
.answer-scale {
  border: none;
  padding: 0;
  margin: 0;
}

.scale-options {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.scale-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.scale-radio {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.scale-value {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 48px;
  border-radius: var(--radius-md);
  border: 2px solid var(--color-border);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text-2);
  background: var(--color-surface);
  transition: all 0.15s;
  user-select: none;
}

.scale-option:hover .scale-value {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.scale-option--selected .scale-value {
  border-color: var(--color-primary);
  background: var(--color-primary);
  color: #fff;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
}

.scale-radio:focus-visible + .scale-value {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.scale-hint {
  font-size: 0.8125rem;
  color: var(--color-muted);
  text-align: center;
  margin: 0.75rem 0 0;
}

@media (min-width: 480px) {
  .scale-options { gap: 0.75rem; }
  .scale-value {
    width: 64px;
    height: 64px;
  }
}
</style>
