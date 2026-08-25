# Panduan Undangan Digital — Maksi & Indiani

## 0. Ringkasan Revisi Terbaru
Perbaikan yang sudah dilakukan pada versi ini:
- Tombol **BUKA UNDANGAN** di halaman pembuka kini selalu terlihat jelas (sebelumnya tersembunyi di bagian bawah).
- Menambahkan **animasi tirai**: saat tombol diklik, tirai bermotif tenun menutup layar lalu terbuka mengarahkan tamu ke halaman undangan.
- Foto mempelai pria & wanita **tidak lagi terpotong bagian kepala** (rasio & posisi foto diperbaiki).
- **Galeri foto** kini ditampilkan 2 foto berdampingan per baris.
- Halaman **Rangkaian Acara** dirapikan menjadi 2 kartu terpisah (Akad/Pemberkatan & Resepsi) dengan ikon dan tata letak yang jelas.
- **Wedding Gift** didesain ulang menyerupai kartu ATM/debit (chip emas, nomor rekening, nama pemegang).
- Menambahkan **bingkai (frame)** dekoratif emas pada foto, kartu, dan elemen-elemen penting lainnya.
- Warna tiap halaman kini **berselang-seling** cream → hijau tosca → cream, dst, supaya tidak monoton satu warna.
- Menambahkan **animasi saat scroll** (elemen muncul dengan fade-up) di seluruh halaman.
- Footer diubah menjadi **"Design by @rijald_elimanafe"** lengkap dengan tombol Instagram, WhatsApp, dan TikTok bergaya ikon.

---

## 1. Struktur File
```
wedding-invitation/
├── index.html        -> halaman undangan utama
├── style.css          -> semua styling
├── script.js           -> logika (countdown, musik, RSVP, galeri, dll)
├── generator.html   -> halaman untuk membuat link undangan per tamu
└── assets/               -> taruh semua foto & musik di sini
```

## 2. Foto & Musik yang perlu ditambahkan ke folder `assets/`
Semua nama file **harus persis sama** (huruf besar/kecil ikut berpengaruh):

- `Latar.jpg` — foto latar (dipakai di semua halaman)
- `Love_Story1.jpg`, `Love_Story2.jpg`, `Love_Story3.jpg` — foto di halaman Love Story
- `Foto1.jpg` s/d `Foto10.jpg` — 10 foto galeri (Foto1 & Foto2 juga dipakai sebagai foto profil mempelai pria & wanita — silakan ganti di `index.html` bila ingin foto profil terpisah)
- `Yovie & Nuno - Janji Suci Lirik Lagu.mp3` — musik latar

## 3. Mengaktifkan Buku Tamu (Ucapan & Doa) dengan JSONBin.io
Agar ucapan tamu bisa dilihat oleh semua orang yang membuka link undangan:

1. Buat akun gratis di https://jsonbin.io
2. Klik **Create Bin**, isi kontennya dengan `[]` lalu simpan.
3. Salin **Bin ID** dari URL / dashboard.
4. Buka menu **API Keys**, salin **X-Master-Key**.
5. Buka file `script.js`, cari bagian:
   ```js
   const JSONBIN_BIN_ID = "PASTE_BIN_ID_ANDA_DISINI";
   const JSONBIN_API_KEY = "PASTE_X_MASTER_KEY_ANDA_DISINI";
   ```
   Ganti dengan Bin ID dan API Key Anda.
6. Simpan, lalu upload ulang. Ucapan tamu sekarang akan tersimpan online dan bisa dilihat semua orang.

## 4. Mengatur Tanggal Hitung Mundur & Lokasi Peta
Di `script.js`, bagian paling atas:
```js
const WEDDING_DATETIME = "2026-09-04T10:00:00+08:00";
const MAPS_AKAD = "https://maps.google.com/?q=...";
const MAPS_RESEPSI = "https://maps.google.com/?q=...";
```
Silakan sesuaikan link Google Maps dengan lokasi asli (klik kanan lokasi di Google Maps → "Bagikan" → salin link).

## 5. Hosting
Upload seluruh folder (`index.html`, `style.css`, `script.js`, `generator.html`, `assets/`) ke layanan hosting statis gratis, misalnya:
- Netlify (drag & drop folder)
- Vercel
- GitHub Pages

Setelah online, Anda akan mendapat alamat seperti:
`https://undangan-maksi-indiani.netlify.app/index.html`

## 6. Menggunakan Generator Link
1. Buka `generator.html` di file yang sudah dihosting, contoh:
   `https://undangan-maksi-indiani.netlify.app/generator.html`
2. Di dalam file `generator.html`, cari baris berikut dan ganti dengan alamat `index.html` Anda:
   ```js
   const BASE_URL = "index.html";
   // ganti menjadi, misalnya:
   const BASE_URL = "https://undangan-maksi-indiani.netlify.app/index.html";
   ```
3. Isi nama tamu → klik **HASILKAN LINK** → salin manual atau langsung **Bagikan via WA**.

Setiap tamu akan melihat namanya sendiri di halaman pembuka undangan (`?to=NamaTamu`), dan nama tersebut otomatis terisi di kolom "Nama Anda" pada form RSVP.

## 7. Catatan
- Rekening yang ditampilkan saat ini hanya rekening mempelai wanita (BRI a.n Indiani Cristina Ndolu) karena rekening mempelai pria belum diberikan — tambahkan kartu kedua di `index.html` bila diperlukan.
- Musik akan otomatis mencoba diputar saat tamu menekan tombol "BUKA UNDANGAN" (mengikuti kebijakan browser yang melarang autoplay tanpa interaksi).
