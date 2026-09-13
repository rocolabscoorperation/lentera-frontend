# LENTERA frontend

Frontend Vue 3, Vite, dan TypeScript untuk prototipe sistem pendukung keputusan jalur pendidikan. Perhitungan DSS, otorisasi data, rekomendasi sekolah, dan PDF berada di backend Go.

## Menjalankan

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Isi `VITE_API_BASE_URL` dengan URL API Go. Untuk mencoba alur UI tanpa backend, ubah `VITE_USE_MOCK=true` di `.env.local`. Mock hanya aktif dalam mode pengembangan.

- **Pengguna kembali:** masuk dengan `081234567890` / `Lentera123`. Akun fiktif Nadia Putri memiliki profil, dua anak, dan satu hasil terdahulu. Pilih salah satu anak untuk membuat hasil simulasi baru.
- **Pengguna baru:** daftar dengan nomor lain. Akun baru mulai tanpa profil, anak, atau hasil sehingga alur pengisian awal dapat dicoba.

Kelima pertanyaan adalah contoh observasi untuk latihan UI. Skor `72`, jalur `Sekolah Inklusi`, dan dua sekolah fiktif adalah **respons simulasi tetap dari mock API**, tidak dihitung dari jawaban dan bukan temuan penelitian. Data akun yang dibuat dan hasil baru hilang saat halaman dimuat ulang. PDF tetap memerlukan endpoint backend sebenarnya.

Periksa produksi dengan `npm run build` dan uji alur mock dengan `npm run check:mock`. `vercel.json` mengarahkan URL SPA langsung, seperti `/results/:id`, ke `index.html`.

## Batas integrasi API

Endpoint di `src/services` dan tipe di `src/types` mengikuti rancangan API awal dalam PRD. Kontrak JSON Go yang final belum tersedia di repositori ini. Sebelum menghubungkan produksi, cocokkan bentuk respons autentikasi, profil, waktu cooldown (`cooldownUntil`), dan respons submit asesmen (`resultId`) dengan backend. Bila berbeda, sesuaikan service dan DTO terpusat; komponen tidak perlu mengenal model PostgreSQL.
