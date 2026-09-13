<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ResultSummary from '@/components/result/ResultSummary.vue'
import ResultExplanation from '@/components/result/ResultExplanation.vue'
import SchoolRecommendationCard from '@/components/result/SchoolRecommendationCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'
import LoadingState from '@/components/ui/LoadingState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import * as resultsService from '@/services/results'
import * as schoolsService from '@/services/schools'
import type { AssessmentResultDetail } from '@/types/result'
import type { SchoolRecommendationDetail } from '@/types/school'
import type { ApiError } from '@/types/api'
import { formatDateTime } from '@/utils/date'

const route = useRoute()
const router = useRouter()

const resultId = computed(() => route.params.id as string)
const result = ref<AssessmentResultDetail | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)
const isPdfDownloading = ref(false)
const pdfError = ref<string | null>(null)
const recommendations = ref<SchoolRecommendationDetail[]>([])
const recommendationError = ref<string | null>(null)
const recommendationsLoading = ref(false)

async function fetchRecommendations() {
  recommendationsLoading.value = true
  recommendationError.value = null
  try {
    recommendations.value = await schoolsService.getSchoolRecommendations(resultId.value)
  } catch (e) {
    recommendationError.value = (e as ApiError).message
  } finally {
    recommendationsLoading.value = false
  }
}

async function fetchResult() {
  isLoading.value = true
  error.value = null
  try {
    result.value = await resultsService.getResult(resultId.value)
    if (result.value.recommendedSchools) {
      recommendations.value = result.value.recommendedSchools
    } else {
      await fetchRecommendations()
    }
  } catch (e) {
    error.value = (e as ApiError).message
  } finally {
    isLoading.value = false
  }
}

async function downloadPdf() {
  isPdfDownloading.value = true
  pdfError.value = null
  try {
    const blob = await resultsService.downloadResultPdf(resultId.value)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `hasil-asesmen-${resultId.value}.pdf`
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  } catch {
    pdfError.value = 'Gagal mengunduh PDF. Silakan coba lagi.'
  } finally {
    isPdfDownloading.value = false
  }
}

onMounted(fetchResult)
</script>

<template>
  <div class="page-container">
    <!-- Back -->
    <button class="back-btn" type="button" @click="router.push('/results')">
      ← Kembali ke Riwayat
    </button>

    <div class="page-header">
      <h1 class="page-title">Detail Hasil Asesmen</h1>
      <p v-if="result" class="page-subtitle">{{ formatDateTime(result.createdAt) }}</p>
    </div>

    <LoadingState v-if="isLoading" />

    <ErrorState v-else-if="error" :message="error" @retry="fetchResult" />

    <template v-else-if="result">
      <!-- Summary -->
      <section class="result-section">
        <h2 class="section-title">Hasil Asesmen</h2>
        <ResultSummary :result="result" />
      </section>

      <!-- Explanation -->
      <section class="result-section">
        <h2 class="section-title">Penjelasan</h2>
        <ResultExplanation :result="result" />
      </section>

      <!-- School recommendations -->
      <section class="result-section">
        <h2 class="section-title">Rekomendasi Sekolah</h2>
        <LoadingState v-if="recommendationsLoading" message="Memuat rekomendasi sekolah..." />
        <ErrorState v-else-if="recommendationError" :message="recommendationError" @retry="fetchRecommendations" />
        <div v-else-if="recommendations.length > 0" class="schools-list">
          <SchoolRecommendationCard
            v-for="rec in recommendations"
            :key="rec.id"
            :recommendation="rec"
          />
        </div>
        <EmptyState
          v-else
          title="Rekomendasi sekolah belum tersedia"
          message="Belum ada rekomendasi sekolah untuk hasil asesmen ini."
        />
        <BaseButton
          variant="secondary"
          size="sm"
          @click="router.push(`/schools/${result.id}`)"
          class="mt-btn"
        >
          Lihat Semua Rekomendasi
        </BaseButton>
      </section>

      <!-- PDF download -->
      <section class="result-section">
        <BaseAlert v-if="pdfError" variant="danger" dismissible @dismiss="pdfError = null">
          {{ pdfError }}
        </BaseAlert>
        <BaseButton
          variant="ghost"
          :loading="isPdfDownloading"
          @click="downloadPdf"
        >
          Unduh Hasil sebagai PDF
        </BaseButton>
      </section>
    </template>
  </div>
</template>

<style scoped>
.page-container { max-width: 720px; margin: 0 auto; padding: 1.5rem 1rem 3rem; display: flex; flex-direction: column; gap: 0; }

.back-btn {
  background: none;
  border: none;
  font-size: 0.9375rem;
  color: var(--color-primary);
  cursor: pointer;
  font-family: inherit;
  font-weight: 600;
  padding: 0;
  margin-bottom: 1rem;
  align-self: flex-start;
}

.page-header { margin-bottom: 1.5rem; }
.page-title { margin: 0 0 0.25rem; }
.page-subtitle { color: var(--color-muted); font-size: 0.9375rem; margin: 0; }

.result-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--color-border);
}
.result-section:last-child { border-bottom: none; margin-bottom: 0; }

.section-title {
  font-size: 1.0625rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 1rem;
}

.schools-list { display: flex; flex-direction: column; gap: 0.75rem; }
.mt-btn { margin-top: 0.875rem; }
</style>
