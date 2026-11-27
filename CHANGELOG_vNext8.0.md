# CHANGELOG — BASYIR AGENCY vNext8.0

## Fokus redesign
- Mengubah halaman awal menjadi Game Lobby dengan HUD level/XP, koin, bintang, panel misi, dan navigasi game.
- Menambahkan maskot tawon detektif 3D original sebagai aset PNG transparan.
- Menambahkan animasi idle, aura, ring holografik, dan efek reward menggunakan CSS.
- Menambahkan bottom navigation: Lobby, Mission, Learn, Vocabulary, Profile.
- Mengubah pemilihan kasus menjadi tampilan mission deck yang konsisten dengan tema game.
- Mengubah tampilan materi menjadi Interactive Learning Room tanpa mengubah data akademik, teks Arab, harakat, atau audio.
- Mengubah tampilan kamus menjadi Vocabulary Collection dan mempertahankan pencarian, status mastery, latihan retrieval, serta audio.
- Menambahkan halaman Agent Profile berisi level, rank, statistik, achievement, reward collection, dan riwayat reward.
- Menyegarkan tampilan game investigasi, hasil, autentikasi, dan admin dashboard melalui stylesheet tambahan.

## Reward dan gamification
- Menambahkan XP, Koin Ilmu, bintang, level, rank, daily check-in, daily mission, achievement, dan reward collection.
- Reward memakai event ID idempotent agar satu aktivitas tidak memberikan reward berulang.
- Reward ledger, aktivitas harian, dan check-in disimpan lokal per pengguna.
- Backup JSON kini mencakup gamification state; backup lama tanpa field ini tetap dapat diimpor tanpa menghapus reward aktif.
- Menambahkan tabel opsional `player_gamification` dengan RLS per pengguna untuk sinkronisasi reward antarperangkat.
- Menambahkan migrasi progres vNext7.2 agar kasus selesai, checkpoint lulus, jawaban benar, dan kosakata mastered yang sudah ada dikonversi menjadi reward satu kali.

## Kompatibilitas
- React, Vite, JavaScript, CSS, dan Supabase tetap digunakan.
- Tidak mengubah ID enam episode, bukti, tersangka, puzzle, soal, opsi jawaban, jawaban benar, scoring, mastery threshold, dan unlock rules.
- Tidak mengubah tabel `profiles` atau `player_progress` yang sudah ada.
- Sinkronisasi reward menggunakan tabel tambahan; bila SQL belum dijalankan, reward tetap tersimpan lokal dan progres utama tetap berjalan.
- Tidak melakukan deployment atau Git Push.
