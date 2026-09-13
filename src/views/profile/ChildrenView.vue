<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ChildCard from '@/components/profile/ChildCard.vue'
import ChildForm from '@/components/profile/ChildForm.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import LoadingState from '@/components/ui/LoadingState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { useChildrenStore } from '@/stores/children'
import type { Child, CreateChildRequest } from '@/types/child'
import type { ApiError } from '@/types/api'

const childrenStore = useChildrenStore()

const showModal = ref(false)
const editingChild = ref<Child | null>(null)
const formLoading = ref(false)
const formError = ref<string | null>(null)

onMounted(() => { childrenStore.fetchChildren() })

function openAdd() {
  editingChild.value = null
  formError.value = null
  showModal.value = true
}

function openEdit(child: Child) {
  editingChild.value = child
  formError.value = null
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingChild.value = null
  formError.value = null
}

async function handleSubmit(data: CreateChildRequest) {
  formLoading.value = true
  formError.value = null
  try {
    if (editingChild.value) {
      await childrenStore.updateChild(editingChild.value.id, data)
    } else {
      await childrenStore.createChild(data)
    }
    closeModal()
  } catch (e) {
    formError.value = (e as ApiError).message ?? 'Terjadi kesalahan. Silakan coba lagi.'
  } finally {
    formLoading.value = false
  }
}
</script>

<template>
  <div class="page-container">
    <div class="page-header">
      <div class="page-header-inner">
        <div>
          <h1 class="page-title">Data Anak</h1>
          <p class="page-subtitle">Kelola profil anak yang akan mengikuti asesmen.</p>
        </div>
        <BaseButton variant="primary" size="sm" @click="openAdd">
          + Tambah Anak
        </BaseButton>
      </div>
    </div>

    <LoadingState v-if="childrenStore.isLoading" />

    <ErrorState
      v-else-if="childrenStore.error"
      :message="childrenStore.error.message"
      @retry="childrenStore.fetchChildren()"
    />

    <EmptyState
      v-else-if="childrenStore.children.length === 0"
      title="Belum ada data anak"
      message="Tambahkan profil anak untuk memulai asesmen."
      cta-text="Tambah Anak"
      @action="openAdd"
    />

    <div v-else class="children-list">
      <ChildCard
        v-for="child in childrenStore.children"
        :key="child.id"
        :child="child"
        @edit="openEdit"
      />
    </div>

    <!-- Add / Edit Modal -->
    <BaseModal
      v-if="showModal"
      :title="editingChild ? 'Edit Data Anak' : 'Tambah Anak'"
      @close="closeModal"
    >
      <ChildForm
        :child="editingChild"
        :is-loading="formLoading"
        :error="formError"
        @submit="handleSubmit"
        @cancel="closeModal"
      />
    </BaseModal>
  </div>
</template>

<style scoped>
.page-container { max-width: 720px; margin: 0 auto; padding: 1.5rem 1rem 3rem; }
.page-header { margin-bottom: 1.5rem; }
.page-header-inner {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}
.page-title { margin: 0 0 0.25rem; }
.page-subtitle { color: var(--color-muted); font-size: 0.9375rem; margin: 0; }
.children-list { display: flex; flex-direction: column; gap: 0.75rem; }
</style>
