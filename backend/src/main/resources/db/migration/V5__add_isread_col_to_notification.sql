ALTER TABLE notification
    ADD COLUMN is_read BOOLEAN DEFAULT FALSE AFTER reference_type;