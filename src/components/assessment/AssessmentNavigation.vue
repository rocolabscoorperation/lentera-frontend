<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'

interface Props {
  canPrev: boolean
  canNext: boolean
  isLast: boolean
  hasAnswer: boolean
  isSubmitting?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  prev: []
  next: []
  submit: []
}>()
</script>

<template>
  <div class="assessment-nav">
    <BaseButton
      variant="ghost"
      :disabled="!props.canPrev"
      @click="emit('prev')"
    >
      ← Kembali
    </BaseButton>

    <BaseButton
      v-if="!props.isLast"
      variant="primary"
      :disabled="!props.hasAnswer"
      @click="emit('next')"
    >
      Lanjut →
    </BaseButton>

    <BaseButton
      v-else
      variant="primary"
      :disabled="!props.hasAnswer"
      :loading="props.isSubmitting"
      @click="emit('submit')"
    >
      Lihat Ringkasan
    </BaseButton>
  </div>
</template>

<style scoped>
.assessment-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--color-border);
}
</style>
