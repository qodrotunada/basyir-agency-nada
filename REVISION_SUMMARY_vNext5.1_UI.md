# BASYIR AGENCY vNext.5.1 — UI Update

## Perubahan

### 1. Panel detail bukti investigasi
- Dialog detail bukti diubah menjadi tata letak dua kolom pada desktop: gambar objek di kiri dan kosakata, petunjuk objek, serta fakta investigatif di kanan.
- Petunjuk objek dan fakta utama kini tampil di area pertama yang terlihat setelah objek benar diklik; siswa tidak perlu menggulir melewati gambar besar untuk mulai membaca petunjuk.
- Pada tablet dan smartphone, panel berubah menjadi satu kolom dengan pratinjau gambar yang lebih pendek.
- Lokasi penemuan, waktu/urutan, kondisi, fakta investigatif, dan fungsi deduksinya tetap dipertahankan.
- Tombol Catat Temuan/Kembali ke TKP dan mekanisme progres bukti tidak diubah.

### 2. Kontrol zoom tampilan
- Ditambahkan kontrol tetap di kanan bawah: perkecil, indikator persentase, perbesar, dan reset.
- Rentang zoom aplikasi: 80%–125% dengan langkah 5%.
- Preferensi zoom disimpan di localStorage dan dipulihkan ketika aplikasi dibuka kembali.
- Zoom browser bawaan (Ctrl + +, Ctrl + -, Ctrl + 0) dan pinch zoom pada perangkat sentuh tetap diizinkan.
- Gerakan gulir halus dan transisi zoom singkat; preferensi `prefers-reduced-motion` tetap dihormati.

## File yang diubah
- `src/App.jsx`
- `src/styles.css`
- `index.html`

## Validasi
- `npm run audit:content`: PASS (6 bab, 30 bukti, 18 tersangka, 60 soal, 6 materi Istima', dan aset merek terdeteksi).
- Pemeriksaan sintaks JSX dengan TypeScript parser: PASS.
- `npm test` dan `npm run build` belum dijalankan ulang pada lingkungan pengemasan ini karena instalasi `node_modules` di lingkungan tersebut tidak lengkap. Jalankan keduanya pada komputer Windows setelah file diperbarui.

## Kompatibilitas
- ID bab, bukti, tersangka, soal, struktur progres, dan format penyimpanan tidak diubah.
- Tidak ada migrasi data yang diperlukan.
