<script setup lang="ts">
import type { AssessmentQuestion } from '@/types/assessment'

interface Props {
  question: AssessmentQuestion
  index: number
  total: number
}

defineProps<Props>()
</script>

<template>
  <div class="question-container">
    <div class="question-counter">
      Pertanyaan {{ index + 1 }} dari {{ total }}
    </div>
    <p
      v-if="question.category"
      class="question-category"
    >
      {{ question.category }}
    </p>
    <h2 class="question-text">
      {{ question.questionText ?? '—' }}
    </h2>
  </div>
</template>

<style scoped>
.question-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.question-counter {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.question-category {
  font-size: 0.875rem;
  color: var(--color-muted);
  margin: 0;
  font-style: italic;
}

.question-text {
  font-size: clamp(1.125rem, 4vw, 1.375rem);
  font-weight: 600;
  color: var(--color-text);
  line-height: 1.45;
  margin: 0;
}
</style>
