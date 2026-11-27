# Changelog — BASYIR AGENCY vNext7

## 1. Investigasi enam bab

- Setiap bab memiliki satu paragraf kronologi Bahasa Arab Fusha berharakat lengkap dan terjemahan Bahasa Indonesia.
- Kronologi diselaraskan dengan waktu, lokasi, kode akses, log, dan pernyataan tokoh yang sudah tercatat pada data kasus.
- Halaman pemilihan tersangka tidak lagi mengulang lima kartu fakta dan penjelasan puzzle.
- Halaman pemilihan menampilkan paragraf Arab, tombol TTS, tombol tampil/sembunyikan terjemahan, serta tiga kartu tersangka.
- Pernyataan/alibi dan informasi identitas akses tetap ditampilkan secara ringkas.

## 2. Bab 4 — الحج والعمرة

- Bukti Zahra diperluas dengan rekaman CCTV berkelanjutan dan log petugas ZH-05.
- Kronologi Zahra: area penyimpanan koper 13.10–14.20, lalu pos pemeriksaan keberangkatan 14.27–14.48.
- Rentang 14.27–14.48 mencakup peminjaman jurnal pada 14.35 dan ekspor salinan pada 14.42.
- ID bukti yang sudah digunakan tidak diganti agar tidak merusak referensi sesi tersimpan.
- Lima objek bukti per bab dan mekanisme skor tetap dipertahankan.

## 3. Visual

- Penerapan dark mode navy dengan aksen teal, cyan, slate, dan amber.
- Kartu investigasi, panel, modal, dan kartu tersangka disesuaikan agar terbaca dalam tema gelap.
- Penambahan ilustrasi vektor maskot detektif pada bagian investigasi.
- Layout responsif untuk desktop dan mobile.

## 4. Latihan lima mufradat

- Jawaban benar memanggil efek suara `correct.mp3`.
- Jawaban salah memanggil efek suara `wrong.mp3`.
- Skor, progres, antrean pengulangan, dan penyimpanan respons tidak diubah.

## 5. Perlindungan fitur

- Tidak ada perubahan database, tabel, RLS policy, atau autentikasi Supabase.
- Tidak ada perubahan engine skor, nyawa, progres, dan mekanisme penyimpanan.
- `.env.local`, `.git`, `node_modules`, dan `dist` dikecualikan dari source package.
- Script penerapan membuat backup otomatis dan tidak menimpa `.env.local`.
