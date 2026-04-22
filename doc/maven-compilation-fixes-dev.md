# Compilation Fixes for Backend Services and Dependencies

## Date
2026-04-22

## Branch
dev

## Summary
Fixed backend compilation errors introduced by recent remote changes involving missing dependencies and integer to long type mismatches in newly added ticket services.

## Changes Made
- Added `dotenv-java` dependency to `pom.xml` to resolve the `package io.github.cdimascio.dotenv does not exist` error in `SmartCampusOperationHubApplication.java`.
- Updated `TicketService.java` to correctly convert `Integer` user IDs from DTOs to `Long` for the `Users` entity.
- Updated `TicketCommentService.java` to correctly handle `Integer` to `Long` conversions when setting the user who commented and verifying comment ownership.
- Updated `TicketAttachmentService.java` to correctly convert the `userId` from `Integer` to `Long` during attachment uploads.

## Files Modified
- backend/pom.xml
- backend/src/main/java/com/project/smart_campus_operationhub/services/TicketService.java
- backend/src/main/java/com/project/smart_campus_operationhub/services/TicketCommentService.java
- backend/src/main/java/com/project/smart_campus_operationhub/services/TicketAttachmentService.java

## Commit Details
- Commit message: `fix: resolve Maven compilation errors in ticket services and add missing dotenv dependency`

## Notes
- The backend compiles successfully. The Spring Boot development server can be started normally.
