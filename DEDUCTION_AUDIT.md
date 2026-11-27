# DEDUCTION AUDIT — BASYIR AGENCY vNext.5

## Metode audit

Setiap kartu tersangka juga menampilkan peran dan kode akses/identitas agar siswa dapat memetakan kode pada log ke orang yang tepat. Setiap kasus dianalisis dengan urutan: (1) tetapkan kejadian dan objek yang dicari, (2) catat fakta waktu/lokasi/kondisi pada lima objek, (3) baca fungsi kalimat puzzle terhadap konteks, (4) bandingkan pernyataan tiga tersangka, (5) cari sedikitnya dua petunjuk independen yang bertentangan dengan alibi pelaku, dan (6) pastikan dua tersangka lain mempunyai fakta pendukung.

Data operasional berada di `src/data/deduction.js`. Fakta dan waktu di bawah merupakan detail skenario fiktif untuk pembelajaran, bukan klaim tentang orang atau kejadian nyata. Nama dan ID tersangka dipertahankan dari baseline vNext.4.

---

## Bab 1 — التَّسَوُّقُ · Perbelanjaan

**Kasus:** Audit Transaksi Pasar  
**Masalah:** Map rekap harga dan berat daging berpindah dari meja penimbangan ke rak R-3 tanpa catatan serah terima.  
**Pelaku yang dipertahankan:** Nabil — Petugas penimbangan.

### Matriks lima bukti

| Bukti | Fakta yang ditemukan | Hubungan dengan penyelidikan |
|---|---|---|
| ثَمَنٌ / label harga | Selongsong map terselip di rak R-3 pada 10.28; sisi selongsong memuat kode pengambilan N-03; label daging menunjukkan Rp100.000/kg. | Menghubungkan puzzle harga per kilogram dengan dokumen yang dicari dan lokasi akhir map. |
| مِيزَانٌ / timbangan | Tiket timbang terakhir dengan ID N-03 tercetak pada 10.24. | Catatan mesin muncul setelah Nabil mengaku meninggalkan pasar pada 10.18. |
| خَضْرَوَاتٌ / sayuran | Kartu stok ditandatangani Umar pada 10.05, 10.18, dan 10.29. | Mendukung keberadaan Umar di lapak sayuran. |
| فَوَاكِهُ / buah | Tanda terima peti buah atas nama Umar pada 10.16 dan 10.26. | Pemeriksaan kedua yang mendukung aktivitas Umar di area buah. |
| الْمُشْتَرِي / pembeli | Log kasir dan struk menunjukkan Salma memproses transaksi pada 10.13–10.27; buku serah terima tidak mencatat map. | Mendukung alibi Salma sekaligus membantah klaim map telah diterima kasir. |

### Kalimat puzzle

**سِعْرُ اللَّحْمِ مِائَةُ أَلْفِ رُوبِيَّةٍ لِلْكِيلُو الْوَاحِدِ** — Harga daging seratus ribu rupiah untuk satu kilogram.

Kalimat mengidentifikasi jenis catatan dan satuan harga. Hubungannya adalah label harga dan tiket timbang, bukan identitas pelaku.

### Pernyataan dan alibi

| Tersangka | Pernyataan | Hasil pemeriksaan |
|---|---|---|
| Nabil (N-03) | Menyerahkan map ke Salma pukul 10.15 lalu meninggalkan pasar pukul 10.18. | Tidak cocok dengan tiket timbang N-03 pukul 10.24 dan tanda pengambilan N-03 pada selongsong map pukul 10.28. Dua jejak ini berasal dari catatan berbeda. |
| Salma (S-02) | Tetap berada di meja kasir mencatat transaksi. | Didukung log kasir dan struk pembeli. |
| Umar (U-04) | Menata buah dan sayuran selama rentang kejadian. | Didukung kartu stok sayuran dan tanda terima peti buah. |

**Kesimpulan:** Nabil adalah satu-satunya tersangka yang alibinya bertentangan dengan dua petunjuk independen: tiket timbang setelah waktu ia mengaku pergi dan tanda pengambilan pada selongsong map. Salma dan Umar didukung catatan kerja masing-masing.

---

## Bab 2 — الصِّحَّةُ · Kesehatan

**Kasus:** Berkas Kunjungan Klinik  
**Masalah:** Lembar prosedur pemeriksaan pasien terpisah dari map pendaftaran dan tercatat di kabinet meja informasi.  
**Pelaku yang dipertahankan:** Huda — Perawat pendaftaran.

### Matriks lima bukti

| Bukti | Fakta yang ditemukan | Hubungan dengan penyelidikan |
|---|---|---|
| مِقْيَاسُ الْحَرَارَةِ / termometer | Suhu pasien nomor 21 dicatat pada 09.12; label sampel terkait diproses Amin di laboratorium pada 09.17. | Menetapkan urutan pemeriksaan awal dan mendukung pekerjaan Amin di laboratorium. |
| وَصْفَةٌ طِبِّيَّةٌ / resep | Resep dokter pukul 09.31 memberi tanda bahwa lampiran prosedur pasien 21 belum diterima. | Membantah bahwa berkas sudah ada di meja dokter sebelum waktu tersebut. |
| مُسْتَشْفًى / rumah sakit | Monitor antrean menunjukkan pasien nomor 21 baru dipanggil ke ruang dokter pada 09.26. | Ruang dokter belum menerima pasien itu pada waktu 09.15 yang disebut Huda. |
| دَوَاءٌ / obat | Log apotek mencatat Salim menyiapkan dan menyerahkan obat pada 09.34. | Mendukung alibi Salim setelah resep diterbitkan. |
| مُمَرِّضَةٌ / perawat | Kartu akses Huda membuka kabinet meja informasi dan label PROSEDUR-21 dipindai pada 09.18. | Menunjukkan lokasi map setelah Huda menyatakan telah menyerahkannya ke dokter. |

### Kalimat puzzle

**ذَهَبَ مُحَمَّدٌ إِلَى الْمُسْتَشْفَى لِلْفَحْصِ** — Muhammad pergi ke rumah sakit untuk pemeriksaan.

Kalimat menetapkan tempat dan tujuan kunjungan pasien. Siswa perlu menyusun urutan pemeriksaan awal, panggilan dokter, dan perpindahan map.

### Pernyataan dan alibi

| Tersangka | Pernyataan | Hasil pemeriksaan |
|---|---|---|
| Huda (H-01) | Menyerahkan map prosedur ke ruang dokter pukul 09.15. | Bertentangan dengan panggilan pasien yang baru terjadi 09.26 dan akses Huda ke kabinet informasi pada 09.18. Resep 09.31 juga menyatakan lampiran belum diterima. |
| Salim (S-04) | Menyiapkan dan menyerahkan obat di loket apotek. | Didukung log penyerahan obat pada 09.34. |
| Amin (A-07) | Memeriksa sampel pasien di laboratorium. | Didukung label sampel dan catatan pemrosesan laboratorium pada 09.17. |

**Kesimpulan:** Urutan antrean dan log akses kabinet merupakan dua pemeriksaan independen yang menggugurkan alibi Huda. Catatan apotek dan laboratorium mendukung Salim dan Amin.

---

## Bab 3 — السَّفَرُ · Perjalanan

**Kasus:** Jadwal Perjalanan Tertukar  
**Masalah:** Kartu rute rombongan tidak sesuai dengan manifes penerbangan dan label bagasi.  
**Pelaku yang dipertahankan:** Faris — Petugas jadwal perjalanan.

### Matriks lima bukti

| Bukti | Fakta yang ditemukan | Hubungan dengan penyelidikan |
|---|---|---|
| جَوَازُ السَّفَرِ / paspor | Manifes awal mencatat GA218 menuju Surabaya; salinan dibuat pada 07.30 sebelum kartu dibagikan. | Menetapkan tujuan asli. |
| مَطَارٌ / bandara | Akun jadwal FRS-07 mengubah kartu rute Surabaya menjadi Denpasar pada 07.46 dan mencetak ulang pada 07.48. | Mengidentifikasi waktu dan akun yang mengubah kartu. |
| حَقِيبَةٌ / koper | Label bagasi menunjukkan GA218–Surabaya, tetapi kartu rute sisipan menunjukkan Denpasar; koper dipindai pada 07.52. | Membuktikan kartu sisipan tidak cocok dengan label bagasi dan manifes. |
| طَائِرَةٌ / pesawat | Daftar boarding mencatat Aisyah mendampingi rombongan di Gerbang 3 pada 07.55. | Mendukung alibi Aisyah. |
| مُسَافِرٌ / pelancong | Log troli mencatat Yusuf memeriksa koper di sabuk bagasi B pada 07.52 dan 08.05. | Mendukung alibi Yusuf. |

### Kalimat puzzle

**سَافَرَ فَاتِحٌ إِلَى إِنْدُونِيسِيَا يَوْمَ الْأَحَدِ بِالطَّائِرَةِ** — Fatih bepergian ke Indonesia pada hari Ahad dengan pesawat.

Kalimat menetapkan moda dan waktu perjalanan. Manifes, papan bandara, dan label bagasi harus dibandingkan agar rute tidak ditentukan dari satu objek saja.

### Pernyataan dan alibi

| Tersangka | Pernyataan | Hasil pemeriksaan |
|---|---|---|
| Faris (FRS-07) | Mencetak kartu rute pada pagi hari dan tidak mengubah tujuan setelah dibagikan. | Bertentangan dengan log terminal yang mengubah rute pada 07.46 dan ketidakcocokan kartu sisipan dengan label bagasi. |
| Aisyah (AS-03) | Menunggu dan mendampingi rombongan di Gerbang 3. | Didukung daftar boarding pada 07.55. |
| Yusuf (YS-02) | Memeriksa koper di sabuk bagasi B. | Didukung dua pemindaian troli pada 07.52 dan 08.05. |

**Kesimpulan:** Manifes dan label koper menyepakati tujuan asli. Log perubahan terminal dan kartu sisipan menunjukkan perubahan rute setelah pencetakan awal. Aisyah dan Yusuf tercatat berada di lokasi tugas masing-masing.

---

## Bab 4 — الْحَجُّ وَالْعُمْرَةُ · Haji dan Umrah

**Kasus:** Rekonstruksi Jurnal Perjalanan Ibadah  
**Masalah:** Urutan halaman jurnal berubah pada salinan yang akan dicetak.  
**Pelaku yang dipertahankan:** Amin — Petugas penyusun jurnal.

### Matriks lima bukti

| Bukti | Fakta yang ditemukan | Hubungan dengan penyelidikan |
|---|---|---|
| لِبَاسُ الْإِحْرَامِ / pakaian ihram | Daftar pembagian perlengkapan mencatat persiapan ihram pukul 08.00 sebelum keberangkatan 08.45. | Menjadi patokan awal kronologi perjalanan. |
| جَوَازُ السَّفَرِ / paspor | Slip peminjaman jurnal induk pada 14.35 memakai kartu petugas AM-04 atas nama Amin. | Menetapkan akses Amin ke jurnal induk. |
| حَقِيبَةٌ / koper | Log penitipan mencatat Zahra membantu mencocokkan koper rombongan pada 13.10–14.20. | Mendukung alibi Zahra. |
| دَلِيلُ الْحَجِّ / buku panduan haji | Metadata bukti cetak menunjukkan akun AM-04 mengekspor halaman pada urutan 1, 2, 5, 3, 4, 6, 7, 8 pada 14.42. | Menjadi bukti independen perubahan urutan halaman. |
| سَجَّادَةُ الصَّلَاةِ / sajadah | Inventaris sajadah dan daftar glosarium mencatat Salim di meja informasi pada 14.30–15.00. | Mendukung alibi Salim. |

### Kalimat puzzle

**طَافَ الْحَاجُّ حَوْلَ الْكَعْبَةِ سَبْعَةَ أَشْوَاطٍ** — Jamaah haji melakukan tawaf mengelilingi Ka’bah sebanyak tujuh putaran.

Kalimat menyediakan peristiwa manasik untuk ditempatkan dalam kronologi. Siswa membandingkan urutan kegiatan dengan daftar persiapan dan salinan jurnal.

### Pernyataan dan alibi

| Tersangka | Pernyataan | Hasil pemeriksaan |
|---|---|---|
| Amin (AM-04) | Hanya memeriksa istilah manasik dan tidak mengubah urutan halaman. | Slip peminjaman jurnal 14.35 dan metadata ekspor ulang 14.42 menghubungkan akses dan perubahan halaman dengan akun AM-04. |
| Zahra (ZH-05) | Membantu mencocokkan koper rombongan di ruang penyimpanan. | Didukung label penitipan dan log pemindaian 13.10–14.20. |
| Salim (SL-02) | Memeriksa istilah haji/umrah dan inventaris sajadah di meja informasi. | Didukung inventaris sajadah dan daftar pemeriksaan glosarium. |

**Kesimpulan:** Peminjaman jurnal induk dan metadata ekspor merupakan dua jejak terpisah yang bertentangan dengan pernyataan Amin. Catatan penitipan koper dan meja informasi mendukung Zahra dan Salim.

---

## Bab 5 — تكنولوجيا الإعلام والاتصال · Teknologi Informasi dan Komunikasi

**Kasus:** Verifikasi Informasi Digital  
**Masalah:** Berkas final ditemukan pada folder arsip, bukan folder informasi yang ditentukan.  
**Pelaku yang dipertahankan:** Rani — Editor ruang media.

### Matriks lima bukti

| Bukti | Fakta yang ditemukan | Hubungan dengan penyelidikan |
|---|---|---|
| شَاشَةُ الْحَاسُوبِ / layar komputer | Tangkapan layar 16.20 menunjukkan folder informasi kosong dan berkas final berada di folder arsip. | Menetapkan lokasi akhir berkas. |
| لَوْحَةُ مَفَاتِيحِ التَّرْمِيزِ / papan ketik | Tiket servis mencatat Dimas memperbaiki papan ketik meja nomor 2 pada 16.05–16.25. | Mendukung alibi Dimas dan membedakan perangkat servis dari laptop editor. |
| وَايْ فَايْ / Wi-Fi | Log router mencatat sesi diagnostik Nisa pada 16.05, 16.14, dan 16.23. | Mendukung alibi Nisa di ruang jaringan. |
| حَاسُوبٌ مَحْمُولٌ / laptop | Riwayat file mencatat pemindahan `/informasi/` ke `/arsip/` oleh akun RANI-02 pada 16.19. | Jejak audit lokal yang menguji pernyataan Rani. |
| تَطْبِيقٌ / aplikasi | Riwayat sinkronisasi aplikasi mencatat berkas final dikirim dari folder arsip melalui akun Rani pada 16.20. | Pemeriksaan independen melalui layanan sinkronisasi. |

### Kalimat puzzle

**يُحَرِّرُ الْمُحَرِّرُ الْمَلَفَّ وَيَحْفَظُهُ فِي الْمُجَلَّدِ الْمُخَصَّصِ** — Editor menyunting berkas dan menyimpannya di folder yang ditentukan.

Kalimat menguji Fi’il Mudhari’ dan langsung berkaitan dengan aktivitas menyunting serta menyimpan berkas. Fokus deduksi adalah folder tujuan dan jejak perubahan.

### Pernyataan dan alibi

| Tersangka | Pernyataan | Hasil pemeriksaan |
|---|---|---|
| Rani (RANI-02) | Hanya menyunting isi berkas, menyimpannya di folder informasi, dan tidak memindahkannya. | Bertentangan dengan riwayat file laptop 16.19 dan sinkronisasi aplikasi 16.20. |
| Dimas (DM-01) | Memperbaiki papan ketik di meja nomor 2. | Didukung tiket servis perangkat. |
| Nisa (NS-06) | Memeriksa Wi-Fi melalui konsol router. | Didukung tiga catatan diagnostik router. |

**Kesimpulan:** Riwayat file laptop dan catatan sinkronisasi merupakan dua sumber terpisah yang menghubungkan pemindahan berkas dengan akun Rani. Tiket servis dan log router mendukung Dimas dan Nisa.

---

## Bab 6 — الأَدْيَانُ فِي إِنْدُونِيسِيَا · Agama-Agama di Indonesia

**Kasus:** Pameran Informasi Keberagaman Indonesia  
**Masalah:** Kartu informasi toleransi berpindah dari kelompok tema ke papan utama sehingga urutan kartu tidak lagi sesuai indeks.  
**Pelaku yang dipertahankan:** Farah — Koordinator kartu informasi.

### Matriks lima bukti

| Bukti | Fakta yang ditemukan | Hubungan dengan penyelidikan |
|---|---|---|
| دِينٌ / agama | Indeks katalog pukul 09.00 menunjukkan kartu tersusun benar; slip pukul 09.12 mencatat Farah mengambil kartu toleransi dari rak kategori. | Menetapkan susunan awal dan pengambilan kartu. |
| مَسْجِدٌ / masjid | Denah panel versi 09.05 buatan Nada menunjukkan posisi panel masjid sesuai kategori. | Mendukung alibi Nada sebagai penyusun denah. |
| كَنِيسَةٌ / gereja | Metadata foto Bima pukul 09.12 menunjukkan dokumentasi panel gereja dari sisi barat. | Mendukung alibi Bima sebagai petugas dokumentasi. |
| مَعْبَدٌ / tempat ibadah | Lembar pemeriksaan denah pada 09.14 menempatkan Nada di meja desain; denah tidak memerintahkan pemindahan kartu toleransi. | Pemeriksaan kedua yang mendukung kegiatan Nada. |
| التَّسَامُحُ / toleransi | Slip pemasangan pada papan utama pukul 09.18 bertanda F-01; perekat belakang kartu masih baru. | Mengonfirmasi pemasangan ulang setelah susunan awal. |

### Kalimat puzzle

**يُصَلِّي الْمُسْلِمُونَ فِي الْمَسَاجِدِ** — Umat Islam salat di masjid-masjid.

Kalimat menguji jumlah fi’liyyah dan menghubungkan kegiatan dengan tempat. Kalimat digunakan untuk memeriksa kategori kartu secara faktual dan netral, bukan menilai keyakinan atau menyebut pelaku.

### Pernyataan dan alibi

| Tersangka | Pernyataan | Hasil pemeriksaan |
|---|---|---|
| Farah (F-01) | Menata kartu menurut tema pada 09.00 dan tidak memindahkannya setelah itu. | Bertentangan dengan slip pengambilan kartu 09.12 dan slip pemasangan ulang 09.18 bertanda F-01. |
| Bima (BM-03) | Mengambil foto pameran dari sisi barat, termasuk panel gereja. | Didukung metadata foto 09.12. |
| Nada (ND-02) | Memeriksa denah panel di meja desain dan tidak memindahkan kartu. | Didukung denah versi awal dan lembar pemeriksaan 09.14. |

**Kesimpulan:** Slip pengambilan dan slip pemasangan ulang merupakan dua catatan terpisah yang bertentangan dengan alibi Farah. Metadata foto dan denah mendukung Bima dan Nada.

---

## Hasil audit lintas kasus

| Pemeriksaan | Hasil |
|---|---|
| Jumlah kasus | 6 |
| Bukti objek | 5 per kasus, total 30; seluruhnya memiliki lokasi, kondisi, waktu, fakta, dan fungsi deduksi. |
| Tersangka | 3 per kasus, total 18; seluruhnya memiliki pernyataan Arab dan terjemahan Indonesia. |
| Pelaku | 1 per kasus; identitas pelaku baseline vNext.4 dipertahankan. |
| Petunjuk kontradiksi pelaku | Minimal 2 petunjuk independen per kasus. |
| Eliminasi tersangka lain | Dua alibi lain masing-masing didukung fakta yang dapat diperiksa. |
| Kebocoran jawaban | Nama pelaku dan rangkaian solusi hanya ditampilkan setelah jawaban benar; catatan polisi lama tidak lagi ditampilkan di kartu tersangka. |
| Umpan balik salah | Spesifik pada bukti yang mendukung alibi pilihan dan mengarahkan siswa memeriksa jejak yang belum cocok tanpa menyebut pelaku. |

**Batasan:** Matriks ini adalah rekonstruksi skenario pembelajaran berdasarkan objek dan peran yang tersedia pada baseline. Waktu, log, label, slip, dan metadata merupakan fakta fiktif yang ditambahkan agar deduksi dapat diuji. Guru dapat meninjau kewajaran konteks lokal sebelum aplikasi digunakan sebagai bahan ajar kelas.
