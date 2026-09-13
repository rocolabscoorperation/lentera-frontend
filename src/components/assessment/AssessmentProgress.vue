<script setup lang="ts">
import ProgressBar from '@/components/ui/ProgressBar.vue'

interface Props {
  current: number
  total: number
}

const props = defineProps<Props>()
</script>

<template>
  <div class="assessment-progress">
    <ProgressBar
      :value="props.current"
      :max="props.total"
      label="Progres asesmen"
      :show-text="true"
    />
    <div class="progress-steps" aria-hidden="true">
      <div
        v-for="i in props.total"
        :key="i"
        class="progress-step"
        :class="{
          'progress-step--done':    i <  props.current,
          'progress-step--current': i === props.current,
        }"
      />
    </div>
  </div>
</template>

<style scoped>
.assessment-progress {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.progress-steps {
  display: flex;
  gap: 3px;
  flex-wrap: wrap;
}

.progress-step {
  height: 4px;
  flex: 1;
  min-width: 8px;
  border-radius: 9999px;
  background: var(--color-border);
  transition: background-color 0.2s;
}

.progress-step--done    { background: var(--color-primary); }
.progress-step--current { background: var(--color-primary); opacity: 0.5; }
</style>
