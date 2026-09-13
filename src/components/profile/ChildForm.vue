<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'
import type { Child, CreateChildRequest } from '@/types/child'
import type { Gender } from '@/types/common'
import { todayInputDate } from '@/utils/date'

interface Props {
  child?: Child | null
  isLoading?: boolean
  error?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  child: null,
  isLoading: false,
  error: null,
})

const emit = defineEmits<{
  submit: [data: CreateChildRequest]
  cancel: []
}>()

const genderOptions = [
  { value: 'Laki-laki', label: 'Laki-laki' },
  { value: 'Perempuan', label: 'Perempuan' },
]

const form = ref({
  name: '',
  birthDate: '',
  gender: '' as Gender | '',
})

const errors = ref({
  name: '',
  birthDate: '',
  gender: '',
})

// Populate form if editing
watch(
  () => props.child,
  (child) => {
    if (child) {
      form.value.name = child.name ?? ''
      form.value.birthDate = child.birthDate?.slice(0, 10) ?? ''
      form.value.gender = (child.gender ?? '') as Gender | ''
    } else {
      form.value = { name: '', birthDate: '', gender: '' }
    }
  },
  { immediate: true },
)

function validate(): boolean {
  errors.value = { name: '', birthDate: '', gender: '' }
  let valid = true

  if (!form.value.name.trim()) {
    errors.value.name = 'Nama anak wajib diisi'
    valid = false
  }
  if (!form.value.birthDate) {
    errors.value.birthDate = 'Tanggal lahir wajib diisi'
    valid = false
  }
  if (!form.value.gender) {
    errors.value.gender = 'Jenis kelamin wajib dipilih'
    valid = false
  }

  return valid
}

function handleSubmit() {
  if (!validate()) return
  emit('submit', {
    name: form.value.name.trim(),
    birthDate: form.value.birthDate,
    gender: form.value.gender as Gender,
  })
}
</script>

<template>
  <form @submit.prevent="handleSubmit" novalidate>
    <div class="child-form">
      <BaseAlert v-if="props.error" variant="danger">{{ props.error }}</BaseAlert>

      <BaseInput
        v-model="form.name"
        label="Nama Anak"
        placeholder="Masukkan nama lengkap"
        :error="errors.name"
        required
        autocomplete="off"
      />

      <BaseInput
        v-model="form.birthDate"
        label="Tanggal Lahir"
        type="date"
        :max="todayInputDate()"
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

      <div class="child-form-actions">
        <BaseButton type="button" variant="ghost" @click="emit('cancel')">
          Batal
        </BaseButton>
        <BaseButton type="submit" variant="primary" :loading="props.isLoading">
          {{ props.child ? 'Simpan Perubahan' : 'Tambah Anak' }}
        </BaseButton>
      </div>
    </div>
  </form>
</template>

<style scoped>
.child-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.child-form-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  padding-top: 0.5rem;
}
</style>
