# BASYIR AGENCY vNext7

Paket revisi untuk proyek Vite + React + Supabase. Revisi difokuskan pada kualitas kronologi enam bab, halaman pemilihan tersangka, tampilan dark navy, dan efek suara latihan lima mufradat.

## Isi paket

- `basyir-agency/` — source code proyek lengkap, tanpa `node_modules`, `.git`, `dist`, backup lama, dan `.env.local`.
- `Apply-vNext7.ps1` — script PowerShell untuk membuat backup dan menerapkan source tanpa menimpa `.env.local`, `.git`, atau `node_modules`.
- `CHANGELOG_vNext7.md` — catatan perubahan.

## Cara menerapkan di Windows

1. Ekstrak `BASYIR_AGENCY_vNext7.zip` ke folder yang mudah ditemukan, misalnya Downloads.
2. Buka PowerShell di folder hasil ekstraksi.
3. Jalankan:

   ```powershell
   Set-ExecutionPolicy -Scope Process Bypass
   .\Apply-vNext7.ps1
   ```

4. Jika folder proyek berbeda dari lokasi default, gunakan:

   ```powershell
   .\Apply-vNext7.ps1 -ProjectPath "D:\Folder\basyir-agency"
   ```

5. Untuk langsung menjalankan build dan seluruh unit test setelah penerapan:

   ```powershell
   .\Apply-vNext7.ps1 -RunChecks
   ```

Script membuat backup otomatis di `backups\before-vNext7-TANGGAL-JAM` di dalam folder proyek tujuan. Backup menyertakan `.env.local` yang sudah ada, tetapi tidak menyalin `node_modules`, `.git`, `dist`, atau folder backup lama.

## Menjalankan localhost secara manual

```powershell
cd "C:\Users\infin\Downloads\BASYIR_AGENCY_vNext5_FINAL\basyir-agency"
npm run dev
```

Buka alamat localhost yang ditampilkan Vite, biasanya `http://localhost:5173`.

## Pemeriksaan produksi dan test

```powershell
npm run build
npm test
npm run audit:content
```

`npm run audit:content` memeriksa konfigurasi enam bab, 30 objek bukti, 18 tersangka, materi pembelajaran, asesmen, dan registry mufradat.

## Supabase dan keamanan konfigurasi

- `.env.local` tidak disertakan dalam ZIP dan tidak ditimpa oleh script.
- Pertahankan file `.env.local` lokal yang berisi `VITE_SUPABASE_URL` dan `VITE_SUPABASE_PUBLISHABLE_KEY`.
- Tidak ada perubahan database, tabel, RLS policy, atau autentikasi Supabase dalam revisi ini.
- File `.env.example` hanya berisi placeholder, bukan kredensial.

## Catatan pengujian

Jalankan build, unit test, dan uji manual localhost setelah menerapkan paket. Jangan push GitHub atau deploy Vercel sebelum seluruh alur login, penyimpanan progres, skor, nyawa, materi, TTS, investigasi, dan latihan mufradat diuji di browser lokal.
