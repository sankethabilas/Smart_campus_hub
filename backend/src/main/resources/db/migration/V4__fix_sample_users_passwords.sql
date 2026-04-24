UPDATE users SET password = REPLACE(password, '$2b$', '$2a$') WHERE id IN (1, 2, 3);
