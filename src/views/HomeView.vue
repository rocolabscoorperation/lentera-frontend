<script setup lang="ts">
import { useRouter } from 'vue-router'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseCard from '@/components/ui/BaseCard.vue'

const router = useRouter()
</script>

<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">Kenali Kebutuhan, Temukan Arah.</h1>
        <p class="hero-desc">
          Sistem Pendukung Keputusan untuk membantu orang tua menentukan jalur pendidikan
          yang paling sesuai (Sekolah Inklusi atau SLB) bagi anak berkebutuhan khusus.
        </p>
        <div class="hero-actions">
          <BaseButton size="lg" variant="primary" @click="router.push('/register')">
            Mulai Sekarang
          </BaseButton>
          <BaseButton size="lg" variant="ghost" @click="router.push('/guide')">
            Pelajari Lebih Lanjut
          </BaseButton>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <h2 class="features-title">Mengapa Menggunakan LENTERA?</h2>
      <div class="features-grid">
        <BaseCard padding="lg" class="feature-card">
          <div class="feature-icon" aria-hidden="true">🎯</div>
          <h3 class="feature-heading">Asesmen Terarah</h3>
          <p class="feature-text">
            Kumpulan pertanyaan yang dirancang khusus untuk mengidentifikasi kebutuhan spesifik anak.
          </p>
        </BaseCard>

        <BaseCard padding="lg" class="feature-card">
          <div class="feature-icon" aria-hidden="true">📊</div>
          <h3 class="feature-heading">Hasil Objektif</h3>
          <p class="feature-text">
            Sistem menghitung kecenderungan berdasarkan bobot kriteria untuk memberikan rekomendasi yang akurat.
          </p>
        </BaseCard>

        <BaseCard padding="lg" class="feature-card">
          <div class="feature-icon" aria-hidden="true">🏫</div>
          <h3 class="feature-heading">Rekomendasi Sekolah</h3>
          <p class="feature-text">
            Temukan daftar Sekolah Luar Biasa (SLB) maupun Sekolah Inklusi yang terdekat dan sesuai dengan hasil asesmen.
          </p>
        </BaseCard>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home { display: flex; flex-direction: column; gap: 4rem; padding-bottom: 4rem; }

.hero {
  padding: 4rem 1rem;
  background: linear-gradient(135deg, var(--color-primary-light) 0%, #fff 100%);
  text-align: center;
  border-bottom: 1px solid var(--color-border);
}

.hero-content {
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.hero-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  color: var(--color-text);
  line-height: 1.2;
  margin: 0;
}

.hero-desc {
  font-size: 1.125rem;
  color: var(--color-text-2);
  line-height: 1.6;
  margin: 0;
  max-width: 600px;
}

.hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; }

.features { padding: 0 1rem; max-width: 1024px; margin: 0 auto; }
.features-title { text-align: center; font-size: 1.5rem; font-weight: 700; margin: 0 0 2rem; color: var(--color-text); }
.features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }

.feature-card { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1rem; }
.feature-icon { font-size: 3rem; line-height: 1; }
.feature-heading { font-size: 1.125rem; font-weight: 700; margin: 0; color: var(--color-text); }
.feature-text { font-size: 0.9375rem; color: var(--color-muted); line-height: 1.6; margin: 0; }
</style>
