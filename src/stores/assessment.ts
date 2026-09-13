import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AssessmentTemplate, AssessmentQuestion, AssessmentAttempt, AssessmentAnswerInput } from '@/types/assessment'
import type { Child } from '@/types/child'
import type { EntityId } from '@/types/common'
import * as assessmentService from '@/services/assessments'
import type { ApiError } from '@/types/api'

export const useAssessmentStore = defineStore('assessment', () => {
  // ── State ──────────────────────────────────────────────────────────────────
  const selectedChild = ref<Child | null>(null)
  const template = ref<AssessmentTemplate | null>(null)
  const attempt = ref<AssessmentAttempt | null>(null)
  const questions = ref<AssessmentQuestion[]>([])
  const answers = ref<Map<string, AssessmentAnswerInput>>(new Map())
  const currentIndex = ref(0)
  const isSubmitting = ref(false)
  const isLoading = ref(false)
  const error = ref<ApiError | null>(null)
  /** ISO datetime string from backend indicating when next attempt is allowed */
  const cooldownUntil = ref<string | null>(null)

  // ── Getters ────────────────────────────────────────────────────────────────
  const currentQuestion = computed(() => questions.value[currentIndex.value] ?? null)
  const totalQuestions = computed(() => questions.value.length)
  const answeredCount = computed(() => answers.value.size)
  const progress = computed(() =>
    totalQuestions.value > 0
      ? Math.round((answeredCount.value / totalQuestions.value) * 100)
      : 0,
  )
  const allAnswered = computed(() =>
    questions.value.every((q) => answers.value.has(String(q.id))),
  )
  const isOnCooldown = computed(() => {
    if (!cooldownUntil.value) return false
    return new Date(cooldownUntil.value) > new Date()
  })

  // ── Actions ────────────────────────────────────────────────────────────────

  function setSelectedChild(child: Child): void {
    selectedChild.value = child
  }

  async function loadAssessment(assessmentId: EntityId): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const [templates, qs] = await Promise.all([
        assessmentService.getAssessments(),
        assessmentService.getAssessmentQuestions(assessmentId),
      ])
      template.value = templates.find((t) => String(t.id) === String(assessmentId)) ?? null
      // Sort by questionOrder as a safety measure (backend should already sort)
      questions.value = [...qs].sort((a, b) => (a.questionOrder ?? 0) - (b.questionOrder ?? 0))
    } catch (e) {
      error.value = e as ApiError
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function startAttempt(assessmentId: EntityId): Promise<AssessmentAttempt> {
    if (!selectedChild.value) throw new Error('Pilih anak terlebih dahulu')
    isLoading.value = true
    error.value = null
    try {
      const att = await assessmentService.startAttempt(assessmentId, selectedChild.value.id)
      attempt.value = att
      answers.value = new Map()
      currentIndex.value = 0
      return att
    } catch (e) {
      error.value = e as ApiError
      throw e
    } finally {
      isLoading.value = false
    }
  }

  function setAnswer(questionId: EntityId, answer: number): void {
    answers.value.set(String(questionId), { questionId, answer })
  }

  function getAnswer(questionId: EntityId): number | undefined {
    return answers.value.get(String(questionId))?.answer
  }

  function navigateTo(index: number): void {
    if (index >= 0 && index < questions.value.length) {
      currentIndex.value = index
    }
  }

  function navigateNext(): void {
    navigateTo(currentIndex.value + 1)
  }

  function navigatePrev(): void {
    navigateTo(currentIndex.value - 1)
  }

  async function submitAssessment(): Promise<void> {
    if (!attempt.value) throw new Error('Tidak ada asesmen aktif')
    isSubmitting.value = true
    error.value = null
    try {
      const answersArray = Array.from(answers.value.values())
      await assessmentService.submitAnswers(attempt.value.id, { answers: answersArray })
      await assessmentService.submitAttempt(attempt.value.id)
    } catch (e) {
      error.value = e as ApiError
      throw e
    } finally {
      isSubmitting.value = false
    }
  }

  function setCooldown(until: string): void {
    cooldownUntil.value = until
  }

  function reset(): void {
    selectedChild.value = null
    template.value = null
    attempt.value = null
    questions.value = []
    answers.value = new Map()
    currentIndex.value = 0
    isSubmitting.value = false
    isLoading.value = false
    error.value = null
    cooldownUntil.value = null
  }

  return {
    selectedChild,
    template,
    attempt,
    questions,
    answers,
    currentIndex,
    isSubmitting,
    isLoading,
    error,
    cooldownUntil,
    currentQuestion,
    totalQuestions,
    answeredCount,
    progress,
    allAnswered,
    isOnCooldown,
    setSelectedChild,
    loadAssessment,
    startAttempt,
    setAnswer,
    getAnswer,
    navigateTo,
    navigateNext,
    navigatePrev,
    submitAssessment,
    setCooldown,
    reset,
  }
})
