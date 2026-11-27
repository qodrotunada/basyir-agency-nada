BASYIR AGENCY - ADMIN DASHBOARD PATCH

Isi patch:
- src/App.jsx: menambahkan pemeriksaan role dan tautan Admin yang hanya tampil untuk role admin.
- src/components/AdminDashboard.jsx: dashboard statistik dan daftar pengguna.
- src/components/admin-dashboard.css: tampilan dashboard responsif.
- supabase/admin_dashboard_setup.sql: kolom role, fungsi is_admin(), RLS baca admin, dan promosi satu akun menjadi admin.

LANGKAH PEMASANGAN
1. Backup src/App.jsx terlebih dahulu.
2. Buka supabase/admin_dashboard_setup.sql.
3. Ganti GANTI_DENGAN_EMAIL_ADMIN dengan email akun yang sudah terdaftar di BASYIR AGENCY.
4. Jalankan seluruh SQL di Supabase SQL Editor.
5. Verifikasi query terakhir menampilkan akun dengan role=admin.
6. Ekstrak ZIP ini ke folder root proyek, timpa file bila diminta.
7. Jalankan npm.cmd run build dan npm.cmd test.
8. Jalankan npm.cmd run dev, login dengan akun admin. Menu Admin akan muncul.

KEAMANAN
- Semua akun baru mendapat role student secara default.
- Aplikasi tidak menyediakan tombol untuk menaikkan role sendiri.
- RLS membatasi pembacaan seluruh profil dan progres hanya untuk role admin.
- Admin dashboard tidak menampilkan email pengguna lain karena tabel profiles tidak menyimpan email dan dashboard tidak memakai service_role.
- Jangan memasukkan service_role key ke frontend.
