# BASYIR AGENCY vNext7.1

**UI Layout Correction, Responsive Optimization & Color Refinement**

Paket ini merupakan revisi visual berbasis source vNext7. Fokusnya memperbaiki lapisan modal, layout responsif, dan warna dark navy. Logika permainan, materi enam bab, Supabase, skor, nyawa, progres, TTS, dan efek suara tidak sengaja diubah.

## Isi paket

- `Apply-vNext7.1.ps1` — script PowerShell untuk backup dan penerapan otomatis.
- `basyir-agency/` — source code lengkap.
- `CHANGELOG_vNext7.1.md` — daftar perubahan.
- `LAYOUT_AUDIT_vNext7.1.md` — temuan akar masalah dan perbaikan.
- `TEST_REPORT_vNext7.1.md` — status pemeriksaan.

## Cara menerapkan di Windows

1. Ekstrak ZIP satu kali. Pastikan `Apply-vNext7.1.ps1` berada sejajar dengan folder `basyir-agency`.
2. Buka PowerShell pada folder hasil ekstraksi.
3. Pastikan script ditemukan:

   ```powershell
   Test-Path .\Apply-vNext7.1.ps1
   ```

   Hasil harus `True`.

4. Jalankan:

   ```powershell
   Set-ExecutionPolicy -Scope Process Bypass
   .\Apply-vNext7.1.ps1 -ProjectPath "$env:USERPROFILE\Downloads\BASYIR_AGENCY_vNext5_FINAL\basyir-agency" -RunChecks
   ```

   Jika proyek aktif berada di lokasi lain, ganti nilai `-ProjectPath` dengan folder root proyek yang berisi `package.json`.

5. Setelah proses berhasil, jalankan localhost:

   ```powershell
   cd "$env:USERPROFILE\Downloads\BASYIR_AGENCY_vNext5_FINAL\basyir-agency"
   npm run dev
   ```

6. Buka alamat localhost yang ditampilkan Vite.

## Perlindungan file dan konfigurasi

Script membuat backup sebelum menyalin source. Script tidak menggunakan `/MIR` dan tidak menghapus file target. File `.env`, `.env.local`, file `*.local`, `.git`, `node_modules`, `dist`, serta folder `backups` pada target tidak ditimpa.

Paket ini tidak membawa `.env.local` atau folder `.git` dari komputer lain.

## Pengujian yang disarankan

- Login dan registrasi pada desktop dan mobile.
- Tutup modal melalui tombol X dan klik backdrop.
- Periksa modal bukti, papan bukti, panduan, impor backup, dan reset.
- Periksa ukuran 1440×900, 1366×768, 768×1024, 390×844, dan 360×800.
- Uji seluruh alur enam bab, TTS, lima latihan mufradat, skor, nyawa, dan penyimpanan progres.

## Deployment

Jangan push GitHub atau deploy Vercel sebelum build, unit test, dan pengujian manual localhost disetujui.
