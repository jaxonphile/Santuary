# PRD: Santuary

Versi 1.0 · 16 November 2026 · Kelompok 4, Basis Data Lanjutan, Kelas A, Informatika USK

## 1. Ringkasan

Santuary adalah platform komunitas anonim tempat korban bullying dan pelecehan seksual bisa bercerita, didengar, dan mendapat dukungan dari sesama mahasiswa. Pada tahap awal, platform fokus pada cerita, komunitas, dan moderasi. Integrasi dengan lembaga berwenang dan aplikasi mobile masuk rencana jangka panjang.

## 2. Masalah

- Bullying dan kekerasan seksual masih terjadi di lingkungan pendidikan. Survei Kemendikbud pada 2020 mencatat 77 persen dosen yang disurvei mengaku mengetahui adanya kekerasan seksual di kampus. Dari jumlah itu, 63 persen memilih tidak melapor karena takut stigma terhadap korban. Responden survei ini adalah dosen, bukan mahasiswa, sehingga hasilnya tidak sepenuhnya mewakili pengalaman korban.
- KPAI mengutip data UNICEF yang menyebut delapan dari sepuluh anak pernah mengalami bullying. Data ini berasal dari 2014 dan perlu diperbarui dengan data USK atau survei terbaru.
- Banyak korban memendam pengalaman mereka karena tidak tahu harus bercerita ke mana atau takut tidak dipercaya.

Sumber: https://www.cnnindonesia.com/nasional/20211111093436-20-719583/survei
Sumber: https://www.kpai.go.id/publikasi/kpai-perundungan-urutan-keempat-kasus-kekerasan-anak

## 3. Pengguna

- Persona utama: Rina, 20 tahun, mahasiswi USK. Pernah mengalami perundungan di grup kelas dan belum siap bercerita ke teman atau dosen. Tujuannya bercerita tanpa identitas dirinya diketahui.
- Persona kedua: Dimas, 21 tahun, mahasiswa USK. Mengalami pelecehan seksual dan merasa malu untuk bercerita karena takut dianggap lemah. Tujuannya menemukan ruang aman untuk menuangkan cerita.
- Persona pengelola: admin komunitas atau moderator yang memastikan cerita tetap aman dan sesuai aturan.

## 4. Tujuan dan Metrik Sukses

- Pengguna dapat mengirim cerita anonim dalam kurang dari tiga menit.
- Minimal 80 persen cerita yang tayang sudah melalui peninjauan moderator dalam waktu 24 jam. Angka ini perlu disesuaikan setelah uji coba.
- Minimal 30 persen cerita aktif mendapat minimal satu komentar dukungan dalam seminggu.
- Jumlah cerita aktif per minggu meningkat selama tiga bulan pertama uji coba.
- Tidak ada data identitas pengguna yang tampil di antarmuka publik.

## 5. Fitur Utama

- Cerita anonim: pengguna menulis cerita dengan nama samaran dan memilih kategori.
- Komentar dukungan: pengguna lain dapat memberi dukungan tanpa menghakimi.
- Moderasi: moderator meninjau cerita dan komentar sebelum tampil atau setelah dilaporkan.
- Tautan layanan bantuan: panel berisi kontak layanan krisis dan Satgas PPKPT USK.
- Pengaturan privasi: pengguna memilih apakah cerita tampil publik atau terbatas.
- Peringatan konten sensitif: penulis wajib memilih label sensitif sebelum posting. Cerita bertanda sensitif tersembunyi sampai pembaca menekan tombol untuk membukanya.
- Laporan konten: pengguna dapat melaporkan cerita atau komentar dengan memilih kategori alasan. Sistem membatasi pelaporan berulang dari akun yang sama untuk mencegah penyalahgunaan.

Fitur yang ditunda: area chat, feed media, dan profil progres kesembuhan.

## 6. Di Luar Lingkup

- Integrasi dengan lembaga berwenang.
- Aplikasi mobile.
- Fitur membagikan foto atau identitas terduga pelaku.
- Sistem verifikasi identitas penuh.
- Penyortiran otomatis dengan bot. Dijadwalkan pada fase berikutnya setelah moderasi manusia berjalan.
- Layanan konseling langsung oleh psikolog atau tenaga medis.

## 7. Risiko dan Asumsi

- Waktu pengerjaan hanya dua minggu, sehingga cakupan fitur harus ketat.
- Nilai utama platform, yaitu rasa aman dan komunitas, perlu dibuktikan lewat uji coba, bukan hanya klaim.
- Desain antarmuka mungkin belum nyaman. Lakukan uji singkat dengan lima sampai sepuluh mahasiswa sebelum rilis.
- Data uji bukan data pengguna nyata.
- Asumsi: moderator tersedia selama uji coba.

## 8. Kebutuhan Non-Fungsional

- Data pribadi pengguna dienkripsi dan tidak ditampilkan di antarmuka publik.
- Konten sensitif diberi peringatan dan tautan layanan krisis.
- Akses moderasi dibatasi pada akun yang berwenang.

## 9. Aturan Komunitas

- Dilarang mengomentari cerita dengan kalimat yang menyalahkan, merendahkan, atau meragukan pengalaman korban.
- Dilarang menyebarkan identitas, foto, atau data pribadi siapa pun dalam cerita atau komentar.
- Pelanggaran aturan dapat berujung pada penghapusan konten dan pembatasan akun.

## 10. Moderasi dan Penghapusan Konten

- Moderator dapat menghapus konten yang membahayakan pengguna atau melanggar aturan komunitas.
- Setiap penghapusan wajib tercatat dengan alasan, waktu, dan nama moderator.
- Penulis cerita yang dihapus diberi tahu alasannya, kecuali konten tersebut mengancam keselamatan orang lain.
- Setiap laporan konten ditinjau moderator dalam waktu 24 jam.

## 11. Kebijakan Data dan Retensi

- Cerita disimpan selama dua tahun sejak tanggal posting, kecuali penulis meminta penghapusan lebih awal.
- Pengguna dapat menghapus ceritanya sendiri kapan saja. Data pribadi yang tidak diperlukan tidak dikumpulkan.
- Kebijakan ini disusun dengan mengacu pada UU Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi.

## 12. Batasan Layanan

Santuary bukan pengganti layanan psikologis, layanan medis, atau penegakan hukum. Pesan ini ditampilkan di halaman utama dan di setiap panel bantuan.

- Untuk krisis psikologis, pengguna diarahkan ke layanan 119 ekstensi 8.
- Untuk kekerasan dan perlindungan, pengguna diarahkan ke SAPA 129.
- Untuk pelaporan di kampus, pengguna diarahkan ke Satgas PPKPT USK.
