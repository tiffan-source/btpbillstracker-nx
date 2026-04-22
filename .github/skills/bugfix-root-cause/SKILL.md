---
name: bugfix-root-cause
description: Diagnose and fix bugs by tracing failures across orchestrators, use cases, stores, providers, and infrastructure boundaries.
---

# Bugfix Root Cause

Use this skill for runtime errors, failing builds, and behavior regressions.

## Debug flow

1. Reproduce
- Capture exact failing command and error output.
- Isolate failing project/target in Nx.

2. Localize layer
- Determine whether failure is in domain, orchestrator, provider wiring, store, or infrastructure.

3. Trace dependency path
- Follow call chain from UI action to orchestrator to use case to port to adapter.
- Confirm request/response shapes at every boundary.

4. Fix at the right layer
- Business rule issue: domain.
- Workflow branch issue: orchestrator.
- DI issue: provider.
- External integration issue: adapter.

5. Validate regression risk
- Run targeted tests/build for affected libs/apps.
- Add missing test that would have caught the bug.

## Anti-patterns to avoid

- Patching symptoms in UI when root cause is domain or provider wiring.
- Swallowing errors without mapping them to typed workflow failures.
- Bypassing ports with direct infra calls from orchestrators.
