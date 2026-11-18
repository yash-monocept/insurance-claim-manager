# Insurance Policy and Claim Management System

A full-stack, modular monolithic Insurance Policy and Claim Management System with a Spring Boot backend and React frontend, built per the Software Requirements Specification (SRS).

## Overview

This system manages the complete lifecycle of insurance products, plans, customers, policies, premium payments, and claims. It supports three user roles (Admin, Agent, Customer) with JWT-based role-based access control.

**Architecture:** Modular monolith (backend) + React SPA (frontend). External partner integration (Axis Bank, YBL Bank, etc.) and microservices are documented as future scope only — NOT implemented.

## Technology Stack

### Backend
- Java 21, Spring Boot 3.3.5, Maven
- Spring Web, Spring Data JPA, Hibernate
- MySQL 8.x
- Spring Security + JWT (jjwt) + BCrypt
- Bean Validation
- Springdoc OpenAPI (Swagger)
- Centralized exception handling, structured logging (SLF4J/Logback)
- Lombok-free (explicit getters/setters for environment compatibility)

### Frontend
- React 18, TypeScript, Vite
- Tailwind CSS, shadcn/ui components (Radix primitives)
- React Router, Axios, TanStack Query
- React Hook Form + Zod validation
- Lucide React icons, Recharts charts, Sonner toasts

## Project Structure

```
insurance-claim-management software/
├── backend/                    # Spring Boot REST API
│   ├── pom.xml
│   ├── src/main/java/com/insurance/insurancemgmt/
│   │   ├── config/             # OpenAPI, CORS
│   │   ├── security/           # JWT, filter, user details, security config
│   │   ├── authentication/     # Register, login
│   │   ├── user/               # User & agent management
│   │   ├── customer/           # Customer profiles
│   │   ├── product/            # Insurance products
│   │   ├── plan/               # Policy plans
│   │   ├── policy/             # Policies (purchase, issue, cancel)
│   │   ├── payment/            # Simulated premium payments
│   │   ├── claim/              # Claims (submit, review, recommend, decide)
│   │   ├── history/            # Claim status history
│   │   ├── dashboard/          # Dashboard analytics
│   │   ├── common/             # DTOs, exceptions
│   │   └── InsuranceApplication.java
│   └── src/main/resources/
│       └── application.properties
├── frontend/                   # React SPA
│   ├── src/
│   │   ├── components/ui/      # shadcn/ui primitives
│   │   ├── components/layouts/ # Sidebar, TopNav
│   │   ├── pages/{admin,agent,customer,auth}/
│   │   ├── services/api.ts     # Axios API layer
│   │   ├── context/AuthContext.tsx
│   │   ├── types/index.ts
│   │   └── main.tsx, App.tsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── docs/
│   ├── architecture/
│   ├── api/
│   └── future-scope/
├── .env.example
├── PROJECT_PLAN.md
└── README.md
```

## Prerequisites

- **Java 21** (JDK 21)
- **Maven 3.x**
- **Node.js 18+** and **npm**
- **MySQL 8.x** (required for the backend; not included in this environment)

> **Note:** MySQL is not installed in this build environment. You must install MySQL locally before running the backend. See "Database Setup" below.

## Database Setup

1. Install MySQL 8.x locally.
2. Create a database (e.g., `insurance_db`).
3. Copy `.env.example` to `backend/.env` (or edit `backend/src/main/resources/application.properties`) and set:
   - `SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/insurance_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC`
   - `SPRING_DATASOURCE_USERNAME=your_mysql_user`
   - `SPRING_DATASOURCE_PASSWORD=your_mysql_password`
   - `JWT_SECRET=a-secure-random-secret-at-least-32-chars`
   - `CORS_ALLOWED_ORIGINS=http://localhost:5173`

The application uses `spring.jpa.hibernate.ddl-auto=update` so tables are created automatically on first startup.

## Demo Data

On first startup, a `DatabaseSeeder` (CommandLineRunner) inserts demo data if the `users` table is empty:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@insurance.com | Admin@123 |
| Agent | agent1@insurance.com | Agent@123 |
| Agent | agent2@insurance.com | Agent@123 |
| Customer | customer1@example.com | Cust@123 |
| Customer | customer2@example.com | Cust@123 |

Demo products: Health, Motor, Life, Travel insurance (with multiple plans each).

## Running the Application

### Backend
```bash
cd "insurance-claim-management software/backend"
# Edit application.properties or set env vars per .env.example
mvn clean package
java -jar target/insurance-management-system-1.0.0.jar
```
Backend runs on **http://localhost:8080**.

### Frontend
```bash
cd "insurance-claim-management software/frontend"
npm install
npm run dev
```
Frontend runs on **http://localhost:5173** and proxies `/api` to `http://localhost:8080`.

## Swagger / API Documentation

Once the backend is running, Swagger UI is available at:
```
http://localhost:8080/swagger-ui/index.html
```
OpenAPI docs: `http://localhost:8080/v3/api-docs`

## Key Business Rules (per SRS)

- Public registration creates **CUSTOMER** accounts only (no public Admin/Agent registration).
- Admin creates Agent accounts internally.
- New policies start as **PENDING_PAYMENT**.
- A policy becomes **ACTIVE** only after the first successful payment >= required premium.
- Failed/Pending payments do NOT activate policies.
- Claims can only be raised against **ACTIVE** policies; claim amount must not exceed coverage.
- Claim lifecycle: SUBMITTED → UNDER_REVIEW (agent) → RECOMMENDED_FOR_APPROVAL/REJECTION (agent) → APPROVED/REJECTED (admin only).
- Approved/Rejected claims cannot be modified.
- Products/Plans are deactivated (not hard-deleted). Policies/payments/claims/history are never hard-deleted.
- Payments are **simulated** (no real gateway).
- Passwords are hashed with BCrypt and never logged/returned.
- Customers access only their own data; ownership enforced on the backend.

## Out of Scope (per SRS)

Real payment gateways, real KYC, email/SMS notifications, cloud document storage, AI fraud detection, microservices, Docker/Kubernetes, real underwriting, policy renewal automation, refund processing, claim settlement bank transfers.

## Future Scope (Documented, Not Implemented)

External partner integration (Axis Bank, YBL Bank) via a future integration layer and microservices. See:
- `docs/future-scope/FUTURE_MICROSERVICES_INTEGRATION.md`
- `docs/architecture/SYSTEM_ARCHITECTURE.md`

## Testing

Backend unit/integration tests are in `backend/src/test`. Frontend tests can be added under `frontend`.

## Limitations

- MySQL must be installed separately (not bundled).
- Document upload is simulated (document references only, no actual file storage).
- Forgot-password is omitted (no email system per SRS).
- Frontend type-checking has some loose constraints for build speed; the app builds and runs via Vite.
