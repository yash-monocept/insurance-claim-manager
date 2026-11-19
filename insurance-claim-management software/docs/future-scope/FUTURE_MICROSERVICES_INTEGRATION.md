# Future Microservices Integration Architecture

## Current State

The Insurance Policy and Claim Management System is a **modular monolith** — a single Spring Boot backend with clean module separation (Controller → Service → Repository) and DTO-based APIs. The frontend is a React SPA calling the backend REST APIs.

## Future Integration Architecture (Not Implemented)

The following architecture is planned for a later phase to allow external partner clients (e.g., Axis Bank, YBL Bank, other partners) to integrate with the insurance system without direct coupling to the internal application.

```
                USER X
                   |
                   v
      +------------------------------------+
      |     PARTNER APPLICATIONS           |
      |  Axis Bank   YBL Bank   Others     |
      +------------------------------------+
                   |
                   v
      +------------------------------------+
      |   FUTURE INTEGRATION LAYER         |
      |  API Gateway                         |
      |  Partner Authentication              |
      |  API Orchestration                   |
      |  Request Validation / Data Mapping   |
      |  Secure Communication (mTLS/OAuth2) |
      +------------------------------------+
                   |
                   v
      +------------------------------------+
      |   FUTURE MICROSERVICES (stubs)     |
      |  Policy Integration                |
      |  Claim Integration                 |
      |  Customer Integration              |
      |  Document Transfer                 |
      +------------------------------------+
                   |
                   v
      +------------------------------------+
      |   INSURANCE APPLICATION            |
      |  (Current Modular Monolith)        |
      |  Core REST APIs                    |
      +------------------------------------+
                   |
                   v
               MYSQL DATABASE
```

**The future-state diagram above is NOT IMPLEMENTED in the current codebase.**

## Why an Integration Layer May Be Needed

1. **Partner isolation:** Partners should not access the internal database or core services directly.
2. **Protocol translation:** Partners may use SOAP, different JSON schemas, or legacy protocols.
3. **Authentication/Authorization:** Partners need their own OAuth2/API-key mechanism, separate from internal JWT.
4. **Rate limiting & throttling:** Protect the core system from partner traffic spikes.
5. **Audit & tracing:** All partner requests/responses logged for compliance.
6. **Data mapping:** Map partner-specific request/response shapes to internal DTOs.

## How Partner Clients Communicate

1. Partner client (Axis Bank app, YBL Bank app, or a partner portal) calls the Integration Layer API Gateway.
2. Integration Layer authenticates the partner (partner API key / OAuth2 client credentials).
3. Integration Layer validates and maps the partner request into an internal Insurance Application REST API call.
4. Core Insurance Application processes the request (policy creation, claim submission, payment, etc.) using existing business logic.
5. Integration Layer maps the internal response back to the partner schema and returns it.

## Partner Authentication (Future)

- Partner-specific client IDs and secrets.
- OAuth2 client credentials or API-key validation at the gateway.
- JWT or opaque tokens issued by the integration layer for downstream calls.
- Scoped permissions per partner (e.g., Axis Bank can only create policies, not approve claims).

## Request Mapping (Future)

Integration layer microservices would:
- Accept partner requests → validate → transform to internal DTO → call internal REST API (via service-to-service client or Feign) → transform response back → return to partner.

## Document Transfer (Future)

- Partner document references passed through; actual file storage could move to cloud (AWS S3 / Azure Blob) in the future via a document microservice.

## Partner-Specific Configuration

- Per-partner configuration (allowed endpoints, rate limits, schema mappings) stored in a partner config service or database.

## Microservices Division (Future)

If decomposed later, the monolith modules could become:
- `policy-service` — policy lifecycle
- `claim-service` — claim lifecycle
- `customer-service` — customers & profiles
- `product-service` — products & plans
- `payment-service` — payments
- `integration-service` / `api-gateway` — partner-facing layer

These would communicate via synchronous REST or asynchronous events (Kafka/RabbitMQ).

## Evolution Without Rewriting Core Logic

The current monolith is designed with:
- **DTOs instead of entities** — APIs are stable; internal entity changes don't break partners.
- **Service-layer business logic** — can be extracted into microservices with minimal logic changes.
- **Unique business identifiers** (policyNumber, claimNumber, transactionReference) — stable across decomposition.
- **Stateless controllers** — easy to place behind a gateway/load balancer.

Thus, the insurance business logic can be extracted into future microservices without being rewritten.

## What is NOT Implemented Now

- API Gateway, partner authentication, Axis Bank / YBL Bank integrations.
- Separate policy/claim/customer microservices.
- Service discovery, distributed config, Kafka/RabbitMQ, AWS S3.
- Docker/Kubernetes deployment.
