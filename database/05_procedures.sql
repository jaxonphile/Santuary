CREATE OR REPLACE PROCEDURE sp_ajukan_laporan (
  p_cerita_id  IN  NUMBER,
  p_lembaga_id IN  NUMBER,
  p_rujukan_id OUT NUMBER
) AS
  v_aktif       NUMBER(1);
  v_persetujuan NUMBER;
BEGIN
  SELECT aktif INTO v_aktif FROM lembaga WHERE id = p_lembaga_id;
  IF v_aktif <> 1 THEN
    RAISE_APPLICATION_ERROR(-20010, 'Lembaga tidak aktif');
  END IF;
  SELECT COUNT(*) INTO v_persetujuan FROM persetujuan WHERE cerita_id = p_cerita_id;
  IF v_persetujuan = 0 THEN
    RAISE_APPLICATION_ERROR(-20011, 'Persetujuan pengguna belum ada');
  END IF;
  INSERT INTO rujukan (cerita_id, lembaga_id, status, dirujuk_pada)
  VALUES (p_cerita_id, p_lembaga_id, 'DITERIMA', LOCALTIMESTAMP)
  RETURNING id INTO p_rujukan_id;
EXCEPTION
  WHEN NO_DATA_FOUND THEN
    RAISE_APPLICATION_ERROR(-20012, 'Lembaga tidak ditemukan');
END;
