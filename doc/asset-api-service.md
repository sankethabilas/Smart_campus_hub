# Asset API Service

## Date
2026-04-21

## Branch
feature/Facilities_Assets_Catalogue

## Summary
Created the frontend API service layer to consume the backend asset endpoints.

## Changes Made
- Created `frontend/src/services/assetService.ts` to fetch all assets and search assets
- Handled basic TypeScript interfaces for the Asset and filters
- Handled static locations mapping fallback

## Files Modified
- frontend/src/services/assetService.ts

## Commit Details
- Commit message: `feat: add asset API service layer`

## Notes
- Used Option C for locations (static mapping) until a proper backend endpoint is available.
