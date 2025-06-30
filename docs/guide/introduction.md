# Introduction

E2E Wrapper is a generic abstraction layer for end-to-end testing frameworks that provides a unified interface with builder pattern support. It allows you to write tests that can work across different testing frameworks without changing your test logic.

## Why E2E Wrapper?

### Framework Agnostic
Switch between testing frameworks without rewriting your test logic. Whether you're using Detox for React Native, Appium for mobile apps, or planning to migrate to Playwright, E2E Wrapper provides a consistent interface.

### Builder Pattern
Write intuitive, readable tests with chainable methods:

```typescript
await element
  .wait()
  .forVisible()
  .forEnabled()
  .execute()
```

### Flexible Execution Order
Unlike traditional frameworks that force a specific order, E2E Wrapper lets you chain conditions in any order:

```typescript
// Both work equally well
await element.wait().forVisible().forEnabled().execute()
await element.wait().forEnabled().forVisible().execute()
```

### TypeScript First
Built with TypeScript from the ground up, providing excellent IntelliSense and type safety.

## Core Concepts

### Element Drivers
Each testing framework has its own way of finding and interacting with elements. E2E Wrapper abstracts this through the `IElementDriver` interface:

- **DetoxElementDriver**: Wraps Detox's element API
- **AppiumElementDriver**: Wraps WebDriver/Appium methods
- **BaseElementDriver**: Abstract base for custom implementations

### Wait Conditions
Instead of framework-specific wait methods, E2E Wrapper provides generic wait conditions:

- `forVisible()`: Wait for element to be visible
- `forEnabled()`: Wait for element to be enabled/interactable
- `forExists()`: Wait for element to exist in the DOM/view hierarchy

### Selectors
Unified selector format works across frameworks:

```typescript
// Detox
{ testId: 'login-button' }

// Appium
{ xpath: '//android.widget.Button[@text="Login"]' }
{ id: 'login-btn' }

// Both
{ accessibility: 'login-button' }
{ text: 'Login' }
```

## Architecture

```
┌─────────────────┐
│   Your Tests    │
└─────────────────┘
         │
┌─────────────────┐
│   E2E Wrapper   │
│  (Abstract API) │
└─────────────────┘
         │
┌─────────────────┐
│ Framework       │
│ Drivers         │
│ (Detox/Appium)  │
└─────────────────┘
         │
┌─────────────────┐
│ Native          │
│ Frameworks      │
└─────────────────┘
```

## Who Should Use E2E Wrapper?

- **Teams using multiple testing frameworks** across different projects
- **Organizations planning framework migrations** (e.g., from Detox to Appium)
- **Developers who want consistent API** across different testing environments
- **Projects requiring cross-platform testing** with unified test logic

## What's Next?

Ready to get started? Read the [Getting Started](/guide/getting-started) guide for a quick tutorial. 