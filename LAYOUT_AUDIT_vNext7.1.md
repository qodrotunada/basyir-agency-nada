# LAYOUT AUDIT — BASYIR AGENCY vNext7.1

## Source yang diperiksa
- Source utama: arsip `BASYIR_AGENCY_vNext7(1).zip`.
- Arsip vNext5 yang juga diunggah tidak dipakai sebagai source penerapan. Arsip lama mengandung `.env.local` dan `.git`; keduanya tidak disalin ke paket vNext7.1.

## Temuan akar masalah

### A1 — Dialog login terikat ke header
`AuthControls` sebelumnya dirender sebagai anak `.header-actions` di dalam `.site-header`. Header menggunakan `backdrop-filter: blur(16px)`. Filter/backdrop-filter dapat membentuk containing block untuk descendant `position: fixed`. Akibatnya, `.modal-backdrop` login berisiko diposisikan relatif terhadap header, bukan viewport penuh.

**Perbaikan:** modal login/registrasi sekarang dirender menggunakan `createPortal(..., document.body)`. Tombol login tetap berada pada header; hanya dialog yang dipindahkan ke lapisan dokumen.

### A2 — Dialog investigasi berada di dalam elemen ber-transform
Dialog bukti/papan bukti/panduan dirender di dalam `GameView`. Game view menggunakan kelas `.page-enter` yang menjalankan animasi dengan `transform: translateY(...)`. Transform pada ancestor dapat membentuk containing block baru untuk elemen fixed.

**Perbaikan:** dialog investigasi dipindahkan ke `document.body` menggunakan React portal. Dialog impor dan reset juga memakai portal untuk konsistensi.

### A3 — Dialog panjang pada viewport pendek
Aturan lama memakai flex centering dan overflow pada backdrop. Kombinasi itu dapat membuat bagian atas dialog yang lebih tinggi dari viewport sulit dijangkau pada ukuran layar pendek/keyboard mobile.

**Perbaikan:** backdrop menggunakan grid overlay, dialog diberi `max-height` dinamis berbasis `100dvh`, dan konten dialog memiliki scroll internal serta safe-area padding.

### A4 — Sisa permukaan terang dari tema lama
Tema vNext7 telah menggelapkan sejumlah kartu, tetapi beberapa panel lama, status badge, komponen latihan, form input, kontrol zoom, serta dekorasi folder/catatan masih memakai warna cream/putih atau aksen yang relatif terang.

**Perbaikan:** stylesheet `styles-vnext71.css` memperkenalkan token warna final dan override terarah pada komponen tersebut. Teks, placeholder, tombol, dan feedback ikut disesuaikan.

## Batasan audit
- Audit ini berbasis struktur source dan CSS yang tersedia di arsip, bukan inspeksi DOM langsung pada browser komputer pengguna.
- Posisi aktual pada resolusi yang ditentukan tetap perlu diverifikasi lewat localhost.
- Tidak ada klaim bahwa seluruh kemungkinan tumpang tindih telah dibuktikan hilang sebelum pengujian browser.

## File utama yang berubah
- `src/auth/AuthControls.jsx`
- `src/App.jsx`
- `src/main.jsx`
- `src/styles-vnext71.css` (baru)
- `src/auth/AuthControls.test.js` (baru)
- `package.json`
- `package-lock.json`
