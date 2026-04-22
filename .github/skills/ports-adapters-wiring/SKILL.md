---
name: ports-adapters-wiring
description: Wire domain ports to infrastructure adapters through Angular providers in the app composition root.
---

# Ports Adapters Wiring

Use this skill when adding new repositories/services, changing adapter implementations, or fixing DI wiring.

## Goal

Keep domain libs independent while allowing runtime wiring in app providers.

## Process

1. Confirm port contract
- Identify the exact port required by the use case.
- Ensure the adapter fully implements it.

2. Implement or update adapter
- Place adapter code in `libs/infrastructure`.
- Keep external SDK details contained in adapter classes.

3. Wire providers in app
- Update corresponding file in `src/app/providers`.
- Bind port token to adapter factory/class.
- Bind use case factories with explicit deps list.

4. Verify composition root
- Ensure providers are included by `src/app/app.config.ts`.
- Validate DI graph by running build/tests.

## Quality checks

- No use case imports infrastructure directly.
- Provider dependencies are explicit and minimal.
- Runtime failures include actionable error context.
