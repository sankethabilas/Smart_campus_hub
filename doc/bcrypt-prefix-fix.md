# Fix BCrypt Password Prefix

## Date
2026-04-22

## Branch
dev

## Summary
Fixed the "Invalid credentials" error occurring during login. The problem was caused by the previously inserted sample passwords having a `$2b$` BCrypt prefix (generated via Node.js), which Spring Security's `BCryptPasswordEncoder` does not natively recognize (it expects `$2a$`). 

## Changes Made
- Created a new Flyway migration (`V4__fix_sample_users_passwords.sql`) to convert the `$2b$` prefix to `$2a$` for all sample users in the database.

## Files Modified
- backend/src/main/resources/db/migration/V4__fix_sample_users_passwords.sql

## Commit Details
- Commit message: `fix: correct bcrypt hash prefix in sample users from $2b$ to $2a$ for Spring Security compatibility`

## Notes
- After restarting the backend, Flyway will run the V4 migration and the login will succeed.
