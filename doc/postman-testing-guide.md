# Postman Testing Guide for Smart Campus Hub

This guide explains how to test the backend API endpoints using Postman.

## Date
2026-04-16

## Base URL
`http://localhost:8080`

---

## 1. Public Endpoints (No Auth Required)
These endpoints can be tested directly without any credentials.

### **Connectivity Check**
- **Method**: `GET`
- **URL**: `http://localhost:8080/api/test`
- **Response**: JSON confirming the backend status.

---

## 2. Protected Endpoints (Auth Required)
Most endpoints require authentication. By default, Spring Security uses **HTTP Basic Auth**.

### **Authentication Credentials**
- **Username**: `user`
- **Password**: *Check the backend console logs upon startup for the "Using generated security password" line.* 
  *(Example: `ca34ca1f-21dd-42d6-bc89-dc7cd0f083b9`)*

### **Postman Configuration**
1. Open Postman and create a new request.
2. Select the **Authorization** tab.
3. Choose **Type**: `Basic Auth`.
4. Enter the `user` and the generated password.

---

## 3. Asset Management APIs
Base Path: `/api/assets`

### **Get All Assets**
- **Method**: `GET`
- **URL**: `http://localhost:8080/api/assets`

### **Create New Asset**
- **Method**: `POST`
- **URL**: `http://localhost:8080/api/assets`
- **Headers**: `Content-Type: application/json`
- **Body** (Raw JSON):
```json
{
  "name": "Lecture Hall A",
  "type": "Hall",
  "capacity": 200,
  "location_id": 1,
  "status": "Available",
  "available": true
}
```

### **Search Assets**
- **Method**: `GET`
- **URL**: `http://localhost:8080/api/assets/search`
- **Params**:
  - `type`: (Optional) e.g., `Hall`
  - `status`: (Optional) e.g., `Available`
  - `available`: (Optional) `true` or `false`

### **Update Asset**
- **Method**: `PUT`
- **URL**: `http://localhost:8080/api/assets/{id}`
- **Body**: Same format as Create.

### **Delete Asset**
- **Method**: `DELETE`
- **URL**: `http://localhost:8080/api/assets/{id}`

---

## 4. Troubleshooting
- **401 Unauthorized**: Ensure your Basic Auth credentials are correct.
- **403 Forbidden**: Ensure you are using the correct HTTP method.
- **Connection Refused**: Ensure the backend is running and listening on port 8080.
