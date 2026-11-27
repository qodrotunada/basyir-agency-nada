# TEST REPORT — BASYIR AGENCY vNext7.2

## Pemeriksaan statis
- [x] ZIP vNext7.1 berhasil dibuka dan 97 file source diekstrak.
- [x] Struktur Vite + React teridentifikasi.
- [x] Sisa permukaan putih pada admin dashboard dan kontrol audio ditemukan.
- [x] Sisa permukaan legacy di toast, feedback, mastery result, transcript, dan panel eliminasi diidentifikasi.
- [x] `styles-vnext72.css` ditambahkan sebagai stylesheet terakhir.
- [x] CSS vNext7.2 berhasil diparse oleh tinycss2 tanpa syntax error.
- [x] Audit tema otomatis `npm run audit:theme` — PASS.
- [x] Audit konten `npm run audit:content` — PASS: 6 chapter, 30 evidence objects, 18 suspects, 60 assessment questions, dan 69 vocabulary entries.
- [x] Token kontras utama diperiksa; seluruh pasangan yang diuji memenuhi WCAG AA.

## Pengujian otomatis yang dijalankan pada lingkungan pembuatan
- [x] `node scripts/audit-theme-vnext72.mjs` — PASS.
- [x] `node scripts/verify-project.mjs` — PASS.
- [ ] `npm run build` — belum dijalankan pada lingkungan pembuatan karena dependency `node_modules` tidak tersedia pada arsip yang diunggah.
- [ ] `npm test` — belum dijalankan pada lingkungan pembuatan karena dependency `node_modules` tidak tersedia pada arsip yang diunggah.

Installer PowerShell dengan opsi `-RunChecks` akan menjalankan build dan seluruh unit test di komputer Windows pengguna, menggunakan dependency lokal proyek yang sudah ada. Jangan menganggap build/unit test lulus sebelum hasil PowerShell menunjukkan keberhasilan.

## Pengujian browser manual — wajib sebelum deployment
- [ ] Login dan registrasi.
- [ ] Landing page dan dashboard.
- [ ] Dashboard administrator.
- [ ] Pemilihan bab dan seluruh enam bab investigasi.
- [ ] Panel bukti, tersangka, dan hasil investigasi.
- [ ] Materi flipbook, kamus, dan latihan mufradat.
- [ ] TTS Bahasa Arab dan efek suara.
- [ ] Panel pengaturan audio.
- [ ] 1440×900, 1366×768, 768×1024, 390×844, dan 360×800.
- [ ] Periksa tidak ada panel putih terang yang tersisa.
- [ ] Periksa seluruh teks, placeholder, badge, dan tombol terbaca.

**Status:** source vNext7.2 dan audit statis siap untuk diterapkan dan diuji melalui localhost. Belum disetujui untuk deployment.
