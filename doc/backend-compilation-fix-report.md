# Backend Compilation and Lombok Fix

## Date
2026-04-22

## Branch
feature/Facilities_Assets_Catalogue

## Summary
Resolved a compilation error that appeared when running `mvn spring-boot:run`. The backend was failing to compile due to a duplicated bean definition and duplicated plugin configuration blocking Lombok annotation processing.

## Changes Made
- Removed the duplicated `passwordEncoder()` Bean method from `SecurityConfig.java`.
- Removed duplicated `maven-compiler-plugin` definitions from `pom.xml` which was disrupting the correct initialization of Lombok and MapStruct annotation processors.

## Files Modified
- backend/src/main/java/com/project/smart_campus_operationhub/config/SecurityConfig.java
- backend/pom.xml

## Commit Details
- Commit message: `fix: resolve backend compilation errors caused by duplicated plugin and method`

## Notes
- The compilation issues manifested as missing getter/setter methods (e.g., `getId()`, `getStatus()`) on Entities and DTOs because Lombok was unable to process the annotations.
- Removing the duplicated configuration correctly restored Lombok functionality.
