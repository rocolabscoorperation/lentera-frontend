<script setup lang="ts">
import BaseCard from '@/components/ui/BaseCard.vue'
</script>

<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">Panduan Penggunaan LENTERA</h1>
      <p class="page-subtitle">Pahami cara kerja sistem untuk mendapatkan hasil maksimal.</p>
    </div>

    <div class="guide-content">
      <BaseCard padding="lg" class="guide-section">
        <h2>1. Apa itu LENTERA?</h2>
        <p>
          LENTERA adalah aplikasi Sistem Pendukung Keputusan (SPK) yang dirancang untuk membantu orang tua
          dan wali dalam menentukan jalur pendidikan yang paling sesuai (Sekolah Luar Biasa atau Sekolah Inklusi)
          bagi anak berkebutuhan khusus.
        </p>
      </BaseCard>

      <BaseCard padding="lg" class="guide-section">
        <h2>2. Persiapan Asesmen</h2>
        <ul>
          <li>Pastikan Anda telah <strong>mendaftarkan akun</strong> dan <strong>melengkapi profil</strong>.</li>
          <li>Tambahkan data anak Anda melalui menu <strong>Data Anak</strong>.</li>
          <li>Sediakan waktu sekitar 10-15 menit dalam kondisi tenang.</li>
        </ul>
      </BaseCard>

      <BaseCard padding="lg" class="guide-section">
        <h2>3. Proses Asesmen</h2>
        <p>
          Asesmen terdiri dari serangkaian pertanyaan mengenai kondisi, kebiasaan, dan respons anak Anda sehari-hari.
        </p>
        <ul>
          <li>Jawab setiap pertanyaan sejujur mungkin.</li>
          <li>Gunakan skala 1 (Tidak pernah) hingga 5 (Selalu).</li>
          <li>Anda dapat kembali ke pertanyaan sebelumnya jika ingin mengubah jawaban.</li>
        </ul>
      </BaseCard>

      <BaseCard padding="lg" class="guide-section">
        <h2>4. Memahami Hasil</h2>
        <p>Setelah selesai, sistem akan menampilkan rekomendasi jalur pendidikan beserta penjelasan ringkas.</p>
        <p>
          <strong>PENTING:</strong> Hasil dari sistem ini hanyalah sebuah panduan awal dan
          tidak dapat menggantikan asesmen atau diagnosis dari profesional (psikolog/dokter anak).
        </p>
      </BaseCard>
    </div>
  </div>
</template>

<style scoped>
.page-container { max-width: 720px; margin: 0 auto; padding: 2rem 1rem 4rem; }
.page-header { margin-bottom: 2rem; text-align: center; }
.page-title { font-size: 1.75rem; font-weight: 800; color: var(--color-text); margin: 0 0 0.5rem; }
.page-subtitle { font-size: 1rem; color: var(--color-muted); margin: 0; }

.guide-content { display: flex; flex-direction: column; gap: 1.5rem; }

.guide-section h2 {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-primary);
  margin: 0 0 1rem;
}

.guide-section p { font-size: 0.9375rem; color: var(--color-text-2); line-height: 1.6; margin: 0 0 0.75rem; }
.guide-section p:last-child { margin-bottom: 0; }

.guide-section ul { margin: 0; padding-left: 1.25rem; }
.guide-section li { font-size: 0.9375rem; color: var(--color-text-2); line-height: 1.6; margin-bottom: 0.375rem; }
.guide-section li:last-child { margin-bottom: 0; }
</style>
