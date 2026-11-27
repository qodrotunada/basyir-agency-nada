# TEST REPORT — BASYIR AGENCY vNext8.0

## Pemeriksaan sumber dan konten
- [x] Source baseline vNext7.2 diekstrak dan struktur React/Vite diperiksa.
- [x] Enam bab, 36 sublevel, 30 objek bukti, 18 pernyataan tersangka, 60 soal, dan 69 entri mufrodat dipertahankan.
- [x] ID episode, urutan opsi, kunci jawaban, struktur puzzle, dan aturan deduksi tetap lolos `audit:content`.
- [x] Materi akademik, teks Arab, harakat, contoh, dan enam materi Istima' tetap lolos validasi.
- [x] Aset maskot tawon detektif 3D ditambahkan sebagai PNG transparan.
- [x] Komponen GameLobby, Interactive Learning Room, Vocabulary Collection, dan PlayerProfile ditambahkan.
- [x] Sistem reward memakai event ID idempotent agar aktivitas yang sama tidak memberikan reward berulang.
- [x] Backup/import mencakup gamification state; backup lama tanpa field ini tetap dapat diimpor tanpa menghapus reward aktif.
- [x] Migrasi progres lama vNext7.2 ke reward ledger ditambahkan.
- [x] SQL tabel `player_gamification` menggunakan RLS per pengguna.
- [x] Cloud save menggabungkan ledger cloud dan lokal sebelum upsert; operasi ini belum atomik untuk dua perangkat yang menulis serentak.
- [x] Tidak ada library runtime baru yang ditambahkan.

## Hasil pengujian yang berhasil
- [x] `npm run audit:content` — PASS.
- [x] `npm run audit:theme` — PASS; stylesheet order, selector utama, reduced motion, aset maskot, dan enam pasangan kontras utama diperiksa.
- [x] Manual gamification checks — PASS; duplicate reward, daily check-in, streak, daily mission, merge, dan migrasi progres lama.
- [x] Pemeriksaan sintaks 43 file JavaScript/JSX menggunakan TypeScript transpiler — 0 syntax error.

## Pengujian yang belum dapat dijalankan
- [ ] `npm test` — belum berjalan karena `vitest` tidak tersedia.
- [ ] `npm run build` — belum berjalan karena `vite` tidak tersedia.
- [ ] `npm ci --ignore-scripts` — proses instalasi melewati batas waktu 240 detik; dependency belum terpasang lengkap. Node v22.16.0 juga menampilkan peringatan engine untuk beberapa dependency yang meminta versi lebih baru.
- [ ] Browser QA desktop, tablet, Android, dan iOS belum diverifikasi.
- [ ] Login/registrasi Supabase, sinkronisasi dua perangkat, dan audio TTS belum diuji langsung.

## Pengujian yang wajib dilakukan sebelum deployment
1. Gunakan Node.js yang memenuhi engine dependency pada `package-lock.json`, lalu jalankan `npm ci`.
2. Jalankan `npm run audit:content`, `npm run audit:theme`, `npm test`, dan `npm run build`.
3. Jalankan SQL `supabase/gamification_setup.sql` di Supabase SQL Editor untuk mengaktifkan cloud reward sync.
4. Uji guest mode, login, logout, migrasi progres lama, backup/import, reward harian, dan sinkronisasi dua perangkat.
5. Uji seluruh enam episode, seluruh materi, mufrodat, TTS, hasil permainan, dashboard admin, serta ukuran layar 1440×900, 1366×768, 768×1024, 390×844, dan 360×800.

**Catatan risiko:** Reward ledger terlindungi antar-akun melalui RLS, tetapi reward client-side tidak anti-cheat terhadap pemilik akun sendiri. Untuk penggunaan kompetitif, pindahkan perhitungan reward ke server.

**Status:** Source vNext8.0 dan audit konten/tema lulus. Build, Vitest, dan browser QA belum dapat dinyatakan lulus pada lingkungan ini. Jangan deploy sebelum seluruh pengujian yang belum dilakukan berhasil.

## Batas desain yang perlu diketahui
- Label kesulitan terpisah belum tersedia pada data baseline. Learning Room menampilkan tingkat akademik MA Kelas XI, bukan membuat tingkat kesulitan baru tanpa validasi pengajar.
- Ilustrasi kartu mufrodat mengambil scene kontekstual dari bab terkait. Ilustrasi unik per kata untuk 69 kosakata belum dibuat.
- Maskot menggunakan satu PNG transparan dengan animasi idle, glow, dan aura CSS. Gerakan sayap, kedipan mata, dan animasi kaca pembesar belum dipisahkan menjadi rig/layer animasi.
- Leaderboard tidak ditambahkan karena belum ada sumber peringkat lintas pengguna yang tervalidasi.
