/**
 * Case-specific deduction data for the six learning investigations.
 * These are fictional classroom scenarios, not claims about real people.
 * Each case is built around observable facts, two independent checks of the
 * guilty suspect's alibi, and affirmative support for the other two alibis.
 */
export const DEDUCTION_CASES = {
  'ch01-shopping': {
    incident: 'Map rekap harga dan berat daging berpindah dari meja penimbangan ke rak R-3 tanpa catatan serah terima.',
    selectionGuidance: "Pada 10.05, Umar memeriksa kartu stok sayuran, lalu mencatat penerimaan peti buah pada 10.16 dan 10.26. Dalam rentang 10.13–10.27, Salma melayani transaksi di meja kasir dan buku serah terima tidak mencatat bahwa ia menerima map. Nabil menyatakan telah menyerahkan map kepada Salma pada 10.15 dan meninggalkan pasar pada 10.18. Namun, tiket timbang dengan ID N-03 tercetak pada 10.24, sedangkan selongsong map ditemukan di rak R-3 pada 10.28 dengan kode pengambilan yang sama. Cocokkan urutan tersebut dengan pernyataan ketiga tokoh sebelum menentukan siapa yang keterangannya bertentangan dengan catatan transaksi dan penimbangan.",
    selectionGuidanceArabic: "فِي السَّاعَةِ ١٠:٠٥، رَاجَعَ عُمَرُ بَطَاقَاتِ مَخْزُونِ الْخُضْرَوَاتِ، ثُمَّ سَجَّلَ اسْتِلَامَ صُنْدُوقَيِ الْفَوَاكِهِ فِي السَّاعَتَيْنِ ١٠:١٦ وَ١٠:٢٦. وَفِي الْفَتْرَةِ مِنَ السَّاعَةِ ١٠:١٣ إِلَى ١٠:٢٧، كَانَتْ سَلْمَى تُسَجِّلُ مُعَامَلَاتِ الْمُشْتَرِينَ عِنْدَ صُنْدُوقِ الدَّفْعِ، وَلَمْ يُسَجَّلْ فِي دَفْتَرِ التَّسْلِيمِ أَنَّهَا اسْتَلَمَتِ الْمَلَفَّ. وَذَكَرَ نَبِيلٌ أَنَّهُ سَلَّمَ الْمَلَفَّ إِلَى سَلْمَى فِي السَّاعَةِ ١٠:١٥، ثُمَّ غَادَرَ السُّوقَ فِي السَّاعَةِ ١٠:١٨. وَلَكِنَّ تَذْكِرَةَ الْوَزْنِ سُجِّلَتْ بِرَمْزِ N-03 فِي السَّاعَةِ ١٠:٢٤، وَوُجِدَ غِلَافُ الْمَلَفِّ فِي الرَّفِّ R-3 فِي السَّاعَةِ ١٠:٢٨ وَعَلَيْهِ رَمْزُ الِاسْتِلَامِ نَفْسُهُ. قَارِنُوا هَذَا التَّسَلْسُلَ بِأَقْوَالِ الشُّخُوصِ الثَّلَاثَةِ لِتَحْدِيدِ الْقَوْلِ الَّذِي تُخَالِفُهُ سِجِلَّاتُ الْمُعَامَلَاتِ وَالْوَزْنِ.",
    logic: { culpritId: 'nabil', contradictionEvidenceIds: ['scale', 'price'], exoneratingEvidence: { salma: ['buyer'], umar: ['vegetables', 'discount'] } },
    evidence: {
      price: {
        location: 'Rak label harga daging, kode R-3',
        condition: 'Selongsong map rekap terselip di balik label harga daging.',
        time: '10.28',
        fact: 'Label menunjukkan harga Rp100.000 per kilogram. Pada sisi selongsong terdapat kode rak R-3 dan tanda pengambilan N-03.',
        deductionUse: 'Menghubungkan kalimat puzzle dengan catatan harga sekaligus menunjukkan tujuan perpindahan map.'
      },
      scale: {
        location: 'Meja penimbangan daging',
        condition: 'Tiket timbang tercetak dan masih tersimpan di baki mesin.',
        time: '10.24',
        fact: 'Tiket timbang terakhir memakai ID petugas N-03. Catatan ini tercetak setelah waktu Nabil menyatakan sudah meninggalkan pasar.',
        deductionUse: 'Menguji klaim waktu Nabil dengan catatan mesin yang dibuat otomatis.'
      },
      vegetables: {
        location: 'Lapak sayuran bagian depan',
        condition: 'Kartu stok memiliki dua paraf pemeriksaan.',
        time: '10.05, 10.18, dan 10.29',
        fact: 'Tiga pemeriksaan stok ditandatangani Umar di lapak sayuran sepanjang rentang waktu kejadian.',
        deductionUse: 'Memberi bukti lokasi yang mendukung alibi Umar.'
      },
      discount: {
        location: 'Lapak buah dekat timbangan',
        condition: 'Tanda terima pemasok dan daftar penerimaan peti buah masih terpasang.',
        time: '10.16 dan 10.26',
        fact: 'Dua penerimaan peti buah dicatat atas nama Umar di lapak buah.',
        deductionUse: 'Menjadi pemeriksaan kedua yang mendukung keberadaan Umar di area lapak.'
      },
      buyer: {
        location: 'Meja kasir',
        condition: 'Struk pembeli dan log mesin kasir tersimpan berurutan.',
        time: '10.13–10.27',
        fact: 'Salma memproses transaksi pembeli secara beruntun. Tidak ada entri penerimaan map rekap pada buku serah terima kasir.',
        deductionUse: 'Mendukung alibi Salma dan menguji klaim bahwa map telah diserahkan kepadanya.'
      }
    },
    puzzleContext: {
      focus: 'Harga daging, nilai seratus ribu rupiah, dan satuan per kilogram.',
      investigativeReading: 'Kalimat mengidentifikasi catatan harga yang berkaitan dengan meja penimbangan. Cocokkan label harga dengan tiket timbang; kalimat ini tidak menyebut pelaku.',
      evidenceIds: ['price', 'scale']
    },
    suspects: {
      nabil: {
        identityNote: 'Kode petugas penimbangan: N-03.',
        statement: 'Saya menyerahkan map kepada Salma di meja kasir pukul 10.15, lalu meninggalkan pasar pukul 10.18.',
        arabic: 'سَلَّمْتُ الْمَلَفَّ إِلَى سَلْمَى عِنْدَ صُنْدُوقِ الدَّفْعِ، ثُمَّ غَادَرْتُ السُّوقَ.',
        translation: 'Saya menyerahkan map kepada Salma di meja kasir, kemudian meninggalkan pasar.',
        wrongFeedback: ''
      },
      salma: {
        identityNote: 'ID operator kasir: S-02.',
        statement: 'Saya berada di meja kasir dan mencatat transaksi pembeli pada pukul 10.13–10.27. Buku serah terima tidak mencatat bahwa saya menerima map.',
        arabic: 'بَقِيتُ عِنْدَ صُنْدُوقِ الدَّفْعِ وَسَجَّلْتُ مُعَامَلَاتِ الْمُشْتَرِينَ مِنَ السَّاعَةِ ١٠:١٣ إِلَى ١٠:٢٧، وَلَمْ أَسْتَلِمِ الْمَلَفَّ.',
        translation: 'Saya berada di meja kasir dan mencatat transaksi pembeli pada pukul 10.13–10.27. Saya tidak menerima map.',
        wrongFeedback: 'Struk pembeli dan log mesin kasir sama-sama mencatat aktivitas di meja kasir pada 10.13–10.27. Kedua catatan itu mendukung pernyataan tokoh ini. Periksa catatan serah terima dan tiket timbang setelah 10.18.'
      },
      umar: {
        identityNote: 'ID petugas stok: U-04.',
        statement: 'Saya menata buah dan sayuran di lapak dari sekitar pukul 10.05 sampai 10.30.',
        arabic: 'رَتَّبْتُ الْفَوَاكِهَ وَالْخَضْرَوَاتِ فِي السُّوقِ.',
        translation: 'Saya menata buah-buahan dan sayuran di lapak.',
        wrongFeedback: 'Kartu stok sayuran dan tanda terima peti buah mencatat aktivitas di dua lapak pada 10.05–10.30. Bukti tersebut mendukung alibi tokoh ini. Bandingkan waktu perpindahan map dengan catatan petugas penimbangan.'
      }
    },
    solution: {
      culpritId: 'nabil',
      steps: [
        { heading: 'Identifikasi dokumen', explanation: 'Kalimat puzzle menyebut harga daging per kilogram. Label harga dan tiket timbang menunjukkan bahwa map yang dicari berkaitan dengan meja penimbangan.', evidenceIds: ['price', 'scale'] },
        { heading: 'Uji waktu penyerahan', explanation: 'Nabil menyatakan map sudah diserahkan dan ia meninggalkan pasar pada 10.18. Tiket timbang dengan ID N-03 tercetak pada 10.24, sehingga klaim bahwa ia sudah meninggalkan area tidak cocok.', evidenceIds: ['scale'] },
        { heading: 'Uji lokasi map', explanation: 'Selongsong map ditemukan di rak R-3 pada 10.28 dengan tanda pengambilan N-03. Ini merupakan petunjuk kedua yang berdiri sendiri dan menghubungkan map dengan petugas penimbangan.', evidenceIds: ['price'] }
      ],
      eliminations: [
        { suspectId: 'salma', reason: 'Log kasir dan struk pembeli menunjukkan Salma sedang melayani transaksi; buku serah terima juga tidak mencatat map diterima olehnya.', evidenceIds: ['buyer'] },
        { suspectId: 'umar', reason: 'Kartu stok sayuran dan tanda terima peti buah menempatkan Umar di dua lapak sepanjang rentang kejadian.', evidenceIds: ['vegetables', 'discount'] }
      ],
      conclusion: 'Dua catatan independen—tiket timbang setelah waktu yang diklaim dan tanda pengambilan pada selongsong map—bertentangan dengan alibi Nabil. Catatan transaksi mendukung Salma, sedangkan dua catatan stok mendukung Umar.'
    }
  },

  'ch02-health': {
    incident: 'Lembar prosedur pemeriksaan pasien terpisah dari map pendaftaran dan tercatat berada di kabinet meja informasi.',
    selectionGuidance: "Pada 09.12, suhu pasien nomor 21 dicatat dan sampelnya diproses melalui akun analis A-07 pada 09.17. Huda menyatakan telah menyerahkan map prosedur ke ruang dokter pada 09.15. Akan tetapi, log kartu H-01 menunjukkan kabinet meja informasi dibuka dan label map PROSEDUR-21 dipindai pada 09.18. Pasien baru dipanggil ke ruang dokter pada 09.26, sedangkan resep pukul 09.31 masih mencatat bahwa lampiran belum diterima. Pada 09.34, Salim tercatat menyerahkan obat di apotek. Bandingkan waktu akses kabinet, antrean pasien, dan catatan layanan untuk menguji pernyataan ketiga petugas.",
    selectionGuidanceArabic: "فِي السَّاعَةِ ٩:١٢، سُجِّلَتْ دَرَجَةُ حَرَارَةِ الْمَرِيضِ رَقْمَ ٢١، وَفُحِصَتْ عَيِّنَتُهُ بِحِسَابِ الْمُحَلِّلِ A-07 فِي السَّاعَةِ ٩:١٧. وَذَكَرَتْ هُدَى أَنَّهَا سَلَّمَتْ مَلَفَّ الْإِجْرَاءِ إِلَى غُرْفَةِ الطَّبِيبِ فِي السَّاعَةِ ٩:١٥. وَلَكِنَّ سِجِلَّ الْبِطَاقَةِ H-01 يُظْهِرُ فَتْحَ خِزَانَةِ مَكْتَبِ الِاسْتِعْلَامَاتِ وَمَسْحَ مُلْصَقِ الْمَلَفِّ PROSEDUR-21 فِي السَّاعَةِ ٩:١٨. وَلَمْ يُنَادَ الْمَرِيضُ إِلَى غُرْفَةِ الطَّبِيبِ إِلَّا فِي السَّاعَةِ ٩:٢٦، وَكَانَتِ الْوَصْفَةُ الْمَكْتُوبَةُ فِي السَّاعَةِ ٩:٣١ تُشِيرُ إِلَى أَنَّ الْمُرْفَقَ لَمْ يَصِلْ بَعْدُ. وَفِي السَّاعَةِ ٩:٣٤، سَجَّلَ سَالِمٌ تَسْلِيمَ الدَّوَاءِ فِي الصَّيْدَلِيَّةِ. قَارِنُوا وَقْتَ فَتْحِ الْخِزَانَةِ وَنِظَامَ الْمَوَاعِيدِ وَسِجِلَّاتِ الْخِدْمَةِ لِفَحْصِ أَقْوَالِ الْمُوَظَّفِينَ الثَّلَاثَةِ.",
    logic: { culpritId: 'huda', contradictionEvidenceIds: ['hospital', 'nurse'], exoneratingEvidence: { salim: ['medicine'], amin: ['thermometer'] } },
    evidence: {
      thermometer: {
        location: 'Meja pemeriksaan awal pasien',
        condition: 'Kartu pemeriksaan suhu terisi dan memuat nomor antrean pasien 21.',
        time: '09.12',
        fact: 'Suhu pasien dicatat pada 09.12. Label sampel yang terhubung dengan kartu itu diterima laboratorium dan diproses melalui akun analis A-07 pada 09.17.',
        deductionUse: 'Menetapkan urutan awal proses kunjungan pasien.'
      },
      prescription: {
        location: 'Papan resep dokter',
        condition: 'Resep dokter terisi, tetapi kolom lampiran prosedur diberi tanda belum diterima.',
        time: '09.31',
        fact: 'Dokter menulis bahwa lembar prosedur pasien 21 belum ada di map ketika resep dibuat.',
        deductionUse: 'Memeriksa apakah berkas benar-benar telah sampai ke dokter.'
      },
      hospital: {
        location: 'Monitor antrean ruang dokter',
        condition: 'Riwayat nomor antrean masih tampil pada layar.',
        time: '09.26',
        fact: 'Pasien nomor 21 baru dipanggil ke ruang dokter pada 09.26; ruang dokter belum menerima pasien itu pada 09.15.',
        deductionUse: 'Menguji urutan waktu yang diklaim dalam alibi Huda.'
      },
      medicine: {
        location: 'Loket apotek',
        condition: 'Log penyerahan obat memuat nomor resep dan paraf petugas.',
        time: '09.34',
        fact: 'Salim tercatat menyiapkan dan menyerahkan obat sesuai resep pada 09.34.',
        deductionUse: 'Memberi bukti waktu dan lokasi yang mendukung alibi Salim.'
      },
      nurse: {
        location: 'Kabinet dokumen meja informasi',
        condition: 'Log akses kartu petugas dan pemindaian label map masih tersimpan.',
        time: '09.18',
        fact: 'Kartu akses Huda membuka kabinet meja informasi; label map PROSEDUR-21 dipindai pada menit yang sama.',
        deductionUse: 'Menunjukkan lokasi map setelah Huda menyatakan telah menyerahkannya ke dokter.'
      }
    },
    puzzleContext: {
      focus: 'Muhammad pergi ke rumah sakit untuk menjalani pemeriksaan.',
      investigativeReading: 'Kalimat menetapkan lokasi dan tujuan kunjungan pasien. Cocokkan urutan pemeriksaan awal, panggilan dokter, dan catatan perpindahan berkas.',
      evidenceIds: ['thermometer', 'hospital', 'prescription']
    },
    suspects: {
      huda: {
        identityNote: 'Kartu akses perawat: H-01.',
        statement: 'Saya menyerahkan map prosedur ke ruang dokter pukul 09.15, lalu kembali ke meja pendaftaran.',
        arabic: 'سَلَّمْتُ مَلَفَّ الْإِجْرَاءِ إِلَى غُرْفَةِ الطَّبِيبِ، ثُمَّ عُدْتُ إِلَى مَكْتَبِ التَّسْجِيلِ.',
        translation: 'Saya menyerahkan map prosedur ke ruang dokter, kemudian kembali ke meja pendaftaran.',
        wrongFeedback: ''
      },
      salim: {
        identityNote: 'ID petugas apotek: S-04.',
        statement: 'Saya menyiapkan dan menyerahkan obat di loket apotek pada pukul 09.34, setelah resep diterbitkan.',
        arabic: 'أَعْدَدْتُ الدَّوَاءَ وَسَلَّمْتُهُ فِي شُبَّاكِ الصَّيْدَلِيَّةِ فِي السَّاعَةِ ٩:٣٤ بَعْدَ صُدُورِ الْوَصْفَةِ.',
        translation: 'Saya menyiapkan dan menyerahkan obat di loket apotek pada pukul 09.34 setelah resep diterbitkan.',
        wrongFeedback: 'Log apotek mencatat penyerahan obat oleh Salim pada 09.34, sesuai urutan setelah resep dokter. Bukti ini mendukung keterangannya. Periksa waktu pasien dipanggil dan log akses kabinet dokumen.'
      },
      amin: {
        identityNote: 'ID analis laboratorium: A-07.',
        statement: 'Saya memeriksa sampel pasien di laboratorium melalui akun analis A-07 pada pukul 09.17.',
        arabic: 'فَحَصْتُ عَيِّنَةَ الْمَرِيضِ فِي الْمُخْتَبَرِ بِحِسَابِ الْمُحَلِّلِ A-07 فِي السَّاعَةِ ٩:١٧.',
        translation: 'Saya memeriksa sampel pasien di laboratorium melalui akun analis A-07 pada pukul 09.17.',
        wrongFeedback: 'Catatan sampel dan log alat laboratorium menunjukkan pekerjaan Amin pada rentang pemeriksaan pasien. Bukti itu mendukung alibinya. Bandingkan log kabinet meja informasi dengan waktu berkas dinyatakan belum diterima dokter.'
      }
    },
    solution: {
      culpritId: 'huda',
      steps: [
        { heading: 'Susun urutan layanan', explanation: 'Kartu suhu dibuat pada 09.12, pasien baru dipanggil ke ruang dokter pada 09.26, dan resep diterbitkan pada 09.31. Dengan urutan ini, berkas tidak mungkin sudah diterima dokter pada 09.15.', evidenceIds: ['thermometer', 'hospital', 'prescription'] },
        { heading: 'Periksa lokasi map', explanation: 'Pada 09.18, kartu akses Huda membuka kabinet meja informasi dan label map PROSEDUR-21 dipindai di sana. Fakta ini bertentangan dengan pernyataan bahwa map sudah diserahkan ke ruang dokter.', evidenceIds: ['nurse'] },
        { heading: 'Cocokkan pekerjaan petugas lain', explanation: 'Log apotek menempatkan Salim di loket saat obat diserahkan, sedangkan log laboratorium menempatkan Amin pada pemeriksaan sampel.', evidenceIds: ['medicine', 'thermometer'] }
      ],
      eliminations: [
        { suspectId: 'salim', reason: 'Log penyerahan obat dan waktu penerbitan resep mendukung pekerjaan Salim di apotek.', evidenceIds: ['medicine', 'prescription'] },
        { suspectId: 'amin', reason: 'Catatan sampel dan penggunaan alat mendukung pekerjaan Amin di laboratorium.', evidenceIds: ['thermometer'] }
      ],
      conclusion: 'Urutan antrean dan catatan akses kabinet merupakan dua pemeriksaan terpisah yang menggugurkan alibi Huda. Catatan apotek dan laboratorium mendukung dua petugas lainnya.'
    }
  },

  'ch03-travel': {
    incident: 'Kartu rute rombongan tidak cocok dengan manifes penerbangan dan label bagasi.',
    selectionGuidance: "Manifes yang disalin pada 07.30 mencatat penerbangan GA218 menuju Surabaya. Pada 07.46, akun jadwal FRS-07 mengubah tujuan kartu rute menjadi Denpasar, lalu mencetak ulang kartu pada 07.48. Pada 07.52, label koper masih menunjukkan GA218–Surabaya, sedangkan kartu rute sisipan menunjukkan Denpasar; log pada waktu yang sama mencatat Yusuf memindai bagasi. Daftar boarding kemudian menempatkan Aisyah bersama rombongan di Gerbang 3 pada 07.55. Cocokkan manifes, riwayat terminal, label bagasi, dan lokasi petugas untuk menentukan pernyataan siapa yang bertentangan dengan perubahan rute.",
    selectionGuidanceArabic: "فِي السَّاعَةِ ٧:٣٠، سَجَّلَ الْمَانِيفِسْتُ رِحْلَةَ GA218 بِاتِّجَاهِ سُورَابَايَا. وَفِي السَّاعَةِ ٧:٤٦، غَيَّرَ حِسَابُ الْجَدْوَلِ FRS-07 وِجْهَةَ بِطَاقَةِ الرِّحْلَةِ إِلَى دِنْبَاسَارَ، ثُمَّ أَعَادَ طِبَاعَتَهَا فِي السَّاعَةِ ٧:٤٨. وَفِي السَّاعَةِ ٧:٥٢، ظَلَّتْ عَلَامَةُ الْحَقِيبَةِ تُشِيرُ إِلَى GA218–سُورَابَايَا، بَيْنَمَا أَشَارَتْ بِطَاقَةُ الرِّحْلَةِ الْمُدْرَجَةُ إِلَى دِنْبَاسَارَ، وَسَجَّلَ السِّجِلُ فِي الْوَقْتِ نَفْسِهِ أَنَّ يُوسُفَ فَحَصَ الْحَقَائِبَ. وَبَعْدَ ذَلِكَ، أَظْهَرَتْ قَائِمَةُ الصُّعُودِ وُجُودَ عَائِشَةَ مَعَ الْمَجْمُوعَةِ عِنْدَ الْبَوَّابَةِ الثَّالِثَةِ فِي السَّاعَةِ ٧:٥٥. قَارِنُوا الْمَانِيفِسْتَ وَسِجِلَّ الْمَحَطَّةِ وَعَلَامَاتِ الْحَقَائِبِ وَمَوَاقِعَ الْمُوَظَّفِينَ لِتَحْدِيدِ الْقَوْلِ الَّذِي يُخَالِفُ تَغْيِيرَ الْوِجْهَةِ.",
    logic: { culpritId: 'faris', contradictionEvidenceIds: ['airport', 'suitcase'], exoneratingEvidence: { aisyah: ['hotel'], yusuf: ['beach'] } },
    evidence: {
      passport: {
        location: 'Meja pemeriksaan dokumen keberangkatan',
        condition: 'Manifes penumpang dan salinan kartu perjalanan berada di dalam map paspor rombongan.',
        time: '07.30',
        fact: 'Manifes awal mencatat penerbangan GA218 menuju Surabaya pada hari Ahad. Salinan ini dibuat sebelum kartu rute dibagikan.',
        deductionUse: 'Menjadi acuan tujuan asli untuk dibandingkan dengan kartu rute yang tertukar.'
      },
      airport: {
        location: 'Terminal informasi keberangkatan',
        condition: 'Riwayat perubahan papan informasi dan log cetak kartu masih tersedia.',
        time: '07.46–07.48',
        fact: 'Akun jadwal FRS-07 mengubah kartu rute dari Surabaya menjadi Denpasar pada 07.46 dan mencetak ulang kartu pada 07.48.',
        deductionUse: 'Mencatat akun dan waktu perubahan rute.'
      },
      suitcase: {
        location: 'Area pemeriksaan bagasi',
        condition: 'Label bagasi terpasang pada koper, sedangkan kartu rute sisipan berada di saku luar.',
        time: '07.52',
        fact: 'Label koper menunjukkan GA218–Surabaya, tetapi kartu rute sisipan menunjukkan Denpasar. Pemindaian bagasi dilakukan petugas Yusuf.',
        deductionUse: 'Mengonfirmasi bahwa kartu rute, bukan manifes atau label bagasi, yang berubah.'
      },
      hotel: {
        location: 'Gerbang keberangkatan 3',
        condition: 'Daftar pemindaian boarding rombongan tersimpan di petugas gerbang.',
        time: '07.55',
        fact: 'Aisyah tercatat mendampingi rombongan di Gerbang 3 ketika proses boarding dimulai.',
        deductionUse: 'Mendukung alibi Aisyah sebagai pemandu rombongan.'
      },
      beach: {
        location: 'Sabuk bagasi B',
        condition: 'Log pemindaian troli dan serah terima koper tercatat dua kali.',
        time: '07.52 dan 08.05',
        fact: 'Yusuf tercatat memeriksa koper rombongan di sabuk bagasi B pada dua waktu tersebut.',
        deductionUse: 'Mendukung alibi Yusuf sebagai petugas bagasi.'
      }
    },
    puzzleContext: {
      focus: 'Fatih bepergian ke Indonesia pada hari Ahad dengan pesawat.',
      investigativeReading: 'Kalimat menetapkan moda perjalanan dan waktu keberangkatan. Manifes paspor, papan bandara, dan label bagasi harus menunjukkan rute yang sama.',
      evidenceIds: ['passport', 'airport', 'suitcase']
    },
    suspects: {
      faris: {
        identityNote: 'Akun jadwal terminal: FRS-07.',
        statement: 'Saya mencetak kartu rute pada pagi hari dan tidak mengubah tujuan penerbangan yang sudah ditetapkan.',
        arabic: 'طَبَعْتُ بِطَاقَاتِ الرِّحْلَةِ فِي الصَّبَاحِ، وَلَمْ أُغَيِّرْ وِجْهَةَ الرِّحْلَةِ الْمُحَدَّدَةَ.',
        translation: 'Saya mencetak kartu rute pada pagi hari dan tidak mengubah tujuan penerbangan yang sudah ditetapkan.',
        wrongFeedback: ''
      },
      aisyah: {
        identityNote: 'ID pemandu rombongan: AS-03.',
        statement: 'Saya menunggu dan mendampingi rombongan di Gerbang 3 pada pukul 07.55 saat proses boarding dimulai.',
        arabic: 'اِنْتَظَرْتُ الْمَجْمُوعَةَ وَرَافَقْتُهَا عِنْدَ الْبَوَّابَةِ الثَّالِثَةِ فِي السَّاعَةِ ٧:٥٥.',
        translation: 'Saya menunggu dan mendampingi rombongan di Gerbang 3 pada pukul 07.55.',
        wrongFeedback: 'Daftar boarding mencatat Aisyah bersama rombongan di Gerbang 3 pada 07.55. Catatan ini mendukung pernyataannya. Bandingkan versi kartu rute dengan manifes awal dan log perubahan terminal.'
      },
      yusuf: {
        identityNote: 'ID petugas bagasi: YS-02.',
        statement: 'Saya memeriksa koper rombongan di sabuk bagasi B pada pukul 07.52 dan 08.05.',
        arabic: 'فَحَصْتُ حَقَائِبَ الْمَجْمُوعَةِ عِنْدَ سَيْرِ الْأَمْتِعَةِ بَاءٍ فِي السَّاعَتَيْنِ ٧:٥٢ وَ٨:٠٥.',
        translation: 'Saya memeriksa koper rombongan di sabuk bagasi B pada pukul 07.52 dan 08.05.',
        wrongFeedback: 'Dua pemindaian troli menempatkan Yusuf di sabuk bagasi B pada 07.52 dan 08.05. Bukti ini mendukung alibinya. Periksa siapa yang memiliki akun pada log perubahan kartu rute.'
      }
    },
    solution: {
      culpritId: 'faris',
      steps: [
        { heading: 'Tetapkan rute asli', explanation: 'Manifes pada map paspor mencatat GA218 menuju Surabaya. Label koper juga menunjukkan kode penerbangan dan tujuan yang sama.', evidenceIds: ['passport', 'suitcase'] },
        { heading: 'Temukan perubahan kartu', explanation: 'Riwayat terminal mencatat akun FRS-07 mengubah kartu rute menjadi Denpasar pada 07.46 dan mencetak ulang pada 07.48. Ini bertentangan dengan pernyataan bahwa tidak ada perubahan setelah pencetakan awal.', evidenceIds: ['airport'] },
        { heading: 'Eliminasi petugas di lokasi lain', explanation: 'Aisyah tercatat di gerbang boarding, sedangkan Yusuf tercatat memeriksa bagasi. Keduanya memiliki catatan aktivitas yang sesuai dengan alibinya.', evidenceIds: ['hotel', 'beach'] }
      ],
      eliminations: [
        { suspectId: 'aisyah', reason: 'Daftar boarding menempatkan Aisyah bersama rombongan di Gerbang 3.', evidenceIds: ['hotel'] },
        { suspectId: 'yusuf', reason: 'Log pemindaian bagasi menempatkan Yusuf di sabuk bagasi B.', evidenceIds: ['suitcase', 'beach'] }
      ],
      conclusion: 'Manifes dan label bagasi sepakat tentang tujuan asli. Log terminal membuktikan ada perubahan rute setelah kartu awal dicetak, sementara Aisyah dan Yusuf tercatat bekerja di lokasi tugas masing-masing.'
    }
  },

  'ch04-hajj-umrah': {
    incident: 'Urutan halaman jurnal perjalanan haji dan umrah berubah pada salinan yang akan dicetak.',
    selectionGuidance: "Pada 08.00–08.45, daftar mencatat pembagian pakaian ihram sebelum rombongan berangkat. Zahra membantu mencocokkan koper di area penyimpanan pada 13.10–14.20. Setelah itu, rekaman CCTV dan log petugas ZH-05 menempatkan Zahra di pos pemeriksaan keberangkatan pada 14.27–14.48. Pada rentang 14.30–15.00, inventaris sajadah dan daftar pemeriksaan glosarium menempatkan Salim di meja informasi. Sementara itu, Amin meminjam jurnal induk dengan kartu AM-04 pada 14.35, lalu akun yang sama mengekspor salinan pada 14.42 dengan urutan halaman yang berubah. Bandingkan catatan keberadaan Zahra dan Salim dengan dua jejak akses jurnal untuk menguji pernyataan ketiga tokoh.",
    selectionGuidanceArabic: "فِي الْفَتْرَةِ مِنَ السَّاعَةِ ٨:٠٠ إِلَى ٨:٤٥، سَجَّلَتِ الْقَائِمَةُ تَوْزِيعَ لِبَاسِ الْإِحْرَامِ قَبْلَ انْطِلَاقِ الْمَجْمُوعَةِ. وَسَاعَدَتْ زَهْرَةُ فِي مُطَابَقَةِ حَقَائِبِ الْمَجْمُوعَةِ فِي مَكَانِ التَّخْزِينِ مِنَ السَّاعَةِ ١٣:١٠ إِلَى ١٤:٢٠. وَبَعْدَ ذَلِكَ، أَظْهَرَتْ تَسْجِيلَاتُ كَامِيرَا الْمُرَاقَبَةِ وَسِجِلُّ الْمُوَظَّفِ ZH-05 أَنَّ زَهْرَةَ كَانَتْ فِي مَرْكَزِ فَحْصِ الْمُغَادَرَةِ مِنَ السَّاعَةِ ١٤:٢٧ إِلَى ١٤:٤٨. وَفِي الْفَتْرَةِ مِنَ السَّاعَةِ ١٤:٣٠ إِلَى ١٥:٠٠، دَلَّ جَرْدُ سَجَّادَاتِ الصَّلَاةِ وَقَائِمَةُ مُرَاجَعَةِ الْمُفْرَدَاتِ عَلَى أَنَّ سَلِيمًا كَانَ فِي مَكْتَبِ الْمَعْلُومَاتِ. وَفِي السَّاعَةِ ١٤:٣٥، اسْتَعَارَ أَمِينٌ الْمُذَكِّرَةَ الْأَصْلِيَّةَ بِبِطَاقَةِ الْمُوَظَّفِ AM-04، ثُمَّ صَدَّرَ الْحِسَابُ نَفْسُهُ نُسْخَةً فِي السَّاعَةِ ١٤:٤٢ مَعَ تَغَيُّرِ تَرْتِيبِ الصَّفَحَاتِ. قَارِنُوا سِجِلَّاتِ وُجُودِ زَهْرَةَ وَسَلِيمٍ بِدَلِيلَيِ الدُّخُولِ إِلَى الْمُذَكِّرَةِ لِفَحْصِ أَقْوَالِ الشُّخُوصِ الثَّلَاثَةِ.",
    logic: { culpritId: 'amin', contradictionEvidenceIds: ['kaaba', 'arafah'], exoneratingEvidence: { zahra: ['sai'], salim: ['madinah'] } },
    evidence: {
      ihram: {
        location: 'Meja perlengkapan ihram',
        condition: 'Daftar pembagian perlengkapan memuat waktu persiapan dan keberangkatan rombongan.',
        time: '08.00–08.45',
        fact: 'Daftar mencatat pembagian ihram sebelum keberangkatan. Urutan ini menjadi bagian awal kronologi perjalanan.',
        deductionUse: 'Memberi patokan urutan kegiatan sebelum rangkaian manasik.'
      },
      kaaba: {
        location: 'Map paspor rombongan',
        condition: 'Slip peminjaman jurnal terselip di sampul map perjalanan.',
        time: '14.35',
        fact: 'Jurnal induk dipinjam dengan kartu petugas AM-04 atas nama Amin pada 14.35.',
        deductionUse: 'Menetapkan siapa yang menguasai jurnal sebelum salinan halaman diubah.'
      },
      sai: {
        location: 'Area penyimpanan koper dan pos pemeriksaan keberangkatan',
        condition: 'Label penitipan, log pemindaian, rekaman CCTV berkelanjutan, dan log petugas ZH-05 tersimpan dalam berkas pemeriksaan.',
        time: '13.10–14.20; 14.27–14.48',
        fact: 'Label penitipan dan log pemindaian mencatat Zahra membantu mencocokkan koper pada 13.10–14.20. Rekaman CCTV berkelanjutan serta log petugas ZH-05 menempatkan Zahra di pos pemeriksaan keberangkatan pada 14.27–14.48 dan tidak menunjukkan ia meninggalkan pos. Rentang ini mencakup waktu peminjaman jurnal pada 14.35 dan ekspor salinan pada 14.42.',
        deductionUse: 'Dua catatan lanjutan menutup celah kronologi setelah pukul 14.20 dan mendukung alibi Zahra selama seluruh rentang kejadian utama.'
      },
      arafah: {
        location: 'Meja penyuntingan buku panduan haji',
        condition: 'Bukti cetak memiliki metadata ekspor dan urutan halaman.',
        time: '14.42',
        fact: 'Akun AM-04 mengekspor salinan jurnal dengan urutan halaman 1, 2, 5, 3, 4, 6, 7, 8.',
        deductionUse: 'Menjadi bukti kedua tentang perubahan urutan halaman oleh akun penyunting.'
      },
      madinah: {
        location: 'Meja informasi perlengkapan salat',
        condition: 'Kartu inventaris sajadah dan daftar pemeriksaan istilah disatukan.',
        time: '14.30–15.00',
        fact: 'Salim tercatat memeriksa inventaris sajadah dan glosarium manasik di meja informasi.',
        deductionUse: 'Mendukung alibi Salim yang menyatakan sedang memeriksa istilah.'
      }
    },
    puzzleContext: {
      focus: 'Jamaah haji melakukan tawaf mengelilingi Ka’bah sebanyak tujuh putaran.',
      investigativeReading: 'Kalimat memberi satu peristiwa manasik yang dapat ditempatkan pada kronologi. Bandingkan urutan kegiatan dengan daftar persiapan dan salinan jurnal.',
      evidenceIds: ['ihram', 'kaaba', 'arafah']
    },
    suspects: {
      amin: {
        identityNote: 'Akun penyunting jurnal: AM-04.',
        statement: 'Saya hanya memeriksa istilah manasik dan tidak mengubah urutan halaman jurnal.',
        arabic: 'رَاجَعْتُ مُصْطَلَحَاتِ الْمَنَاسِكِ فَقَطْ، وَلَمْ أُغَيِّرْ تَرْتِيبَ صَفَحَاتِ الْمُذَكِّرَةِ.',
        translation: 'Saya hanya memeriksa istilah manasik dan tidak mengubah urutan halaman jurnal.',
        wrongFeedback: ''
      },
      zahra: {
        identityNote: 'ID peserta dan petugas penitipan: ZH-05.',
        statement: 'Saya membantu mencocokkan koper rombongan di area penyimpanan sampai pukul 14.20. Setelah itu saya bertugas di pos pemeriksaan keberangkatan sampai pukul 14.48.',
        arabic: 'سَاعَدْتُ فِي مُطَابَقَةِ حَقَائِبِ الْمَجْمُوعَةِ فِي مَكَانِ التَّخْزِينِ حَتَّى السَّاعَةِ ١٤:٢٠، ثُمَّ عَمِلْتُ فِي مَرْكَزِ فَحْصِ الْمُغَادَرَةِ حَتَّى السَّاعَةِ ١٤:٤٨.',
        translation: 'Saya membantu mencocokkan koper rombongan di area penyimpanan sampai pukul 14.20. Setelah itu saya bertugas di pos pemeriksaan keberangkatan sampai pukul 14.48.',
        wrongFeedback: 'Label penitipan dan log pemindaian mencatat Zahra di area koper pada 13.10–14.20. Rekaman CCTV berkelanjutan dan log petugas ZH-05 menempatkannya di pos pemeriksaan keberangkatan pada 14.27–14.48 tanpa jeda keberangkatan dari pos. Bukti ini mendukung alibinya. Periksa slip peminjaman jurnal dan metadata ekspor AM-04.'
      },
      salim: {
        identityNote: 'ID petugas informasi: SL-02.',
        statement: 'Saya memeriksa istilah haji dan umrah serta inventaris sajadah di meja informasi pada pukul 14.30–15.00.',
        arabic: 'رَاجَعْتُ مُفْرَدَاتِ الْحَجِّ وَالْعُمْرَةِ وَجَرْدَ سَجَّادَاتِ الصَّلَاةِ فِي مَكْتَبِ الْمَعْلُومَاتِ مِنَ السَّاعَةِ ١٤:٣٠ إِلَى ١٥:٠٠.',
        translation: 'Saya memeriksa kosakata haji dan umrah serta inventaris sajadah di meja informasi pada pukul 14.30–15.00.',
        wrongFeedback: 'Kartu inventaris sajadah dan daftar pemeriksaan glosarium menempatkan Salim di meja informasi pada 14.30–15.00. Bukti tersebut mendukung keterangannya. Bandingkan waktu akses jurnal dengan waktu ekspor salinan.'
      }
    },
    solution: {
      culpritId: 'amin',
      steps: [
        { heading: 'Bangun kronologi perjalanan', explanation: 'Daftar ihram menunjukkan persiapan sebelum keberangkatan. Kalimat puzzle memberi peristiwa tawaf sebagai bagian dari urutan kegiatan manasik.', evidenceIds: ['ihram'] },
        { heading: 'Periksa akses jurnal induk', explanation: 'Slip pada map paspor mencatat Amin meminjam jurnal induk pada 14.35, meskipun ia menyatakan hanya memeriksa istilah dan tidak mengubah urutan.', evidenceIds: ['kaaba'] },
        { heading: 'Periksa salinan hasil ekspor', explanation: 'Metadata bukti cetak pada 14.42 menunjukkan akun AM-04 mengekspor halaman dalam urutan 1, 2, 5, 3, 4, 6, 7, 8. Ini menjadi bukti independen bahwa urutan salinan berubah.', evidenceIds: ['arafah'] }
      ],
      eliminations: [
        { suspectId: 'zahra', reason: 'Log penitipan mencatat Zahra di area koper sampai 14.20, lalu rekaman CCTV berkelanjutan dan log ZH-05 menempatkannya di pos pemeriksaan keberangkatan pada 14.27–14.48 tanpa catatan meninggalkan pos, termasuk saat jurnal dipinjam dan diekspor.', evidenceIds: ['sai'] },
        { suspectId: 'salim', reason: 'Inventaris sajadah dan daftar pemeriksaan glosarium mendukung kegiatan Salim di meja informasi.', evidenceIds: ['madinah'] }
      ],
      conclusion: 'Akses jurnal induk pada 14.35 dan metadata ekspor ulang pada 14.42 merupakan dua jejak terpisah yang menghubungkan perubahan halaman dengan Amin. Catatan koper yang disambung dengan CCTV berkelanjutan dan log ZH-05 menutup celah keberadaan Zahra, sedangkan inventaris sajadah dan glosarium mendukung alibi Salim.'
    }
  },

  'ch05-ict': {
    incident: 'Berkas informasi digital ditemukan pada folder arsip, bukan pada folder informasi yang ditentukan.',
    selectionGuidance: "Pada 16.05–16.25, tiket servis menempatkan Dimas di meja operator nomor 2 untuk memperbaiki papan ketik, sedangkan log diagnostik mencatat Nisa menggunakan konsol router pada 16.05, 16.14, dan 16.23. Rani menyatakan hanya menyunting berkas dan menyimpannya di folder /informasi/. Namun, riwayat laptop mencatat akun RANI-02 memindahkan berkas dari /informasi/ ke /arsip/ pada 16.19. Catatan sinkronisasi aplikasi pada 16.20 menggunakan akun yang sama, dan tangkapan layar pukul 16.20 memperlihatkan berkas final berada di /arsip/. Cocokkan jejak akun dan waktu dengan pernyataan ketiga petugas.",
    selectionGuidanceArabic: "فِي الْفَتْرَةِ مِنَ السَّاعَةِ ١٦:٠٥ إِلَى ١٦:٢٥، وَتُثْبِتُ تَذْكِرَةُ الصِّيَانَةِ أَنَّ دِيمَاسَ كَانَ فِي مَحَطَّةِ الْعَمَلِ رَقْمَ ٢ لِإِصْلَاحِ لَوْحَةِ الْمَفَاتِيحِ، بَيْنَمَا سَجَّلَ نِظَامُ التَّشْخِيصِ اسْتِخْدَامَ نِيسَا لِوَحْدَةِ تَحَكُّمِ الْمُوَجِّهِ فِي السَّاعَاتِ ١٦:٠٥ وَ١٦:١٤ وَ١٦:٢٣. وَذَكَرَتْ رَانِي أَنَّهَا حَرَّرَتِ الْمَلَفَّ فَقَطْ وَحَفِظَتْهُ فِي مُجَلَّدِ /informasi/. وَلَكِنَّ سِجِلَّ الْحَاسُوبِ يُظْهِرُ أَنَّ حِسَابَ RANI-02 نَقَلَ الْمَلَفَّ مِنْ /informasi/ إِلَى /arsip/ فِي السَّاعَةِ ١٦:١٩. وَسَجَّلَ تَطْبِيقُ الْمُزَامَنَةِ فِي السَّاعَةِ ١٦:٢٠ اسْتِخْدَامَ الْحِسَابِ نَفْسِهِ، وَأَظْهَرَتْ لَقْطَةُ الشَّاشَةِ فِي الْوَقْتِ نَفْسِهِ وُجُودَ الْمَلَفِّ النِّهَائِيِّ فِي مُجَلَّدِ /arsip/. قَارِنُوا آثَارَ الْحِسَابَاتِ وَالْأَوْقَاتِ بِأَقْوَالِ الْمُوَظَّفِينَ الثَّلَاثَةِ.",
    logic: { culpritId: 'rani', contradictionEvidenceIds: ['download', 'app'], exoneratingEvidence: { dimas: ['keyboard'], nisa: ['wifi'] } },
    evidence: {
      screen: {
        location: 'Monitor utama laboratorium komputer',
        condition: 'Tangkapan layar pohon folder memperlihatkan folder informasi kosong dan berkas berada di folder arsip.',
        time: '16.20',
        fact: 'Tangkapan layar memperlihatkan berkas final berada di /arsip/ pada akhir sesi kerja.',
        deductionUse: 'Memastikan lokasi akhir berkas yang menjadi masalah.'
      },
      keyboard: {
        location: 'Meja operator komputer nomor 2',
        condition: 'Tiket servis papan ketik dan label perangkat memuat nomor meja.',
        time: '16.05–16.25',
        fact: 'Dimas tercatat memperbaiki papan ketik di meja nomor 2. Perangkat ini berbeda dari laptop editor yang menyimpan berkas.',
        deductionUse: 'Mendukung alibi Dimas dan membedakan perangkat yang digunakan.'
      },
      wifi: {
        location: 'Rak router ruang jaringan',
        condition: 'Log diagnostik router mencatat sesi admin dan waktu pemeriksaan.',
        time: '16.05, 16.14, dan 16.23',
        fact: 'Nisa menjalankan tiga pemeriksaan jaringan dari konsol router selama rentang kejadian.',
        deductionUse: 'Mendukung alibi Nisa di ruang jaringan.'
      },
      download: {
        location: 'Laptop editor di meja tengah',
        condition: 'Riwayat file mencatat jalur asal, jalur tujuan, dan akun yang menjalankan pemindahan.',
        time: '16.19',
        fact: 'Berkas berpindah dari /informasi/ ke /arsip/ melalui sesi akun RANI-02.',
        deductionUse: 'Memberi jejak audit file yang menguji pernyataan Rani.'
      },
      app: {
        location: 'Aplikasi sinkronisasi pada telepon genggam tim media',
        condition: 'Riwayat sinkronisasi menampilkan akun pengirim dan folder sumber.',
        time: '16.20',
        fact: 'Aplikasi mencatat sinkronisasi berkas final dari folder arsip melalui akun Rani satu menit setelah pemindahan pada laptop.',
        deductionUse: 'Menjadi pemeriksaan independen dari layanan sinkronisasi terhadap riwayat file lokal.'
      }
    },
    puzzleContext: {
      focus: 'Editor mengolah berkas dan menyimpannya di folder yang ditentukan.',
      investigativeReading: 'Kalimat puzzle menggunakan fi’il mudhari’ untuk kegiatan menyunting dan menyimpan. Fokus investigasi adalah membandingkan folder tujuan dalam pernyataan dengan jejak file dan sinkronisasi.',
      evidenceIds: ['screen', 'download', 'app']
    },
    suspects: {
      rani: {
        identityNote: 'Akun editor: RANI-02.',
        statement: 'Saya hanya menyunting isi berkas; saya menyimpannya di folder informasi dan tidak memindahkannya ke tempat lain.',
        arabic: 'حَرَّرْتُ مَحْتَوَى الْمَلَفِّ فَقَطْ، وَحَفِظْتُهُ فِي مُجَلَّدِ الْمَعْلُومَاتِ، وَلَمْ أَنْقُلْهُ إِلَى مَكَانٍ آخَرَ.',
        translation: 'Saya hanya menyunting isi berkas, menyimpannya di folder informasi, dan tidak memindahkannya ke tempat lain.',
        wrongFeedback: ''
      },
      dimas: {
        identityNote: 'ID teknisi perangkat: DM-01.',
        statement: 'Saya memperbaiki papan ketik di meja operator nomor 2 pada pukul 16.05–16.25.',
        arabic: 'أَصْلَحْتُ لَوْحَةَ الْمَفَاتِيحِ فِي مَحَطَّةِ الْعَمَلِ رَقْمَ اثْنَيْنِ مِنَ السَّاعَةِ ١٦:٠٥ إِلَى ١٦:٢٥.',
        translation: 'Saya memperbaiki papan ketik di meja operator nomor dua pada pukul 16.05–16.25.',
        wrongFeedback: 'Catatan servis mencatat Dimas memperbaiki papan ketik di meja nomor 2 pada 16.05–16.25. Perangkat itu berbeda dari laptop editor yang mencatat perpindahan berkas. Periksa akun pada riwayat file.'
      },
      nisa: {
        identityNote: 'Akun admin router: NS-06.',
        statement: 'Saya memeriksa jaringan Wi-Fi melalui konsol router di ruang jaringan; log mencatat sesi pada pukul 16.05, 16.14, dan 16.23.',
        arabic: 'فَحَصْتُ شَبَكَةَ الْوَايْ فَايْ مِنْ وَحْدَةِ التَّحَكُّمِ فِي غُرْفَةِ الشَّبَكَةِ فِي السَّاعَاتِ ١٦:٠٥ وَ١٦:١٤ وَ١٦:٢٣.',
        translation: 'Saya memeriksa jaringan Wi-Fi melalui konsol router di ruang jaringan pada pukul 16.05, 16.14, dan 16.23.',
        wrongFeedback: 'Log diagnostik router mencatat sesi Nisa pada 16.05, 16.14, dan 16.23. Catatan itu mendukung alibinya. Bandingkan akun pemindah pada laptop dengan akun sinkronisasi aplikasi.'
      }
    },
    solution: {
      culpritId: 'rani',
      steps: [
        { heading: 'Pastikan lokasi akhir berkas', explanation: 'Tangkapan layar monitor menunjukkan berkas final berada di folder arsip, bukan folder informasi.', evidenceIds: ['screen'] },
        { heading: 'Periksa jejak pemindahan lokal', explanation: 'Riwayat laptop mencatat pemindahan dari /informasi/ ke /arsip/ melalui akun RANI-02 pada 16.19. Ini bertentangan dengan pernyataan bahwa berkas tidak dipindahkan.', evidenceIds: ['download'] },
        { heading: 'Konfirmasi melalui sinkronisasi', explanation: 'Aplikasi tim media mencatat sinkronisasi dari folder arsip melalui akun Rani pada 16.20. Catatan layanan ini terpisah dari riwayat file laptop dan menguatkan urutan pemindahan.', evidenceIds: ['app'] }
      ],
      eliminations: [
        { suspectId: 'dimas', reason: 'Tiket servis menempatkan Dimas di meja nomor 2 untuk memperbaiki papan ketik, bukan pada laptop editor.', evidenceIds: ['keyboard'] },
        { suspectId: 'nisa', reason: 'Log diagnostik menempatkan Nisa pada konsol router selama rentang kejadian.', evidenceIds: ['wifi'] }
      ],
      conclusion: 'Riwayat file laptop dan catatan sinkronisasi aplikasi adalah dua sumber terpisah yang sama-sama mencatat akun Rani memindahkan atau menyinkronkan berkas dari folder arsip. Tiket servis dan log router mendukung alibi Dimas dan Nisa.'
    }
  },

  'ch06-religions': {
    incident: 'Kartu informasi toleransi berpindah dari kelompok tema ke papan utama sehingga urutan kartu pameran tidak lagi sesuai indeks.',
    selectionGuidance: "Indeks pameran pukul 09.00 menunjukkan kartu telah tersusun menurut kategori. Pada 09.05, Nada membuat denah posisi panel. Pada 09.12, slip pengambilan mencatat Farah mengambil kartu toleransi dari rak kategori, sementara metadata foto menempatkan Bima di sisi barat untuk mendokumentasikan panel gereja. Lembar pemeriksaan pukul 09.14 menunjukkan Nada masih memeriksa denah di meja desain. Pada 09.18, slip pemasangan mencatat kartu toleransi ditempel pada papan utama dengan paraf F-01 dan perekat baru. Bandingkan indeks awal, slip pengambilan, foto, denah, dan slip pemasangan sebelum menentukan siapa yang keterangannya bertentangan dengan perubahan susunan pameran.",
    selectionGuidanceArabic: "أَظْهَرَ فِهْرِسُ الْمَعْرِضِ فِي السَّاعَةِ ٩:٠٠ أَنَّ الْبِطَاقَاتِ كَانَتْ مُرَتَّبَةً حَسَبَ الْفِئَاتِ. وَفِي السَّاعَةِ ٩:٠٥، أَعَدَّتْ نَادَى مُخَطَّطَ مَوَاقِعِ اللَّوْحَاتِ. وَفِي السَّاعَةِ ٩:١٢، سَجَّلَ إِيصَالُ الْأَخْذِ أَنَّ فَرَحَ أَخَذَتْ بِطَاقَةَ التَّسَامُحِ مِنْ رَفِّ الْفِئَاتِ، بَيْنَمَا وَأَظْهَرَتْ بَيَانَاتُ الصُّورَةِ أَنَّ بِيمَا كَانَ فِي الْجَانِبِ الْغَرْبِيِّ لِتَصْوِيرِ لَوْحَةِ الْكَنِيسَةِ. وَأَظْهَرَتْ وَرَقَةُ الْمُرَاجَعَةِ فِي السَّاعَةِ ٩:١٤ أَنَّ نَادَى كَانَتْ لَا تَزَالُ تُرَاجِعُ الْمُخَطَّطَ فِي مَكْتَبِ التَّصْمِيمِ. وَفِي السَّاعَةِ ٩:١٨، سَجَّلَ إِيصَالُ التَّثْبِيتِ وَضْعَ بِطَاقَةِ التَّسَامُحِ عَلَى اللَّوْحَةِ الرَّئِيسِيَّةِ بِتَوْقِيعِ F-01، وَكَانَ اللَّاصِقُ خَلْفَ الْبِطَاقَةِ جَدِيدًا. قَارِنُوا الْفِهْرِسَ الْأَوَّلَ وَإِيصَالَ الْأَخْذِ وَالصُّوَرَ وَالْمُخَطَّطَ وَإِيصَالَ التَّثْبِيتِ قَبْلَ تَحْدِيدِ الْقَوْلِ الَّذِي يُخَالِفُ تَغْيِيرَ تَرْتِيبِ الْمَعْرِضِ.",
    logic: { culpritId: 'farah', contradictionEvidenceIds: ['religion', 'tolerance'], exoneratingEvidence: { bima: ['church'], nada: ['mosque', 'temple'] } },
    evidence: {
      religion: {
        location: 'Meja katalog buku pameran',
        condition: 'Indeks kategori awal dan slip peminjaman kartu tersimpan di dalam buku katalog.',
        time: '09.00 dan 09.12',
        fact: 'Indeks pukul 09.00 menunjukkan kartu tersusun benar. Slip pukul 09.12 mencatat Farah mengambil satu kartu bertema toleransi dari rak kategori.',
        deductionUse: 'Menetapkan susunan awal dan siapa yang mengambil kartu dari rak tema.'
      },
      mosque: {
        location: 'Panel informasi masjid',
        condition: 'Denah panel versi awal memuat posisi kartu dan label.',
        time: '09.05',
        fact: 'Denah yang dibuat Nada pada 09.05 menunjukkan label panel masjid sesuai daftar kategori dan tidak memerlukan pemindahan kartu toleransi.',
        deductionUse: 'Mendukung alibi Nada sebagai penyusun denah.'
      },
      church: {
        location: 'Panel informasi gereja di sisi barat',
        condition: 'Metadata foto pameran memuat waktu pengambilan dan posisi kamera.',
        time: '09.12',
        fact: 'Foto yang dibuat Bima pada 09.12 menunjukkan ia berada di sisi barat untuk mendokumentasikan panel gereja.',
        deductionUse: 'Mendukung alibi Bima sebagai petugas dokumentasi.'
      },
      temple: {
        location: 'Meja desain denah panel tempat ibadah',
        condition: 'Lembar pemeriksaan denah memuat paraf dan waktu revisi.',
        time: '09.14',
        fact: 'Nada memeriksa posisi panel tempat ibadah pada denah di meja desain; perubahan denah tidak mencatat perpindahan kartu toleransi.',
        deductionUse: 'Menjadi pemeriksaan kedua yang mendukung kegiatan Nada.'
      },
      tolerance: {
        location: 'Papan utama pameran keberagaman',
        condition: 'Bagian belakang kartu memiliki perekat baru dan slip pemasangan.',
        time: '09.18',
        fact: 'Slip pemasangan kartu toleransi pada papan utama bertanda paraf F-01. Perekat di belakang kartu masih baru.',
        deductionUse: 'Menunjukkan kartu dipasang ulang setelah susunan awal dicatat.'
      }
    },
    puzzleContext: {
      focus: 'Umat Islam salat di masjid-masjid.',
      investigativeReading: 'Kalimat menjadi contoh jumlah fi’liyyah dan menghubungkan kegiatan ibadah dengan tempatnya. Gunakan fakta ini untuk memeriksa ketepatan kategori kartu, bukan untuk menilai keyakinan atau menentukan pelaku.',
      evidenceIds: ['religion', 'mosque', 'church', 'temple']
    },
    suspects: {
      farah: {
        identityNote: 'Kode koordinator kartu: F-01.',
        statement: 'Saya menata kartu berdasarkan tema pada pukul 09.00 dan tidak memindahkan kartu setelah itu.',
        arabic: 'وَضَعْتُ الْبِطَاقَاتِ حَسَبَ الْمَوْضُوعَاتِ فِي السَّاعَةِ التَّاسِعَةِ، وَلَمْ أَنْقُلْ أَيَّ بِطَاقَةٍ بَعْدَ ذَلِكَ.',
        translation: 'Saya menata kartu berdasarkan tema pada pukul sembilan dan tidak memindahkan kartu setelah itu.',
        wrongFeedback: ''
      },
      bima: {
        identityNote: 'ID dokumentasi foto: BM-03.',
        statement: 'Saya mengambil foto pameran dari sisi barat, termasuk panel gereja, pada pukul 09.12.',
        arabic: 'أَخَذْتُ صُوَرَ الْمَعْرِضِ مِنَ الْجَانِبِ الْغَرْبِيِّ، وَمِنْهَا لَوْحَةُ الْكَنِيسَةِ، فِي السَّاعَةِ ٩:١٢.',
        translation: 'Saya mengambil foto pameran dari sisi barat, termasuk panel gereja, pada pukul 09.12.',
        wrongFeedback: 'Metadata foto menempatkan Bima di sisi barat saat mendokumentasikan panel gereja pada 09.12. Catatan itu mendukung alibinya. Periksa slip pengambilan kartu dan slip pemasangan di papan utama.'
      },
      nada: {
        identityNote: 'ID penyusun denah: ND-02.',
        statement: 'Saya menyusun denah pada pukul 09.05 dan memeriksa kembali posisi panel di meja desain pada pukul 09.14. Saya tidak memindahkan kartu pameran.',
        arabic: 'أَعْدَدْتُ الْمُخَطَّطَ فِي السَّاعَةِ ٩:٠٥، ثُمَّ رَاجَعْتُ مَوَاقِعَ اللَّوْحَاتِ عَلَى مَكْتَبِ التَّصْمِيمِ فِي السَّاعَةِ ٩:١٤، وَلَمْ أَنْقُلِ الْبِطَاقَاتِ.',
        translation: 'Saya menyusun denah pada pukul 09.05 dan memeriksa kembali posisi panel di meja desain pada pukul 09.14. Saya tidak memindahkan kartu pameran.',
        wrongFeedback: 'Denah versi 09.05 dan lembar pemeriksaan 09.14 menunjukkan Nada bekerja pada rancangan posisi panel. Catatan itu mendukung alibinya. Bandingkan indeks kartu awal dengan slip pemasangan kartu toleransi.'
      }
    },
    solution: {
      culpritId: 'farah',
      steps: [
        { heading: 'Pastikan susunan awal', explanation: 'Indeks katalog pada 09.00 menunjukkan kartu telah tersusun menurut tema sebelum perubahan terjadi.', evidenceIds: ['religion'] },
        { heading: 'Lacak kartu yang diambil', explanation: 'Slip peminjaman pukul 09.12 mencatat Farah mengambil kartu toleransi dari rak kategori. Ini bertentangan dengan pernyataan bahwa ia tidak memindahkan kartu setelah susunan awal.', evidenceIds: ['religion'] },
        { heading: 'Cocokkan pemasangan ulang', explanation: 'Slip pemasangan pukul 09.18 bertanda F-01 dan perekat baru pada kartu menunjukkan kartu toleransi dipasang kembali di papan utama.', evidenceIds: ['tolerance'] }
      ],
      eliminations: [
        { suspectId: 'bima', reason: 'Metadata foto menempatkan Bima di sisi barat saat mendokumentasikan panel gereja.', evidenceIds: ['church'] },
        { suspectId: 'nada', reason: 'Denah versi awal dan lembar pemeriksaan menempatkan Nada pada pekerjaan desain panel; denahnya tidak memerintahkan pemindahan kartu toleransi.', evidenceIds: ['mosque', 'temple'] }
      ],
      conclusion: 'Slip pengambilan kartu dan slip pemasangan ulang merupakan dua catatan terpisah yang menghubungkan perubahan kartu dengan Farah. Catatan foto dan denah mendukung alibi Bima dan Nada.'
    }
  }
};

export function getDeductionCase(chapterId) {
  return DEDUCTION_CASES[chapterId] ?? null;
}
