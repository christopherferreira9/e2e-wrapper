# Detox Integration

Learn how to integrate E2E Wrapper with Detox for React Native testing.

## Overview

Detox is a gray-box end-to-end testing framework for React Native applications. E2E Wrapper provides a unified interface that works seamlessly with Detox's testing capabilities.

## Prerequisites

Before using E2E Wrapper with Detox, ensure you have:

1. **Detox installed and configured** in your React Native project
2. **E2E Wrapper installed** as a dependency
3. **Proper test environment** set up

## Installation

Install both packages:

```bash
# Install E2E Wrapper
pnpm add e2e-wrapper

# Install Detox (if not already installed)
pnpm add -D detox
```

## Basic Setup

### 1. Import E2E Wrapper

```typescript
import { createDetoxWrapper, E2EWrapper } from 'e2e-wrapper'

// Or using the class directly
import { E2EWrapper, DetoxElementDriver } from 'e2e-wrapper'
```

### 2. Create Element Wrappers

```typescript
describe('My React Native App', () => {
  it('should interact with elements', async () => {
    // Using the convenience function
    const loginButton = createDetoxWrapper({ testId: 'login-button' })
    
    // Or using the class constructor
    const loginButton2 = E2EWrapper.withDetox({ testId: 'login-button' })
    
    // Wait for element to be ready
    await loginButton
      .wait()
      .forVisible()
      .forEnabled()
      .execute()
    
    // Use Detox methods directly
    await loginButton.getDriver().tap()
  })
})
```

## Selector Support

E2E Wrapper supports all common Detox selectors:

### TestID (Recommended)

```typescript
const element = createDetoxWrapper({ testId: 'my-element' })
```

This maps to Detox's: `element(by.id('my-element'))`

### Text Content

```typescript
const element = createDetoxWrapper({ text: 'Login' })
```

This maps to Detox's: `element(by.text('Login'))`

### Accessibility Label

```typescript
const element = createDetoxWrapper({ accessibility: 'login-button' })
```

This maps to Detox's: `element(by.label('login-button'))`

## Available Methods

### Wait Methods

```typescript
const button = createDetoxWrapper({ testId: 'submit-btn' })

// Chain multiple conditions
await button
  .wait()
  .forVisible({ timeout: 10000 })
  .forEnabled({ timeout: 5000 })
  .execute()

// Single condition
await button.wait().forVisible().execute()
```

### Direct Check Methods

```typescript
// Quick checks without waiting
const isVisible = await button.isVisible()
const isEnabled = await button.isEnabled()
const exists = await button.exists()
```

### Framework Access

```typescript
// Get the underlying Detox element for framework-specific operations
const detoxElement = button.getDriver()

// Use any Detox method
await detoxElement.tap()
await detoxElement.typeText('Hello World')
await detoxElement.scroll(200, 'down')
```

## Common Patterns

### Form Interaction

```typescript
describe('Login Form', () => {
  it('should handle login flow', async () => {
    const emailInput = createDetoxWrapper({ testId: 'email-input' })
    const passwordInput = createDetoxWrapper({ testId: 'password-input' })
    const loginButton = createDetoxWrapper({ testId: 'login-button' })
    
    // Wait for form to be ready
    await emailInput.wait().forVisible().execute()
    await passwordInput.wait().forVisible().execute()
    
    // Fill form
    await emailInput.getDriver().typeText('user@example.com')
    await passwordInput.getDriver().typeText('password123')
    
    // Submit
    await loginButton.wait().forEnabled().execute()
    await loginButton.getDriver().tap()
  })
})
```

### List Interaction

```typescript
describe('Todo List', () => {
  it('should interact with list items', async () => {
    const todoList = createDetoxWrapper({ testId: 'todo-list' })
    const firstItem = createDetoxWrapper({ testId: 'todo-item-0' })
    
    // Wait for list to load
    await todoList.wait().forVisible().execute()
    
    // Scroll to item if needed
    if (!(await firstItem.isVisible())) {
      await todoList.getDriver().scroll(200, 'down')
    }
    
    // Interact with item
    await firstItem.wait().forVisible().execute()
    await firstItem.getDriver().tap()
  })
})
```

### Navigation Testing

```typescript
describe('Navigation', () => {
  it('should navigate between screens', async () => {
    const profileTab = createDetoxWrapper({ testId: 'profile-tab' })
    const profileScreen = createDetoxWrapper({ testId: 'profile-screen' })
    
    // Navigate to profile
    await profileTab.wait().forVisible().execute()
    await profileTab.getDriver().tap()
    
    // Verify navigation
    await profileScreen
      .wait()
      .forVisible({ timeout: 5000 })
      .execute()
  })
})
```

## Framework-Specific Features

### Using Detox Matchers

```typescript
const button = createDetoxWrapper({ testId: 'my-button' })

// Get Detox element for advanced assertions
const detoxElement = button.getDriver()

// Use Detox expect matchers
await expect(detoxElement).toBeVisible()
await expect(detoxElement).toHaveText('Expected Text')
```

### Device Interactions

```typescript
// E2E Wrapper doesn't abstract device interactions
// Use Detox directly for these operations
await device.reloadReactNative()
await device.openURL('myapp://deep-link')
await device.sendToHome()
```

### Multiple Element Matching

```typescript
// For multiple elements, use Detox directly
const buttons = element(by.type('TouchableOpacity'))
await expect(buttons).toHaveLength(3)

// Or wrap individual elements
const firstButton = createDetoxWrapper({ testId: 'button-0' })
const secondButton = createDetoxWrapper({ testId: 'button-1' })
```

## Best Practices

### 1. Use TestIDs Consistently

```typescript
// Good - reliable and fast
const element = createDetoxWrapper({ testId: 'unique-test-id' })

// Avoid - text can change, less reliable
const element = createDetoxWrapper({ text: 'Submit' })
```

### 2. Implement Proper Waits

```typescript
// Good - wait for element to be ready
await element
  .wait()
  .forVisible()
  .forEnabled()
  .execute()

await element.getDriver().tap()

// Avoid - might tap before element is ready
await element.getDriver().tap()
```

### 3. Handle Timeouts Gracefully

```typescript
const success = await element
  .wait()
  .forVisible({ timeout: 10000 })
  .execute()

if (!success) {
  // Handle timeout scenario
  console.log('Element did not appear within expected time')
  // Maybe take screenshot or log app state
}
```

### 4. Combine with Detox Synchronization

```typescript
// Let Detox handle synchronization
beforeEach(async () => {
  await device.reloadReactNative()
})

// Then use E2E Wrapper for element interactions
const element = createDetoxWrapper({ testId: 'my-element' })
await element.wait().forVisible().execute()
```

## Troubleshooting

### Common Issues

1. **Element not found**: Ensure testId is correctly set in your React Native component
2. **Timing issues**: Use appropriate timeouts and wait conditions
3. **Synchronization problems**: Let Detox handle app synchronization before using E2E Wrapper

### Debugging Tips

```typescript
// Check if element exists before interacting
const exists = await element.exists()
console.log('Element exists:', exists)

// Use longer timeouts for slow operations
await element
  .wait()
  .forVisible({ timeout: 30000 })
  .execute()

// Get framework info
console.log('Using framework:', element.getFramework())
```

## Migration from Pure Detox

If you're migrating from pure Detox code:

### Before (Pure Detox)
```typescript
const loginButton = element(by.id('login-button'))
await waitFor(loginButton).toBeVisible().withTimeout(10000)
await waitFor(loginButton).toBeEnabled().withTimeout(5000)
await loginButton.tap()
```

### After (E2E Wrapper)
```typescript
const loginButton = createDetoxWrapper({ testId: 'login-button' })
await loginButton
  .wait()
  .forVisible({ timeout: 10000 })
  .forEnabled({ timeout: 5000 })
  .execute()
await loginButton.getDriver().tap()
```

The E2E Wrapper approach provides better chaining and consistent API across different testing frameworks. 