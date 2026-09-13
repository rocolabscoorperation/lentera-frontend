<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'
import { useAuthStore } from '@/stores/auth'
import type { ApiError } from '@/types/api'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const isDemo = import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === 'true'

const form = ref({ phoneNumber: '', password: '' })
const errors = ref({ phoneNumber: '', password: '' })
const submitError = ref<string | null>(null)

function validate(): boolean {
  errors.value = { phoneNumber: '', password: '' }
  let valid = true
  if (!form.value.phoneNumber.trim()) {
    errors.value.phoneNumber = 'Nomor telepon wajib diisi'
    valid = false
  }
  else if (!/^\+?[0-9]{8,15}$/.test(form.value.phoneNumber.trim())) {
    errors.value.phoneNumber = 'Masukkan nomor telepon yang valid'
    valid = false
  }
  if (!form.value.password) {
    errors.value.password = 'Kata sandi wajib diisi'
    valid = false
  }
  return valid
}

async function handleSubmit() {
  if (!validate()) return
  submitError.value = null
  try {
    await auth.login({ phoneNumber: form.value.phoneNumber.trim(), password: form.value.password })
    const requested = route.query.redirect
    const redirect = typeof requested === 'string' && requested.startsWith('/') && !requested.startsWith('//')
      ? requested : '/profile'
    router.push(redirect)
  } catch (e) {
    const error = e as ApiError
    submitError.value = error.status === 401
      ? 'Nomor telepon atau kata sandi tidak sesuai.'
      : error.message ?? 'Gagal masuk. Periksa kembali data Anda.'
  }
}
</script>

<template>
  <div>
    <h1 class="auth-heading">Masuk ke LENTERA</h1>
    <p class="auth-sub">Gunakan nomor telepon yang telah terdaftar.</p>

    <BaseAlert v-if="isDemo" variant="info" class="demo-hint">
      Akun simulasi: <strong>081234567890</strong> · Kata sandi: <strong>Lentera123</strong>
    </BaseAlert>

    <form @submit.prevent="handleSubmit" novalidate class="auth-form">
      <BaseAlert v-if="route.query.registered === '1'" variant="success">
        Pendaftaran berhasil. Silakan masuk menggunakan akun Anda.
      </BaseAlert>
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
        placeholder="Masukkan kata sandi"
        autocomplete="current-password"
        :error="errors.password"
        required
      />

      <BaseButton type="submit" variant="primary" full size="lg" :loading="auth.isLoading">
        Masuk
      </BaseButton>
    </form>

    <p class="auth-switch">
      Belum punya akun?
      <RouterLink to="/register">Daftar sekarang</RouterLink>
    </p>
  </div>
</template>

<style scoped>
.auth-heading { font-size: 1.375rem; font-weight: 700; margin: 0 0 0.375rem; color: var(--color-text); }
.auth-sub { font-size: 0.9375rem; color: var(--color-muted); margin: 0 0 1.5rem; }
.auth-form { display: flex; flex-direction: column; gap: 1.125rem; }
.demo-hint { margin-bottom: 1rem; }
.auth-switch { text-align: center; font-size: 0.9375rem; color: var(--color-muted); margin: 1.25rem 0 0; }
</style>
