# COLOR AUDIT — BASYIR AGENCY vNext7.2

## Baseline
Source `BASYIR_AGENCY_vNext7.1.zip` yang dilampirkan pengguna.

## Temuan konkret
- `src/components/admin-dashboard.css`: panel admin, kartu metrik, input/select, header tabel, badge peran, dan state panel memakai warna putih/cream serta teks gelap.
- `src/components/game-audio-controls.css`: tombol summary, panel pengaturan audio, badge status, dan catatan menggunakan putih/abu-abu terang dengan teks navy redup.
- `src/styles.css`: masih terdapat permukaan terang pada toast, feedback, mastery result, beberapa kartu kosakata/buku, transcript Istima, dan elemen eliminasi.
- Beberapa selector legacy menetapkan teks abu-abu gelap, teal gelap, atau amber gelap yang kurang terbaca di atas permukaan navy.
- Token `--muted` dan `--ba-text-muted` pada vNext7.1 belum cukup terang secara visual untuk preferensi keterbacaan yang diminta, walaupun sebagian pasangan masih memenuhi ambang kontras.

## Perbaikan sumber
1. Menambahkan `styles-vnext72.css` sebagai stylesheet terakhir agar urutan cascade eksplisit.
2. Mengubah stylesheet admin, audio, dan autentikasi di sumbernya, bukan hanya menutupinya dari stylesheet global.
3. Menetapkan token dark navy untuk background, surface, elevated surface, inset surface, dan border.
4. Meningkatkan teks utama, sekunder, muted, placeholder, dan aksen.
5. Menambahkan override terarah untuk sisa permukaan legacy yang belum ditangani.
6. Mengubah selector teks legacy yang luminansinya rendah menjadi token teks atau aksen yang lebih terang.
7. Mempertahankan teks gelap hanya pada tombol aksen terang yang memang memerlukan teks gelap untuk kontras.

## Token warna final
| Peran | Warna |
|---|---|
| Background utama | `#071321` |
| Surface | `#0C1D2E` |
| Surface raised | `#12283B` |
| Surface elevated | `#172F45` |
| Surface inset | `#091A2A` |
| Border | `#344F64` |
| Judul | `#F4F7FA` |
| Teks utama | `#EAF1F6` |
| Teks sekunder | `#D1DCE5` |
| Teks muted | `#B8C7D2` |
| Amber terang | `#E2C28C` |
| Teal terang | `#A5D3CF` |
| Cyan terang | `#A9D5E2` |

## Hasil perhitungan kontras
| Pasangan | Rasio |
|---|---:|
| Judul / background utama | 17.37:1 |
| Teks utama / card | 13.22:1 |
| Teks sekunder / card | 10.83:1 |
| Teks muted / card | 8.72:1 |
| Amber / card | 8.85:1 |
| Teal / teal surface | 7.70:1 |
| Cyan / cyan surface | 8.77:1 |
| Success / success surface | 8.84:1 |
| Warning / warning surface | 8.99:1 |
| Danger / danger surface | 7.67:1 |
| Teks tombol utama / amber button | 5.95:1 |
| Teks tombol admin / teal button | 5.58:1 |

Semua pasangan token yang diuji memenuhi WCAG AA 4.5:1 untuk teks normal.

## Batas audit
- Rasio dihitung untuk pasangan token solid yang dicantumkan, bukan setiap kombinasi pixel pada gradient, ilustrasi, atau gambar.
- Audit statis tidak menggantikan pemeriksaan browser dan pengujian responsivitas.
- Transparansi, state hover, disabled, dan teks di atas gambar harus tetap diperiksa secara visual di localhost.
