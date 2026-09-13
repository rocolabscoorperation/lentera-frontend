<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
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

async function fetchHistory() {
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

onMounted(fetchHistory)
</script>

<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">Riwayat Asesmen</h1>
      <p class="page-subtitle">Lihat semua hasil asesmen yang telah dilakukan.</p>
    </div>

    <LoadingState v-if="isLoading" />
    <ErrorState v-else-if="error" :message="error" @retry="fetchHistory" />
    <EmptyState
      v-else-if="results.length === 0"
      title="Belum ada riwayat"
      message="Lakukan asesmen pertama Anda untuk melihat hasilnya di sini."
      cta-text="Mulai Asesmen"
      @action="router.push('/assessment')"
    />

    <div v-else class="history-list">
      <BaseCard
        v-for="result in results"
        :key="result.id"
        padding="md"
        class="history-card"
        @click="router.push(`/results/${result.id}`)"
        role="button"
        tabindex="0"
        @keydown.enter="router.push(`/results/${result.id}`)"
        @keydown.space.prevent="router.push(`/results/${result.id}`)"
      >
        <div class="history-card-row">
          <div class="history-meta">
            <p class="history-date">{{ formatDateTime(result.createdAt) }}</p>
            <div class="history-badges">
              <BaseBadge v-if="result.placement" variant="primary">
                {{ result.placement }}
              </BaseBadge>
              <BaseBadge v-if="result.classification" variant="default">
                {{ result.classification }}
              </BaseBadge>
            </div>
          </div>
          <div class="history-score" v-if="result.totalScore != null">
            <span class="history-score-label">Skor</span>
            <span class="history-score-value">{{ result.totalScore }}</span>
          </div>
        </div>
        <p class="history-link">Lihat detail →</p>
      </BaseCard>
    </div>
  </div>
</template>

<style scoped>
.page-container { max-width: 720px; margin: 0 auto; padding: 1.5rem 1rem 3rem; }
.page-header { margin-bottom: 1.5rem; }
.page-title { margin: 0 0 0.25rem; }
.page-subtitle { color: var(--color-muted); font-size: 0.9375rem; margin: 0; }

.history-list { display: flex; flex-direction: column; gap: 0.75rem; }
.history-card {
  cursor: pointer;
  transition: box-shadow 0.15s, border-color 0.15s;
}
.history-card:hover { border-color: var(--color-primary); box-shadow: var(--shadow-md); }

.history-card-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.history-meta { display: flex; flex-direction: column; gap: 0.5rem; flex: 1; }
.history-date { font-size: 0.875rem; color: var(--color-muted); margin: 0; }
.history-badges { display: flex; gap: 0.375rem; flex-wrap: wrap; }

.history-score { text-align: right; flex-shrink: 0; }
.history-score-label { display: block; font-size: 0.75rem; color: var(--color-muted); text-transform: uppercase; letter-spacing: 0.04em; }
.history-score-value { font-size: 1.5rem; font-weight: 800; color: var(--color-primary); }

.history-link { font-size: 0.875rem; color: var(--color-primary); font-weight: 600; margin: 0.75rem 0 0; }
</style>
