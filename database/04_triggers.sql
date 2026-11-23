CREATE OR REPLACE TRIGGER trg_rujukan_log_status
AFTER INSERT OR UPDATE OF status ON rujukan
FOR EACH ROW 
BEGIN 
	IF inserting THEN
		INSERT INTO log_status (rujukan_id, status_lama, status_baru, diubah_pada)
		VALUES (:NEW.id, NULL, :NEW.status, LOCALTIMESTAMP);
	ELSIF updating AND :OLD.status <> :NEW.status THEN 
		INSERT INTO log_status (rujukan_id, status_lama, status_baru, diubah_pada)
		VALUES (:NEW.id, :OLD.status, :NEW.status, LOCALTIMESTAMP);
	END IF;
END;
/

CREATE OR REPLACE TRIGGER try_log_status_immutable
BEFORE UPDATE OR DELETE ON log_status
BEGIN
	RAISE_APPLICATION_ERROR(-20001, 'log_status bersifat append-only, UPDATE dan DELETE tidak diizinkan');
END;
/