# Backend Startup Environment Fix

## Date
2026-04-16

## Branch
feature/Facilities_Assets_Catalogue

## Summary
Resolved backend startup failure caused by unresolved environment variables for database configuration.

## Changes Made
- Added `dotenv-java` dependency to `pom.xml` to support loading variables from `.env` files.
- Updated `SmartCampusOperationHubApplication.java` to load `.env` variables into System properties during the main startup phase.
- Verified that the application successfully initializes the JPA EntityManager using credentials from the `.env` file.

## Files Modified
- backend/pom.xml
- backend/src/main/java/com/project/smart_campus_operationhub/SmartCampusOperationHubApplication.java

## Commit Details
- Commit message: `fix: add .env support to resolve database configuration`

## Notes
- The application now requires a `.env` file in the `backend/` directory to run successfully.
- Ensure port 8080 is free before starting the application to avoid "Port already in use" errors.
