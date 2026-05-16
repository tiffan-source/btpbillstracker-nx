---
name: angular-orchestrator-and-service-implementation
description: Guidelines for implementing Angular Services (fire-and-forget) and Orchestrators (state and flow management) based on project architecture. Use this skill when needed to create or update an Angular service or orchestrator.
---

# Angular Services & Orchestrators Implementation Guide

This guide explains the difference between Services and Orchestrators in this project and how you should implement them.

## 1. Services (Standard)

A **Service** is a class exposing functions that group related domain operations, use case executions, or external interactions (e.g., HTTP calls).

### Characteristics:
- **Fire and forget**: Components inject a Service and call its methods. They generally don't expect complex state management back from it.
- **Core capabilities**: Provides access to core application functionality or interacts with the external world.
- **Stateless**: Generally stateless or manages very simple local state.

### Implementation Rules:
- Use `@Injectable({ providedIn: 'root' })` for singletons.
- Group related use cases or HTTP calls.
- Avoid managing UI state, routing, or Toast notifications in standard services.

## 2. Orchestrators

An **Orchestrator** is a specialized service used when the application needs to react to an action in specific ways (e.g., updating a store optimally, showing notifications, routing).

### Characteristics:
- **Flow Management**: Encapsulates the expected application flow when an action is requested. Components just trigger the action and the Orchestrator handles the rest.
- **Coordination**: Orchestrates the execution of use cases, HTTP calls, stores (for optimistic updates data), UI services (like Toasters), and the Router.
- **Stateful Reactions**: Uses Angular mechanisms like Signals, Computed values, or Async functions to manage the business logic and state.
- **Readability**: Reading an orchestrator should immediately clarify what happens in the app when a specific action/service is triggered.

### Implementation Rules:
- Identify if the task requires flow coordination (optimistic updates, error handling with Toasts, navigation). If so, write an Orchestrator, not a simple service.
- Use **Signals** (`signal`, `computed`) to expose process state to components (e.g., loading state, success/error status).
- Coordinate optimistic store updates: Update store -> execute use case -> rollback if failure.
- Inject Router, ToastService (or equivalent), Domain Use Cases, and App Stores.
- Use explicit typed requests and discriminated unions for outcomes.

## 3. Dependency Injection & Testing Requirements

### Dependency Injection (DI)
- **Abstractions Over Concretions**: Orchestrators and Services must ONLY depend on abstractions (Interfaces or `InjectionToken`), NEVER on concrete classes. 
- **Exception for Stores**: The only exception to the abstraction rule is the state/store classes, which can be injected directly since they represent concrete reactive application state.
- **Testability**: This strict dependency inversion rule ensures that orchestrators can be easily unit tested by mocking all dependencies.

### Unit Testing
- **Mandatory Tests**: The creation or modification of a Service or Orchestrator MUST automatically be accompanied by the creation or update of its corresponding Unit Tests (`.spec.ts`).
- Ensure all business and control flows (success, validation error, HTTP error, optimistic update rollback) are thoroughly tested through mocks setup with the abstractions.

## Summary Checklist for Copilot
- **Does it just execute a use case or make an HTTP call and return?** -> It's a **Service**.
- **Does it update UI state, trigger toasts, navigate, or manage optimistic store updates?** -> It's an **Orchestrator**.
- Ensure Orchestrators encapsulate the *entire* flow to keep the component focused purely on presentation.
