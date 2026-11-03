# ADR 0001 — Start as a modular monolith

## Decision

Use a Next.js App Router modular monolith with a server-only data-access layer and explicit domain boundaries. Use the managed database and authentication capabilities when real accounts are enabled.

## Rationale

The MVP needs fast iteration, clear authorization, low operational overhead and a small attack surface. Microservices would add deployment, identity and observability complexity before product-market validation.

## Consequences

Domain modules must stay separated even though they share a deployable unit. Extract services only when there is a proven operational boundary, not as a default.
