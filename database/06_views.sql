CREATE OR REPLACE VIEW v_dashboard_kasus AS
SELECT k.nama_kategori,
       COUNT(DISTINCT c.id) AS jumlah_cerita,
       COUNT(r.id)          AS jumlah_rujukan
FROM kategori_bullying k
LEFT JOIN cerita c
       ON c.kategori_id = k.id
      AND c.status_moderasi = 'DISETUJUI'
LEFT JOIN rujukan r
       ON r.cerita_id = c.id
GROUP BY k.nama_kategori;

CREATE OR REPLACE VIEW v_status_laporan AS
SELECT r.id          AS rujukan_id,
       r.cerita_id,
       l.nama_lembaga,
       r.status,
       r.dirujuk_pada
FROM rujukan r
JOIN lembaga l ON l.id = r.lembaga_id;