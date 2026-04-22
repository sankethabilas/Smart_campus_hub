# Facilities & Assets Catalogue Backend Implementation

## Date
2026-04-13

## Branch
feature/Facilities_Assets_Catalogue

## Summary
Implemented the REST API backend for the Facilities & Assets Catalogue module in Spring Boot based on the original requirements given in the prompt, successfully adapting them into the existing Java architecture. Also configured the build system to correctly process lombok annotations.

## Changes Made
- Created generic ApiResponse wrapper for uniform JSON outputs.
- Developed the AssetDto handling data mapping and incoming request validation securely.
- Built AssetRepository with Spring Data JPA specification for complex backend filtering.
- Implemented core business logic and custom exceptions (ResourceNotFoundException) in AssetService & AssetServiceImpl.
- Created fully operational REST controller mapping CRUD requests to the service layer.
- Fixed an existing bug in pom.xml where maven-compiler-plugin didn't properly include lombok annotation processor.

## Files Modified
- backend/pom.xml
- backend/src/main/java/com/project/smart_campus_operationhub/dtos/ApiResponse.java
- backend/src/main/java/com/project/smart_campus_operationhub/dtos/AssetDto.java
- backend/src/main/java/com/project/smart_campus_operationhub/exceptions/ResourceNotFoundException.java
- backend/src/main/java/com/project/smart_campus_operationhub/repositories/AssetRepository.java
- backend/src/main/java/com/project/smart_campus_operationhub/repositories/LocationRepository.java
- backend/src/main/java/com/project/smart_campus_operationhub/services/AssetService.java
- backend/src/main/java/com/project/smart_campus_operationhub/services/impl/AssetServiceImpl.java
- backend/src/main/java/com/project/smart_campus_operationhub/controllers/AssetController.java

## Commit Details
- Commit message: `feat: implement facilities and assets catalogue backend APIs in Spring Boot`

## Notes
- Validation triggers appropriately for Name and Status schemas.
- Advanced querying using `available=true` successfully checks real-time database timestamps against limits setup from prompt requirements.
- The codebase correctly builds and executes on start; resolved `cannot find symbol` compiler conflicts caused by missing mapstruct/lombok config.
