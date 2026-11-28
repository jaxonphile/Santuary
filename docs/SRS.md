# SRS: Santuary

Versi 1.0 · 16 November 2026 · Kelompok 4, Basis Data Lanjutan, Kelas A, Informatika USK

## 1. Pendahuluan

### 1.1 Tujuan

Dokumen ini menjelaskan kebutuhan perangkat lunak Santuary, platform komunitas anonim untuk korban bullying dan pelecehan seksual di lingkungan kampus. Dokumen ditujukan untuk tim pengembang, dosen pengampu, dan penguji.

### 1.2 Ruang Lingkup

Santuary mencakup cerita anonim, komentar dukungan, pelaporan konten, moderasi, persetujuan, pengajuan laporan formal ke lembaga pilot, pelacakan status, dan dashboard admin. Integrasi nyata dengan lembaga dan aplikasi mobile berada di luar lingkup.

### 1.3 Acuan

- PRD_Santuary.docx versi 1.0, sebagai sumber tujuan dan fitur produk.
- IEEE Std 29148, sebagai acuan struktur kebutuhan.
- UU Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi.

### 1.4 Istilah

- Cerita: tulisan pengguna tentang pengalaman bullying atau pelecehan.
- Rujukan: pengajuan laporan formal dari cerita ke lembaga pilot.
- Moderator: pengguna berwenang yang meninjau dan mengelola konten.

## 2. Deskripsi Umum

### 2.1 Pengguna

- Pengguna umum: mahasiswa yang ingin bercerita, mendukung, atau melaporkan konten.
- Moderator: meninjau konten dan mengelola laporan.
- Admin lembaga pilot: melihat status rujukan dan dashboard (simulasi).

### 2.2 Asumsi

- Seluruh data pada tahap prototipe adalah data uji, bukan data pengguna nyata.
- Lembaga pilot disimulasikan dengan tabel lembaga berisi data contoh.
- Moderator tersedia selama masa uji coba.

## 3. Kebutuhan Fungsional

| ID | Kebutuhan | Prioritas | Cara uji |
| --- | --- | --- | --- |
| FR-01 | Pengguna dapat mendaftar dengan email, nama samaran, dan password. | Tinggi | POST /api/auth/daftar, status 201 |
| FR-02 | Pengguna dapat masuk dan menerima token JWT. | Tinggi | POST /api/auth/masuk, status 200 dan token terisi |
| FR-03 | Pengguna dapat membuat cerita dengan judul, isi, kategori, dan label sensitif. | Tinggi | POST /api/cerita, status 201 |
| FR-04 | Pengguna memilih tingkat keterlibatan: hanya bercerita, minta dukungan, atau laporan formal. | Tinggi | Uji tiga nilai, cek kolom tingkat_keterlibatan |
| FR-05 | Cerita bertanda sensitif tersembunyi sampai pembaca membukanya. | Tinggi | Cek respons API untuk cerita sensitif, field isi disembunyikan |
| FR-06 | Cerita yang belum ditinjau moderator tidak tampil publik. | Tinggi | GET /api/cerita tanpa status disetujui, cerita tidak muncul |
| FR-07 | Pengguna dapat memberi komentar dukungan pada cerita yang tampil. | Sedang | POST /api/cerita/:id/komentar, status 201 |
| FR-08 | Pengguna dapat melaporkan cerita atau komentar dengan memilih alasan. | Tinggi | POST /api/laporan-konten, status 201 |
| FR-09 | Sistem membatasi laporan berulang dari akun yang sama terhadap konten yang sama. | Sedang | Kirim laporan kedua yang sama, status 409 |
| FR-10 | Moderator dapat menyetujui, menyembunyikan, atau menghapus konten. | Tinggi | PATCH /api/moderasi/cerita/:id, uji tiga aksi |
| FR-11 | Setiap tindakan moderasi tercatat dengan alasan, waktu, dan nama moderator. | Tinggi | Cek tabel log_moderasi setelah FR-10 |
| FR-12 | Pengguna memberikan persetujuan tertulis sebelum cerita diteruskan ke lembaga pilot. | Tinggi | POST /api/persetujuan, status 201 |
| FR-13 | Pengguna mengajukan laporan formal ke lembaga pilot melalui prosedur sp_ajukan_laporan. | Tinggi | POST /api/rujukan, status 201 dan rujukan terbentuk |
| FR-14 | Sistem membatalkan seluruh pengajuan jika salah satu langkah gagal. | Tinggi | Skenario ROLLBACK di 07_transaction_demo.sql |
| FR-15 | Pengguna dapat melihat status rujukan miliknya tanpa data pengguna lain. | Tinggi | GET /api/rujukan/saya, hanya data milik sendiri |
| FR-16 | Setiap perubahan status rujukan tercatat otomatis di log_status. | Tinggi | Ubah status rujukan, cek baris baru di log_status |
| FR-17 | Dashboard admin menampilkan jumlah kasus per kategori dan per bulan. | Sedang | GET /api/dashboard, sesuai hasil v_dashboard_kasus |
| FR-18 | Sistem menampilkan direktori layanan bantuan, termasuk 119 ekstensi 8 dan SAPA 129. | Tinggi | GET /api/layanan, dua layanan tampil |
| FR-19 | Pengguna dapat menghapus ceritanya sendiri. | Sedang | DELETE /api/cerita/:id oleh pemilik, status 200 |
| FR-20 | Pengguna dapat mengatur cerita tampil publik atau terbatas. | Sedang | PATCH /api/cerita/:id/privasi, uji dua nilai |
| FR-21 | Halaman utama dan panel bantuan menampilkan disclaimer bahwa Santuary bukan pengganti layanan psikologis, medis, atau penegakan hukum. | Tinggi | Pemeriksaan manual di antarmuka |

## 4. Kebutuhan Non-Fungsional

| ID | Kebutuhan | Prioritas | Cara uji |
| --- | --- | --- | --- |
| NFR-01 | Password disimpan dalam bentuk hash bcrypt, tidak pernah dalam bentuk asli. | Tinggi | Cek kolom password_hash di tabel pengguna |
| NFR-02 | Identitas pengguna tidak tampil di antarmuka publik maupun di v_status_laporan. | Tinggi | Cek respons semua endpoint publik |
| NFR-03 | Cerita disimpan sesuai kebijakan retensi yang ditetapkan tim. | Sedang | Pemeriksaan manual kebijakan |
| NFR-04 | Query pencarian kategori berjalan lebih cepat setelah index dibuat. | Sedang | EXPLAIN PLAN sebelum dan sesudah index |
| NFR-05 | Sistem dapat dijalankan di Windows, macOS, dan Linux melalui Docker Compose. | Tinggi | Uji satu perintah docker compose up pada tiap sistem |
| NFR-06 | Kredensial tidak tersimpan di repositori. | Tinggi | Cek .gitignore dan riwayat commit |
| NFR-07 | Riwayat status rujukan tidak dapat diubah atau dihapus. | Tinggi | Uji UPDATE dan DELETE pada log_status, harus ditolak |

## 5. Kebutuhan Basis Data

| ID | Kebutuhan | Prioritas | Cara uji |
| --- | --- | --- | --- |
| DB-01 | Delapan tabel utama: pengguna, kategori_bullying, lembaga, cerita, persetujuan, rujukan, log_status, dan log_moderasi, dengan bentuk normal ketiga. | Tinggi | Jalankan skrip terkait dan cek hasilnya |
| DB-02 | Index idx_cerita_kategori_tanggal pada cerita(kategori_id, dibuat_pada) untuk filter kategori di beranda dan dashboard. | Tinggi | Jalankan skrip terkait dan cek hasilnya |
| DB-03 | Index idx_rujukan_lembaga pada rujukan(lembaga_id) untuk dashboard lembaga. | Tinggi | Jalankan skrip terkait dan cek hasilnya |
| DB-04 | Trigger trg_log_status (AFTER UPDATE pada rujukan) mencatat setiap perubahan status. | Tinggi | Jalankan skrip terkait dan cek hasilnya |
| DB-05 | Trigger trg_log_immutable (BEFORE UPDATE OR DELETE pada log_status) menolak perubahan riwayat. | Tinggi | Jalankan skrip terkait dan cek hasilnya |
| DB-06 | Stored procedure sp_ajukan_laporan(p_cerita_id, p_lembaga_id) menyimpan persetujuan dan rujukan, serta menolak lembaga tidak aktif. | Tinggi | Jalankan skrip terkait dan cek hasilnya |
| DB-07 | Transaction dengan SAVEPOINT, COMMIT pada pengajuan valid, dan ROLLBACK TO SAVEPOINT pada pengajuan gagal. | Tinggi | Jalankan skrip terkait dan cek hasilnya |
| DB-08 | View v_dashboard_kasus untuk jumlah cerita per kategori dan per bulan. | Tinggi | Jalankan skrip terkait dan cek hasilnya |
| DB-09 | View v_status_laporan untuk status rujukan tanpa identitas pengguna. | Tinggi | Jalankan skrip terkait dan cek hasilnya |
| DB-10 | Tabel log_moderasi mencatat setiap tindakan moderator, termasuk alasan, waktu, dan nama moderator. | Tinggi | Jalankan skrip terkait dan cek hasilnya |

## 6. Kebutuhan Antarmuka

- Beranda menampilkan daftar cerita yang sudah disetujui, dengan filter kategori.
- Formulir cerita memuat judul, isi, kategori, pilihan tingkat keterlibatan, dan label sensitif.
- Halaman status laporan hanya menampilkan rujukan milik pengguna yang sedang login.
- Dashboard admin hanya dapat diakses akun moderator.
- Panel bantuan selalu terlihat di setiap halaman.

## 7. Batasan

- Pengerjaan dilakukan dalam dua minggu, sehingga FR bertanda Sedang dapat disederhanakan jika waktu tidak cukup.
- Tidak ada verifikasi identitas penuh.
- Tidak ada pengiriman otomatis ke lembaga nyata.
