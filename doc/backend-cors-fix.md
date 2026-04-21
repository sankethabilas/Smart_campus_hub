# Asset API CORS and Security Whitelist Fix

## Date
2026-04-21

## Branch
feature/Facilities_Assets_Catalogue

## Summary
Fixed backend CORS and authentication issues preventing the frontend from fetching assets.

## Changes Made
- Added a `CorsConfigurationSource` bean to `SecurityConfig.java` to explicitly allow `http://localhost:5173` to make cross-origin requests to the backend.
- Whitelisted `/api/assets/**` in the `SecurityFilterChain` to bypass authentication since the frontend currently does not implement an authentication flow.

## Files Modified
- backend/src/main/java/com/project/smart_campus_operationhub/config/SecurityConfig.java

## Commit Details
- Commit message: `fix: whitelist /api/assets and configure CORS for frontend port 5173`

## Notes
- Without this configuration, the frontend fetch requests to `/api/assets` were being blocked either by CORS or receiving a 401/403 Unauthorized status, resulting in the "Connection Error" UI state on the frontend Resources page.
- Spring Boot dev server must be restarted to apply these configuration changes.
