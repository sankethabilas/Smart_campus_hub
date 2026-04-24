INSERT INTO users (id, name, email, role, password, phone) VALUES 
(1, 'System Admin', 'admin@smartcampus.edu', 'ADMIN', '$2b$10$Z.3Fg1u4fsPfuHY3KaoZTe16B1pY03sqWtbJQjQeMyeCzkValygma', '123-456-7890'),
(2, 'Test Student', 'student@smartcampus.edu', 'STUDENT', '$2b$10$obB.kDTurDEbAH/mL.tJteMRFjqf6clbz62d8u/pRkzxWPCSmj/W.', '098-765-4321'),
(3, 'John Technician', 'technician@smartcampus.edu', 'TECHNICIAN', '$2b$10$9dPRxte3mPG26jU7uoIRFOFY.bGNQQH2f1VFag/VlvNGgfn0VBPLO', '555-555-5555')
ON DUPLICATE KEY UPDATE 
    password = VALUES(password),
    role = VALUES(role);
