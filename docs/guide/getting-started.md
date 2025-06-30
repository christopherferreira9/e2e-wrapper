# Getting Started

E2E Wrapper provides a unified interface for interacting with different end-to-end testing frameworks through a powerful builder pattern.

## Installation

::: code-group

```bash [pnpm]
pnpm add e2e-wrapper
```

```bash [npm]
npm install e2e-wrapper
```

```bash [yarn]
yarn add e2e-wrapper
```

:::

## Framework Dependencies

Install your preferred testing framework as a peer dependency:

::: code-group

```bash [Detox]
pnpm add -D detox
```

```bash [Appium]
pnpm add -D appium
```

```bash [Playwright]
pnpm add -D playwright
```

```bash [Cypress]
pnpm add -D cypress
```

:::

## Quick Start

### Detox Example

```typescript
import { createDetoxWrapper } from 'e2e-wrapper'

describe('Login Flow', () => {
  it('should login successfully', async () => {
    const loginButton = createDetoxWrapper({ testId: 'login-button' })
    
    // Wait for button to be visible and enabled
    await loginButton
      .wait()
      .forVisible({ timeout: 10000 })
      .forEnabled()
      .execute()
      
    // Use Detox methods directly
    await loginButton.getDriver().tap()
  })
})
```

### Appium Example

```typescript
import { createAppiumWrapper } from 'e2e-wrapper'

describe('Mobile App', () => {
  let driver: any // Your Appium driver
  
  beforeAll(async () => {
    // Initialize your Appium driver
    driver = await wdio.remote(capabilities)
  })
  
  it('should interact with elements', async () => {
    const submitBtn = createAppiumWrapper(
      { xpath: '//android.widget.Button[@text="Submit"]' },
      driver
    )
    
    // Chain multiple conditions
    await submitBtn
      .wait()
      .forExists()
      .forVisible()
      .forEnabled()
      .execute()
  })
})
```

## Key Concepts

### Builder Pattern

The core feature of E2E Wrapper is its chainable builder pattern:

```typescript
// Different execution orders
await element.wait().forVisible().forEnabled().execute()
await element.wait().forEnabled().forVisible().execute()
await element.wait().forExists().forVisible().forEnabled().execute()
```

### Element Selectors

Use flexible selector objects:

```typescript
// Different selector types
const byTestId = { testId: 'my-button' }
const byId = { id: 'submit-btn' }
const byXPath = { xpath: '//button[@class="primary"]' }
const byText = { text: 'Submit' }
const byAccessibility = { accessibility: 'submit-button' }
```

### Quick Access Methods

For simple checks without the builder pattern:

```typescript
const wrapper = createDetoxWrapper({ testId: 'my-element' })

const isVisible = await wrapper.isVisible()
const isEnabled = await wrapper.isEnabled()
const exists = await wrapper.exists()
```

## Wait Options

Customize wait behavior:

```typescript
await wrapper
  .wait()
  .forVisible({ 
    timeout: 15000,  // 15 seconds
    interval: 200    // Check every 200ms
  })
  .forEnabled({ timeout: 5000 })
  .execute()
```

## Error Handling

```typescript
try {
  const result = await wrapper
    .wait()
    .forVisible()
    .forEnabled()
    .execute()
    
  if (!result) {
    console.log('Conditions were not met within timeout')
  }
} catch (error) {
  console.error('Error during wait execution:', error)
}
```

## Next Steps

- Learn about [Core Concepts](/guide/core-concepts)
- Explore [Framework Integration](/guide/detox)
- Check out [Examples](/examples/detox)
- Browse the [API Reference](/api/e2e-wrapper) 