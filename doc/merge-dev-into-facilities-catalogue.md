# Merge Dev Branch into Facilities Assets Catalogue

## Date
2025-04-25

## Branch
feature/Facilities_Assets_Catalogue

## Summary
Merged all latest changes from the `dev` branch into `feature/Facilities_Assets_Catalogue` to keep the feature branch up to date with the latest development work including incident ticket improvements, OAuth fixes, user dashboard, and role management updates.

## Changes Made
- Merged dev branch into feature/Facilities_Assets_Catalogue
- Resolved merge conflict in `backend/src/main/resources/application.yaml` — kept port 8083 from feature branch, added `file.upload-dir` config from dev
- Resolved merge conflict in `frontend/src/App.tsx` — combined admin mode logic from both branches, removed duplicate `ResourcesPage` import, kept both `/bookings` and `/dashboard` routes
- Renamed `isAdminMode` to `isAdminModeComputed` to avoid naming collision with the state setter from dev

## Files Modified
- backend/src/main/resources/application.yaml (conflict resolved)
- frontend/src/App.tsx (conflict resolved)

## Commit Details
- Commit message: `feat: merge dev branch into feature/Facilities_Assets_Catalogue with conflict resolution`

## Notes
- The feature branch port remains at 8083 to avoid conflicts with other running services
- Both `/bookings` (from feature branch) and `/dashboard` (from dev) routes are now available
- The `isAdminModeComputed` variable combines three sources: URL path detection, manual toggle state, and login-based admin mode
- 19 files were brought in from dev including new UserDashboard, userService, axiosUserConfig, and ticket service improvements
