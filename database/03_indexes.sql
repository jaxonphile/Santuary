-- 03_indexes.sql
CREATE INDEX idx_cerita_kategori_tanggal ON cerita (kategori_id, dibuat_pada);
CREATE INDEX idx_rujukan_lembaga ON rujukan (lembaga_id);