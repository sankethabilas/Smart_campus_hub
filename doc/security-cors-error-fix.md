# Spring Security CORS and Error Masking Fix

## Date
2026-04-22

## Branch
dev

## Summary
Resolved a bug where invalid login attempts (such as bad email formatting) resulted in a "Failed to fetch" browser error. This occurred because validation exceptions were forwarded to the `/error` endpoint, which was intercepted by Spring Security and redirected to Google OAuth2. The browser blocked this cross-origin redirect, masking the actual `400 Bad Request` or `401 Unauthorized` responses.

## Changes Made
- Updated `SecurityConfig.java` to explicitly permit the `/error` endpoint (`.requestMatchers("/error").permitAll()`).
- Updated `SecurityConfig.java` CORS configuration to use `setAllowedOriginPatterns("*")` to reliably handle requests from any local frontend port (`5173`, `5174`, etc.).

## Files Modified
- backend/src/main/java/com/project/smart_campus_operationhub/config/SecurityConfig.java

## Commit Details
- Commit message: `fix: permit /error endpoint and widen CORS patterns to prevent masking of validation exceptions`

## Notes
- Validation errors (like typing "admin" instead of "admin@smartcampus.edu") will now correctly display as "Invalid credentials" in the frontend rather than causing a CORS crash.
