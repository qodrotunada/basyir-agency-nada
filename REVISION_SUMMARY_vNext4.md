# REVISION SUMMARY — Basyir Agency vNext.4

## Baseline and integration
- `Basyir_Agency_Revisi_vNext3(1).zip` dipilih sebagai baseline karena berisi source code aplikasi, `LearningFlipbook.jsx`, `arabicAssessment.js`, enam scene WebP, test, dan konfigurasi yang lebih lengkap.
- `Basyir_Agency_Revisi(1).zip` diperiksa sebagai pembanding. Arsip tersebut memuat `dist` dan `node_modules` yang besar; tidak dipakai sebagai sumber utama implementasi.
- ID enam bab, 30 bukti, puzzle, tersangka, checkpoint, penyimpanan progres, dan sistem permainan dipertahankan dari baseline vNext.3.

## Perubahan vNext.4
1. Menambahkan `src/data/learningMaterials.js` sebagai lapisan data akademik untuk flipbook.
2. Mengganti `LearningFlipbook.jsx` agar membaca data akademik, bukan memetakan semua `learningPath` secara otomatis.
3. Memastikan halaman flipbook tidak menampilkan misi, puzzle, checkpoint, atau aktivitas investigasi.
4. Menambahkan halaman kompetensi dan indikator, peta konsep, pengantar, materi keterampilan, penjelasan kaidah, contoh, kosakata, dan rangkuman pada tiap bab.
5. Memperluas penjelasan kaidah:
   - Bab 1: العدد والمعدود, kelompok bilangan 1–2, 3–10, 11–99, bilangan besar, dan bilangan gabungan.
   - Bab 2: حروف الجر dan حروف العطف, fungsi, pengaruh i‘rab, serta contoh.
   - Bab 3: الاسم النكرة والاسم المعرفة, kategori ma‘rifah, dan struktur teks rekon.
   - Bab 4: تصريف الفعل الماضي اللغوي menurut dhamir.
   - Bab 5: تصريف الفعل المضارع اللغوي menurut dhamir.
   - Bab 6: الجملة الاسمية والجملة الفعلية, mubtada’, khabar, fi‘il, dan fa‘il.
6. Menambahkan contoh kalimat Arab berharakat dan makna bahasa Indonesia pada tiap bab.
7. Menambahkan layout khusus untuk indikator, kaidah, daftar isi, serta aksesibilitas fokus keyboard pada flipbook.
8. Memperbarui metadata proyek ke `basyir-agency` versi `4.0.0`.
9. Menambahkan `npm run audit:content` untuk memvalidasi struktur kampanye, pemisahan materi/game, kosakata, dan lokalisasi evaluasi.

## Evaluasi
- 60 soal checkpoint tetap dipertahankan (10 soal per bab).
- Lokalisasi pertanyaan, pilihan, dan umpan balik tetap memakai `arabicAssessment.js`.
- Tidak mengubah indeks kunci jawaban dan identitas soal.
- Audit statis vNext.4 memastikan seluruh 60 prompt, pilihan, dan umpan balik tidak mengandung teks Latin.

## Catatan
- Contoh kalimat tambahan di flipbook merupakan contoh adaptasi untuk pembelajaran, bukan kutipan verbatim dari buku.
- Rangkuman kompetensi/indikator disajikan secara ringkas dan perlu disandingkan dengan dokumen kurikulum madrasah yang digunakan guru.
- Tidak ada penghapusan fitur permainan yang telah ada.
