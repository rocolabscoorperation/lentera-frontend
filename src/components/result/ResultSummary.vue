<script setup lang="ts">
import BaseBadge from '@/components/ui/BaseBadge.vue'
import type { AssessmentResultDetail } from '@/types/result'

interface Props {
  result: AssessmentResultDetail
}

defineProps<Props>()
</script>

<template>
  <div class="result-summary">
    <!-- Placement — most prominent -->
    <div class="result-placement">
      <p class="result-placement-label">Rekomendasi Jalur Pendidikan</p>
      <div class="result-placement-value">
        {{ result.placement ?? 'Menunggu hasil...' }}
      </div>
    </div>

    <!-- Score row -->
    <div class="result-details">
      <div v-if="result.totalScore != null" class="result-detail-item">
        <span class="result-detail-label">Skor</span>
        <span class="result-detail-value">{{ result.totalScore }}</span>
      </div>

      <div v-if="result.classification" class="result-detail-item">
        <span class="result-detail-label">Klasifikasi</span>
        <BaseBadge variant="primary">{{ result.classification }}</BaseBadge>
      </div>
    </div>
  </div>
</template>

<style scoped>
.result-summary {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.result-placement {
  text-align: center;
  padding: 1.5rem;
  background: var(--color-primary-light);
  border-radius: var(--radius-lg);
  border: 2px solid var(--color-primary);
}

.result-placement-label {
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-primary);
  margin: 0 0 0.5rem;
}

.result-placement-value {
  font-size: 1.625rem;
  font-weight: 800;
  color: var(--color-text);
  line-height: 1.2;
}

.result-details {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.result-detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
  min-width: 120px;
  background: var(--color-surface-2);
  padding: 0.875rem 1rem;
  border-radius: var(--radius-md);
}

.result-detail-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.result-detail-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
}
</style>
