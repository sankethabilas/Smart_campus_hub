# Pull from Dev Branch

## Date
2026-04-24

## Branch
feature/Facilities_Assets_Catalogue

## Summary
Pulled the latest code from the 'dev' branch to integrate new features (login, register, tickets, technician dashboard) with the Facilities & Assets Catalogue. Resolved merge conflicts across frontend components and backend configuration.

## Changes Made
- Pulled code from origin dev
- Resolved conflict in backend/src/main/resources/application.yaml to keep port 8083.
- Resolved conflict in frontend/package.json to merge dependencies (axios, date-fns, jwt-decode).
- Rebuilt frontend/package-lock.json with `npm install`.
- Resolved conflict in frontend/src/App.tsx, combining both new routes and navigation logic from dev and the booking components from current branch.
- Resolved conflict in frontend/src/components/admin/AdminLayout.tsx to retain both 'ManageBookings' and 'TicketAdminPage' imports/routes.
- Resolved conflict in frontend/src/components/admin/AdminSidebar.tsx to keep the 'Ticket' navigation item.

## Files Modified
- backend/src/main/resources/application.yaml
- frontend/package.json
- frontend/package-lock.json
- frontend/src/App.tsx
- frontend/src/components/admin/AdminLayout.tsx
- frontend/src/components/admin/AdminSidebar.tsx
- doc/dev-branch-merge.md

## Commit Details
- Commit message: `feat: merge dev branch and resolve conflicts`

## Notes
- `App.tsx` now supports both route-based admin detection and state-based admin toggling.
