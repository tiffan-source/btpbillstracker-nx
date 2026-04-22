---
name: domain-usecase-implementation
description: Implement or refactor domain entities and use cases in libs while preserving pure business logic and strict port-based dependencies.
---

# Domain Use Case Implementation

Use this skill when adding or changing business rules in `libs/bills`, `libs/clients`, `libs/chantiers`, or other domain libs.

## Rules

- Domain code must not depend on Angular frameworks.
- Domain use cases depend on ports, entities, and domain errors only.
- Keep business invariants in entities/value objects where possible.

## Process

1. Clarify business rule
- Write the invariant and expected behavior before coding.

2. Design inputs/outputs
- Use explicit input types and result unions.
- Avoid `any`; use precise domain types.

3. Use ports for external interactions
- If persistence/external service is required, model or extend a port.

4. Implement with deterministic flow
- Keep use cases small and intention-revealing.
- Return typed domain errors, not raw technical errors.

5. Test-first mindset
- Add or update focused unit tests for happy path and business failures.

## Done criteria

- Business logic is testable without framework bootstrapping.
- Use case API is stable and explicit.
- Domain errors are meaningful for orchestrator mapping.
