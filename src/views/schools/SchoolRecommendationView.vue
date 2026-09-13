<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SchoolRecommendationCard from '@/components/result/SchoolRecommendationCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import LoadingState from '@/components/ui/LoadingState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import * as schoolsService from '@/services/schools'
import type { SchoolRecommendationDetail } from '@/types/school'
import type { ApiError } from '@/types/api'

const route = useRoute()
const router = useRouter()

const resultId = computed(() => route.params.resultId as string)
const recommendations = ref<SchoolRecommendationDetail[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

async function fetchRecommendations() {
  isLoading.value = true
  error.value = null
  try {
    recommendations.value = await schoolsService.getSchoolRecommendations(resultId.value)
  } catch (e) {
    error.value = (e as ApiError).message
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchRecommendations)
</script>

<template>
  <div class="page-container">
    <button class="back-btn" type="button" @click="router.back()">
      ← Kembali ke Hasil
    </button>

    <div class="page-header">
      <h1 class="page-title">Rekomendasi Sekolah</h1>
      <p class="page-subtitle">
        Daftar sekolah yang direkomendasikan berdasarkan hasil asesmen Anda.
      </p>
    </div>

    <div class="disclaimer">
      <p>
        Rekomendasi ini dihasilkan oleh sistem berdasarkan data yang tersedia.
        Untuk pertimbangan lebih lanjut, disarankan berkonsultasi dengan pihak sekolah secara langsung.
      </p>
    </div>

    <LoadingState v-if="isLoading" message="Memuat rekomendasi sekolah..." />
    <ErrorState v-else-if="error" :message="error" @retry="fetchRecommendations" />
    <EmptyState
      v-else-if="recommendations.length === 0"
      title="Belum ada rekomendasi"
      message="Rekomendasi sekolah belum tersedia untuk hasil asesmen ini."
    />

    <div v-else class="schools-list">
      <SchoolRecommendationCard
        v-for="rec in recommendations"
        :key="rec.id"
        :recommendation="rec"
      />
    </div>

    <div class="bottom-actions">
      <BaseButton variant="ghost" @click="router.push('/results')">
        Kembali ke Riwayat
      </BaseButton>
      <BaseButton variant="primary" @click="router.push('/assessment')">
        Mulai Asesmen Baru
      </BaseButton>
    </div>
  </div>
</template>

<style scoped>
.page-container { max-width: 720px; margin: 0 auto; padding: 1.5rem 1rem 3rem; display: flex; flex-direction: column; gap: 1.5rem; }

.back-btn {
  background: none;
  border: none;
  font-size: 0.9375rem;
  color: var(--color-primary);
  cursor: pointer;
  font-family: inherit;
  font-weight: 600;
  padding: 0;
  align-self: flex-start;
}

.page-header { display: flex; flex-direction: column; gap: 0.25rem; }
.page-title { margin: 0; }
.page-subtitle { color: var(--color-muted); font-size: 0.9375rem; margin: 0; }

.disclaimer {
  background: var(--color-surface-2);
  border-left: 3px solid var(--color-border-2);
  padding: 0.875rem 1rem;
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  font-size: 0.875rem;
  color: var(--color-muted);
  line-height: 1.6;
}
.disclaimer p { margin: 0; }

.schools-list { display: flex; flex-direction: column; gap: 0.75rem; }

.bottom-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  padding-top: 0.5rem;
  border-top: 1px solid var(--color-border);
}
</style>
