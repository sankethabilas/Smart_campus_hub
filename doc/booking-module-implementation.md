# Booking Management Module (Module B)

## Date
2026-04-22

## Branch
feature/Facilities_Assets_Catalogue

## Summary
Implemented the full end-to-end Booking Management module, allowing users to request resource reservations with automated conflict detection, and providing administrators with a workflow to review, approve, and reject bookings.

## Changes Made
- Created `BookingRepository` with a custom query for overlapping conflict detection.
- Developed `BookingService` to handle business logic, capacity validation, and time-based availability checking based on `Asset` start/end datetimes.
- Implemented `BookingController` exposing endpoints for CRUD operations and state transitions (Approve/Reject/Cancel).
- Built frontend `bookingService.ts` to interface with the new backend API.
- Developed user-facing components: `BookResourceModal` (booking form) and `MyBookingsPage` (personal dashboard).
- Developed admin-facing components: `ManageBookings` (review dashboard with status management).
- Integrated booking triggers into the existing `AssetCard` component.

## Files Modified
- backend/src/main/java/com/project/smart_campus_operationhub/controllers/BookingController.java (New)
- backend/src/main/java/com/project/smart_campus_operationhub/dtos/BookingActionDTO.java (New)
- backend/src/main/java/com/project/smart_campus_operationhub/dtos/BookingRequestDTO.java (New)
- backend/src/main/java/com/project/smart_campus_operationhub/dtos/BookingResponseDTO.java (New)
- backend/src/main/java/com/project/smart_campus_operationhub/repositories/BookingRepository.java (New)
- backend/src/main/java/com/project/smart_campus_operationhub/services/BookingService.java (New)
- frontend/src/components/admin/views/ManageBookings.tsx (New)
- frontend/src/components/bookings/BookResourceModal.tsx (New)
- frontend/src/components/bookings/MyBookingsPage.tsx (New)
- frontend/src/services/bookingService.ts (New)
- frontend/src/App.tsx
- frontend/src/components/admin/AdminLayout.tsx
- frontend/src/components/layout/Navbar.tsx
- frontend/src/components/resources/AssetCard.tsx
- frontend/src/components/resources/ResourcesPage.tsx

## Commit Details
- Commit message: `feat(bookings): implement booking management module (Module B) with resource-based availability`

## Notes
- Currently using a mocked user ID (`1L`) for all requests as frontend authentication is not yet implemented.
- Availability is determined dynamically by checking the requested time against the `Asset.startDatetime` and `Asset.endDatetime`.
- Conflict detection query ensures no two 'PENDING' or 'APPROVED' bookings overlap for the same asset.
