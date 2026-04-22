---
name: angular-orchestrator-implementation
description: Build or refactor Angular orchestrators that coordinate stores, domain use cases, routing, and typed workflow errors in this monorepo architecture.
---

# Angular Orchestrator Implementation

Use this skill when the task mentions orchestrators, multi-step workflows, optimistic updates, or cross-domain UI flows.

## Goal

Create a single orchestration boundary that coordinates multiple domain use cases and app stores without leaking infrastructure concerns.

## Process

1. Map workflow steps
- Enumerate all branches and optional paths.
- Define a step union for traceable failures.

2. Define request/result contracts
- Create a typed request payload for the page/form.
- Return a discriminated union result with `success` and step-aware errors.

3. Implement resolvers
- Split branch resolution into private methods.
- Keep each resolver single-purpose and typed.

4. Implement process state
- Expose `isProcessing` and `processError` using signals/computed.
- Reset state before execution and finalize in `finally`.

5. Apply optimistic updates safely
- Update stores only after successful domain operations.
- Keep writes deterministic and replay-safe.

6. Validate
- Verify all branches compile and tests cover success/failure branches.

## Output quality bar

- No direct adapter/repository usage in orchestrator.
- No duplicated domain validation logic.
- Explicit step-level error mapping.
- Clear method names and small private helpers.
