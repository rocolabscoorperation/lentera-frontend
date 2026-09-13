<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router'
import AssessmentQuestion from '@/components/assessment/AssessmentQuestion.vue'
import AnswerScale from '@/components/assessment/AnswerScale.vue'
import AssessmentProgress from '@/components/assessment/AssessmentProgress.vue'
import AssessmentNavigation from '@/components/assessment/AssessmentNavigation.vue'
import AssessmentReview from '@/components/assessment/AssessmentReview.vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'
import LoadingState from '@/components/ui/LoadingState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import { useAssessmentStore } from '@/stores/assessment'
import { getChild } from '@/services/children'
import { formatDateTime } from '@/utils/date'
import type { ApiError } from '@/types/api'

const route = useRoute()
const router = useRouter()
const assessmentStore = useAssessmentStore()

const assessmentId = computed(() => route.params.id as string)

// UI state
const phase = ref<'intro' | 'questions' | 'review' | 'submitting'>('intro')
const submitError = ref<string | null>(null)

onBeforeRouteLeave(() => {
  if ((phase.value === 'questions' || phase.value === 'review') && assessmentStore.answeredCount > 0) {
    return window.confirm('Jawaban yang belum dikirim akan hilang. Tinggalkan asesmen?')
  }
})

function warnBeforeUnload(event: BeforeUnloadEvent) {
  if ((phase.value === 'questions' || phase.value === 'review') && assessmentStore.answeredCount > 0) {
    event.preventDefault()
    event.returnValue = ''
  }
}
window.addEventListener('beforeunload', warnBeforeUnload)
onUnmounted(() => window.removeEventListener('beforeunload', warnBeforeUnload))

onMounted(async () => {
  try {
    const childId = route.query.childId
    if (typeof childId === 'string' && String(assessmentStore.selectedChild?.id) !== childId) {
      assessmentStore.setSelectedChild(await getChild(childId))
    }
    await assessmentStore.loadAssessment(assessmentId.value)
  } catch (e) {
    submitError.value = (e as ApiError).message ?? 'Gagal memuat data anak.'
  }
})

async function handleStart() {
  if (!assessmentStore.selectedChild) {
    router.push('/assessment')
    return
  }
  try {
    await assessmentStore.startAttempt(assessmentId.value)
    phase.value = 'questions'
  } catch (e) {
    // cooldown check
    const err = e as ApiError
    if (err.status === 429 && err.cooldownUntil) {
      assessmentStore.setCooldown(err.cooldownUntil)
    }
  }
}

const currentAnswer = computed(() =>
  assessmentStore.currentQuestion
    ? assessmentStore.getAnswer(assessmentStore.currentQuestion.id)
    : undefined,
)

function handleAnswer(val: number) {
  if (!assessmentStore.currentQuestion) return
  assessmentStore.setAnswer(assessmentStore.currentQuestion.id, val)
}

function handleNext() {
  if (assessmentStore.currentIndex === assessmentStore.totalQuestions - 1) {
    phase.value = 'review'
  } else {
    assessmentStore.navigateNext()
  }
}

function handleGoTo(idx: number) {
  assessmentStore.navigateTo(idx)
  phase.value = 'questions'
}

async function handleSubmit() {
  phase.value = 'submitting'
  submitError.value = null
  try {
    const response = await assessmentStore.submitAssessment()
    phase.value = 'submitting'
    router.replace(response.resultId != null ? `/results/${response.resultId}` : '/results')
  } catch (e) {
    submitError.value = (e as ApiError).message ?? 'Gagal mengirim asesmen.'
    phase.value = 'review'
  }
}
</script>

<template>
  <div class="page-container">
    <!-- Loading -->
    <LoadingState v-if="assessmentStore.isLoading" message="Memuat asesmen..." />

    <!-- Error -->
    <!-- Cooldown -->
    <div v-else-if="assessmentStore.isOnCooldown" class="cooldown-block">
      <h2 class="cooldown-title">Asesmen Belum Tersedia</h2>
      <p class="cooldown-desc">Anda belum dapat melakukan asesmen berikutnya.</p>
      <p v-if="assessmentStore.cooldownUntil" class="cooldown-date">
        Anda dapat mencoba kembali pada:<br />
        <strong>{{ formatDateTime(assessmentStore.cooldownUntil) }}</strong>
      </p>
    </div>

    <ErrorState
      v-else-if="assessmentStore.error && phase === 'intro'"
      :message="assessmentStore.error.message"
      @retry="assessmentStore.loadAssessment(assessmentId)"
    />

    <ErrorState v-else-if="submitError && !assessmentStore.template" :message="submitError" />

    <!-- Intro phase -->
    <div v-else-if="phase === 'intro' && assessmentStore.template" class="intro-block">
      <h1 class="intro-title">{{ assessmentStore.template.name }}</h1>
      <p v-if="assessmentStore.template.description" class="intro-desc">
        {{ assessmentStore.template.description }}
      </p>

      <div class="intro-child" v-if="assessmentStore.selectedChild">
        <p class="intro-child-label">Asesmen untuk:</p>
        <strong>{{ assessmentStore.selectedChild.name }}</strong>
      </div>
      <div v-else class="intro-no-child">
        <BaseAlert variant="warning">
          Pilih anak terlebih dahulu dari halaman asesmen.
        </BaseAlert>
      </div>

      <div class="intro-info">
        <p>Jawab setiap pertanyaan dengan jujur sesuai kondisi anak Anda.</p>
        <p>Gunakan skala <strong>1–5</strong> untuk setiap jawaban.</p>
        <p>Hasil asesmen diproses oleh sistem dan tidak menggantikan penilaian profesional.</p>
      </div>

      <BaseAlert v-if="submitError" variant="danger">{{ submitError }}</BaseAlert>

      <button
        type="button"
        class="intro-start-btn"
        :disabled="!assessmentStore.selectedChild || assessmentStore.questions.length === 0"
        @click="handleStart"
      >
        Mulai Asesmen
      </button>
    </div>

    <!-- Question phase -->
    <div v-else-if="phase === 'questions' && assessmentStore.currentQuestion" class="question-block">
      <AssessmentProgress
        :current="assessmentStore.currentIndex + 1"
        :total="assessmentStore.totalQuestions"
      />

      <AssessmentQuestion
        :question="assessmentStore.currentQuestion"
        :index="assessmentStore.currentIndex"
        :total="assessmentStore.totalQuestions"
      />

      <AnswerScale
        :question-id="assessmentStore.currentQuestion.id"
        :model-value="currentAnswer ?? null"
        @update:model-value="handleAnswer"
      />

      <AssessmentNavigation
        :can-prev="assessmentStore.currentIndex > 0"
        :can-next="true"
        :is-last="assessmentStore.currentIndex === assessmentStore.totalQuestions - 1"
        :has-answer="currentAnswer !== undefined"
        @prev="assessmentStore.navigatePrev()"
        @next="handleNext"
        @submit="phase = 'review'"
      />
    </div>

    <!-- Review phase -->
    <div v-else-if="phase === 'review'">
      <BaseAlert v-if="submitError" variant="danger" class="mb-alert">
        {{ submitError }}
      </BaseAlert>
      <AssessmentReview
        :questions="assessmentStore.questions"
        :answers="assessmentStore.answers"
        :is-submitting="assessmentStore.isSubmitting"
        @go-to="handleGoTo"
        @submit="handleSubmit"
      />
    </div>

    <!-- Submitting -->
    <div v-else-if="phase === 'submitting'">
      <LoadingState message="Sedang memproses hasil asesmen..." />
    </div>
  </div>
</template>

<style scoped>
.page-container { max-width: 680px; margin: 0 auto; padding: 1.5rem 1rem 3rem; display: flex; flex-direction: column; gap: 1.5rem; }

/* Cooldown */
.cooldown-block { text-align: center; padding: 3rem 1rem; display: flex; flex-direction: column; align-items: center; gap: 0.75rem; }
.cooldown-icon { font-size: 3rem; }
.cooldown-title { font-size: 1.375rem; font-weight: 700; color: var(--color-text); margin: 0; }
.cooldown-desc { color: var(--color-muted); font-size: 0.9375rem; margin: 0; }
.cooldown-date { font-size: 1rem; color: var(--color-text); margin: 0; }

/* Intro */
.intro-block { display: flex; flex-direction: column; gap: 1.25rem; align-items: flex-start; }
.intro-icon { font-size: 3rem; }
.intro-title { font-size: 1.5rem; font-weight: 800; color: var(--color-text); margin: 0; }
.intro-desc { font-size: 1rem; color: var(--color-text-2); margin: 0; line-height: 1.6; }
.intro-child { background: var(--color-surface-2); padding: 0.875rem 1rem; border-radius: var(--radius-md); font-size: 0.9375rem; }
.intro-child-label { font-size: 0.8125rem; color: var(--color-muted); margin: 0 0 0.25rem; }
.intro-no-child { width: 100%; }
.intro-info {
  background: var(--color-primary-light);
  border: 1px solid #bfdbfe;
  padding: 1rem;
  border-radius: var(--radius-md);
  font-size: 0.9375rem;
  color: var(--color-text-2);
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}
.intro-info p { margin: 0; }

.intro-start-btn {
  background: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: var(--radius-md);
  padding: 0.875rem 2rem;
  font-size: 1.0625rem;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  min-height: 52px;
  transition: background-color 0.15s;
  width: 100%;
}
.intro-start-btn:hover:not(:disabled) { background: var(--color-primary-hover); }
.intro-start-btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* Question block */
.question-block { display: flex; flex-direction: column; gap: 1.75rem; }

.mb-alert { margin-bottom: 1rem; }
</style>
