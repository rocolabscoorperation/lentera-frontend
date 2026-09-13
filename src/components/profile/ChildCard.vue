<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import { calculateAge, formatDate } from '@/utils/date'
import type { Child } from '@/types/child'

interface Props {
  child: Child
  selected?: boolean
  selectable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  selected: false,
  selectable: false,
})

const emit = defineEmits<{
  select: [child: Child]
  edit: [child: Child]
}>()

const age = () => {
  const a = calculateAge(props.child.birthDate)
  return a !== null ? `${a} tahun` : null
}
</script>

<template>
  <div
    class="child-card"
    :class="{
      'child-card--selected': props.selected,
      'child-card--selectable': props.selectable,
    }"
    @click="props.selectable ? emit('select', props.child) : undefined"
    :role="props.selectable ? 'button' : undefined"
    :tabindex="props.selectable ? 0 : undefined"
    @keydown.enter="props.selectable ? emit('select', props.child) : undefined"
    @keydown.space.prevent="props.selectable ? emit('select', props.child) : undefined"
  >
    <!-- Avatar -->
    <div class="child-avatar" aria-hidden="true">
      {{ child.name?.trim().charAt(0).toUpperCase() || 'A' }}
    </div>

    <div class="child-info">
      <div class="child-name-row">
        <span class="child-name">{{ child.name ?? '—' }}</span>
        <BaseBadge v-if="child.gender" variant="default">{{ child.gender }}</BaseBadge>
      </div>
      <div class="child-meta">
        <span v-if="child.birthDate">{{ formatDate(child.birthDate) }}</span>
        <span v-if="age()" class="child-age">({{ age() }})</span>
      </div>
    </div>

    <div v-if="!props.selectable" class="child-actions" @click.stop>
      <BaseButton variant="ghost" size="sm" @click="emit('edit', child)">
        Edit
      </BaseButton>
    </div>

    <!-- Selected indicator -->
    <div v-if="props.selected" class="child-selected-badge" aria-hidden="true">✓</div>
  </div>
</template>

<style scoped>
.child-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  position: relative;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.child-card--selectable {
  cursor: pointer;
}

.child-card--selectable:hover {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
}

.child-card--selected {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
  box-shadow: 0 0 0 2px var(--color-primary);
}

.child-avatar {
  font-size: 2rem;
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-surface-2);
  border-radius: 50%;
}

.child-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.child-name-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.child-name {
  font-weight: 700;
  font-size: 1rem;
  color: var(--color-text);
}

.child-meta {
  font-size: 0.875rem;
  color: var(--color-muted);
}

.child-age { margin-left: 0.25rem; }

.child-actions { flex-shrink: 0; }

.child-selected-badge {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 22px;
  height: 22px;
  background: var(--color-primary);
  color: #fff;
  border-radius: 50%;
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
