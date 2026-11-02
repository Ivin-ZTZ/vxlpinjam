# Library of Things — Mono no Toshokan (ものの図書館)

Aplikasi web peminjaman barang antaranggota komunitas rukun warga dan hobi. Terinspirasi dari konsep **Mono no Toshokan** di Jepang: *berbagi manfaat barang, merawat bersama, dan mengurangi konsumsi berlebih.*

---

## 🌿 Fitur Utama

### 1. Halaman Katalog Barang (Mode Anggota)
- **Daftar Barang Komunitas**: Berisi 9 barang contoh realistis (bor listrik, tangga teleskopik, tenda camping, proyektor FHD, mesin cuci steam, vacuum cleaner, perkakas mekanik, alat berkebun, set raket badminton).
- **Pencarian Interaktif**: Cari berdasarkan nama barang, deskripsi, atau nama pemilik.
- **Filter Kategori**: Pertukangan, Rumah Tangga, Elektronik, Camping & Outdoor, Olahraga & Hobi.
- **Filter Ketersediaan**: Tampilkan hanya barang yang berstatus "Tersedia".
- **Kartu Barang Taktil**: Menampilkan foto, kondisi fisik (*Sangat Baik / Baik / Cukup*), nama pemilik, lokasi blok, dan badge status ketersediaan.

### 2. Detail Barang & Edukasi Perawatan
- Spesifikasi lengkap, catatan kondisi fisik, dan lokasi penjemputan barang.
- **Petunjuk Pemakaian & Perawatan**: Instruksi khusus agar barang tetap awet dan aman digunakan.
- Tombol **Ajukan Peminjaman** aktif jika barang tersedia, dan otomatis nonaktif jika barang sedang dipinjam (disertai info peminjam & tanggal rencana kembali).

### 3. Formulir Pengajuan Peminjaman
- Pengisian nama peminjam, kontak/blok rumah, tanggal mulai pinjam, rencana tanggal pengembalian, dan catatan keperluan.
- Perhitungan estimasi durasi hari pinjam otomatis.
- Validasi input (tanggal kembali tidak boleh sebelum tanggal pinjam).
- Komitmen warga untuk merawat barang sebaik milik sendiri.
- Status awal pengajuan: **Menunggu Persetujuan**.

### 4. Dashboard Pengelola (Mode Admin)
- **Role Switcher**: Tombol beralih instan antara *Mode Anggota* dan *Mode Pengelola* di bilah navigasi atas (lengkap dengan badge jumlah permintaan yang butuh tindakan).
- **Statistik Cepat**: Total barang, barang siap dipinjam, barang aktif dipinjam, dan permintaan menunggu persetujuan.
- **Alur Status Peminjaman**:
  1. `Menunggu Persetujuan` ➜ Admin dapat klik **Setujui** atau **Tolak**.
  2. `Disetujui` ➜ Admin klik **Serahkan Barang (Mulai Pinjam)** saat serah-terima fisik terjadi. Status barang di katalog otomatis berubah menjadi `Sedang Dipinjam`.
  3. `Sedang Dipinjam` ➜ Admin klik **Catat Kembali** saat barang dikembalikan. Status barang otomatis kembali menjadi `Tersedia`.
  4. `Dikembalikan` / `Ditolak`.
- **Manajemen Inventaris**:
  - Tambah barang baru (lengkap dengan preset foto contoh untuk demonstrasi).
  - Edit informasi barang.
  - Hapus barang dengan dialog konfirmasi.

### 5. Penyimpanan & Ketahanan Data
- Seluruh data barang dan riwayat peminjaman disimpan secara persisten di `localStorage` peramban web (data tidak hilang saat halaman di-refresh).
- Tombol **Reset Data Demo** di footer untuk mengembalikan katalog dan peminjaman ke kondisi simulasi awal kapan saja.

---

## 🚀 Cara Menjalankan Secara Lokal

Pastikan Node.js (v18+) telah terpasang di komputer Anda.

1. Buka terminal di folder proyek:
   ```bash
   cd d:\textrpg\pinjam
   ```

2. Jalankan server pengembangan Vite:
   ```bash
   npm run dev
   ```

3. Buka tautan lokal yang ditampilkan di peramban web (biasanya `http://localhost:5173`).

4. Untuk membuat build produksi:
   ```bash
   npm run build
   ```

---

## 🎯 Panduan Skenario Demo untuk Pengujian

1. **Skenario Peminjaman oleh Warga**:
   - Berada di **Mode Anggota**.
   - Cari "Tenda" atau klik kategori *Camping & Outdoor*.
   - Klik kartu **Tenda Dome Camping 4 Orang** ➜ Klik **Ajukan Peminjaman**.
   - Masukkan nama Anda (misal: "Budi Santoso", Blok C-02), pilih tanggal, lalu klik **Kirim Pengajuan**.
   - Notifikasi sukses akan muncul.

2. **Skenario Verifikasi oleh Admin**:
   - Klik tombol **Pengelola** di kanan atas header.
   - Perhatikan badge notifikasi pada tab *Daftar Permintaan Peminjaman*.
   - Temukan pengajuan Budi Santoso tadi yang berstatus *Menunggu Persetujuan*.
   - Klik tombol hijau **Setujui**. Status berubah menjadi *Disetujui*.
   - Klik tombol **Serahkan Barang**. Status peminjaman menjadi *Sedang Dipinjam*.
   - Beralih kembali ke **Mode Anggota**: Barang *Tenda Dome Camping* kini berstatus *Sedang Dipinjam* dan tombol pinjamnya nonaktif.

3. **Skenario Pengembalian Barang**:
   - Beralih ke **Mode Pengelola**.
   - Pada baris peminjaman tenda yang sedang aktif, klik **Catat Kembali**.
   - Status peminjaman menjadi *Dikembalikan* dan barang di katalog otomatis kembali *Tersedia*.

4. **Skenario Reset**:
   - Klik tombol **Reset Data Demo** di bagian footer paling bawah jika ingin mengulang demonstrasi dari awal.
