---
name: custom-ui-component
description: Creates, modifies, and adapts custom UI components in `libs/components`, wrapping external UI libraries like PrimeNG or building native components. Use this skill when the user asks to create or update a UI component.
---

# Constructing Custom UI Components (Design System)

This codebase builds its own design system in the `libs/components` library. We **NEVER** use external UI libraries (like PrimeNG) directly inside the main application (`src/app/**`). Instead, we create custom wrapper components to keep our app agnostic of the underlying UI framework.

## 1. Core Principles

- **Location:** All components belong in `libs/components/src/lib/`. 
- **Modern Angular API:** Always use Signal-based inputs (`input()`, `input.required()`) and outputs (`output()`).
- **Standalone:** Components must be standalone.

## 2. The Wrapper Pattern (PrimeNG or other libraries)

When wrapping an external component:
1. **Define Custom Inputs:** Expose your own domain-specific inputs via `input()`. Do not blindly expose all PrimeNG inputs unless needed.
2. **Translate to External Inputs:** In your `.html` template, use the external component (e.g., `<p-button>`, `<p-card>`) and bind your Signal inputs to their native `@Input()` equivalent.

### Content Projection & Templates
Many external components expect custom templates (`#pTemplate`). Since the parent app cannot use `<ng-template pTemplate="body">` directly on our custom tag, use this pattern:
- **`ng-content`**: For standard slots, use `<ng-content select="...">` inside your component's `<ng-template pTemplate="...">`.
- **`@ContentChild` / `ngTemplateOutlet`**: For dynamic iterative components (like Tables), capture templates from the parent component using `@ContentChild('myTemplateRef')` and render them via `*ngTemplateOutlet` inside the underlying PrimeNG template.

## 3. Mandatory MCP Tool Usage

When instructed to create or update a wrapper component powered by PrimeNG, **you MUST utilize PrimeNG MCP tools** to ensure correct implementation:
1. Call `activate_primeng_component_overview_tools` or related capability activation tools if Primeng tools are not available.
2. Use tools like `mcp_primeng_get_component`, `mcp_primeng_get_component_slots`, or `mcp_primeng_generate_component_template` to research what properties and templates the PrimeNG component requires.
3. Only after understanding the PrimeNG API, create your custom wrapper `inputs()` and `.html`.

## 4. Example Implementations

### Simple Prop Wrapping (e.g. Button)
```typescript
import { Component, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'lib-button',
  imports: [ButtonModule],
  templateUrl: './button.html',
})
export class Button {
    label = input.required<string>();
    variant = input<'primary'|'secondary'>('primary');
}
```
```html
<!-- button.html -->
<p-button [label]="label()" [severity]="variant() !== 'primary' ? variant() : undefined"></p-button>
```

### Advanced Template Forwarding (e.g. Table)
```typescript
import { Component, ContentChild, TemplateRef, input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'lib-table',
  imports: [TableModule, NgTemplateOutlet],
  templateUrl: './table.html',
})
export class Table {
    value = input.required<unknown[]>();
    @ContentChild('header') headerTemplate!: TemplateRef<any>;
    @ContentChild('body') bodyTemplate!: TemplateRef<any>;
}
```
```html
<p-table [value]="value()">
    <ng-template pTemplate="header">
        <ng-container *ngTemplateOutlet="headerTemplate"></ng-container>
    </ng-template>
    <ng-template pTemplate="body" let-rowData>
        <ng-container *ngTemplateOutlet="bodyTemplate; context: { $implicit: rowData }"></ng-container>
    </ng-template>
</p-table>
```