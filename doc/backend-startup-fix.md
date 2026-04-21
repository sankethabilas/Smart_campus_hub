# Backend Startup Port Conflict Fix

## Date
2026-04-21

## Branch
feature/Facilities_Assets_Catalogue

## Summary
Resolved backend startup failure due to a port 8080 conflict by modifying the application port.

## Changes Made
- Identified that Tomcat9 was occupying port 8080 and couldn't be killed without admin rights.
- Updated `application.yaml` to change the Spring Boot server port to 8081.
- Updated the frontend `App.tsx` API fetch URL to point to the new port 8081.
- Successfully verified backend starts correctly on the new port.

## Files Modified
- backend/src/main/resources/application.yaml
- frontend/src/App.tsx

## Commit Details
- Commit message: `fix: resolve backend startup port conflict by changing port to 8081`

## Notes
- Tomcat9 service running locally occupies port 8080, causing Spring Boot default port conflict.
