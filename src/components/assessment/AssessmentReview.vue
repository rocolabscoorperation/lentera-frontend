<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import type { AssessmentQuestion, AssessmentAnswerInput } from '@/types/assessment'

interface Props {
  questions: AssessmentQuestion[]
  answers: Map<string, AssessmentAnswerInput>
  isSubmitting: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  goTo: [index: number]
  submit: []
}>()

const unanswered = () =>
  props.questions.filter((q) => !props.answers.has(String(q.id)))
</script>

<template>
  <div class="review-container">
    <h2 class="review-title">Ringkasan Jawaban</h2>
    <p class="review-subtitle">
      Periksa kembali jawaban Anda sebelum mengirim.
    </p>

    <!-- Unanswered warning -->
    <div v-if="unanswered().length > 0" class="review-warning">
      ⚠️ {{ unanswered().length }} pertanyaan belum dijawab. Anda dapat kembali untuk melengkapinya.
    </div>

    <div class="review-list">
      <BaseCard
        v-for="(q, idx) in props.questions"
        :key="q.id"
        padding="sm"
        class="review-item"
        :class="{ 'review-item--unanswered': !props.answers.has(String(q.id)) }"
      >
        <div class="review-item-header">
          <span class="review-item-num">{{ idx + 1 }}</span>
          <button class="review-item-edit" type="button" @click="emit('goTo', idx)">
            Edit
          </button>
        </div>
        <p class="review-item-question">{{ q.questionText }}</p>
        <p class="review-item-answer">
          <template v-if="props.answers.has(String(q.id))">
            Jawaban: <strong>{{ props.answers.get(String(q.id))?.answer }}</strong>
          </template>
          <template v-else>
            <span class="review-item-missing">Belum dijawab</span>
          </template>
        </p>
      </BaseCard>
    </div>

    <div class="review-actions">
      <BaseButton
        variant="primary"
        size="lg"
        full
        :loading="props.isSubmitting"
        :disabled="unanswered().length > 0"
        @click="emit('submit')"
      >
        Kirim Asesmen
      </BaseButton>
      <p v-if="unanswered().length > 0" class="review-disabled-hint">
        Lengkapi semua jawaban sebelum mengirim.
      </p>
    </div>
  </div>
</template>

<style scoped>
.review-container { display: flex; flex-direction: column; gap: 1.25rem; }

.review-title {
  font-size: 1.375rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
}

.review-subtitle {
  color: var(--color-muted);
  margin: 0;
  font-size: 0.9375rem;
}

.review-warning {
  background: var(--color-warning-bg);
  color: var(--color-warning);
  border: 1px solid #fde68a;
  border-radius: var(--radius-md);
  padding: 0.875rem 1rem;
  font-size: 0.9375rem;
}

.review-list { display: flex; flex-direction: column; gap: 0.625rem; }

.review-item { }
.review-item--unanswered { border-color: var(--color-warning) !important; }

.review-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.375rem;
}

.review-item-num {
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--color-primary);
  background: var(--color-primary-light);
  padding: 0.15rem 0.5rem;
  border-radius: 9999px;
}

.review-item-edit {
  background: none;
  border: none;
  font-size: 0.875rem;
  color: var(--color-primary);
  cursor: pointer;
  font-family: inherit;
  font-weight: 600;
  padding: 0;
}

.review-item-question {
  font-size: 0.9375rem;
  color: var(--color-text);
  margin: 0 0 0.25rem;
}

.review-item-answer {
  font-size: 0.875rem;
  color: var(--color-muted);
  margin: 0;
}

.review-item-missing { color: var(--color-warning); font-weight: 600; }

.review-actions { display: flex; flex-direction: column; gap: 0.5rem; }

.review-disabled-hint {
  text-align: center;
  font-size: 0.875rem;
  color: var(--color-muted);
  margin: 0;
}
</style>
