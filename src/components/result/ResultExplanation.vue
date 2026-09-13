<script setup lang="ts">
import type { AssessmentResultDetail } from '@/types/result'

interface Props {
  result: AssessmentResultDetail
}

defineProps<Props>()
</script>

<template>
  <div class="result-explanation">
    <!-- Interpretation -->
    <section v-if="result.interpretation" class="explanation-section">
      <h3 class="explanation-heading">Interpretasi Hasil</h3>
      <p class="explanation-body">{{ result.interpretation }}</p>
    </section>

    <!-- Recommendation explanation (optional API field) -->
    <section v-if="result.recommendationExplanation" class="explanation-section">
      <h3 class="explanation-heading">Mengapa hasil ini muncul?</h3>
      <p class="explanation-intro">Berdasarkan jawaban yang diberikan:</p>
      <p class="explanation-body">{{ result.recommendationExplanation }}</p>
    </section>

    <!-- Research disclaimer -->
    <div class="explanation-disclaimer">
      <p>
        <strong>Catatan:</strong> LENTERA adalah prototipe sistem pendukung keputusan,
        bukan alat diagnosis. Hasil ini dimaksudkan sebagai pertimbangan awal dan
        tidak menggantikan penilaian profesional.
      </p>
    </div>
  </div>
</template>

<style scoped>
.result-explanation {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.explanation-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.explanation-heading {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
}

.explanation-intro {
  font-size: 0.9375rem;
  color: var(--color-muted);
  margin: 0;
  font-style: italic;
}

.explanation-body {
  font-size: 0.9375rem;
  color: var(--color-text-2);
  line-height: 1.65;
  margin: 0;
}

.explanation-disclaimer {
  background: var(--color-surface-2);
  border-left: 3px solid var(--color-border-2);
  padding: 0.875rem 1rem;
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  font-size: 0.875rem;
  color: var(--color-muted);
  line-height: 1.55;
}

.explanation-disclaimer p { margin: 0; }
</style>
