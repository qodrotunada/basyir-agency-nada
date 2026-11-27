# REVISION SUMMARY — BASYIR AGENCY vNext.5

## 1. Prinsip pemeliharaan
- Baseline vNext.4 dipertahankan; aplikasi tidak dibangun ulang.
- ID enam bab, 30 bukti, 18 tersangka, empat fragmen puzzle per bab, dan 60 soal checkpoint tetap dipertahankan.
- Bentuk state permainan, `GAME_SCHEMA_VERSION`, serta `contentVersion` tidak diubah karena revisi tidak mengubah skema progres.

## 2. Checkpoint Bahasa Arab
- `arabicQuestion()` tidak lagi menerjemahkan semua opsi menjadi Bahasa Arab.
- Soal kosakata Arab → Indonesia menggunakan prompt Arab dan empat pilihan Bahasa Indonesia.
- Arah Indonesia → Arab didukung melalui `translationDirection: 'id-ar'`, dengan prompt Indonesia dan opsi Arab.
- Soal tata bahasa dan pemahaman bacaan mempertahankan bahasa sesuai kompetensi yang diuji.
- Indeks jawaban, urutan opsi, dan ID soal tidak diacak ulang oleh fungsi presentasi.
- Soal `أَلْفٌ` diklasifikasikan sebagai kosakata, bukan tata bahasa.
- Feedback checkpoint memakai penjelasan Indonesia dan tetap memuat istilah Arab yang sedang diuji.
- Automated test memeriksa empat opsi, duplikasi prompt, bahasa prompt/opsi, dan indeks jawaban.

## 3. Audio Istima'
- Ditambahkan dialog adaptasi pembelajaran terstruktur untuk enam tema: perbelanjaan, kesehatan, perjalanan, haji dan umrah, teknologi informasi dan komunikasi, serta agama-agama di Indonesia.
- Setiap dialog mempunyai teks Arab berharakat, terjemahan Indonesia, label penutur, dan catatan bahwa materi merupakan adaptasi, bukan kutipan langsung buku.
- `LearningFlipbook` menampilkan pemutar audio pada halaman Istima' yang dipilih melalui daftar isi.
- Audio menggunakan `ArabicAudioButton` → `playArabic()` → Nabra Neural TTS, dengan fallback suara Arab browser yang sudah ada.
- Status tombol mencakup memuat, sedang diputar, selesai, dan gagal; tombol dapat digunakan untuk memutar ulang.
- Tidak ada autoplay.

## 4. Judul akademik
- Enam judul akademik Arab dan Indonesia disimpan pada `EPISODE_META`.
- Judul cerita investigasi dipisahkan menjadi `caseTitle` dan tetap ditampilkan sebagai subjudul.
- Judul akademik diterapkan pada kartu kampanye, briefing, header permainan, flipbook, daftar isi, checkpoint, dan ringkasan hasil.

## 5. Kamus Detektif
- Contoh kalimat Arab diperbesar secara responsif melalui aturan CSS untuk tampilan desktop dan smartphone.
- RTL, font Arab, line-height, dan pembungkusan kata disesuaikan agar harakat tidak bertumpuk dan teks tidak terpotong.
- Fitur pencarian, statistik, status penguasaan, dan latihan tidak dihapus.

## 6. Deduksi enam kasus
- Dibuat `src/data/deduction.js` sebagai sumber data investigasi terstruktur.
- Setiap dari 30 bukti memiliki lokasi, kondisi, waktu/urutan, fakta investigatif, dan fungsi deduksi.
- Setiap dari 18 tersangka memiliki pernyataan Indonesia, kalimat Arab, dan terjemahan.
- Setiap kasus menetapkan satu pelaku sesuai baseline, dua bukti independen yang menggugurkan alibinya, serta fakta pendukung untuk dua alibi lainnya.
- Halaman pemilihan tersangka menampilkan Papan Analisis Detektif.
- Pilihan salah memberikan umpan balik yang spesifik terhadap alibi pilihan tanpa menyebut nama pelaku.
- Pilihan benar membuka urutan deduksi dan alasan eliminasi dua tersangka lain.
- Puzzle Bab 5 diperbarui agar kalimat Fi'il Mudhari' berkaitan langsung dengan aktivitas menyunting dan menyimpan berkas.

## 7. Identitas visual
- Logo JPEG asli yang diberikan pengguna disimpan di `public/assets/basyir-agency-logo.jpg`.
- Emblem navigasi dipotong dari simbol pada logo asli tanpa menggambar ulang simbol, disimpan sebagai `public/assets/basyir-agency-emblem.png`.
- Header, hero, footer, favicon, metadata halaman, dan warna navy/emas diselaraskan dengan identitas baru.
- Gambar menggunakan ukuran proporsional dan `object-fit: contain`.

## 8. Pengujian
- `node scripts/verify-project.mjs`: PASS.
- Automated test ditambahkan untuk arah bahasa checkpoint, status pemutar audio, enam halaman audio, judul akademik, matriks deduksi, dan umpan balik pilihan salah.
- `npm test` dan `npm run build` belum dapat dinyatakan lulus pada lingkungan pengerjaan ini karena instalasi dependency tidak selesai; lihat `TEST_REPORT.md`.
