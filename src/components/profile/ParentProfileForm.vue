<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'
import type { ParentProfile, UpdateParentProfileRequest } from '@/types/parent'
import type { Gender } from '@/types/common'
import { todayInputDate, calculateAge } from '@/utils/date'

interface Props {
  profile?: ParentProfile | null
  phoneNumber?: string | null
  isLoading?: boolean
  error?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  profile: null,
  isLoading: false,
  error: null,
})

const emit = defineEmits<{
  submit: [data: UpdateParentProfileRequest]
}>()

const genderOptions = [
  { value: 'Laki-laki', label: 'Laki-laki' },
  { value: 'Perempuan', label: 'Perempuan' },
]

const form = ref({
  name: '',
  birthDate: '',
  gender: '' as Gender | '',
  address: '',
})

const errors = ref({ name: '', birthDate: '', gender: '' })

watch(
  () => props.profile,
  (p) => {
    if (p) {
      form.value.name = p.name ?? ''
      form.value.birthDate = p.birthDate?.slice(0, 10) ?? ''
      form.value.gender = (p.gender ?? '') as Gender | ''
      form.value.address = p.address ?? ''
    }
  },
  { immediate: true },
)

const derivedAge = () => {
  const a = calculateAge(form.value.birthDate)
  return a !== null ? `${a} tahun` : null
}

function validate(): boolean {
  errors.value = { name: '', birthDate: '', gender: '' }
  let valid = true

  if (!form.value.name.trim()) { errors.value.name = 'Nama wajib diisi'; valid = false }
  if (!form.value.birthDate)   { errors.value.birthDate = 'Tanggal lahir wajib diisi'; valid = false }
  if (!form.value.gender)      { errors.value.gender = 'Jenis kelamin wajib dipilih'; valid = false }

  return valid
}

function handleSubmit() {
  if (!validate()) return
  emit('submit', {
    name: form.value.name.trim(),
    birthDate: form.value.birthDate,
    gender: form.value.gender as Gender,
    address: form.value.address.trim() || undefined,
  })
}
</script>

<template>
  <form @submit.prevent="handleSubmit" novalidate>
    <div class="parent-form">
      <BaseAlert v-if="props.error" variant="danger">{{ props.error }}</BaseAlert>

      <!-- Phone number (read-only — from users table) -->
      <div class="form-field">
        <label class="form-label">Nomor Telepon <span class="form-badge">Akun</span></label>
        <p class="form-readonly">{{ props.phoneNumber ?? '—' }}</p>
        <p class="form-hint-text">Nomor telepon tidak dapat diubah dari halaman ini.</p>
      </div>

      <BaseInput
        v-model="form.name"
        label="Nama Lengkap"
        placeholder="Masukkan nama lengkap"
        :error="errors.name"
        required
      />

      <BaseInput
        v-model="form.birthDate"
        label="Tanggal Lahir"
        type="date"
        :max="todayInputDate()"
        :hint="derivedAge() ? `Usia saat ini: ${derivedAge()}` : undefined"
        :error="errors.birthDate"
        required
      />

      <BaseSelect
        v-model="form.gender"
        label="Jenis Kelamin"
        placeholder="Pilih jenis kelamin"
        :options="genderOptions"
        :error="errors.gender"
        required
      />

      <BaseInput
        v-model="form.address"
        label="Alamat"
        placeholder="Masukkan alamat (opsional)"
      />

      <div class="parent-form-actions">
        <BaseButton type="submit" variant="primary" full :loading="props.isLoading">
          Simpan Profil
        </BaseButton>
      </div>
    </div>
  </form>
</template>

<style scoped>
.parent-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.parent-form-actions {
  padding-top: 0.5rem;
}

.form-field { display: flex; flex-direction: column; gap: 0.375rem; }
.form-label {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-text-2);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-badge {
  font-size: 0.75rem;
  font-weight: 600;
  background: var(--color-surface-2);
  color: var(--color-muted);
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
}

.form-readonly {
  font-size: 1rem;
  color: var(--color-text);
  padding: 0.6875rem 0.875rem;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  margin: 0;
  min-height: 44px;
  display: flex;
  align-items: center;
}

.form-hint-text {
  font-size: 0.875rem;
  color: var(--color-muted);
  margin: 0;
}
</style>
