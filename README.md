# BASYIR AGENCY vNext8.0 — Arabic Learning Battle Academy

BASYIR AGENCY adalah aplikasi pembelajaran Bahasa Arab MA Kelas XI berbasis investigasi edukatif. vNext8.0 membawa pengalaman visual ke arah game lobby modern dengan maskot tawon detektif 3D, misi, materi interaktif, koleksi mufrodat, profil pemain, dan sistem reward.

## Teknologi
- React + Vite + JavaScript ES modules.
- CSS tanpa library UI/animasi tambahan.
- Supabase Auth dan sinkronisasi progres.
- Vitest untuk unit test.
- Nabra Neural TTS dengan fallback suara Arab browser.

## Fitur yang dipertahankan
- Enam bab akademik dan 36 sublevel.
- 30 objek bukti, 18 pernyataan tersangka, enam alur deduksi, dan puzzle kalimat.
- 60 soal checkpoint dengan empat opsi dan ambang mastery 70.
- 69 entri kosakata, harakat, transliterasi, contoh, dan audio TTS.
- Scoring, episode unlocking, localStorage, sessionStorage, export/import, recovery, Supabase authentication, cloud progress, dan admin dashboard.

## Fitur vNext8.0
- Game Lobby dengan HUD, maskot tawon detektif 3D, misi aktif, dan navigasi bawah.
- Interactive Learning Room dengan chapter cards, tab materi, audio, dan Vocabulary Collection.
- Agent Profile dengan XP, level, rank, koin, bintang, achievement, dan reward collection.
- Daily check-in, daily mission, streak, dan reward ledger anti-duplikasi.
- UI admin, autentikasi, dan permainan mengikuti design system game.
- CSS menghormati `prefers-reduced-motion`.

## Aturan reward
| Aktivitas | Reward | Aturan anti-duplikasi |
|---|---:|---|
| Menjawab benar pertama kali untuk satu mufrodat | +5 XP | Satu event per ID kosakata |
| Menguasai satu mufrodat | +15 XP, +5 koin | Satu event per ID kosakata |
| Menyelesaikan investigasi | +120 XP, +50 koin | Satu event per episode |
| Lulus checkpoint mastery | +80 XP, +25 koin | Satu event per episode |
| Menyelesaikan satu bab materi | +40 XP, +10 koin | Satu event per bab |
| Daily check-in | +20 XP, +10 koin | Satu event per tanggal lokal |
| Streak 7 hari | Bonus +30 XP, +20 koin, +1 bintang | Satu kali pada milestone streak 7-hari |
| Daily mission lengkap | +60 XP, +30 koin, +1 bintang | Satu event per tanggal lokal |

Level naik setiap 300 XP. XP dan reward dihitung dari ledger yang tersimpan. Progres lama vNext7.2 dimigrasikan menjadi event reward satu kali saat akun dimuat.

## Penyimpanan dan Supabase
- Mode tamu: reward disimpan pada localStorage perangkat.
- Akun: reward disimpan lokal per user dan dapat disinkronkan ke Supabase.
- Untuk cloud reward sync, jalankan `supabase/gamification_setup.sql` di Supabase SQL Editor.
- Tabel `player_gamification` memiliki RLS sehingga user hanya dapat membaca/menulis row dengan `user_id = auth.uid()`.
- Sinkronisasi melakukan merge ledger sebelum upsert untuk mengurangi risiko kehilangan event ketika data lokal dan cloud berbeda. Merge ini belum merupakan transaksi atomik untuk dua perangkat yang menulis pada waktu yang sama.
- RLS melindungi data antar-akun, tetapi karena reward masih dihitung di client, pemilik akun yang memodifikasi browser dapat mengubah reward miliknya sendiri. Untuk leaderboard kompetitif atau reward bernilai tinggi, perhitungan harus dipindahkan ke Supabase Edge Function/RPC tervalidasi.
- Jika tabel belum dibuat, fitur utama dan reward lokal tetap berjalan; sinkronisasi reward antarperangkat belum aktif.
- Tidak ada service-role key atau secret baru di frontend.

## Catatan desain yang belum memiliki data sumber
- Kartu materi menampilkan level akademik MA Kelas XI. Label kesulitan terpisah belum ditambahkan karena baseline tidak menyediakan klasifikasi tingkat kesulitan per bab.
- Kartu mufrodat menggunakan ilustrasi kontekstual dari scene bab terkait. Ilustrasi objek unik untuk seluruh 69 kata belum dibuat.
- Maskot menggunakan satu PNG transparan dengan animasi idle, glow, dan aura CSS. Animasi sayap dan kedipan mata belum menggunakan rig/layer terpisah.

## Menjalankan aplikasi
Gunakan Node.js 22.22.2 atau versi kompatibel yang memenuhi `engines` dependency pada lockfile.

```bash
npm ci
npm run audit:content
npm run audit:theme
npm test
npm run build
npm run dev
```

Buat `.env` dari `.env.example` dan isi `VITE_SUPABASE_URL` serta `VITE_SUPABASE_PUBLISHABLE_KEY` (atau anon key yang sesuai proyek). Jangan masukkan service-role key ke frontend.

## Struktur utama
```text
src/
  App.jsx
  auth/
  components/
    GameLobby.jsx
    PlayerProfile.jsx
    AdminDashboard.jsx
    LearningFlipbook.jsx
    SceneArt.jsx
  data/
  engine/
    gamification.js
    persistence.js
    game.js
    scoring.js
    vocabulary.js
  services/
    gamificationSync.js
    progressSync.js
    audioService.js
  styles-vnext8.css
public/assets/
  detective-wasp-3d.png
supabase/
  gamification_setup.sql
```

## Batas verifikasi
Build, Vitest, browser QA, pemutaran audio nyata, dan cloud reward sync belum dinyatakan lulus sebelum dijalankan pada lingkungan dengan dependency terpasang dan Supabase migration diterapkan. Lihat `TEST_REPORT_vNext8.0.md`.
