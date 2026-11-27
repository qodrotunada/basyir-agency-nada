# Catatan Revisi Basyir Agency vNext.3

## Perubahan
1. Menambahkan menu **Materi Bab** dan komponen `src/components/LearningFlipbook.jsx`.
   - Enam bab mengikuti urutan dan data kurikulum di `src/data/campaign.js`.
   - Tiap bab berisi pengantar, jenis teks, kaidah, enam keterampilan/materi yang telah ada, kosakata, contoh kalimat, dan ringkasan.
   - Navigasi daftar isi, tombol halaman sebelumnya/berikutnya, nomor halaman, progres baca, animasi page-turn, dan layout responsif.
   - Flipbook tidak mengambil aktivitas/soal dari `learningPath.activities`.
2. Menambahkan `src/engine/arabicAssessment.js`.
   - Seluruh 60 prompt checkpoint dan pilihan jawaban diubah menjadi teks Arab.
   - Kunci jawaban tetap menggunakan indeks asli sehingga tidak mengubah perhitungan nilai.
   - Umpan balik jawaban menggunakan ungkapan Arab sederhana.
3. Redesain tahap pemilihan tersangka menjadi **Pilih tokoh yang sesuai dengan konteks**.
   - Menampilkan kembali bukti yang benar-benar dikumpulkan dan kalimat Arab hasil puzzle.
   - Setiap tokoh menampilkan pernyataan Arab kontekstual sesuai bab dan terjemahannya.
   - Pilihan tokoh diperiksa berdasarkan rangkaian bukti yang telah diperoleh.
4. Memperbaiki tombol mulai kampanye yang sebelumnya menunjuk ID episode yang tidak tersedia; kini membuka `ch01-shopping`.

## Catatan sumber
Tautan FlipHTML5 berhasil diidentifikasi sebagai *Bahasa Arab Kelas XI MA*, tetapi konten halaman tidak tersedia untuk ekstraksi penuh pada sesi revisi ini. Karena itu, flipbook dirakit dari ringkasan kurikulum, materi, kosakata, contoh, dan referensi halaman yang sudah tertanam di kode proyek. Nomor halaman dan redaksi final perlu dicocokkan dengan buku asli/guru sebelum dipakai sebagai materi resmi.

## Pengujian
- Pemeriksaan sintaks JSX/JS menggunakan parser Sucrase: lolos untuk `App.jsx`, `LearningFlipbook.jsx`, dan `arabicAssessment.js`.
- Audit otomatis 60 soal: seluruh prompt, pilihan jawaban, dan umpan balik memiliki karakter Arab; tidak ditemukan fallback generik atau baris non-Arab.
- Build dan rangkaian Vitest belum dapat dijalankan di lingkungan ini karena arsip `node_modules` berasal dari Windows (`@esbuild/win32-x64`) sedangkan runtime pemeriksaan Linux membutuhkan binary Linux. Jalankan `npm install` di Windows pada folder proyek, kemudian `npm test` dan `npm run build`.
