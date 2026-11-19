# Database Schema

## Entities (9)

| Entity | Description |
|--------|-------------|
| `users` | Account/login info (id, fullName, email, password, mobileNumber, role, active, timestamps) |
| `customers` | Customer profile (id, user FK, DOB, address, city, state, pinCode, nomineeName, nomineeRelation) |
| `insurance_products` | Product category (id, productName, productType, description, active) |
| `policy_plans` | Purchasable plan under a product (id, product FK, planName, coverageAmount, premiumAmount, premiumType, durationYears, terms, active) |
| `policies` | Purchased policy (id, policyNumber, customer FK, plan FK, startDate, endDate, status, totalPremiumPaid) |
| `premium_payments` | Simulated payment (id, policy FK, amount, paymentDate, mode, transactionReference, status) |
| `claims` | Insurance claim (id, claimNumber, policy FK, amount, reason, incidentDate, status, agentRemarks, adminRemarks) |
| `claim_documents` | Document references (id, claim FK, name, type, reference, uploadedDate) |
| `claim_status_history` | Status change log (id, claim FK, previousStatus, newStatus, remarks, updatedByUser FK → users, updatedDate) |

## Relationships

| Mapping | Type | Description |
|---------|------|-------------|
| User → Customer | One-to-One | One customer user has one customer profile |
| Product → Plan | One-to-Many | One product has multiple plans |
| Plan → Policy | One-to-Many | One plan purchased by multiple customers |
| Customer → Policy | One-to-Many | One customer has multiple policies |
| Policy → Payment | One-to-Many | One policy has multiple payment records |
| Policy → Claim | One-to-Many | One policy has multiple claims |
| Claim → Document | One-to-Many | One claim has multiple document references |
| Claim → History | One-to-Many | One claim has multiple status history records |
| User → History | One-to-Many | One user performs multiple status updates |

## Constraints & Rules

- **Unique constraints:** users.email, insurance_products.productName, policies.policyNumber, claims.claimNumber, premium_payments.transactionReference
- **Deactivation (no hard delete):** Products and plans are `deactivated` (active=false) instead of deleted. Policies, payments, claims, histories are never hard-deleted.
- **Indexes:** On unique business identifiers, foreign keys, and commonly filtered fields (status, customer, dates).
- **Cascades:** Customer profile cascades from user; plan/product deletions cascade where safe but business records prevent hard deletion.

## Status Enums

- **User.Role:** ADMIN, AGENT, CUSTOMER
- **ProductType:** HEALTH, MOTOR, LIFE, TRAVEL
- **PremiumType:** ONE_TIME, ANNUAL
- **PolicyStatus:** PENDING_PAYMENT, ACTIVE, EXPIRED, CANCELLED
- **PaymentStatus:** SUCCESS, FAILED, PENDING
- **PaymentMode:** UPI, CARD, NET_BANKING, CASH
- **ClaimStatus:** SUBMITTED, UNDER_REVIEW, RECOMMENDED_FOR_APPROVAL, RECOMMENDED_FOR_REJECTION, APPROVED, REJECTED

## Policy Lifecycle

PENDING_PAYMENT → (successful payment >= premium) → ACTIVE → (end date passed) → EXPIRED
                                               → (admin/agent cancels) → CANCELLED
Cancelled policies cannot be reactivated.

## Claim Lifecycle

SUBMITTED (customer) → UNDER_REVIEW (agent) → RECOMMENDED_FOR_APPROVAL or RECOMMENDED_FOR_REJECTION (agent) → APPROVED or REJECTED (admin)

Only admins make final decisions. Agents cannot approve/reject finally.
