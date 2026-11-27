# TEST REPORT — BASYIR AGENCY vNext7

## Pemeriksaan yang berhasil dijalankan pada source vNext7

| Pemeriksaan | Hasil | Catatan |
|---|---|---|
| `node scripts/verify-project.mjs` | **PASS** | 6 bab, 30 objek bukti, 18 tersangka, 60 soal, materi pembelajaran, 69 mufradat, dan aset merek tervalidasi. |
| Pemeriksaan struktur kronologi | **PASS** | Keenam bab memiliki paragraf terjemahan Indonesia dan paragraf Arab berharakat. |
| Pemeriksaan bukti Bab 4 | **PASS** | Lima ID bukti tetap ada; bukti Zahra mencakup 13.10–14.20 dan 14.27–14.48. |
| Pemeriksaan sintaks source JS/JSX | **PASS** | Source JS/JSX diparse melalui TypeScript transpile parser; tidak ditemukan diagnostic sintaks. |
| Pemeriksaan unit test | **BELUM DIJALANKAN** | Paket Vitest pada arsip asal menggunakan dependency native Windows. Dependency Linux tidak dapat dipasang karena akses registry npm gagal (`EAI_AGAIN`). |
| Build Vite | **BELUM DIJALANKAN** | Vite/esbuild tidak dapat dijalankan pada lingkungan pemeriksaan ini karena dependency platform Windows tidak kompatibel dengan Linux dan instalasi ulang tidak dapat mengakses registry npm. |

## Cakupan unit test

- 9 file test.
- 53 deklarasi `it()` setelah penambahan dua pengujian untuk kronologi Arab dan bukti Zahra.
- Unit test harus dijalankan kembali pada komputer Windows pengguna setelah paket diterapkan:

```powershell
npm test
npm run build
npm run audit:content
```

## Pemeriksaan manual localhost yang masih wajib dilakukan

1. Login dan logout pengguna.
2. Sinkronisasi progres dengan Supabase.
3. Skor, nyawa, reset sesi, dan pemulihan progres.
4. Investigasi enam bab dari briefing sampai kesimpulan.
5. TTS kronologi Arab pada enam halaman pemilihan tersangka.
6. Tombol tampil/sembunyikan terjemahan.
7. Efek suara benar dan salah untuk lima mufradat.
8. Tampilan desktop dan mobile.

Tidak ada klaim bahwa build atau unit test telah lulus pada lingkungan ini. Deployment tidak dilakukan.
