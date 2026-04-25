# Add Sample Login Credentials

## Date
2026-04-22

## Branch
dev

## Summary
Created a new Flyway migration script (`V3__add_sample_users.sql`) to insert sample users into the database with securely hashed passwords using BCrypt. This allows testing of the login functionality.

## Changes Made
- Inserted an `ADMIN` user.
- Inserted a `STUDENT` user.
- Inserted a `TECHNICIAN` user.
- Passwords for all accounts are hashed with BCrypt.

## Files Modified
- backend/src/main/resources/db/migration/V3__add_sample_users.sql

## Commit Details
- Commit message: `feat: add sample login credentials via Flyway migration`

## Notes
- **Admin Login:**
  - Email: `admin@smartcampus.edu`
  - Password: `admin123`
- **Student Login:**
  - Email: `student@smartcampus.edu`
  - Password: `student123`
- **Technician Login:**
  - Email: `technician@smartcampus.edu`
  - Password: `tech123`
