# Frontend App.tsx Parsing Error Fix

## Date
2026-04-22

## Branch
dev

## Summary
Resolved a Vite build failure (`[PARSE_ERROR]`) that was causing the frontend to crash with a white screen. The error was caused by incorrectly nested `<Routes>` and duplicate variable declarations in `App.tsx`.

## Changes Made
- Corrected JSX syntax in `App.tsx` by wrapping the inner layout with `<Routes>` properly.
- Removed duplicate `useLocation()` hook declarations in `App.tsx`.
- Addressed several TypeScript and ESLint strict errors in `AdminSidebar.tsx`, `DeleteConfirmModal.tsx`, `Navbar.tsx`, `Login.tsx`, and `SearchBar.tsx` that were introduced when the `dev` branch was updated.

## Files Modified
- frontend/src/App.tsx
- frontend/src/components/admin/AdminSidebar.tsx
- frontend/src/components/admin/modals/DeleteConfirmModal.tsx
- frontend/src/components/layout/Navbar.tsx
- frontend/src/components/Login.tsx
- frontend/src/components/ticket/TechnicianDashboard.tsx
- frontend/src/components/resources/SearchBar.tsx
- frontend/src/components/ticket/TicketDetail.tsx

## Commit Details
- Commit message: `fix: resolve App.tsx JSX parse errors and clear strict TS lint warnings`

## Notes
- The frontend development server is now running smoothly on Vite without crashing.
