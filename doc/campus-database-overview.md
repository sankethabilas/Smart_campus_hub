# Campus Database Overview

## Date
2026-04-09

## Branch
feature/Facilities_Assets_Catalogue

## Summary
Full overview of the `campus` database schema, containing all tables and attributes necessary for the Smart Campus Operation Hub.

## Database General Details
- **Schema Name**: `campus`
- **Database Type**: Relational (MySQL based on connection string)

## Tables & Structures

### 1. `users`
Stores user account information, including authentication details and roles.
- `id` (Integer, Primary Key, Auto-increment)
- `name` (String, Max 100, Not Null)
- `email` (String, Max 150, Not Null)
- `role` (String, Max 50, Not Null)
- `password` (String, Max 255)
- `oauth_provider` (String, Max 50)
- `oauth_provider_id` (String, Max 100)
- `phone` (String, Max 20)
- `created_at` (Timestamp, Default: CURRENT_TIMESTAMP)
- `updated_at` (Timestamp, Default: CURRENT_TIMESTAMP)
*Relationships*: Has many `audits`, `bookings` (requested/reviewed), `notifications`, `tickets` (reported/assigned), `ticket_attachments`, `ticket_comments`.

### 2. `asset`
Represents physical resources, facilities, or equipment on campus.
- `id` (Integer, Primary Key, Auto-increment)
- `name` (String)
- `type` (String/Lob)
- `status` (String/Lob, Default: 'ACTIVE')
- `capacity` (Integer)
- `location_id` (Foreign Key -> `location`)
- `start_datetime` (Timestamp)
- `end_datetime` (Timestamp)
*Relationships*: Has many `bookings`, `tickets`.

### 3. `location`
Specifies geographical locations or zones within the campus.
- `id` (Integer, Primary Key, Auto-increment)
- `name` (String, Max 100, Not Null)
- `building_name` (String, Max 100)
- `floor_no` (Integer)
*Relationships*: Associated with `asset` and `ticket`.

### 4. `booking`
Tracks reservations and allocations of campus assets.
- `id` (Integer, Primary Key, Auto-increment)
- `asset_id` (Foreign Key -> `asset`)
- `requested_by` (Foreign Key -> `users`)
- `booking_date` (Date)
- `start_time` (Time)
- `end_time` (Time)
- `purpose` (String/Lob)
- `headcount` (Integer)
- `status` (String/Lob, Default: 'PENDING')
- `reviewed_by` (Foreign Key -> `users`)
- `review_reason` (String/Lob)
- `created_at` (Timestamp, Default: CURRENT_TIMESTAMP)
- `updated_at` (Timestamp, Default: CURRENT_TIMESTAMP)

### 5. `ticket`
Manages issues, complaints, or maintenance requests related to assets.
- `id` (Integer, Primary Key, Auto-increment)
- `reported_by` (Foreign Key -> `users`)
- `asset_id` (Foreign Key -> `asset`)
- `location_id` (Foreign Key -> `location`)
- `priority` (String/Lob, Default: 'MEDIUM')
- `title` (String, Max 200, Not Null)
- `description` (String/Lob)
- `contact` (String, Max 100)
- `status` (String/Lob, Default: 'OPEN')
- `assigned_to` (Foreign Key -> `users`)
- `resolution_notes` (String/Lob)
- `rejection_reason` (String/Lob)
- `created_at` (Timestamp, Default: CURRENT_TIMESTAMP)
- `updated_at` (Timestamp, Default: CURRENT_TIMESTAMP)
- `resolved_at` (Timestamp)
- `closed_at` (Timestamp)
*Relationships*: Has many `ticket_comments`, `ticket_attachments`.

### 6. `ticket_comment`
Stores discussions and updates regarding specific tickets.
- `id` (Integer, Primary Key, Auto-increment)
- `ticket_id` (Foreign Key -> `ticket`)
- `commented_by` (Foreign Key -> `users`)
- `comment` (String/Lob)
- `created_at` (Timestamp, Default: CURRENT_TIMESTAMP)
- `updated_at` (Timestamp, Default: CURRENT_TIMESTAMP)

### 7. `ticket_attachment`
Stores metadata for files or images added to tickets.
- `id` (Integer, Primary Key, Auto-increment)
- `ticket_id` (Foreign Key -> `ticket`)
- `file_name` (String)
- `file_path` (String)
- `file_type` (String)
- `uploaded_by` (Foreign Key -> `users`)
- `uploaded_at` (Timestamp, Default: CURRENT_TIMESTAMP)

### 8. `notification`
Handles system alerts sent to users regarding various events.
- `id` (Integer, Primary Key, Auto-increment)
- `user_id` (Foreign Key -> `users`, Not Null)
- `type` (String, Max 50)
- `title` (String, Max 200)
- `message` (String/Lob)
- `reference_type` (String, Max 50)
- `reference_id` (Integer)
- `created_at` (Timestamp, Default: CURRENT_TIMESTAMP)

### 9. `audit`
Maintains an audit trail of sensitive actions on entities for tracking purpose.
- `id` (Integer, Primary Key, Auto-increment)
- `user_id` (Foreign Key -> `users`)
- `action_type` (String, Max 50)
- `entity_type` (String, Max 50)
- `entity_id` (Integer)
- `old_value` (String/Lob)
- `new_value` (String/Lob)
- `timestamp` (Timestamp, Default: CURRENT_TIMESTAMP)

## Notes
- Enforces relational mapping and soft constraints through application tier logic via JPA (Hibernate).
- Most tables track standard creation/update fields using default timestamps.
