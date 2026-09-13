<script setup lang="ts">
import BaseBadge from '@/components/ui/BaseBadge.vue'
import type { SchoolRecommendationDetail } from '@/types/school'

interface Props {
  recommendation: SchoolRecommendationDetail
}

defineProps<Props>()
</script>

<template>
  <div class="school-card">
    <!-- Rank -->
    <div v-if="recommendation.rank != null" class="school-rank">
      #{{ recommendation.rank }}
    </div>

    <div class="school-body">
      <!-- Name & type -->
      <div class="school-header">
        <h3 class="school-name">{{ recommendation.school.name ?? '—' }}</h3>
        <BaseBadge
          v-if="recommendation.school.schoolType"
          variant="primary"
        >
          {{ recommendation.school.schoolType }}
        </BaseBadge>
      </div>

      <!-- Location -->
      <p v-if="recommendation.school.address || recommendation.school.city" class="school-location">
        <strong>Alamat:</strong>
        <span v-if="recommendation.school.address">{{ recommendation.school.address }}</span>
        <span v-if="recommendation.school.city">{{ recommendation.school.address ? ', ' : '' }}{{ recommendation.school.city }}</span>
      </p>

      <!-- Description -->
      <p v-if="recommendation.school.description" class="school-description">
        {{ recommendation.school.description }}
      </p>

      <!-- Reason from backend -->
      <div v-if="recommendation.reason" class="school-reason">
        <span class="school-reason-label">Alasan rekomendasi:</span>
        {{ recommendation.reason }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.school-card {
  display: flex;
  gap: 1rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 1.25rem;
  box-shadow: var(--shadow-sm);
  transition: box-shadow 0.15s;
}

.school-card:hover {
  box-shadow: var(--shadow-md);
}

.school-rank {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--color-primary);
  min-width: 2rem;
  text-align: center;
  flex-shrink: 0;
  padding-top: 2px;
}

.school-body { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; }

.school-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.school-name {
  font-size: 1.0625rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
  flex: 1;
}

.school-location {
  font-size: 0.875rem;
  color: var(--color-muted);
  margin: 0;
}

.school-description {
  font-size: 0.9375rem;
  color: var(--color-text-2);
  margin: 0;
  line-height: 1.55;
}

.school-reason {
  background: var(--color-surface-2);
  border-radius: var(--radius-sm);
  padding: 0.625rem 0.75rem;
  font-size: 0.875rem;
  color: var(--color-text-2);
  line-height: 1.5;
}

.school-reason-label {
  font-weight: 700;
  color: var(--color-text);
  display: block;
  margin-bottom: 0.25rem;
}
</style>
