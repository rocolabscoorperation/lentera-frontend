<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import LoadingState from '@/components/ui/LoadingState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import * as resultsService from '@/services/results'
import type { AssessmentResult } from '@/types/result'
import type { ApiError } from '@/types/api'
import { formatDateTime } from '@/utils/date'

const router = useRouter()

const results = ref<AssessmentResult[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

async function fetchResults() {
  isLoading.value = true
  error.value = null
  try {
    results.value = await resultsService.getResults()
  } catch (e) {
    error.value = (e as ApiError).message
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchResults)
</script>

<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">Hasil Asesmen</h1>
      <p class="page-subtitle">Riwayat hasil asesmen anak Anda.</p>
    </div>

    <LoadingState v-if="isLoading" />
    <ErrorState v-else-if="error" :message="error" @retry="fetchResults" />
    <EmptyState
      v-else-if="results.length === 0"
      title="Belum ada hasil"
      message="Lakukan asesmen pertama Anda untuk melihat hasilnya."
      cta-text="Mulai Asesmen"
      @action="router.push('/assessment')"
    />

    <div v-else class="results-list">
      <BaseCard
        v-for="result in results"
        :key="result.id"
        padding="md"
        class="result-card"
      >
        <div class="result-card-row">
          <div class="result-info">
            <p class="result-date">{{ formatDateTime(result.createdAt) }}</p>
            <div class="result-badges">
              <BaseBadge v-if="result.placement" variant="primary">
                {{ result.placement }}
              </BaseBadge>
              <BaseBadge v-if="result.classification" variant="default">
                {{ result.classification }}
              </BaseBadge>
            </div>
            <p v-if="result.totalScore != null" class="result-score">
              Skor: <strong>{{ result.totalScore }}</strong>
            </p>
          </div>
          <BaseButton
            variant="secondary"
            size="sm"
            @click="router.push(`/results/${result.id}`)"
          >
            Lihat Detail
          </BaseButton>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<style scoped>
.page-container { max-width: 720px; margin: 0 auto; padding: 1.5rem 1rem 3rem; }
.page-header { margin-bottom: 1.5rem; }
.page-title { margin: 0 0 0.25rem; }
.page-subtitle { color: var(--color-muted); font-size: 0.9375rem; margin: 0; }
.results-list { display: flex; flex-direction: column; gap: 0.75rem; }

.result-card-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.result-info { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; }
.result-date { font-size: 0.875rem; color: var(--color-muted); margin: 0; }
.result-badges { display: flex; gap: 0.375rem; flex-wrap: wrap; }
.result-score { font-size: 0.9375rem; color: var(--color-text-2); margin: 0; }
</style>
