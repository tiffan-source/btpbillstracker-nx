
You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection

## Project Architecture Rules

- Respect layered boundaries:
  - Domain libs (`libs/bills`, `libs/clients`, `libs/chantiers`, etc.)
  - Infrastructure adapters (`libs/infrastructure`)
  - App orchestration (`src/app/services/**/orchestrator`)
  - App UI + forms + pages (`src/app/pages`, `src/app/forms`, `libs/components`)
  - App providers/stores (`src/app/providers`, `src/app/stores`)
- Domain code must not import Angular framework APIs.
- Domain use cases must depend on ports, entities, and domain errors only.
- Infrastructure must implement ports without leaking SDK details to domain code.
- Orchestrators coordinate use cases, stores, and routing but do not call infrastructure adapters directly.
- Providers in `src/app/providers` are the composition root for wiring ports to adapters.

## Orchestrator Conventions

- Use typed request and typed result contracts.
- Use discriminated unions for workflow outcomes (`success: true | false`).
- Map each failure to a workflow step with an actionable message.
- Expose process state through signals and computed values.
- Use optimistic store updates only after successful domain actions.

## Local Instruction Files

- `.github/instructions/architecture-boundaries.instructions.md`
- `.github/instructions/orchestrator-playbook.instructions.md`

## Local Skills

- `.github/skills/angular-orchestrator-implementation/SKILL.md`
- `.github/skills/domain-usecase-implementation/SKILL.md`
- `.github/skills/ports-adapters-wiring/SKILL.md`
- `.github/skills/bugfix-root-cause/SKILL.md`
