# Login Fetch Error Fix

## Date
2026-04-22

## Branch
dev

## Summary
Resolved the "Failed to fetch" error occurring during user login. The issue was caused by hardcoded `http://localhost:8080` and `http://localhost:8081` backend URLs scattered across the frontend codebase, while the backend is actually running on port `8083` (as defined in `application.yaml`).

## Changes Made
- Created a `frontend/.env` file containing `VITE_BACKEND_URL` and `VITE_API_BASE_URL` pointing to `http://localhost:8083`.
- Updated `Login.tsx`, `App.tsx`, `api.ts`, `assetService.ts`, and `axiosConfig.ts` to use the environment variables instead of hardcoded string literals.

## Files Modified
- frontend/.env
- frontend/src/App.tsx
- frontend/src/api.ts
- frontend/src/components/Login.tsx
- frontend/src/services/assetService.ts
- frontend/src/services/axiosConfig.ts

## Commit Details
- Commit message: `fix: resolve login fetch error by pointing frontend to the correct backend port (8083)`

## Notes
- The login functionality successfully authenticates with the `V3__add_sample_users.sql` credentials and correctly receives a JWT token.
