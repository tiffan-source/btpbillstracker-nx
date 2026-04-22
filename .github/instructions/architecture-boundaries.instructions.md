# Architecture Boundaries for BTP Bill Tracker

This workspace uses an Nx monorepo with a strict layered architecture:

1. Domain libs (`libs/bills`, `libs/clients`, `libs/chantiers`, `libs/reminders`, `libs/auth`)
2. Infrastructure lib (`libs/infrastructure`)
3. App orchestration layer (`src/app/services/**/orchestrator`)
4. App UI layer (`src/app/pages`, `src/app/forms`, `libs/components`)
5. App state and app wiring (`src/app/stores`, `src/app/providers`, `src/app/app.config.ts`)

## Non-negotiable dependency rules

- Domain entities and use cases must not import from Angular or infrastructure.
- Domain use cases depend only on ports, entities, and domain errors.
- Infrastructure implements domain ports.
- Orchestrators can depend on stores, use cases, router, and app services.
- UI components and pages should call orchestrators, not infrastructure repositories directly.
- Providers in `src/app/providers` are the composition root where ports are wired to adapters.

## When implementing a new feature

- Start by extending domain entities/use cases when business rules change.
- Add or evolve ports when external interactions are needed.
- Implement adapter logic in infrastructure.
- Wire dependencies in app providers.
- Use orchestrators for cross-domain workflow and optimistic updates.
- Keep components declarative: form input, view state, and orchestrator calls.

## Error and result conventions

- Prefer discriminated unions (`success: true | false`) for use case and orchestrator results.
- Keep domain errors explicit and typed.
- Translate technical errors into user-facing orchestration errors.

## Testing policy

- Domain use cases: unit tests first.
- Orchestrators: workflow and branching tests.
- Providers and infra: integration-style tests around adapters and wiring.
- Components/pages: interaction tests focused on UI behavior.
