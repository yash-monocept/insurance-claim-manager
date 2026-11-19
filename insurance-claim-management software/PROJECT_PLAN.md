# Insurance Policy and Claim Management System - Project Plan

## Status: COMPLETE (Build verified)

Backend: Spring Boot compiles (BUILD SUCCESS, 82 source files)
Frontend: Vite production build succeeds (~987 kB JS)
Documentation: README, architecture, database schema, future scope all written

## Technology Stack
- Backend: Java 21, Spring Boot 3.3.5, Spring Data JPA, Hibernate, MySQL 8, Spring Security, JWT (jjwt), BCrypt, Springdoc OpenAPI, SLF4J
- Frontend: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui (Radix), React Router, Axios, TanStack Query, React Hook Form, Zod, Lucide React, Recharts, Sonner

## What Was Built (All SRS Modules)
1. Authentication & authorization (register/login, JWT, BCrypt, role-based access)
2. User management (admin: list, create agent, activate/deactivate)
3. Customer management (profiles, ownership enforcement)
4. Insurance products (Health, Motor, Life, Travel; CRUD, deactivate)
5. Policy plans (CRUD, coverage > premium validation, active-only purchase)
6. Policies (purchase, issue, cancel; PENDING_PAYMENT→ACTIVE on payment)
7. Simulated premium payments (SUCCESS/FAILED/PENDING, no real gateway)
8. Claims (submit, agent review/recommend, admin final decision)
9. Claim status history (immutable timeline)
10. DTOs, centralized exception handling, Swagger, structured logging
11. Pagination, sorting, filtering on all list APIs
12. Dashboards for Admin/Agent/Customer with real DB-backed metrics
13. Full React frontend with role-based navigation and pages

## Out of Scope (per SRS, NOT built)
Real payment gateway, KYC, email/SMS, cloud document storage, AI fraud detection,
microservices, Docker/Kubernetes, real underwriting, renewal automation, refunds,
claim settlement bank transfers.

## Future Scope (Documented, NOT implemented)
External partner integration (Axis Bank, YBL Bank) via integration layer +
microservices — see docs/future-scope/FUTURE_MICROSERVICES_INTEGRATION.md

## Prerequisites to Run
- Java 21, Maven, Node.js/npm
- MySQL 8.x (must be installed separately; not in this environment)
- See README.md and .env.example for configuration

## Demo Credentials
Admin: admin@insurance.com / Admin@123
Agent: agent1@insurance.com / Agent@123
Customer: customer1@example.com / Cust@123
