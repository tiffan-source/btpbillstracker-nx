---
name: domain-usecase-implementation
description: Guidelines for implementing pure domain logic (Entities, UseCases, Ports) following Clean Architecture, REP/CCP/CRP principles, strict OOP, and Result/CoreError patterns. Use when creating or modifying the domain zone of the project.
---

# Domain & Use Case Implementation Guidelines

This skill guides the implementation of the "Domain Zone", the isolated core of the application containing Entities, Use Cases, and Ports.

## 1. Core Principles

The Domain Zone is the heart of the application. It **MUST NOT** depend on any external frameworks, libraries (like Angular, Firebase, etc.), or infrastructure code. It is written in pure TypeScript.

### Component Coupling Principles
- **REP (Reuse/Release Equivalence Principle):** Group components that logically make sense to be used and reused together.
- **CCP (Common Closure Principle):** Components that change together for the same reasons should be grouped into the same module/folder (Single Responsibility Principle applied at the architecture level).
- **CRP (Common Reuse Principle):** Do not force a module to depend on things it does not need. Isolate independent behaviors.

### Clean Architecture
- Code belongs purely to the domain schema block.
- Module organization is restricted strictly to business meaning (e.g., `bills`, `clients`, `chantiers`).

## 2. Entities

Entities encapsulate the core business rules and state.
- **Strict OOP:** Entities must follow strict Object-Oriented Programming (encapsulation, private properties, getters/setters validation).
- **No Invalid State:** Entity constructors and setters must throw domain errors if a constraint is violated.
- **Pure Logic:** Do not inject services or repositories into entities.

## 3. Errors

- All domain errors must extend the base `CoreError` class (imported from `@btpbilltracker/chore`).
- Errors should represent specific business or technical failures with a stable `code` and optional `metadata`.

## 4. Use Cases

Use Cases orchestrate interactions between entities and the outside world through Ports.
- **Ports Justification:** When writing a Use Case, you **MUST** thoroughly justify the use of specific Ports (e.g., Repositories, Generators, Auth Providers) via dependency injection. Ports act as boundaries.
- **Return Types:** Use Cases must ALWAYS return a `Result<T>` type (`success` and `failure` functions from `@btpbilltracker/chore`).
- **Error Handling:** Use Cases should `try/catch` and explicitly return failures for known domain errors (e.g., `error instanceof MyDomainError`). It must wrap unexpected errors as an 'UNKNOWN_ERROR'.

## 5. Ports

- Ports are pure TypeScript interfaces detailing methods that the domain expects from the infrastructure layer. 
- Never leak connection details (HTTP, SQL) into the port signatures.

## 6. Testing & Documentation

- **Unit Tests:** Every Entity and Use Case MUST be accompanied by exhaustive unit tests validating both success scenarios and all error/failure constraints.
- **Documentation:** Every Entity and Use Case MUST have clear documentation (JSDoc/comments) explaining the business purpose and rules it enforces.

## Example Flow
- Read the context from `libs/chore/src/lib/result/result.ts` and `libs/chore/src/lib/errors/core.error.ts`.
- Instantiate the entity with strict validations.
- Interact with injected ports.
- Return `success(entity)` or `failure(error.code, ...)`.
