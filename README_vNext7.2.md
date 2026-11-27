# BASYIR AGENCY vNext7.2
## Global Dark Theme, Background Correction & High Readability

Paket ini menggunakan source vNext7.1 yang dilampirkan pengguna sebagai baseline. Revisi difokuskan pada konsistensi dark navy, penghilangan permukaan putih yang masih tersisa, serta peningkatan keterbacaan teks.

## Isi paket
- `Apply-vNext7.2.ps1` — backup dan penerapan otomatis untuk Windows PowerShell.
- `basyir-agency/` — source code lengkap.
- `CHANGELOG_vNext7.2.md` — ringkasan perubahan.
- `COLOR_AUDIT_vNext7.2.md` — temuan dan tindakan audit warna.
- `TEST_REPORT_vNext7.2.md` — status pengujian.

## Cara menerapkan
1. Ekstrak ZIP satu kali. Pastikan `Apply-vNext7.2.ps1` sejajar dengan folder `basyir-agency`.
2. Buka PowerShell pada folder hasil ekstraksi.
3. Pastikan script tersedia:

   ```powershell
   Test-Path .\Apply-vNext7.2.ps1
   ```

   Hasil harus `True`.

4. Terapkan revisi ke folder proyek lokal:

   ```powershell
   Set-ExecutionPolicy -Scope Process Bypass
   .\Apply-vNext7.2.ps1 -ProjectPath "$env:USERPROFILE\Downloads\BASYIR_AGENCY_vNext5_FINAL\basyir-agency" -RunChecks
   ```

   Jika lokasi proyek berbeda, ganti nilai `-ProjectPath` dengan folder root yang berisi `package.json`.

5. Setelah proses selesai, jalankan:

   ```powershell
   cd "$env:USERPROFILE\Downloads\BASYIR_AGENCY_vNext5_FINAL\basyir-agency"
   npm run dev
   ```

6. Buka URL localhost yang ditampilkan Vite.

## Perlindungan
- Backup otomatis dibuat sebelum source disalin.
- `.env`, `.env.local`, dan file `*.local` pada proyek tujuan tidak ditimpa.
- `.git`, `node_modules`, `dist`, dan folder `backups` pada proyek tujuan dipertahankan.
- Script tidak menggunakan `/MIR` dan tidak menghapus file target.
- Paket tidak membawa kredensial lokal atau folder `.git`.

## Pemeriksaan otomatis
Dengan `-RunChecks`, installer menjalankan:
1. `npm run build`
2. `npm test`
3. `npm run audit:content`
4. `npm run audit:theme`

## Pemeriksaan visual localhost
Periksa halaman login, dashboard, semua bab investigasi, materi, kamus, latihan mufradat, panel audio, dan dashboard admin. Uji desktop, tablet, dan mobile. Perhatikan khususnya komponen yang sebelumnya memakai permukaan putih.

## Deployment
Jangan menjalankan Git Push atau Vercel Deploy sebelum hasil localhost disetujui. Paket ini tidak menjalankan deployment.
