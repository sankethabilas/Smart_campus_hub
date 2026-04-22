# Fix Type Imports for TS VerbatimModuleSyntax

## Date
2026-04-21

## Branch
feature/Facilities_Assets_Catalogue

## Summary
Fixed TypeScript build errors caused by importing types incorrectly when `verbatimModuleSyntax` is enabled in `tsconfig.json`.

## Changes Made
- Changed import statements for `Asset` and `AssetFilters` in frontend resources components to use type-only imports (`import type { ... }`).
- Resolved compilation crash in Vite dev server which caused an empty page.

## Files Modified
- frontend/src/components/resources/AssetCard.tsx
- frontend/src/components/resources/AssetDetailModal.tsx
- frontend/src/components/resources/FilterPanel.tsx
- frontend/src/components/resources/ResourcesPage.tsx

## Commit Details
- Commit message: `fix: use type-only imports for TS verbatimModuleSyntax compatibility`

## Notes
- TypeScript 5.0+ with `verbatimModuleSyntax` requires explicit `type` keyword for type-only imports to prevent them from being emitted into JavaScript, which Vite enforces tightly.
