# Missing Dependency Fix (Axios)

## Date
2026-04-21

## Branch
feature/Facilities_Assets_Catalogue

## Summary
Fixed a Vite build error (`Failed to resolve import "axios"`) caused by a missing dependency after pulling the latest changes from the remote repository.

## Changes Made
- Ran `npm install axios` in the frontend directory to resolve the missing dependency.
- Verified that all other package dependencies from the remote pull are installed via `npm install`.

## Files Modified
- frontend/package.json
- frontend/package-lock.json

## Commit Details
- Commit message: `fix: install missing axios dependency for frontend`

## Notes
- The Vite development server should now hot-reload successfully and the error overlay should disappear automatically.
