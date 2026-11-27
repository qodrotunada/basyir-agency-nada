BASYIR AGENCY - PATCH SINKRONISASI KOSAKATA CLOUD

Perbaikan:
- Memvalidasi data kosakata cloud secara aman.
- Tetap memvalidasi ID yang dikenal oleh versi aplikasi saat ini.
- Mempertahankan entri kosakata dari versi lama agar tidak terhapus saat sinkronisasi berikutnya.
- Tidak mengubah tabel Supabase, localStorage, autentikasi, atau App.jsx.

Pemasangan Windows PowerShell:
1. Buka PowerShell pada folder proyek BASYIR AGENCY.
2. Jalankan perintah berikut (sesuaikan nama ZIP bila berbeda):

$project = (Get-Location).Path
$target = Join-Path $project 'src\services\progressSync.js'
$backup = Join-Path $project 'src\services\progressSync.js.backup'
Copy-Item $target $backup -Force
Expand-Archive -LiteralPath "$env:USERPROFILE\Downloads\BASYIR_AGENCY_cloud_fix.zip" -DestinationPath $project -Force

3. Jalankan:
npm.cmd run build
npm.cmd test

4. Jangan push sebelum pengujian dan uji sinkronisasi cloud berhasil.

Catatan:
Patch ini menargetkan error validasi ID kosakata lama pada fetchCloudProgress.
Keberhasilan build dan test tidak otomatis membuktikan koneksi cloud. Setelah dipasang,
login dan periksa apakah status sinkronisasi sukses serta apakah data player_progress
berisi progres yang diperbarui.
