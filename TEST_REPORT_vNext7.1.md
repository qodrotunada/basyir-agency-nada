# TEST REPORT — BASYIR AGENCY vNext7.1

## Pemeriksaan statis
- [x] Arsip source vNext7 berhasil dibuka.
- [x] Struktur Vite + React teridentifikasi.
- [x] Penyebab clipping modal login ditemukan pada relasi portal/header/backdrop-filter.
- [x] Dialog investigasi di dalam ancestor ber-transform diidentifikasi.
- [x] File `.env.local` tidak dimasukkan ke paket revisi.
- [x] Perubahan source diarahkan pada UI/layout; logika Supabase dan permainan tidak ditargetkan.
- [x] Syntax JSX/JavaScript diperiksa menggunakan TypeScript transpile parser: `App.jsx`, `AuthControls.jsx`, `AuthControls.test.js`, dan `main.jsx` tanpa diagnostic syntax.
- [x] CSS `styles.css`, `styles-vnext71.css`, dan `auth.css` berhasil diparse oleh PostCSS.
- [x] Rasio kontras token utama diperiksa; pasangan teks utama 13.08:1, sekunder 8.03:1, muted 5.80:1, label amber 6.77:1, label teal 7.48:1, teks tombol utama 5.95:1, teks tombol login 5.30:1, placeholder 6.77:1, dan status success/warning/error di atas 6.9:1. Semua pasangan yang diuji memenuhi WCAG AA.
- [x] `npm run audit:content` — PASS: 6 chapter, 30 evidence objects, 18 suspects, 60 assessment questions, 69 vocabulary entries, dan aset brand terverifikasi.

## Pengujian otomatis
- [ ] `npm run build` — BLOCKED, bukan lulus. Perintah berhenti dengan `vite: not found`.
- [ ] `npm test` — BLOCKED, bukan lulus. Perintah berhenti dengan `vitest: not found`.
- [x] `npm run audit:content` — PASS.

`npm ci --ignore-scripts --no-audit --no-fund` pada lingkungan pembuatan tidak selesai dalam batas waktu 300 detik. Executable Vite dan Vitest tidak tersedia setelah instalasi terhenti. Karena itu build produksi dan unit test tidak dapat diklaim lulus. Script PowerShell menyediakan opsi `-RunChecks` untuk menjalankan build, unit test, dan audit konten pada komputer Windows pengguna yang memiliki dependency proyek terpasang.

## Pengujian browser manual — wajib sebelum deployment
- [ ] 1440×900
- [ ] 1366×768
- [ ] 768×1024
- [ ] 390×844
- [ ] 360×800
- [ ] Login dan registrasi
- [ ] Modal bukti/papan bukti/panduan
- [ ] Modal impor dan reset
- [ ] Enam bab investigasi
- [ ] TTS Bahasa Arab
- [ ] Lima latihan mufradat dan efek suara
- [ ] Skor, nyawa, progres, serta sinkronisasi

**Status:** paket revisi disiapkan untuk pengujian localhost. Belum disetujui untuk deployment.
