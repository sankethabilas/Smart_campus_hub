# Resources UI Implementation

## Date
2026-04-21

## Branch
feature/Facilities_Assets_Catalogue

## Summary
Built the full frontend Resources catalogue page for Smart Campus Hub. The page
consumes the backend `/api/assets` and `/api/assets/search` endpoints and displays
assets in a responsive card-based catalogue with live filtering, search, and a
detail modal.

## Changes Made
- Created API service layer (`assetService.ts`) with typed interfaces and all fetch logic
- Created `AssetCardSkeleton` — animated shimmer placeholders while data loads
- Created `AssetCard` — interactive card with type icon, status pulse, capacity bar, and hover action buttons
- Created `SearchBar` — debounced (300ms) search input with result count badge
- Created `FilterPanel` — sidebar with type chip toggles, status toggles, and capacity range slider; collapsible on mobile
- Created `AssetDetailModal` — slide-up overlay modal with gradient header, full asset details, and keyboard (Esc) dismiss
- Created `ResourcesPage` — orchestrating page with stats bar, filter + search layout, grid, error state, and empty state
- Modified `App.tsx` — added `currentPage` state (`'home' | 'resources'`) and conditional rendering
- Modified `Navbar.tsx` — added `onNavigate` / `currentPage` props and active link indigo underline indicator
- Fixed backend API base URL from port 8081 → 8082 (actual running port confirmed from terminal)

## Files Modified
- frontend/src/services/assetService.ts (NEW)
- frontend/src/components/resources/AssetCardSkeleton.tsx (NEW)
- frontend/src/components/resources/AssetCard.tsx (NEW)
- frontend/src/components/resources/SearchBar.tsx (NEW)
- frontend/src/components/resources/FilterPanel.tsx (NEW)
- frontend/src/components/resources/AssetDetailModal.tsx (NEW)
- frontend/src/components/resources/ResourcesPage.tsx (NEW)
- frontend/src/App.tsx (MODIFIED)
- frontend/src/components/layout/Navbar.tsx (MODIFIED)

## Commit Details
- Commit message: `feat: implement Resources catalogue page with filters, search, and modal`

## Notes
- Location filter uses Option C (static mapping) — backend has no `/api/locations` endpoint yet
- Edit and Delete buttons are visible but show placeholder alerts (Option A) — no auth implemented yet
- Backend port is 8082 (confirmed from Spring Boot startup logs)
- Type-based filtering (ROOM/LAB/EQUIPMENT) and status filtering hit the backend `/api/assets/search` endpoint
- Capacity and name search are applied client-side for instant response
- All components are dark-mode compatible via existing `dark:` class pattern
