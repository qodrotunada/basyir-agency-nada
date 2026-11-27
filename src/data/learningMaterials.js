import { CASES_CONFIG, EPISODE_META, VOCABULARY_REGISTRY } from './campaign.js';

/**
 * Konten akademik flipbook dipisahkan dari learningPath.activities.
 * Deskripsi keterampilan diambil dari ringkasan materi pada campaign.js,
 * sedangkan kaidah dan struktur disusun mengikuti pembahasan/rangkuman buku.
 * Nomor halaman adalah halaman cetak buku Kemenag RI (2020).
 */
export const ISTIMA_AUDIO_CONTENT = {
  'ch01-shopping': {
    title: 'Dialog jual beli di pasar',
    adaptationNote: 'Adaptasi pembelajaran untuk latihan menyimak tema perbelanjaan; bukan kutipan langsung dari buku.',
    turns: [
      { speaker: 'الزَّبُونُ', speakerIndo: 'Pembeli', arabic: 'بِكَمْ كِيلُو اللَّحْمِ؟', translation: 'Berapa harga satu kilogram daging?' },
      { speaker: 'الْبَائِعُ', speakerIndo: 'Penjual', arabic: 'سِعْرُ الْكِيلُو مِائَةُ أَلْفِ رُوبِيَّةٍ.', translation: 'Harga satu kilogram seratus ribu rupiah.' },
      { speaker: 'الزَّبُونُ', speakerIndo: 'Pembeli', arabic: 'أُرِيدُ كِيلُو وَاحِدًا مِنَ اللَّحْمِ، وَكِيلُو مِنَ الْخَضْرَوَاتِ.', translation: 'Saya ingin satu kilogram daging dan satu kilogram sayuran.' },
      { speaker: 'الْبَائِعُ', speakerIndo: 'Penjual', arabic: 'تَفَضَّلْ، وَهَذِهِ فَوَاكِهُ طَازَجَةٌ أَيْضًا.', translation: 'Silakan, buah-buahan ini juga segar.' }
    ]
  },
  'ch02-health': {
    title: 'Dialog pemeriksaan kesehatan',
    adaptationNote: 'Adaptasi pembelajaran untuk latihan menyimak tema kesehatan; bukan kutipan langsung dari buku.',
    turns: [
      { speaker: 'الْمَرِيضُ', speakerIndo: 'Pasien', arabic: 'أَشْعُرُ بِالصُّدَاعِ وَالْحُمَّى.', translation: 'Saya merasa sakit kepala dan demam.' },
      { speaker: 'الْمُمَرِّضَةُ', speakerIndo: 'Perawat', arabic: 'سَأَقِيسُ دَرَجَةَ حَرَارَتِكَ أَوَّلًا.', translation: 'Saya akan mengukur suhu tubuhmu terlebih dahulu.' },
      { speaker: 'الطَّبِيبُ', speakerIndo: 'Dokter', arabic: 'تَنَاوَلِ الدَّوَاءَ بَعْدَ الطَّعَامِ، وَاسْتَرِحْ.', translation: 'Minumlah obat setelah makan dan beristirahatlah.' },
      { speaker: 'الْمَرِيضُ', speakerIndo: 'Pasien', arabic: 'شُكْرًا يَا دُكْتُورُ.', translation: 'Terima kasih, Dokter.' }
    ]
  },
  'ch03-travel': {
    title: 'Dialog persiapan perjalanan',
    adaptationNote: 'Adaptasi pembelajaran untuk latihan menyimak tema perjalanan; bukan kutipan langsung dari buku.',
    turns: [
      { speaker: 'الْمُسَافِرُ', speakerIndo: 'Pelancong', arabic: 'أَيْنَ مَوْقِفُ الْحَافِلَةِ إِلَى الْمَطَارِ؟', translation: 'Di mana halte bus menuju bandara?' },
      { speaker: 'الْمُوَظَّفُ', speakerIndo: 'Petugas', arabic: 'الْمَوْقِفُ أَمَامَ الْفُنْدُقِ.', translation: 'Halte berada di depan hotel.' },
      { speaker: 'الْمُسَافِرُ', speakerIndo: 'Pelancong', arabic: 'هَلْ أَحْمِلُ جَوَازَ السَّفَرِ وَالْحَقِيبَةَ؟', translation: 'Apakah saya membawa paspor dan koper?' },
      { speaker: 'الْمُوَظَّفُ', speakerIndo: 'Petugas', arabic: 'نَعَمْ، وَصِلْ إِلَى الْمَطَارِ قَبْلَ الْمَوْعِدِ.', translation: 'Ya, dan datanglah ke bandara sebelum waktunya.' }
    ]
  },
  'ch04-hajj-umrah': {
    title: 'Dialog urutan manasik',
    adaptationNote: 'Adaptasi pembelajaran untuk latihan menyimak tema haji dan umrah; bukan kutipan langsung dari buku.',
    turns: [
      { speaker: 'الْمُرْشِدُ', speakerIndo: 'Pembimbing', arabic: 'نَلْبَسُ ثِيَابَ الْإِحْرَامِ قَبْلَ دُخُولِ مَكَّةَ.', translation: 'Kita mengenakan pakaian ihram sebelum memasuki Makkah.' },
      { speaker: 'الْحَاجُّ', speakerIndo: 'Jamaah haji', arabic: 'مَتَى نُؤَدِّي الطَّوَافَ؟', translation: 'Kapan kita melaksanakan tawaf?' },
      { speaker: 'الْمُرْشِدُ', speakerIndo: 'Pembimbing', arabic: 'نُؤَدِّي الطَّوَافَ سَبْعَةَ أَشْوَاطٍ، ثُمَّ نَسْعَى بَيْنَ الصَّفَا وَالْمَرْوَةِ.', translation: 'Kita melaksanakan tawaf tujuh putaran, kemudian melakukan sa’i antara Safa dan Marwah.' },
      { speaker: 'الْحَاجُّ', speakerIndo: 'Jamaah haji', arabic: 'وَبَعْدَ ذَلِكَ نَذْهَبُ إِلَى الْمَدِينَةِ؟', translation: 'Setelah itu, apakah kita pergi ke Madinah?' },
      { speaker: 'الْمُرْشِدُ', speakerIndo: 'Pembimbing', arabic: 'نَعَمْ، حَسَبَ بَرْنَامَجِ الرِّحْلَةِ.', translation: 'Ya, sesuai dengan program perjalanan.' }
    ]
  },
  'ch05-ict': {
    title: 'Dialog penggunaan teknologi',
    adaptationNote: 'Adaptasi pembelajaran untuk latihan menyimak tema teknologi informasi dan komunikasi; bukan kutipan langsung dari buku.',
    turns: [
      { speaker: 'الطَّالِبُ', speakerIndo: 'Siswa', arabic: 'كَيْفَ نَسْتَخْدِمُ الْإِنْتَرْنِتَ فِي التَّعَلُّمِ؟', translation: 'Bagaimana kita menggunakan internet dalam pembelajaran?' },
      { speaker: 'الْمُعَلِّمُ', speakerIndo: 'Guru', arabic: 'نَبْحَثُ عَنِ الْمَعْلُومَاتِ وَنَحْفَظُ الْمَلَفَّاتِ فِي الْمُجَلَّدَاتِ.', translation: 'Kita mencari informasi dan menyimpan berkas di dalam folder.' },
      { speaker: 'الطَّالِبُ', speakerIndo: 'Siswa', arabic: 'وَهَلْ نُرْسِلُهَا إِلَى الْأَصْدِقَاءِ؟', translation: 'Apakah kita mengirimkannya kepada teman-teman?' },
      { speaker: 'الْمُعَلِّمُ', speakerIndo: 'Guru', arabic: 'نَعَمْ، وَلَكِنْ نَتَحَقَّقُ مِنْ صِحَّتِهَا قَبْلَ النَّشْرِ.', translation: 'Ya, tetapi kita memeriksa kebenarannya sebelum membagikannya.' }
    ]
  },
  'ch06-religions': {
    title: 'Dialog tentang keberagaman dan toleransi',
    adaptationNote: 'Adaptasi pembelajaran untuk latihan menyimak tema agama-agama di Indonesia; bukan kutipan langsung dari buku.',
    turns: [
      { speaker: 'الطَّالِبَةُ', speakerIndo: 'Siswi', arabic: 'مَا مَعْنَى التَّسَامُحِ فِي الْمُجْتَمَعِ؟', translation: 'Apa arti toleransi dalam masyarakat?' },
      { speaker: 'الْمُعَلِّمَةُ', speakerIndo: 'Guru', arabic: 'أَنْ نَحْتَرِمَ اخْتِلَافَ النَّاسِ وَنَتَعَامَلَ مَعَهُمْ بِأَدَبٍ.', translation: 'Kita menghormati perbedaan dan berinteraksi dengan orang lain secara santun.' },
      { speaker: 'الطَّالِبَةُ', speakerIndo: 'Siswi', arabic: 'وَهَلْ تَخْتَلِفُ أَمَاكِنُ الْعِبَادَةِ؟', translation: 'Apakah tempat-tempat ibadah berbeda?' },
      { speaker: 'الْمُعَلِّمَةُ', speakerIndo: 'Guru', arabic: 'نَعَمْ، فَالْمَسْجِدُ وَالْكَنِيسَةُ وَالْمَعْبَدُ أَمَاكِنُ لِلْعِبَادَةِ.', translation: 'Ya, masjid, gereja, dan kuil merupakan tempat ibadah.' }
    ]
  }
};

const CHAPTER_ACADEMIC = {
  'ch01-shopping': {
    competency: 'Memahami dan menyajikan teks tentang التسوق (pasar tradisional dan pusat perbelanjaan), termasuk tindak tutur mendeskripsikan bentuk, timbangan, sifat, dan karakteristik benda dengan kaidah العدد والمعدود.',
    indicators: [
      'Menjelaskan fungsi sosial dan struktur teks deskriptif.',
      'Mengidentifikasi kosakata tentang perbelanjaan.',
      'Menjelaskan bentuk, makna, dan fungsi ‘adad dan ma‘dūd.',
      'Menemukan ‘adad dan ma‘dūd dalam kalimat.',
      'Mengidentifikasi fakta dari teks simakan dan bacaan.',
      'Menyusun kalimat dan paragraf deskriptif serta mempraktikkan percakapan jual beli.'
    ],
    concept: 'التسوق ← tindak tutur mendeskripsikan benda dan tempat; gramatikal العدد والمعدود; konteks: pasar tradisional dan pusat perbelanjaan.',
    intro: 'Bab ini mengajak peserta didik memahami kegiatan jual beli serta mendeskripsikan tempat, barang, sifat, ukuran, dan harga. Bacaan tentang pusat perbelanjaan menjelaskan bagian-bagian tempat, barang yang dijual, kebersihan, serta transaksi.',
    grammar: [
      { heading: 'Bilangan 1–2', arabic: 'وَاحِدٌ، وَاحِدَةٌ، اِثْنَانِ، اِثْنَتَانِ', detail: 'Ma‘dūd mengikuti kesesuaian gender dengan ‘adad. Bentuk tunggal atau mutsanna digunakan sesuai jumlah yang dinyatakan.' },
      { heading: 'Bilangan 3–10', arabic: 'ثَلَاثَةُ أَقْلَامٍ، ثَلَاثُ مَجَلَّاتٍ', detail: '‘Adad berbeda gender dari ma‘dūd. Ma‘dūd berbentuk jamak majrūr.' },
      { heading: 'Bilangan 11–99', arabic: 'أَحَدَ عَشَرَ قَلَمًا، ثَلَاثَةٌ وَعِشْرُونَ قَلَمًا', detail: 'Ma‘dūd berbentuk mufrad manṣūb. Bentuk bilangan mengikuti pola mudzakkar dan muannats yang dicontohkan pada tabel buku.' },
      { heading: 'Bilangan 100–1000 dan kelipatannya', arabic: 'مِائَةُ قَلَمٍ، أَلْفُ كِتَابٍ', detail: 'Ma‘dūd berbentuk mufrad majrūr. Pola ini juga digunakan pada bilangan besar seperti juta, miliar, dan triliun sesuai contoh buku.' },
      { heading: 'Bilangan gabungan 101–999', arabic: 'مِائَةٌ وَوَاحِدٌ ... / مِائَةٌ وَثَلَاثَةٌ ...', detail: 'Untuk bilangan berakhir 1–2, ma‘dūd mengikuti pola 1–2. Untuk bentuk 103–999 yang berakhir 3–9, ma‘dūd mengikuti pola 3–10 (jamak majrūr).' }
    ],
    examples: [
      { arabic: 'ثَلَاثَةُ أَقْلَامٍ', meaning: 'Tiga buah pena.', note: 'Bilangan 3–10: ma‘dūd jamak majrūr dan berbeda gender.' },
      { arabic: 'مِائَةُ أَلْفِ رُوبِيَّةٍ', meaning: 'Seratus ribu rupiah.', note: 'Contoh bilangan harga yang muncul dalam tema perbelanjaan.' },
      { arabic: 'سِعْرُ اللَّحْمِ مِائَةُ أَلْفِ رُوبِيَّةٍ لِلْكِيلُو الْوَاحِدِ.', meaning: 'Harga daging seratus ribu rupiah untuk satu kilogram.', note: 'Contoh kalimat kontekstual dari kosakata bab.' }
    ],
    summary: 'Teks deskriptif pada bab ini memberikan informasi rinci tentang tempat dan barang. Strukturnya mencakup الوصف العام (deskripsi umum) dan الوصف الخاص (deskripsi khusus). Kaidah utama adalah العدد والمعدود, dengan pola yang berbeda menurut kelompok bilangan.'
  },
  'ch02-health': {
    competency: 'Memahami dan mempraktikkan teks tentang الصحة, termasuk menanyakan kondisi kesehatan, menjenguk orang sakit, memberi saran, serta menggunakan حروف الجر dan حروف العطف.',
    indicators: [
      'Menjelaskan fungsi sosial dan struktur teks prosedur.',
      'Mengidentifikasi kosakata kesehatan dan informasi dari dialog.',
      'Mengenali bagian tujuan, materi, dan langkah-langkah dalam teks prosedur.',
      'Menjelaskan fungsi huruf jar dan huruf ‘athaf.',
      'Menggunakan huruf jar dan ‘athaf dalam kalimat.',
      'Menyusun teks prosedur dan mempraktikkan percakapan tentang kesehatan.'
    ],
    concept: 'الصحة ← rumah sakit, apotek, kondisi kesehatan, dan saran; teks prosedur: الهدف، المادة، الخطوات; gramatikal: حروف الجر dan حروف العطف.',
    intro: 'Bab kesehatan berisi ungkapan untuk menanyakan keadaan seseorang, menyampaikan keluhan, menjenguk orang sakit, dan memberikan saran. Materi bacaan dan percakapan mengambil konteks rumah, meja penerimaan rumah sakit, ruang dokter, dan apotek.',
    grammar: [
      { heading: 'Huruf jar (حروف الجر)', arabic: 'مِنْ، عَنْ، إِلَى، كَ، لِـ، عَلَى، فِي، بِـ', detail: 'Huruf jar menghubungkan kata dan menyebabkan isim sesudahnya berkedudukan majrūr. Contoh: إِلَى الْمُسْتَشْفَى (ke rumah sakit), فِي الْمُسْتَشْفَى (di rumah sakit), بِالدَّوَاءِ (dengan obat).' },
      { heading: 'Makna huruf jar', arabic: 'مِنْ / عَنْ / إِلَى / كَ / لِـ / عَلَى / فِي / بِـ', detail: 'Buku memberi padanan makna seperti dari/sebagian, tentang, ke/pada, seperti, milik/untuk, di atas/kepada, di dalam/pada, dan dengan/di. Makna tepat ditentukan oleh konteks kalimat.' },
      { heading: 'Huruf ‘athaf (حروف العطف)', arabic: 'وَ، فَ، ثُمَّ، أَوْ، أَمْ، حَتَّى، لَكِنْ، لَا، بَلْ', detail: 'Huruf ‘athaf berfungsi menghubungkan kata atau bagian kalimat. Contoh yang umum: وَ (dan), فَ (maka/lalu), ثُمَّ (kemudian), أَوْ (atau), لَكِنْ (tetapi), بَلْ (bahkan/melainkan).' },
      { heading: 'Struktur teks prosedur', arabic: 'الْهَدَفُ ← الْمَادَّةُ ← الْخُطُوَاتُ', detail: 'الهدف menyatakan tujuan; المادة menyebut bahan atau perlengkapan; الخطوات menjelaskan urutan langkah untuk mencapai tujuan.' }
    ],
    examples: [
      { arabic: 'ذَهَبَ مُحَمَّدٌ إِلَى الْمُسْتَشْفَى.', meaning: 'Muhammad pergi ke rumah sakit.', note: 'إِلَى adalah huruf jar; الْمُسْتَشْفَى menjadi majrūr.' },
      { arabic: 'أَذْهَبُ إِلَى الصَّيْدَلِيَّةِ لِشِرَاءِ الدَّوَاءِ.', meaning: 'Saya pergi ke apotek untuk membeli obat.', note: 'إِلَى dan لِـ merupakan huruf jar.' },
      { arabic: 'أَشْعُرُ بِالصُّدَاعِ وَالْحُمَّى.', meaning: 'Saya merasa sakit kepala dan demam.', note: 'وَ menghubungkan dua keluhan.' }
    ],
    summary: 'Teks prosedur menjelaskan tahapan secara sistematis untuk mencapai tujuan. Strukturnya adalah الهدف، المادة، الخطوات. Huruf jar menyebabkan isim sesudahnya majrūr, sedangkan huruf ‘athaf menghubungkan unsur bahasa.'
  },
  'ch03-travel': {
    competency: 'Memahami dan menyusun teks tentang السفر والسياحة serta mempraktikkan ungkapan berpamitan, mengucapkan selamat jalan, dan selamat datang dengan memperhatikan الاسم النكرة والاسم المعرفة.',
    indicators: [
      'Menjelaskan fungsi sosial dan struktur teks rekon.',
      'Mengidentifikasi orientasi, kejadian, dan reorientasi.',
      'Menemukan informasi faktual dan urutan peristiwa dalam teks perjalanan.',
      'Membedakan isim nakirah dan isim ma‘rifah.',
      'Melengkapi teks rekon dan menyusun cerita perjalanan.',
      'Mempraktikkan ungkapan berpamitan dan menyambut kedatangan.'
    ],
    concept: 'السفر والسياحة ← sarana transportasi dan daerah wisata; tindak tutur berpamitan/menyambut; teks rekon; gramatikal الاسم النكرة والاسم المعرفة.',
    intro: 'Bab ini membahas sarana transportasi, tempat wisata, pengalaman bepergian, serta ungkapan sosial ketika berpisah dan menyambut kedatangan. Teks rekon menceritakan kembali peristiwa masa lalu sesuai urutan terjadinya.',
    grammar: [
      { heading: 'Isim nakirah (الاسم النكرة)', arabic: 'مَطَارٌ، فُنْدُقٌ، شَاطِئٌ', detail: 'Isim nakirah menunjukkan sesuatu yang umum atau belum ditentukan. Contoh: مَطَارٌ berarti sebuah bandara, belum menunjuk bandara tertentu.' },
      { heading: 'Isim ma‘rifah (الاسم المعرفة)', arabic: 'الْمَطَارُ، مَكَّةُ، هُوَ، هَذَا', detail: 'Isim ma‘rifah menunjukkan sesuatu yang sudah tertentu. Bentuknya antara lain isim yang memakai ال, nama diri (العَلَم), dhamir, isim isyarah, dan isim maushul.' },
      { heading: 'Perbandingan dalam konteks', arabic: 'مَطَارٌ ← الْمَطَارُ', detail: 'مَطَارٌ bersifat umum (nakirah), sedangkan الْمَطَارُ menunjuk bandara tertentu (ma‘rifah). Nama tempat seperti مَكَّةُ juga termasuk ma‘rifah.' },
      { heading: 'Struktur teks rekon', arabic: 'التَّوْجِيهُ ← الْأَحْدَاثُ ← التَّعْلِيقُ', detail: 'Orientasi menyebut siapa, kapan, dan di mana. Kejadian menceritakan peristiwa secara berurutan. Reorientasi berisi komentar atau kesimpulan.' }
    ],
    examples: [
      { arabic: 'سَافَرَ فَاتِحٌ إِلَى بَالِي بِالطَّائِرَةِ.', meaning: 'Fatih bepergian ke Bali dengan pesawat.', note: 'بَالِي nama tempat (ma‘rifah); الطَّائِرَةِ merupakan isim dengan ال.' },
      { arabic: 'وَصَلَ الْمُسَافِرُ إِلَى مَطَارٍ.', meaning: 'Pelancong tiba di sebuah bandara.', note: 'مَطَارٍ adalah nakirah.' },
      { arabic: 'مَعَ السَّلَامَةِ، اللَّهُ يُسَلِّمُكَ.', meaning: 'Selamat jalan; semoga Allah menjagamu.', note: 'Ungkapan sosial yang digunakan dalam dialog perjalanan.' }
    ],
    summary: 'Teks rekon menyampaikan pengalaman masa lalu dengan urutan orientasi, kejadian, dan reorientasi. Isim nakirah bermakna umum/belum tertentu, sedangkan isim ma‘rifah bermakna tertentu dan dapat berupa isim ber ال, nama diri, dhamir, isim isyarah, atau isim maushul.'
  },
  'ch04-hajj-umrah': {
    competency: 'Memahami dan menyajikan teks tentang الحج والعمرة serta menyatakan dan menanyakan tindakan/kejadian masa lalu dengan تصريف الفعل الماضي اللغوي.',
    indicators: [
      'Mengidentifikasi kosakata dan fakta dari teks lisan/tulis tentang haji dan umrah.',
      'Menjelaskan isi dan urutan pengalaman perjalanan ibadah.',
      'Menjelaskan bentuk, makna, dan fungsi tasrif fi‘il madhi.',
      'Menyesuaikan bentuk fi‘il madhi dengan dhamir/subjek.',
      'Menyusun teks rekon dan mempraktikkan percakapan tentang pengalaman haji/umrah.'
    ],
    concept: 'الحج والعمرة ← persiapan dan pengalaman ibadah; teks rekon; tindak tutur menyatakan/menanyakan peristiwa lampau; تصريف الفعل الماضي اللغوي.',
    intro: 'Bab ini mengangkat pengalaman perjalanan umrah bersama keluarga. Bacaan mengurutkan perjalanan dari keberangkatan menuju Jeddah, persiapan ihram di miqat, tawaf, sa‘i, hingga kunjungan ke Madinah.',
    grammar: [
      { heading: 'Fi‘il madhi (الفعل الماضي)', arabic: 'ذَهَبَ، طَافَ، سَافَرَ', detail: 'Fi‘il madhi digunakan untuk menyatakan tindakan atau kejadian yang telah berlangsung pada masa lampau.' },
      { heading: 'Perubahan menurut dhamir', arabic: 'ذَهَبَ، ذَهَبَا، ذَهَبُوا، ذَهَبَتْ، ذَهَبْتَ، ذَهَبْتِ، ذَهَبْتُ، ذَهَبْنَا', detail: 'Bentuk fi‘il berubah mengikuti pelaku/dhamir. Contoh pada buku menunjukkan bentuk untuk هو، هما، هم، هي، أنتَ، أنتِ، أنا، dan نحن.' },
      { heading: 'Contoh penerapan', arabic: 'ذَهَبْتُ إِلَى مَكَّةَ. / ذَهَبُوا إِلَى الْمَسْجِدِ.', detail: 'ذَهَبْتُ digunakan untuk أنا (saya), sedangkan ذَهَبُوا digunakan untuk هم (mereka laki-laki).' },
      { heading: 'Catatan konsistensi isi buku', arabic: 'تصريف الفعل الماضي اللغوي', detail: 'Daftar isi menuliskan أقسام الفعل – المذكر والمؤنث, sedangkan KD, indikator, pembahasan kaidah, dan rangkuman bab mengarah pada تصريف الفعل الماضي اللغوي. Flipbook mengikuti pembahasan dan rangkuman yang secara langsung diajarkan pada bab.' }
    ],
    examples: [
      { arabic: 'سَافَرْنَا إِلَى مَكَّةَ الْمُكَرَّمَةِ.', meaning: 'Kami bepergian ke Makkah al-Mukarramah.', note: 'سَافَرْنَا adalah fi‘il madhi untuk نحن.' },
      { arabic: 'طَافَ الْحَاجُّ حَوْلَ الْكَعْبَةِ.', meaning: 'Jamaah haji melakukan tawaf mengelilingi Ka‘bah.', note: 'طَافَ adalah fi‘il madhi untuk هو.' },
      { arabic: 'زَارَتْ أُسْرَتِي الْمَدِينَةَ.', meaning: 'Keluarga saya mengunjungi Madinah.', note: 'زَارَتْ menunjukkan pelaku perempuan tunggal.' }
    ],
    summary: 'Teks rekon bab ini mengisahkan pengalaman ibadah haji dan umrah. Kaidah yang dibahas dalam materi dan rangkuman adalah تصريف الفعل الماضي اللغوي, yaitu perubahan bentuk kata kerja lampau berdasarkan dhamir/pelaku.'
  },
  'ch05-ict': {
    competency: 'Memahami dan menyajikan teks tentang تكنولوجيا الإعلام والاتصال, menyampaikan pendapat tentang teknologi, dan menggunakan تصريف الفعل المضارع اللغوي.',
    indicators: [
      'Mengidentifikasi kosakata perangkat dan teknologi komunikasi.',
      'Menemukan gagasan, fakta, manfaat, dan dampak penggunaan teknologi.',
      'Menjelaskan struktur teks eksposisi: tesis, argumen, dan penguatan.',
      'Menjelaskan bentuk, makna, dan fungsi tasrif fi‘il mudhari’.',
      'Menyesuaikan bentuk fi‘il mudhari’ dengan dhamir.',
      'Menyusun teks eksposisi dan menyampaikan pendapat tentang teknologi.'
    ],
    concept: 'تكنولوجيا الإعلام والاتصال ← perangkat digital, internet, aplikasi, manfaat dan dampak; teks eksposisi; تصريف الفعل المضارع اللغوي.',
    intro: 'Bab ini membahas komputer, telepon genggam, internet, aplikasi, dan dampak penggunaan teknologi. Teks eksposisi mengembangkan gagasan melalui tesis, argumen pendukung, dan penguatan atau penegasan.',
    grammar: [
      { heading: 'Fi‘il mudhari’ (الفعل المضارع)', arabic: 'يَكْتُبُ، يَسْتَخْدِمُ، نَتَّصِلُ', detail: 'Fi‘il mudhari’ digunakan untuk menyatakan tindakan yang berlangsung sekarang atau akan datang.' },
      { heading: 'Awalan fi‘il mudhari’', arabic: 'أَ / نَ / يَ / تَ', detail: 'Bentuk mudhari’ menggunakan huruf mudhara‘ah. Secara umum أَ untuk أنا, نَ untuk نحن, يَ untuk orang ketiga laki-laki, dan تَ untuk orang kedua serta bentuk orang ketiga perempuan; bentuk rinci mengikuti dhamir.' },
      { heading: 'Contoh perubahan', arabic: 'أَسْتَخْدِمُ، نَسْتَخْدِمُ، يَسْتَخْدِمُ، تَسْتَخْدِمُ', detail: 'Perhatikan perubahan awalan ketika subjek berubah. Bentuk mutsanna dan jamak juga memiliki penanda akhir sesuai tabel tasrif pada buku.' },
      { heading: 'Catatan konsistensi isi buku', arabic: 'تصريف الفعل المضارع اللغوي', detail: 'Daftar isi mencantumkan تصريف الفعل الماضي اللغوي, tetapi KD, indikator, pembahasan, dan rangkuman Bab 5 mengajarkan تصريف الفعل المضارع اللغوي. Flipbook mengikuti pembahasan dan rangkuman bab.' }
    ],
    examples: [
      { arabic: 'يَسْتَخْدِمُ الطَّالِبُ الْحَاسُوبَ فِي الدِّرَاسَةِ.', meaning: 'Siswa menggunakan komputer dalam belajar.', note: 'يَسْتَخْدِمُ adalah fi‘il mudhari’ untuk هو.' },
      { arabic: 'أَسْتَخْدِمُ الْهَاتِفَ لِلتَّوَاصُلِ مَعَ أُسْرَتِي.', meaning: 'Saya menggunakan telepon untuk berkomunikasi dengan keluarga.', note: 'أَسْتَخْدِمُ menunjukkan subjek أنا.' },
      { arabic: 'نَتَعَلَّمُ اللُّغَةَ الْعَرَبِيَّةَ عَبْرَ الْإِنْتَرْنِتِ.', meaning: 'Kami belajar bahasa Arab melalui internet.', note: 'نَتَعَلَّمُ menunjukkan subjek نحن.' }
    ],
    summary: 'Teks eksposisi menyampaikan gagasan melalui tesis, argumen, dan penguatan. Kaidah bab ini adalah تصريف الفعل المضارع اللغوي, yaitu perubahan fi‘il mudhari’ menurut dhamir untuk menyatakan tindakan sekarang atau akan datang.'
  },
  'ch06-religions': {
    competency: 'Memahami dan menyajikan teks deskriptif tentang الأديان في إندونيسيا secara objektif dan santun, serta membedakan الجملة الاسمية dan الجملة الفعلية.',
    indicators: [
      'Mengidentifikasi kosakata agama dan tempat ibadah.',
      'Menemukan informasi faktual dari teks tentang agama di Indonesia.',
      'Menjelaskan fungsi sosial dan struktur teks deskriptif.',
      'Mengidentifikasi deskripsi umum dan deskripsi khusus.',
      'Menjelaskan mubtada’, khabar, fi‘il, dan fa‘il.',
      'Membedakan dan menyusun jumlah ismiyyah serta jumlah fi‘liyyah.'
    ],
    concept: 'الأديان في إندونيسيا ← agama dan tempat ibadah; teks deskriptif; deskripsi umum dan khusus; الجملة الاسمية والجملة الفعلية.',
    intro: 'Bab ini menyajikan informasi tentang agama-agama di Indonesia dan tempat ibadah. Materi harus dipahami secara deskriptif, objektif, dan santun, tanpa merendahkan atau membandingkan keyakinan.',
    grammar: [
      { heading: 'Jumlah ismiyyah (الجملة الاسمية)', arabic: 'الْمُسْلِمُ مُجْتَهِدٌ.', detail: 'Kalimat nominal diawali isim. Unsur pokoknya adalah mubtada’ (pokok yang dibicarakan) dan khabar (keterangan tentang mubtada’). Contoh: الْمُسْلِمُ sebagai mubtada’ dan مُجْتَهِدٌ sebagai khabar.' },
      { heading: 'Jumlah fi‘liyyah (الجملة الفعلية)', arabic: 'يُصَلِّي الْمُسْلِمُ فِي الْمَسْجِدِ.', detail: 'Kalimat verbal diawali fi‘il. Unsur pokoknya adalah fi‘il (kata kerja) dan fa‘il (pelaku). Pada contoh, يُصَلِّي adalah fi‘il dan الْمُسْلِمُ adalah fa‘il.' },
      { heading: 'Membedakan struktur', arabic: 'الْمَسْجِدُ كَبِيرٌ. / يَزُورُ النَّاسُ الْمَسْجِدَ.', detail: 'Kalimat pertama diawali isim sehingga merupakan jumlah ismiyyah. Kalimat kedua diawali fi‘il sehingga merupakan jumlah fi‘liyyah.' },
      { heading: 'Struktur teks deskriptif', arabic: 'الْوَصْفُ الْعَامُّ ← الْوَصْفُ الْخَاصُّ', detail: 'Deskripsi umum mengenalkan objek atau tempat, sedangkan deskripsi khusus menguraikan ciri, bagian, lokasi, atau informasi rinci.' },
      { heading: 'Catatan konsistensi isi buku', arabic: 'الجملة الاسمية والجملة الفعلية', detail: 'Daftar isi menunjukkan penyebutan kaidah yang tidak selaras dengan bagian pembahasan. Materi utama dan rangkuman Bab 6 menjadi acuan untuk kaidah jumlah ismiyyah dan jumlah fi‘liyyah.' }
    ],
    examples: [
      { arabic: 'الْمَسْجِدُ كَبِيرٌ.', meaning: 'Masjid itu besar.', note: 'Jumlah ismiyyah: الْمَسْجِدُ = mubtada’; كَبِيرٌ = khabar.' },
      { arabic: 'يُصَلِّي الْمُسْلِمُونَ فِي الْمَسَاجِدِ.', meaning: 'Umat Islam salat di masjid-masjid.', note: 'Jumlah fi‘liyyah: يُصَلِّي = fi‘il; الْمُسْلِمُونَ = fa‘il.' },
      { arabic: 'الْكَنِيسَةُ مَكَانُ عِبَادَةٍ.', meaning: 'Gereja adalah tempat ibadah.', note: 'Kalimat nominal yang memberi deskripsi tentang tempat ibadah.' }
    ],
    summary: 'Bab ini menggunakan teks deskriptif dengan pola الوصف العام dan الوصف الخاص. Jumlah ismiyyah diawali isim dan memiliki mubtada’ serta khabar; jumlah fi‘liyyah diawali fi‘il dan memiliki fa‘il.'
  }
};

const SKILL_ORDER = ['istima', 'qiraah', 'qawaid', 'kitabah', 'kalam'];


export function getLearningChapter(chapterId) {
  const chapter = CASES_CONFIG[chapterId];
  const meta = EPISODE_META.find((item) => item.id === chapterId);
  const academic = CHAPTER_ACADEMIC[chapterId];
  if (!chapter || !meta || !academic) return null;

  const learningSections = chapter.learningPath
    .filter((section) => SKILL_ORDER.includes(section.type))
    .sort((a, b) => SKILL_ORDER.indexOf(a.type) - SKILL_ORDER.indexOf(b.type));

  const pages = [
    { type: 'cover', label: 'مُقَدِّمَةُ الْبَابِ', title: meta.title, caseTitle: meta.caseTitle, body: academic.intro, arabic: meta.titleArabic, sourcePages: chapter.curriculum.sourcePages },
    { type: 'competency', label: 'الْكِفَايَاتُ وَالْمُؤَشِّرَاتُ', title: 'Kompetensi dan indikator', body: academic.competency, bullets: academic.indicators, sourcePages: chapter.curriculum.sourcePages },
    { type: 'concept', label: 'خَرَائِطُ الْمَفَاهِيمِ', title: 'Peta konsep', body: academic.concept, sourcePages: chapter.curriculum.sourcePages },
    { type: 'intro', label: 'مَدْخَلُ الدَّرْسِ', title: 'Pengantar materi', body: chapter.curriculum.focus, sourcePages: chapter.curriculum.sourcePages },
    ...learningSections.map((section) => ({
      type: section.type,
      label: section.titleArabic,
      title: section.title,
      body: section.material,
      objective: section.objective,
      vocabIds: section.vocabularyIds ?? [],
      sourcePages: section.sourcePages,
      contentStatus: section.contentStatus,
      ...(section.type === 'istima' && ISTIMA_AUDIO_CONTENT[chapterId] ? { istima: { ...ISTIMA_AUDIO_CONTENT[chapterId], audioText: ISTIMA_AUDIO_CONTENT[chapterId].turns.map((turn) => turn.arabic).join(' ') } } : {})
    })),
    { type: 'grammar-detail', label: 'شَرْحُ الْقَوَاعِدِ', title: 'Penjelasan kaidah', body: academic.grammar.map((item) => item.detail).join(' '), grammar: academic.grammar, sourcePages: chapter.curriculum.sourcePages },
    { type: 'examples', label: 'أَمْثِلَةٌ وَتَطْبِيقَاتٌ', title: 'Contoh penerapan', examples: academic.examples, sourcePages: chapter.curriculum.sourcePages },
    { type: 'vocabulary', label: 'الْمُفْرَدَاتُ', title: 'Kosakata inti', body: 'Daftar kosakata berikut diambil dari registri mufradat proyek dan dikelompokkan menurut tema bab.', vocabIds: chapter.curriculum.coreVocabIds, sourcePages: chapter.curriculum.sourcePages },
    { type: 'summary', label: 'الْخُلَاصَةُ', title: 'Rangkuman', body: academic.summary, sourcePages: chapter.curriculum.sourcePages }
  ];

  return { id: chapterId, meta, chapter, academic, pages: pages.map((page, index) => ({ ...page, page: index + 1 })) };
}

export function getLearningVocabulary(vocabId) {
  return VOCABULARY_REGISTRY[vocabId] ?? null;
}

export const LEARNING_CHAPTER_IDS = Object.keys(CHAPTER_ACADEMIC);
