# Smart Campus Hub - Full System Documentation

This document provides a comprehensive overview of the Smart Campus Hub project, including its environment setup, data flow, API architecture, and a detailed line-by-line explanation of core codebase files.

---

## 1. Project Overview
Smart Campus Hub is a modern web application designed to manage campus operations such as asset tracking, ticket booking, auditing, and user notifications. It uses a **Spring Boot** backend for business logic and data persistence (MySQL) and a **React (Vite)** frontend with **Tailwind CSS** for a responsive and premium user interface.

## 2. Environment Setup

### Backend (Spring Boot)
- **Language**: Java 17+
- **Framework**: Spring Boot 3.x
- **Build Tool**: Maven (`mvnw`)
- **Database**: MySQL 8.0+
- **Configuration**:
    - File: `backend/src/main/resources/application.yaml`
    - Connection URL: `jdbc:mysql://localhost:3306/campus?createDatabaseIfNotExist=true` (Automatically creates the `campus` database if it doesn't exist).
    - To run: Execute `./mvnw spring-boot:run` in the `backend` directory.

### Frontend (React + Vite)
- **Framework**: React 18+
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **To run**: 
    1. Open the `frontend` folder.
    2. `npm install` (First time only).
    3. `npm run dev`.
    - Defaults to `http://localhost:5173` or `5174`.

---

## 3. Data Flow Architecture
The application follows a standard **Client-Server Architecture**:

1.  **Frontend (React)**:
    - User interacts with UI components.
    - Components use the `fetch` API or similar to send asynchronous HTTP requests to the backend server.
    - Example: In `App.tsx`, a request is sent to `http://localhost:8080/api/test` to verify backend connectivity.
2.  **Backend (Spring Boot)**:
    - **Controllers** (`@RestController`): Receive HTTP requests (GET, POST, etc.).
    - **Security** (`SecurityConfig`): Intercepts requests to handle CORS and authorization.
    - **Services (Optional Layer)**: Process business logic.
    - **Repositories (JPA)**: Interact with the MySQL database using entities.
3.  **Database (MySQL)**:
    - Stores persistent data like Users, Assets, and Tickets.

---

## 4. API Endpoints
The following table highlights the core API structure:

| Endpoint | Method | Description | Controller |
| :--- | :--- | :--- | :--- |
| `/api/test` | `GET` | Connectivity check shared between FE and BE. | `TestController` |

---

## 5. Line-by-Line Code Explanation

### 5.1 Backend: `SecurityConfig.java`
This file configures the security filter chain to handle Cross-Origin Resource Sharing (CORS) and endpoint protection.

```java
8:  @Configuration // Informs Spring this is a configuration class
9:  public class SecurityConfig {
11:     @Bean // Defines a bean managed by the Spring IoC container
12:     public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
13:         http
14:             .cors(cors -> cors.configure(http)) // Allows the frontend (different port) to access these APIs
15:             .csrf(csrf -> csrf.disable())       // Disables CSRF protection (common in stateless REST APIs)
16:             .authorizeHttpRequests(auth -> auth
17:                 .requestMatchers("/api/test").permitAll() // Explicitly allows anyone to hit the test endpoint
18:                 .anyRequest().authenticated()             // Requires authentication for all other endpoints
19:             );
20:         return http.build();
21:     }
22: }
```

### 5.2 Backend: `TestController.java`
A simple REST controller used to verify system health.

```java
11: @RestController // Combines @Controller and @ResponseBody
12: @RequestMapping("/api") // Base prefix for all endpoints in this class
13: @CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"}) // Explicitly allows Vite dev ports
14: public class TestController {
16:     @GetMapping("/test") // Maps GET requests to /api/test
17:     public Map<String, String> testConnection() {
18:         Map<String, String> response = new HashMap<>(); // Create return object
19:         response.put("message", "Backend is connected successfully!");
20:         response.put("status", "success");
21:         return response; // Spring automatically converts this Map to JSON
22:     }
23: }
```

### 5.3 Frontend: `App.tsx`
The primary entry point for the React application.

```tsx
8:  function App() {
9:    const [, setIsBackendConnected] = useState(false); // State to track backend connectivity
12:   useEffect(() => { // Hook to run logic once on component mount
13:     fetch('http://localhost:8080/api/test') // Asynchronous API call to the Spring server
14:       .then((res) => {
15:         if (res.ok) setIsBackendConnected(true); // If response status is 200, set status to true
16:       })
17:       .catch(() => setIsBackendConnected(false)); // On error (e.g., BE down), set to false
18:   }, []); // Empty dependency array means this runs only once
20:   return (
21:     <div className="min-h-screen flex flex-col font-sans bg-white dark:bg-slate-900 ... transition-colors duration-300">
22:       {/* Top Navigation Bar */}
23:       <Navbar /> 
25:       {/* Main Content Area */}
26:       <main className="flex-grow">
29:         <Hero /> 
31:         <Features /> 
33:         <HowItWorks /> 
35:       </main>
39:       <Footer /> 
40:     </div>
41:   );
42: }
```

### 5.4 Backend: `application.yaml`
Configuration settings for the Spring Boot application.

```yaml
1: spring:
2:   application:
3:     name: smart_campus_Operation-hub # Project identifier
4:   datasource:
5:     url: jdbc:mysql://localhost:3306/campus?createDatabaseIfNotExist=true # DB connection URL
6:     username: root # DB username
7:     password: "Abi0021@" # Password for MySQL root user
8:   jpa:
9:     show-sql: true # Logs SQL queries to the console for easier debugging
```

### 5.5 Frontend: `HowItWorks.tsx`
This component illustrates how the system's "three-step process" is rendered using an array-driven approach and Lucide icons.

```tsx
4:   const steps = [ // Data array defining each step
5:     {
6:       step: '01',
7:       title: 'Select Resource',
8:       description: 'Browse available facilities, labs, or equipment...',
9:       icon: <MousePointerClick className="..." />, // Lucide icon component
10:    },
12:    // Additional steps...
23:   ];

51:   {steps.map((item, index) => ( // Standard React pattern: iterating over data to render UI
52:     <div key={index} className="flex flex-col items-center group">
53:       {/* Styling with Tailwind CSS for transitions and group-hover states */}
54:       <div className="w-14 h-14 bg-indigo-600 rounded-2xl ... group-hover:scale-110 duration-300">
55:         {item.icon}
56:       </div>
60:       <h3 className="text-xl font-bold text-slate-900 dark:text-white">
61:         {item.title}
62:       </h3>
63:     </div>
66:   ))}
```

---

## 6. Visual Design Aesthetics
The project emphasizes a **Premium User Experience**:
- **Dark Mode Support**: Uses Tailwind `dark:` variant and CSS variables for smooth transitions.
- **Glassmorphism**: Applied to components like the Navbar and feature cards for a modern feel.
- **Micro-Animations**: Hover effects (e.g., `group-hover:scale-110`) on buttons and cards using standard CSS transitions.
- **Modern Typography**: Uses sans-serif fonts (e.g., Inter or Roboto via Google Fonts) for clean readability.
- **Responsive Layout**: Utilizing Tailwind's grid and flexbox utilities to ensure usability on mobile and desktop devices.
