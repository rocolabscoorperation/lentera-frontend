<script setup lang="ts">
import BaseCard from '@/components/ui/BaseCard.vue'
</script>

<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">Panduan Penggunaan LENTERA</h1>
      <p class="page-subtitle">Langkah menggunakan LENTERA dan cara membaca hasilnya.</p>
    </div>

    <div class="guide-content">
      <BaseCard padding="lg" class="guide-section">
        <h2>1. Apa itu LENTERA?</h2>
        <p>
          LENTERA adalah aplikasi Sistem Pendukung Keputusan (SPK) yang dirancang untuk membantu orang tua
          dan wali sebagai bahan pertimbangan jalur pendidikan anak antara Sekolah Luar Biasa dan Sekolah Inklusi.
        </p>
      </BaseCard>

      <BaseCard padding="lg" class="guide-section">
        <h2>2. Siapa yang dapat menggunakan?</h2>
        <p>Orang tua atau wali yang ingin memahami pilihan pendidikan anak dan berdiskusi lebih lanjut dengan pihak yang berwenang.</p>
      </BaseCard>

      <BaseCard padding="lg" class="guide-section">
        <h2>3. Persiapan dan proses asesmen</h2>
        <ul>
          <li>Buat akun, lengkapi profil, lalu tambahkan data anak.</li>
          <li>Pilih anak dan asesmen yang tersedia.</li>
          <li>Jawab setiap pertanyaan sesuai pengamatan Anda. Jawaban dapat ditinjau sebelum dikirim.</li>
        </ul>
      </BaseCard>

      <BaseCard padding="lg" class="guide-section">
        <h2>4. Cara menjawab skala 1–5</h2>
        <p>Pilih satu angka untuk setiap pertanyaan. Arti masing-masing angka harus mengikuti petunjuk pada asesmen resmi; angka tidak ditafsirkan sendiri oleh halaman ini.</p>
      </BaseCard>

      <BaseCard padding="lg" class="guide-section">
        <h2>5. Setelah jawaban dikirim</h2>
        <p>Jawaban diproses oleh backend. Jika hasil sudah tersedia, Anda dapat melihat jalur pendidikan, interpretasi, serta penjelasan yang diberikan sistem.</p>
      </BaseCard>

      <BaseCard padding="lg" class="guide-section">
        <h2>6. Memahami hasil DSS</h2>
        <p>Skor dan klasifikasi, bila tersedia, berasal dari perhitungan backend. Hasil adalah bahan pertimbangan, bukan keputusan yang harus diikuti tanpa diskusi lebih lanjut.</p>
      </BaseCard>

      <BaseCard padding="lg" class="guide-section">
        <h2>7. Rekomendasi sekolah</h2>
        <p>Daftar sekolah, urutan, dan alasan rekomendasi diberikan oleh backend bila tersedia. Hubungi sekolah untuk memeriksa layanan dan penerimaan terkini.</p>
      </BaseCard>

      <BaseCard padding="lg" class="guide-section">
        <h2>8. Batasan penggunaan</h2>
        <p><strong>LENTERA adalah prototipe sistem pendukung keputusan, bukan alat diagnosis.</strong> Hasil tidak menggantikan penilaian profesional atau keputusan keluarga dan sekolah.</p>
      </BaseCard>
    </div>
  </div>
</template>

<style scoped>
.page-container { max-width: 720px; margin: 0 auto; padding: 2rem 1rem 4rem; }
.page-header { margin-bottom: 2rem; text-align: center; }
.page-title { font-size: 1.75rem; font-weight: 800; color: var(--color-text); margin: 0 0 0.5rem; }
.page-subtitle { font-size: 1rem; color: var(--color-muted); margin: 0; }

.guide-content { display: flex; flex-direction: column; gap: 0.75rem; }

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
