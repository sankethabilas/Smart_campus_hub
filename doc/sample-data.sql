-- Sample Data Insertion Script for Smart Campus Operation Hub
-- Schema: campus

-- 1. Insert Users
INSERT INTO campus.users (name, email, role, password, oauth_provider, oauth_provider_id, phone, created_at, updated_at) VALUES
('Admin User', 'admin@smartcampus.edu', 'ADMIN', '$2a$10$xyz...', NULL, NULL, '1234567890', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Student One', 'student1@smartcampus.edu', 'STUDENT', '$2a$10$abc...', NULL, NULL, '0987654321', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Staff Member', 'staff@smartcampus.edu', 'STAFF', '$2a$10$def...', NULL, NULL, '1122334455', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 2. Insert Locations
INSERT INTO campus.location (name, building_name, floor_no) VALUES
('Room 101', 'Engineering Block', 1),
('Auditorium A', 'Main Building', 0),
('Lab 3', 'Science Block', 2);

-- 3. Insert Assets
INSERT INTO campus.asset (name, type, status, capacity, location_id, start_datetime, end_datetime) VALUES
('Projector A', 'ELECTRONICS', 'ACTIVE', NULL, 1, CURRENT_TIMESTAMP, NULL),
('Conference Table', 'FURNITURE', 'ACTIVE', 10, 1, CURRENT_TIMESTAMP, NULL),
('Auditorium Seating', 'FACILITY', 'ACTIVE', 500, 2, CURRENT_TIMESTAMP, NULL);

-- 4. Insert Bookings
INSERT INTO campus.booking (asset_id, requested_by, booking_date, start_time, end_time, purpose, headcount, status, reviewed_by, review_reason, created_at, updated_at) VALUES
(2, 2, CURRENT_DATE, '10:00:00', '12:00:00', 'Group Study', 5, 'APPROVED', 1, 'Approved by admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 3, CURRENT_DATE + INTERVAL '1 day', '14:00:00', '18:00:00', 'Annual Event', 300, 'PENDING', NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 5. Insert Tickets
INSERT INTO campus.ticket (reported_by, asset_id, location_id, priority, title, description, contact, status, assigned_to, resolution_notes, rejection_reason, created_at, updated_at) VALUES
(2, 1, 1, 'HIGH', 'Projector not turning on', 'The projector in Room 101 is not responding to the remote or power button.', '0987654321', 'OPEN', NULL, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, NULL, 3, 'MEDIUM', 'AC leaking water', 'The AC unit near the entrance is dripping water.', '1122334455', 'IN_PROGRESS', 1, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 6. Insert Ticket Attachments
INSERT INTO campus.ticket_attachment (ticket_id, file_name, file_path, file_type, uploaded_by, uploaded_at) VALUES
(1, 'projector_issue.jpg', '/uploads/tickets/1/projector_issue.jpg', 'image/jpeg', 2, CURRENT_TIMESTAMP);

-- 7. Insert Ticket Comments
INSERT INTO campus.ticket_comment (ticket_id, commented_by, comment, created_at, updated_at) VALUES
(1, 1, 'We will send a technician shortly.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 2, 'Thank you, waiting for the fix.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 8. Insert Notifications
INSERT INTO campus.notification (user_id, type, title, message, reference_type, reference_id, created_at) VALUES
(2, 'BOOKING_APPROVED', 'Booking Approved', 'Your booking for Conference Table has been approved.', 'BOOKING', 1, CURRENT_TIMESTAMP),
(2, 'TICKET_UPDATE', 'Ticket Commented', 'An admin commented on your ticket "Projector not turning on".', 'TICKET', 1, CURRENT_TIMESTAMP);

-- 9. Insert Audits
INSERT INTO campus.audit (user_id, action_type, entity_type, entity_id, old_value, new_value, timestamp) VALUES
(1, 'CREATE', 'LOCATION', 1, NULL, '{"name":"Room 101"}', CURRENT_TIMESTAMP),
(1, 'UPDATE', 'BOOKING', 1, '{"status":"PENDING"}', '{"status":"APPROVED"}', CURRENT_TIMESTAMP);
