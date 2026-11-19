# System Architecture

## Current Architecture (Modular Monolith)

The Insurance Policy and Claim Management System is implemented as a **modular monolith** — a single deployable backend with clearly separated business modules, plus a React SPA frontend.

### Backend Layers

```
Controller Layer   →  REST endpoints, input validation, DTO mapping
Service Layer      →  Business rules, lifecycle enforcement, transactions
Repository Layer   →  JPA data access (Spring Data JPA)
Entity Layer       →  JPA entities (9 business entities)
DTO Layer          →  Request/response DTOs (entities never exposed)
Security Layer     →  Spring Security, JWT, BCrypt, role-based access
Exception Layer    →  @RestControllerAdvice centralized handling
Config Layer       →  OpenAPI/Swagger, CORS
```

### Modules
- `authentication` — Register, login, JWT
- `user` — Admin/user management, agent creation, activation/deactivation
- `customer` — Customer profiles
- `product` — Insurance products (Health, Motor, Life, Travel)
- `plan` — Policy plans under products
- `policy` — Policies (purchase, issue, cancel, lifecycle)
- `payment` — Simulated premium payments
- `claim` — Claims (submit, review, recommend, decide)
- `history` — Claim status history
- `dashboard` — Analytics and summary data

### Frontend Architecture

React SPA with:
- `pages/Landing.tsx` — Public marketing landing page at `/` (anonymous visitors)
- `pages/{admin,agent,customer,auth}` — Role-based pages
- `pages/shared` — Shared detail views (claims, policies) used by admin and agent
- `components/ui` — shadcn/ui primitives (Radix)
- `components/layouts` — Sidebar, TopNav
- `services/api.ts` — Axios layer with JWT interceptor
- `context/AuthContext` — Auth state (token, user, login, logout)
- `types` — TypeScript interfaces matching backend DTOs

### Security
- JWT authentication (Bearer token)
- Role-based authorization (@PreAuthorize / security config)
- BCrypt password hashing
- CORS configured for frontend origin
- Backend enforces all permissions (frontend route guards are secondary)

### Data Flow

Client (React) → Axios (with JWT) → Spring Controller → Service (business rules) → JPA Repository → MySQL

### Deployment

- Runs locally without Docker/Kubernetes.
- Backend: `java -jar` on port 8080.
- Frontend: Vite dev server on port 5173 (proxies `/api` to backend).

## Future Architecture (Not Implemented)

External partner clients (Axis Bank, YBL Bank) would connect via a future **Integration Layer** (API Gateway, partner auth, orchestration) which then calls the core Insurance Application REST APIs. See `docs/future-scope/FUTURE_MICROSERVICES_INTEGRATION.md`.

## Diagram (Text)

```
      REACT FRONTEND (port 5173)
             |
             | HTTPS/JSON (JWT Bearer)
             v
      SPRING BOOT BACKEND (port 8080)
             |
   +---------+---------+---------+
   |         |         |         |
 Controller Service Repository ...
   |         |         |         |
   v         v         v         v
   MYSQL DATABASE (insurance_db)
```
