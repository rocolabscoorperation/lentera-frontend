<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'
import { useAuthStore } from '@/stores/auth'
import type { ApiError } from '@/types/api'

const router = useRouter()
const auth = useAuthStore()

const form = ref({ phoneNumber: '', password: '', confirmPassword: '' })
const errors = ref({ phoneNumber: '', password: '', confirmPassword: '' })
const submitError = ref<string | null>(null)

function validate(): boolean {
  errors.value = { phoneNumber: '', password: '', confirmPassword: '' }
  let valid = true

  if (!form.value.phoneNumber.trim()) {
    errors.value.phoneNumber = 'Nomor telepon wajib diisi'
    valid = false
  }
  else if (!/^\+?[0-9]{8,15}$/.test(form.value.phoneNumber.trim())) {
    errors.value.phoneNumber = 'Masukkan nomor telepon yang valid'
    valid = false
  }
  if (!form.value.password || form.value.password.length < 6) {
    errors.value.password = 'Kata sandi minimal 6 karakter'
    valid = false
  }
  if (form.value.password !== form.value.confirmPassword) {
    errors.value.confirmPassword = 'Konfirmasi kata sandi tidak sesuai'
    valid = false
  }

  return valid
}

async function handleSubmit() {
  if (!validate()) return
  submitError.value = null
  try {
    const authenticated = await auth.register({ phoneNumber: form.value.phoneNumber.trim(), password: form.value.password })
    router.push(authenticated ? '/profile' : '/login?registered=1')
  } catch (e) {
    const error = e as ApiError
    if (error.fieldErrors?.phoneNumber) errors.value.phoneNumber = error.fieldErrors.phoneNumber
    submitError.value = error.message ?? 'Gagal mendaftar. Silakan coba lagi.'
  }
}
</script>

<template>
  <div>
    <h1 class="auth-heading">Buat Akun LENTERA</h1>
    <p class="auth-sub">Daftar untuk memulai asesmen pendidikan anak Anda.</p>

    <form @submit.prevent="handleSubmit" novalidate class="auth-form">
      <BaseAlert v-if="submitError" variant="danger" dismissible @dismiss="submitError = null">
        {{ submitError }}
      </BaseAlert>

      <BaseInput
        v-model="form.phoneNumber"
        label="Nomor Telepon"
        type="tel"
        placeholder="Contoh: 08123456789"
        autocomplete="username"
        :error="errors.phoneNumber"
        required
      />

      <BaseInput
        v-model="form.password"
        label="Kata Sandi"
        type="password"
        placeholder="Minimal 6 karakter"
        autocomplete="new-password"
        :error="errors.password"
        required
      />

      <BaseInput
        v-model="form.confirmPassword"
        label="Konfirmasi Kata Sandi"
        type="password"
        placeholder="Ulangi kata sandi"
        autocomplete="new-password"
        :error="errors.confirmPassword"
        required
      />

      <BaseButton type="submit" variant="primary" full size="lg" :loading="auth.isLoading">
        Daftar
      </BaseButton>
    </form>

    <p class="auth-switch">
      Sudah punya akun?
      <RouterLink to="/login">Masuk sekarang</RouterLink>
    </p>
  </div>
</template>

<style scoped>
.auth-heading { font-size: 1.375rem; font-weight: 700; margin: 0 0 0.375rem; color: var(--color-text); }
.auth-sub { font-size: 0.9375rem; color: var(--color-muted); margin: 0 0 1.5rem; }
.auth-form { display: flex; flex-direction: column; gap: 1.125rem; }
.auth-switch { text-align: center; font-size: 0.9375rem; color: var(--color-muted); margin: 1.25rem 0 0; }
</style>
