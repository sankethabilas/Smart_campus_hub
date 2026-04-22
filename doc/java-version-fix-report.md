# Resolve Java Version Mismatch

## Date
2026-04-09

## Branch
feature/Facilities_Assets_Catalogue

## Summary
Updated the Java version specified in the project's POM file to match the system's available Java version to resolve compilation errors.

## Changes Made
- Downgraded `java.version` property from `25` to `24` in `pom.xml`.

## Files Modified
- backend/pom.xml
- .gitignore

## Commit Details
- Commit message: `fix: resolve java version mismatch in pom.xml`

## Notes
- The `spring-boot:run` goal was failing with `UnsupportedClassVersionError` due to compilation to target release 25 (version 69.0), while Maven defaults to JDK 24 (version 68.0) locally.
