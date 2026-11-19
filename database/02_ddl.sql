-- 02_seed.sql
-- Data uji Santuary. Jalankan sekali pada tabel yang masih kosong.

-- Data referensi
INSERT INTO kategori_bullying (nama_kategori, deskripsi) VALUES ('Perundungan verbal', 'Ejekan, hinaan, atau kata merendahkan');
INSERT INTO kategori_bullying (nama_kategori, deskripsi) VALUES ('Perundungan fisik', 'Kekerasan fisik terhadap korban');
INSERT INTO kategori_bullying (nama_kategori, deskripsi) VALUES ('Perundungan siber', 'Perundungan melalui media digital');
INSERT INTO kategori_bullying (nama_kategori, deskripsi) VALUES ('Pelecehan seksual', 'Tindakan seksual yang tidak diinginkan');
INSERT INTO kategori_bullying (nama_kategori, deskripsi) VALUES ('Pengucilan sosial', 'Pengabaian atau pengucilan secara sengaja');

INSERT INTO lembaga (nama_lembaga, jenis, wilayah, kontak, aktif) VALUES ('Satgas PPKPT (simulasi)', 'Kampus', 'Banda Aceh', 'satgas@contoh.test', 1);
INSERT INTO lembaga (nama_lembaga, jenis, wilayah, kontak, aktif) VALUES ('UPTD PPA (simulasi)', 'Pemerintah daerah', 'Aceh', 'uptd@contoh.test', 1);
INSERT INTO lembaga (nama_lembaga, jenis, wilayah, kontak, aktif) VALUES ('Layanan konseling (simulasi)', 'Layanan bantuan', 'Aceh', 'konseling@contoh.test', 0);

INSERT INTO pengguna (nama_samaran, email, password_hash, peran) VALUES ('Pengguna Uji 1', 'uji1@contoh.test', 'HASH_UJI_1', 'PENGGUNA');
INSERT INTO pengguna (nama_samaran, email, password_hash, peran) VALUES ('Pengguna Uji 2', 'uji2@contoh.test', 'HASH_UJI_2', 'PENGGUNA');
INSERT INTO pengguna (nama_samaran, email, password_hash, peran) VALUES ('Moderator Uji', 'mod@contoh.test', 'HASH_UJI_3', 'MODERATOR');

COMMIT;

-- 50.000 cerita uji
BEGIN
  DBMS_RANDOM.SEED(42);
  FOR i IN 1 .. 50000 LOOP
    INSERT INTO cerita (pengguna_id, kategori_id, judul, isi, tingkat_keterlibatan, label_sensitif, status_moderasi, dibuat_pada)
    VALUES (
      MOD(i, 3) + 1,
      MOD(i, 5) + 1,
      'Cerita uji ' || i,
      'Isi cerita uji nomor ' || i || '. Data ini hanya untuk pengujian.',
      CASE MOD(i, 3) WHEN 0 THEN 'BERCERITA' WHEN 1 THEN 'DUKUNGAN'