# CHANGELOG — BASYIR AGENCY vNext7.1

## Fokus
UI Layout Correction, Responsive Optimization & Color Refinement.

## Perubahan utama

1. **Login dan registrasi**
   - Dialog autentikasi dipindahkan ke `document.body` menggunakan React portal.
   - Menghindari dialog fixed yang sebelumnya menjadi turunan elemen header dengan `backdrop-filter`.
   - Form, input, feedback, dan tombol disesuaikan untuk dark mode.
   - Dialog memiliki batas tinggi viewport dan scroll internal.

2. **Modal investigasi**
   - Modal bukti, papan bukti, dan panduan permainan dipindahkan ke portal.
   - Modal impor backup dan reset juga dipindahkan ke portal.
   - Ini mencegah elemen fixed terikat pada ancestor dengan transform/animation seperti `.page-enter`.

3. **Layout dan responsivitas**
   - Header dan action group dapat membungkus konten.
   - Elemen kartu dan dialog menggunakan `min-width: 0` serta pembatasan lebar.
   - Modal menggunakan max-height berbasis viewport dinamis dan safe-area padding.
   - Perbaikan aturan untuk layar pendek dan layar mobile.

4. **Refinement warna**
   - Aksen amber, teal, dan cyan diturunkan saturasi/kecerahannya.
   - Panel yang masih menggunakan permukaan putih/cream lama disesuaikan ke navy/slate.
   - Warna teks, placeholder, tombol, status, feedback, dan input disesuaikan dengan permukaan gelap.
   - Kontrol zoom dan audio diselaraskan dengan tema dark navy.

5. **Regresi**
   - Ditambahkan pengujian portal untuk dialog autentikasi.
   - Tidak ada perubahan pada mekanisme Supabase, database, RLS, skor, nyawa, konten investigasi, TTS, atau progres.

## Catatan
Build produksi, seluruh unit test, dan pengujian browser lintas ukuran layar harus dikonfirmasi pada komputer pengguna sebelum deployment.
