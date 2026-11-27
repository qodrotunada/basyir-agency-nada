# STATUS IMPLEMENTASI — Basyir Agency vNext.5

## Baseline dan kompatibilitas
- Baseline: `BASYIR_AGENCY_vNext4_FINAL.zip`.
- Buku akademik: *Bahasa Arab MA Kelas XI*, Kementerian Agama RI (2020), beserta `ACADEMIC_AUDIT.md`.
- Logo: gambar asli yang dilampirkan pengguna.
- ID enam bab, 30 bukti, 18 tersangka, fragmen puzzle, 60 ID soal, `GAME_SCHEMA_VERSION`, dan `contentVersion` dipertahankan.
- Bentuk state progres tidak diubah; revisi konten tidak memerlukan migrasi data.

## Fitur yang dipertahankan
- Enam bab dan 36 sublevel.
- Lima bukti per bab, puzzle empat fragmen, dan tiga tersangka per kasus.
- Sistem skor, checkpoint 10 soal per bab, mastery, progres, dan riwayat kosakata.
- Kamus Detektif, pencarian, latihan, dan statistik penguasaan.
- Penyimpanan progres, ekspor/impor JSON, validasi, dan pemulihan data.
- Layanan Nabra Neural TTS dengan fallback browser.
- Enam scene investigasi dan hotspot yang sudah ada.

## Perubahan vNext.5
- Fungsi checkpoint tidak lagi mengubah semua pilihan jawaban menjadi bahasa Arab. Arah terjemahan dibedakan dan diperiksa otomatis.
- Soal `أَلْفٌ` diklasifikasikan sebagai kosakata.
- Enam halaman Istima' memiliki dialog Arab berharakat, terjemahan Indonesia, dan audio TTS melalui layanan yang sudah ada.
- Judul akademik Arab–Indonesia dipisahkan dari judul kasus dan diterapkan di seluruh tampilan utama.
- Contoh kalimat Arab pada Kamus Detektif diperbesar melalui CSS responsif.
- Sistem deduksi enam kasus dipindahkan ke data terstruktur `src/data/deduction.js`; tiap objek memuat fakta lokasi, kondisi, waktu, dan fungsi investigasi.
- Papan Analisis Detektif menampilkan lima bukti, puzzle, dan pernyataan tiga tersangka.
- Feedback salah diarahkan pada bukti yang mendukung alibi pilihan tanpa mengungkap nama pelaku.
- Jawaban benar membuka urutan deduksi dan alasan eliminasi dua tersangka lain.
- Puzzle Bab 5 dikaitkan langsung dengan kegiatan menyunting dan menyimpan berkas menggunakan Fi'il Mudhari'.
- Logo asli diterapkan pada hero; emblem dari crop gambar asli digunakan di header/footer dan favicon.
- Dokumen `REVISION_SUMMARY_vNext5.md` dan `DEDUCTION_AUDIT.md` ditambahkan.

## Hasil pemeriksaan
- `npm run audit:content`: PASS.
- `node scripts/verify-project.mjs`: PASS.
- Parser TypeScript terhadap 24 file `.js`/`.jsx`: PASS, tanpa diagnostic sintaks.
- `node --check` pada file `.js`/`.mjs`: PASS.
- Validasi statis: enam bab, 30 bukti, 18 pernyataan tersangka, 60 soal, enam dialog Istima', serta aset logo: PASS.

## Belum dapat diverifikasi
- `npm ci --ignore-scripts --prefer-offline` melewati batas waktu eksekusi 120 detik dan tidak menyelesaikan instalasi.
- `npm test` terblokir karena `vitest` tidak terpasang.
- `npm run build` terblokir karena `vite` tidak terpasang.
- Pemutaran audio nyata dan inspeksi browser desktop/tablet/smartphone belum dapat dijalankan.

Lihat `TEST_REPORT.md` untuk detail dan langkah verifikasi pada lingkungan yang memiliki akses dependency.
