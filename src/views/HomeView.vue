<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
</script>

<template>
  <div class="home">
    <section class="hero">
      <div class="hero-inner">
        <div class="hero-copy">
          <h1>Kenali Kebutuhan,<br />Temukan Arah.</h1>
          <p>LENTERA membantu orang tua mempertimbangkan jalur pendidikan anak melalui asesmen dan rekomendasi sekolah yang diproses oleh sistem.</p>
          <div class="hero-actions">
            <RouterLink class="primary-link" :to="auth.isAuthenticated ? '/assessment' : '/register'">
              {{ auth.isAuthenticated ? 'Mulai asesmen' : 'Mulai menggunakan LENTERA' }}
            </RouterLink>
            <RouterLink class="text-link" to="/panduan">Pelajari cara kerja →</RouterLink>
          </div>
        </div>
        <div class="process" aria-label="Alur LENTERA">
          <div class="process-row"><span>01</span><strong>Isi asesmen</strong><p>Jawab pertanyaan untuk anak Anda.</p></div>
          <div class="process-row"><span>02</span><strong>Hasil diproses</strong><p>Backend menghitung hasil sesuai metode yang ditetapkan.</p></div>
          <div class="process-row"><span>03</span><strong>Tinjau rekomendasi</strong><p>Baca penjelasan hasil dan pilihan sekolah yang tersedia.</p></div>
        </div>
      </div>
    </section>

    <section class="about">
      <h2>Apa itu LENTERA?</h2>
      <p>LENTERA adalah prototipe sistem pendukung keputusan untuk membantu orang tua atau wali membandingkan pilihan Sekolah Luar Biasa dan Sekolah Inklusi. Hasilnya menjadi bahan diskusi lanjutan dengan pihak sekolah dan profesional yang relevan.</p>
      <p class="notice">LENTERA bukan alat diagnosis dan tidak menggantikan penilaian profesional.</p>
    </section>
  </div>
</template>

<style scoped>
.home { padding-bottom: 4rem; }
.hero { background: var(--color-surface); border-bottom: 1px solid var(--color-border); }
.hero-inner { max-width: 1120px; margin: 0 auto; padding: 4.5rem 1.25rem; display: grid; gap: 3rem; align-items: center; }
.hero-copy { max-width: 590px; }
h1 { font-size: clamp(2.25rem, 5vw, 3.75rem); letter-spacing: -0.045em; line-height: 1.08; margin: 0 0 1.5rem; }
.hero-copy p { font-size: 1.0625rem; color: var(--color-text-2); line-height: 1.7; max-width: 540px; margin-bottom: 2rem; }
.hero-actions { display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap; }
.primary-link { display: inline-flex; align-items: center; justify-content: center; min-height: 48px; padding: 0.7rem 1rem; color: #fff; background: var(--color-primary); border-radius: var(--radius-sm); font-weight: 650; text-decoration: none; }
.primary-link:hover { background: var(--color-primary-hover); text-decoration: none; }
.text-link { font-weight: 600; text-decoration: none; }
.process { border: 1px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-surface); }
.process-row { display: grid; grid-template-columns: 2.5rem 1fr; column-gap: 0.75rem; padding: 1.25rem; }
.process-row + .process-row { border-top: 1px solid var(--color-border); }
.process-row span { grid-row: span 2; color: var(--color-primary); font-weight: 700; }
.process-row strong { font-size: 1rem; }
.process-row p { color: var(--color-muted); font-size: 0.875rem; margin: 0.25rem 0 0; }
.about { max-width: 1120px; margin: 0 auto; padding: 3rem 1.25rem 0; }
.about h2 { margin: 0 0 1rem; }
.about p { max-width: 750px; color: var(--color-text-2); line-height: 1.7; }
.about .notice { border-left: 3px solid var(--color-primary); padding: 0.5rem 0 0.5rem 1rem; font-weight: 600; }
@media (min-width: 800px) { .hero-inner { grid-template-columns: 1.25fr 0.75fr; } }
</style>
