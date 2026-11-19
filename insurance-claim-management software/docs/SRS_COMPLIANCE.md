# SRS Compliance Summary

This document maps the Software Requirements Specification (`Insurance Policy and Claim Management System (1).pdf`) to the implementation and the checks performed against a running system.

**Result: all 30 acceptance criteria (AC-001 to AC-030) and all 19 exception scenarios (EXC-001 to EXC-019) are satisfied.**

## 1. Acceptance Criteria

| ID | Criterion | Status | Evidence |
|----|-----------|--------|----------|
| AC-001 | Customer can register successfully | Met | `POST /api/auth/register`; UI `/register` |
| AC-002 | Public users cannot register as admin or agent | Met | `role` is ignored on public registration; resulting role is always `CUSTOMER` |
| AC-003 | Active users can login successfully | Met | `POST /api/auth/login`; inactive users receive 401 |
| AC-004 | JWT token generated after login | Met | Login response contains a signed HS256 token |
| AC-005 | Protected APIs reject requests without a valid JWT | Met | Missing, malformed, and expired tokens return structured 401 |
| AC-006 | Role-based access restrictions work | Met | Method security plus filter-chain rules; forbidden roles return structured 403 |
| AC-007 | Admin can create, update, deactivate products | Met | `POST/PUT /api/admin/products`, `PATCH /api/admin/products/{id}/status`; UI `/admin/products` |
| AC-008 | Admin can create, update, deactivate plans | Met | `POST/PUT /api/plans`, `PATCH /api/plans/{id}/status`; UI `/admin/plans` |
| AC-009 | Customer can create and update own profile | Met | `POST /api/customers/profile`, `PUT /api/customers/me`; UI `/customer/profile` |
| AC-010 | Customer cannot access another customer's data | Met | Ownership checks on policies, payments, claims, and claim history |
| AC-011 | Customer can purchase a policy from an active plan | Met | `POST /api/policies/purchase`; inactive plans rejected |
| AC-012 | Policy created with Pending Payment status | Met | Purchase and issue both start as `PENDING_PAYMENT` |
| AC-013 | Successful required payment activates policy | Met | First successful payment covering the premium sets `ACTIVE` |
| AC-014 | Failed payment does not activate policy | Met | `FAILED`/`PENDING` payments are stored but do not change status or totals |
| AC-015 | Customer can raise claim only for own active policy | Met | Claim submission enforces ownership and `ACTIVE` status |
| AC-016 | Claim above coverage is rejected | Met | Validation returns 400 when amount exceeds coverage |
| AC-017 | Agent can review and recommend | Met | `PATCH /claims/{id}/review`, `PATCH /claims/{id}/recommendation`; UI claim detail |
| AC-018 | Agent cannot approve or reject finally | Met | Decision endpoint is admin-only; agent attempts return 403/400 |
| AC-019 | Admin can approve or reject finally | Met | `PATCH /claims/{id}/decision`; UI claim detail |
| AC-020 | Approved/rejected claims cannot be modified | Met | Terminal statuses reject further transitions with 400 |
| AC-021 | Claim status history is recorded | Met | Every transition inserts a history row with remarks, actor, and timestamp |
| AC-022 | Major errors return structured responses | Met | Centralized handler returns timestamp, status, errorType, message, path |
| AC-023 | Swagger displays all API groups | Met | `/swagger-ui/index.html`; `/v3/api-docs` plus 10 grouped docs |
| AC-024 | Logs generated for major business events | Met | Registration, login, purchase, payment, claim transitions, cancellation, security failures |
| AC-025 | Pagination works for all list APIs | Met | `page`/`size` applied to every list endpoint |
| AC-026 | Default pagination applied when inputs are missing | Met | Defaults to page 1, size 10 (verified across seven list endpoints) |
| AC-027 | Invalid pagination inputs rejected | Met | page < 1, non-numeric, size < 1, size > 100 return 400 |
| AC-028 | Paginated responses include metadata | Met | `records`, `currentPage`, `pageSize`, `totalRecords`, `totalPages`, `lastPage`, sort info |
| AC-029 | Sorting and filtering work with pagination | Met | Validated sort fields and filters combine with paging; invalid sort fields return 400 |
| AC-030 | Entities are not directly exposed | Met | DTO-only responses; no nested JPA objects, no password fields |

## 2. Exception Scenarios

| ID | Scenario | Result |
|----|----------|--------|
| EXC-001 | Resource not found | 404 with structured body |
| EXC-002 | Duplicate email | 409 |
| EXC-003 | Duplicate product name | 409 |
| EXC-004 | Duplicate transaction reference | 409 |
| EXC-005 | Invalid login credentials | 401 |
| EXC-006 | Inactive user login attempt | 401 |
| EXC-007 | Unauthorized access | 401 |
| EXC-008 | Forbidden role access | 403 |
| EXC-009 | Invalid policy status | 400 |
| EXC-010 | Invalid claim status | 400 |
| EXC-011 | Claim amount exceeding coverage | 400 |
| EXC-012 | Validation failure | 400 with field messages |
| EXC-013 | Invalid JWT token | 401 |
| EXC-014 | Expired JWT token | 401 |
| EXC-015 | Access to another customer's data | 403 |
| EXC-016 | Modify approved or rejected claim | 400 |
| EXC-017 | Invalid pagination request | 400 |
| EXC-018 | Invalid sorting field | 400 |
| EXC-019 | Unexpected internal server error | 500 with structured body (no stack trace or internals) |

## 3. Lifecycle and Business Rules Verified

- **Policy:** `PENDING_PAYMENT` → `ACTIVE` only on sufficient successful payment; `CANCELLED` blocks further payments and claims; past-end-date policies are marked `EXPIRED`.
- **Claims:** `SUBMITTED` → `UNDER_REVIEW` (agent) → `RECOMMENDED_FOR_APPROVAL` / `RECOMMENDED_FOR_REJECTION` (agent) → `APPROVED` / `REJECTED` (admin only). Terminal claims are immutable.
- **History:** every transition is persisted with previous status, new status, remarks, actor, and timestamp; the actor is a `User` relation (MAP-009) and is exposed as an email in responses.
- **Payments:** statuses `SUCCESS`, `FAILED`, `PENDING`; only successful payments affect `totalPremiumPaid`.
- **Deactivation:** users, products, and plans are deactivated (soft), not hard-deleted; policies, payments, claims, and history are never deleted.
- **Identifiers:** policy numbers, claim numbers, and transaction references are unique and readable.

## 4. Intentional Additions

These extend the SRS without removing or weakening any requirement:

1. **React SPA.** The SRS assumes a backend-only project (ASM-001). The SPA is an added demonstration client; every backend requirement remains implemented and documented in Swagger.
2. **Public landing page at `/`.** Marketing page for anonymous visitors, with navigation to login and registration.
3. **Partial payments.** PMT-RUL-008 makes partial payments optional. They are supported as an enhancement: successful payments accumulate and activate the policy once the total reaches the required premium.
4. **Policy expiry sweep.** Runs when the application is ready and then hourly; claim submission also detects an expired policy lazily. This implements the "system identifies expired policies" lifecycle step (FR-POL-010).
5. **Frontend search filters.** Admin/agent list pages expose client-side keyword filters; the backend still provides the SRS-required pagination, sorting, and status filters.

## 5. How to Verify

1. Start MySQL, the backend (`mvn spring-boot:run`), and the frontend (`npm run dev`).
2. Open `http://localhost:5173/` for the landing page.
3. Sign in with a demo account:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@insurance.com | Admin@123 |
| Agent | agent1@insurance.com | Agent@123 |
| Customer | customer1@example.com | Cust@123 |

4. Open Swagger at `http://localhost:8080/swagger-ui/index.html` and authorize with the token returned by `POST /api/auth/login`.
