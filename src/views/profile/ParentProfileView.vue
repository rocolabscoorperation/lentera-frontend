<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ParentProfileForm from '@/components/profile/ParentProfileForm.vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'
import LoadingState from '@/components/ui/LoadingState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import { useParentStore } from '@/stores/parent'
import { useAuthStore } from '@/stores/auth'
import type { UpdateParentProfileRequest } from '@/types/parent'
import type { ApiError } from '@/types/api'

const parentStore = useParentStore()
const authStore = useAuthStore()

const successMessage = ref<string | null>(null)
const formError = ref<string | null>(null)

onMounted(() => { parentStore.fetchProfile() })

async function handleSubmit(data: UpdateParentProfileRequest) {
  successMessage.value = null
  formError.value = null
  try {
    await parentStore.updateProfile(data)
    successMessage.value = 'Profil berhasil disimpan.'
  } catch (e) {
    formError.value = (e as ApiError).message ?? 'Gagal menyimpan profil.'
  }
}
</script>

<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">Profil Saya</h1>
      <p class="page-subtitle">Kelola informasi akun dan data pribadi Anda.</p>
    </div>

    <LoadingState v-if="parentStore.isLoading && !parentStore.profile" />

    <ErrorState
      v-else-if="parentStore.error && !parentStore.profile"
      :message="parentStore.error.message"
      @retry="parentStore.fetchProfile()"
    />

    <div v-else class="page-card">
      <BaseAlert v-if="successMessage" variant="success" dismissible @dismiss="successMessage = null">
        {{ successMessage }}
      </BaseAlert>

      <ParentProfileForm
        :profile="parentStore.profile"
        :phone-number="authStore.user?.phoneNumber"
        :is-loading="parentStore.isLoading"
        :error="formError"
        @submit="handleSubmit"
      />
    </div>
  </div>
</template>

<style scoped>
.page-container { max-width: 640px; margin: 0 auto; padding: 1.5rem 1rem 3rem; }
.page-header { margin-bottom: 1.5rem; }
.page-title { margin: 0 0 0.25rem; }
.page-subtitle { color: var(--color-muted); font-size: 0.9375rem; margin: 0; }
.page-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
</style>
