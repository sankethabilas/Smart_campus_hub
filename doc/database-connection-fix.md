# Database Credentials Configuration Fix

## Date
2026-04-22

## Branch
dev

## Summary
Resolved an `Access denied` error when the backend tried to connect to the MySQL database. The database credentials in `application.yaml` were hardcoded to incorrect values, overriding the correct credentials in the `.env` file.

## Changes Made
- Updated `application.yaml` database datasource configuration to use environment variables (`${DB_USERNAME}`, `${DB_PASSWORD}`) with fallback defaults.

## Files Modified
- backend/src/main/resources/application.yaml

## Commit Details
- Commit message: `fix: update application.yaml to use environment variables for DB credentials`

## Notes
- This ensures that local development uses the correct MySQL password (`Abi0021@`) as defined in `.env`, preventing connection failures.
