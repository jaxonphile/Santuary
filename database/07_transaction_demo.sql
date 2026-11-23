
DECLARE
  v_id NUMBER;
BEGIN
  sp_ajukan_laporan(1, 1, v_id);
END;

COMMIT;

UPDATE rujukan SET status = 'DIPROSES' WHERE cerita_id = 1;
SELECT id, status FROM rujukan WHERE cerita_id = 1;
ROLLBACK;
SELECT id, status FROM rujukan WHERE cerita_id = 1;

DECLARE
  v_id NUMBER;
BEGIN
  SAVEPOINT sebelum_pengajuan;
  sp_ajukan_laporan(1, 3, v_id);
EXCEPTION
  WHEN OTHERS THEN
    ROLLBACK TO sebelum_pengajuan;
END;

COMMIT;

SELECT * FROM v_status_laporan WHERE cerita_id = 1;
SELECT * FROM v_dashboard_kasus;
SELECT rujukan_id, status_lama, status_baru, diubah_pada
FROM log_status
WHERE rujukan_id IN (SELECT id FROM rujukan WHERE cerita_id = 1);