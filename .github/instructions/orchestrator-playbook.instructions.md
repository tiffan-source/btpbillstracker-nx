# Orchestrator Playbook

Use this playbook when creating or updating orchestrators in `src/app/services/**/orchestrator`.

## Orchestrator responsibilities

- Coordinate several use cases in one user workflow.
- Handle conditional branching (existing vs new entities, optional uploads, fallback flows).
- Expose process state with Angular signals (`isProcessing`, `processError`, `lastResult`).
- Update stores optimistically when user value is clear.
- Return typed workflow results to the UI.

## Structure template

- Request type: input payload from page/form.
- Step union: literal union of workflow steps.
- Result union: success payload + failure payload (`step`, `error.code`, `error.message`).
- Main async function: strict step-by-step resolution with early returns on failure.
- Private resolvers: one method per branch (`resolveClient`, `resolveChantier`, `resolvePdf`).

## Guardrails

- No direct infrastructure calls inside orchestrators.
- No business invariants duplicated from domain entities/use cases.
- Keep one clear side effect per step.
- Always reset process state at workflow start and in `finally` blocks.
- Keep error messages actionable and mapped to the failing step.

## Review checklist

- Are all branches covered (new/existing/optional/error)?
- Is each failure mapped to the correct step?
- Are optimistic updates idempotent and safe?
- Can the UI render a precise error without parsing unknown exceptions?
- Are all dependencies injected through DI and not created manually?
