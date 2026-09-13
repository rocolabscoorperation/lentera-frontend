<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import ChildCard from '@/components/profile/ChildCard.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'
import LoadingState from '@/components/ui/LoadingState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { useChildrenStore } from '@/stores/children'
import { useAssessmentStore } from '@/stores/assessment'
import * as assessmentService from '@/services/assessments'
import type { AssessmentTemplate } from '@/types/assessment'
import type { Child } from '@/types/child'
import type { ApiError } from '@/types/api'

const router = useRouter()
const childrenStore = useChildrenStore()
const assessmentStore = useAssessmentStore()

const templates = ref<AssessmentTemplate[]>([])
const templatesLoading = ref(false)
const templatesError = ref<string | null>(null)
const error = ref<string | null>(null)

onMounted(async () => {
  childrenStore.fetchChildren()
  try {
    templatesLoading.value = true
    templates.value = await assessmentService.getAssessments()
  } catch (e) {
    templatesError.value = (e as ApiError).message
  } finally {
    templatesLoading.value = false
  }
})

function selectChild(child: Child) {
  assessmentStore.setSelectedChild(child)
  childrenStore.selectChild(child)
}

function startAssessment(templateId: string | number) {
  if (!assessmentStore.selectedChild) {
    error.value = 'Pilih anak terlebih dahulu.'
    return
  }
  router.push({ path: `/assessment/${templateId}`, query: { childId: String(assessmentStore.selectedChild.id) } })
}
</script>

<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">Mulai Asesmen</h1>
      <p class="page-subtitle">Pilih anak dan template asesmen untuk memulai.</p>
    </div>

    <!-- Step 1: Select child -->
    <section class="step-section">
      <h2 class="step-heading">1. Pilih Anak</h2>

      <LoadingState v-if="childrenStore.isLoading" message="Memuat data anak..." />
      <ErrorState
        v-else-if="childrenStore.error"
        :message="childrenStore.error.message"
        @retry="childrenStore.fetchChildren()"
      />
      <EmptyState
        v-else-if="childrenStore.children.length === 0"
        title="Belum ada data anak"
        message="Tambahkan profil anak terlebih dahulu."
        cta-text="Tambah Anak"
        @action="router.push('/children')"
      />
      <div v-else class="children-list">
        <ChildCard
          v-for="child in childrenStore.children"
          :key="child.id"
          :child="child"
          :selectable="true"
          :selected="assessmentStore.selectedChild?.id === child.id"
          @select="selectChild"
        />
      </div>
    </section>

    <!-- Step 2: Select template -->
    <section class="step-section" v-if="assessmentStore.selectedChild">
      <h2 class="step-heading">2. Pilih Asesmen</h2>

      <BaseAlert v-if="error" variant="danger" dismissible @dismiss="error = null">
        {{ error }}
      </BaseAlert>

      <LoadingState v-if="templatesLoading" message="Memuat template asesmen..." />
      <ErrorState
        v-else-if="templatesError"
        :message="templatesError"
        @retry="$router.go(0)"
      />
      <div v-else-if="templates.length === 0">
        <EmptyState title="Belum ada asesmen tersedia" message="Belum ada template asesmen yang aktif." />
      </div>
      <div v-else class="templates-list">
        <BaseCard
          v-for="t in templates"
          :key="t.id"
          padding="md"
          class="template-card"
        >
          <div class="template-header">
            <div>
              <h3 class="template-name">{{ t.name ?? 'Asesmen' }}</h3>
              <p v-if="t.description" class="template-desc">{{ t.description }}</p>
              <p v-if="t.version" class="template-version">Versi {{ t.version }}</p>
            </div>
            <BaseButton variant="primary" size="sm" @click="startAssessment(t.id)">
              Mulai →
            </BaseButton>
          </div>
        </BaseCard>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page-container { max-width: 720px; margin: 0 auto; padding: 1.5rem 1rem 3rem; }
.page-header { margin-bottom: 1.5rem; }
.page-title { margin: 0 0 0.25rem; }
.page-subtitle { color: var(--color-muted); font-size: 0.9375rem; margin: 0; }

.step-section { margin-bottom: 2rem; }
.step-heading {
  font-size: 1.0625rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
}

.children-list { display: flex; flex-direction: column; gap: 0.625rem; }
.templates-list { display: flex; flex-direction: column; gap: 0.75rem; }

.template-card { }
.template-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.template-name { font-size: 1.0625rem; font-weight: 700; color: var(--color-text); margin: 0 0 0.25rem; }
.template-desc { font-size: 0.9375rem; color: var(--color-muted); margin: 0 0 0.25rem; }
.template-version { font-size: 0.8125rem; color: var(--color-muted); margin: 0; }
</style>
