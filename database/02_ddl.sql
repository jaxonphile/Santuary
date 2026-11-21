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
      CASE MOD(i, 3) WHEN 0 THEN 'BERCERITA' WHEN 1 THEN 'DUKUNGAN' ELSE 'LAPORAN' END,
      CASE WHEN MOD(i, 7) = 0 THEN 1 ELSE 0 END,
      'DISETUJUI',
      SYSTIMESTAMP - NUMTODSINTERVAL(TRUNC(DBMS_RANDOM.VALUE(0, 365)), 'DAY')
    );
  END LOOP;
  COMMIT;
END;
/

-- 10.000 rujukan dari cerita kelipatan 5
INSERT INTO rujukan (cerita_id, lembaga_id, status, dirujuk_pada)
SELECT id, MOD(id, 2) + 1, 'DITERIMA', dibuat_pada + 1
FROM cerita
WHERE MOD(id, 5) = 0;

INSERT INTO persetujuan (cerita_id, jenis_persetujuan, disetujui_pada)
SELECT cerita_id, 'LAPORAN_FORMAL', dirujuk_pada
FROM rujukan;

-- 15.000 log status
INSERT INTO log_status (rujukan_id, status_lama, status_baru, diubah_pada)
SELECT id, NULL, 'DITERIMA', dirujuk_pada
FROM rujukan;

INSERT INTO log_status (rujukan_id, status_lama, status_baru, diubah_pada)
SELECT id, 'DITERIMA', 'DIPROSES', dirujuk_pada + 2
FROM rujukan
WHERE MOD(id, 2) = 0;

COMMIT;