# CHANGELOG — BASYIR AGENCY vNext7.2

## Fokus
Global Dark Theme, Background Correction & High Readability Optimization.

## Temuan yang ditangani
1. Dashboard administrator masih menggunakan panel, kartu, toolbar, tabel, badge, dan state putih.
2. Kontrol audio persisten masih memakai summary, panel, dan catatan berwarna putih/cream.
3. Beberapa permukaan legacy seperti toast, feedback, mastery result, transcript Istima, dan panel eliminasi masih terang.
4. Sejumlah teks lama memakai abu-abu gelap, teal redup, atau amber gelap pada permukaan navy.

## Perubahan
- Menambahkan `src/styles-vnext72.css` sebagai stylesheet terakhir.
- Menyatukan token background, surface, border, text, accent, dan status.
- Menggelapkan permukaan admin dashboard, panel audio, toast, feedback, dan beberapa panel konten yang tertinggal.
- Memperbarui `auth.css`, `admin-dashboard.css`, dan `game-audio-controls.css` agar menggunakan dark navy dan teks terang.
- Meningkatkan warna teks sekunder/muted serta placeholder.
- Mengubah selector teks legacy yang memiliki luminansi rendah menjadi token teks atau aksen yang lebih terang.
- Menambahkan `scripts/audit-theme-vnext72.mjs` dan perintah `npm run audit:theme`.
- Memperbarui versi paket menjadi `7.2.0`.

## Kontras token yang diperiksa
Pasangan warna utama yang diuji berada pada rentang 5.58:1 hingga 17.37:1, memenuhi WCAG AA untuk teks normal pada pasangan yang diperiksa.

## Bagian yang dipertahankan
Tidak ada perubahan yang disengaja pada logika autentikasi Supabase, database, RLS, sinkronisasi progres, konten enam bab, bukti, alibi, scoring, nyawa, TTS, dan mekanisme permainan.

## Catatan
Audit warna dilakukan terhadap source CSS dan token. Pemeriksaan visual aktual tetap harus dilakukan melalui localhost pada browser pengguna.
