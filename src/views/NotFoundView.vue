<script setup lang="ts">
import { useRouter } from 'vue-router'
import BaseButton from '@/components/ui/BaseButton.vue'

const router = useRouter()
</script>

<template>
  <div class="not-found">
    <h1 class="nf-title">404</h1>
    <h2 class="nf-subtitle">Halaman Tidak Ditemukan</h2>
    <p class="nf-desc">Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.</p>
    <BaseButton variant="primary" size="lg" @click="router.push('/')">
      Kembali ke Beranda
    </BaseButton>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 60vh;
  padding: 2rem 1rem;
}

.nf-title { font-size: 6rem; font-weight: 900; color: var(--color-primary); margin: 0; line-height: 1; }
.nf-subtitle { font-size: 1.5rem; font-weight: 700; color: var(--color-text); margin: 1rem 0 0.5rem; }
.nf-desc { font-size: 1rem; color: var(--color-muted); margin: 0 0 2rem; max-width: 400px; }
</style>
