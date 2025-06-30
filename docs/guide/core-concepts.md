# Core Concepts

Understanding these core concepts will help you get the most out of E2E Wrapper.

## Architecture Overview

E2E Wrapper follows a layered architecture that abstracts framework-specific implementations behind a common interface:

```
┌─────────────────────────────────────┐
│              Your Tests             │
│    (Framework-agnostic test code)   │
└─────────────────────────────────────┘
                    │
┌─────────────────────────────────────┐
│            E2E Wrapper              │
│        (Unified Interface)          │
└─────────────────────────────────────┘
                    │
┌─────────────────────────────────────┐
│          Element Drivers            │
│  (Framework-specific adapters)      │
└─────────────────────────────────────┘
                    │
┌─────────────────────────────────────┐
│       Testing Frameworks           │
│    (Detox, Appium, Playwright)     │
└─────────────────────────────────────┘
```

## Element Drivers

Element drivers are the bridge between E2E Wrapper's generic interface and framework-specific implementations.

### IElementDriver Interface

All drivers implement the `IElementDriver` interface:

```typescript
interface IElementDriver {
  isVisible(): Promise<boolean>
  isEnabled(): Promise<boolean>
  exists(): Promise<boolean>
  waitForState(conditions: WaitCondition[], options: WaitOptions): Promise<boolean>
  getFramework(): TestFramework
}
```

### Built-in Drivers

#### DetoxElementDriver
- **Purpose**: Integrates with Detox for React Native testing
- **Selector Support**: `testId`, `text`, `accessibility`
- **Framework Methods**: Access to Detox element methods via `getDriver()`

```typescript
const driver = new DetoxElementDriver({ testId: 'my-button' })
await driver.getDriver().tap() // Detox-specific method
```

#### AppiumElementDriver
- **Purpose**: Integrates with Appium/WebDriver for mobile automation
- **Selector Support**: `xpath`, `id`, `accessibility`, `text`, `className`
- **Framework Methods**: Access to WebDriver element methods

```typescript
const driver = new AppiumElementDriver({ xpath: '//button' }, webDriver)
await driver.getDriver().click() // WebDriver method
```

### Custom Drivers

You can create custom drivers by extending `BaseElementDriver`:

```typescript
class MyCustomDriver extends BaseElementDriver {
  constructor(private selector: ElementSelector, private myFramework: any) {
    super()
  }

  async isVisible(): Promise<boolean> {
    // Implement using your framework's API
    return this.myFramework.isElementVisible(this.selector)
  }

  async isEnabled(): Promise<boolean> {
    // Implement using your framework's API
    return this.myFramework.isElementEnabled(this.selector)
  }

  // ... implement other required methods

  getFramework(): TestFramework {
    return TestFramework.CUSTOM
  }
}
```

## Builder Pattern

The builder pattern allows for flexible, readable test composition through method chaining.

### Wait Builder

The `WaitBuilder` class implements the builder pattern for wait conditions:

```typescript
interface IWaitBuilder {
  forVisible(options?: WaitOptions): IWaitBuilder
  forEnabled(options?: WaitOptions): IWaitBuilder
  forExists(options?: WaitOptions): IWaitBuilder
  execute(): Promise<boolean>
}
```

### Method Chaining

Methods can be chained in any order:

```typescript
// All of these are equivalent
await element.wait().forVisible().forEnabled().execute()
await element.wait().forEnabled().forVisible().execute()
await element.wait().forExists().forVisible().forEnabled().execute()
```

### Execution

The `execute()` method:
1. Processes all chained conditions
2. Waits for each condition to be met
3. Returns `true` if all conditions pass, `false` if timeout occurs
4. May throw errors for framework-specific issues

## Wait Conditions

Wait conditions define what state an element should be in before proceeding.

### Built-in Conditions

#### VisibleCondition
Waits for an element to be visible on screen.

```typescript
await element.wait().forVisible({ timeout: 10000 }).execute()
```

#### EnabledCondition
Waits for an element to be enabled/interactable.

```typescript
await element.wait().forEnabled({ timeout: 5000 }).execute()
```

#### ExistsCondition
Waits for an element to exist in the DOM/view hierarchy.

```typescript
await element.wait().forExists({ timeout: 3000 }).execute()
```

### Custom Conditions

Create custom wait conditions by extending `WaitCondition`:

```typescript
class TextContainsCondition extends WaitCondition {
  constructor(private expectedText: string) {
    super()
  }

  async check(driver: IElementDriver): Promise<boolean> {
    // Implement custom check logic
    const actualText = await driver.getText() // Assuming this method exists
    return actualText.includes(this.expectedText)
  }
}
```

## Element Selectors

Selectors define how to find elements in the UI.

### Unified Selector Format

The `ElementSelector` type supports multiple selector strategies:

```typescript
type ElementSelector = {
  testId?: string      // Test identifier (preferred)
  id?: string          // Element ID
  xpath?: string       // XPath expression
  text?: string        // Visible text content
  accessibility?: string // Accessibility identifier
  className?: string   // CSS class name
}
```

### Framework Compatibility

| Selector Type | Detox | Appium | Playwright | Cypress |
|---------------|-------|--------|------------|---------|
| testId        | ✅     | ⚠️     | ✅          | ✅       |
| id            | ⚠️     | ✅     | ✅          | ✅       |
| xpath         | ❌     | ✅     | ✅          | ✅       |
| text          | ✅     | ✅     | ✅          | ✅       |
| accessibility | ✅     | ✅     | ✅          | ✅       |
| className     | ❌     | ✅     | ✅          | ✅       |

### Best Practices

1. **Prefer testId**: Most reliable across frameworks
2. **Use accessibility**: Good for cross-platform compatibility
3. **Avoid text**: Can change and break tests
4. **XPath as last resort**: Brittle and framework-dependent

## Wait Options

Customize wait behavior with `WaitOptions`:

```typescript
interface WaitOptions {
  timeout?: number    // Maximum wait time in milliseconds (default: 5000)
  interval?: number   // Check interval in milliseconds (default: 100)
}
```

### Usage Examples

```typescript
// Custom timeout
await element.wait().forVisible({ timeout: 15000 }).execute()

// Custom interval (check more frequently)
await element.wait().forEnabled({ interval: 50 }).execute()

// Both options
await element.wait().forExists({ 
  timeout: 10000, 
  interval: 200 
}).execute()
```

### Default Behavior

- **Default timeout**: 5000ms (5 seconds)
- **Default interval**: 100ms
- **Timeout behavior**: Returns `false` (does not throw)

## Error Handling

E2E Wrapper uses different strategies for different types of errors:

### Wait Timeouts
```typescript
const result = await element.wait().forVisible().execute()
if (!result) {
  console.log('Element did not become visible within timeout')
}
```

### Framework Errors
```typescript
try {
  await element.wait().forVisible().execute()
} catch (error) {
  console.error('Framework-specific error:', error)
}
```

### Best Practices
1. Always check return values from `execute()`
2. Use try-catch for framework-specific operations
3. Implement retries for flaky tests
4. Log useful debugging information

## Type Safety

E2E Wrapper is built with TypeScript and provides full type safety:

### Generic Type Parameters
```typescript
// Type-safe access to framework-specific methods
const detoxWrapper: E2EWrapper<DetoxElementDriver> = createDetoxWrapper({...})
const appiumWrapper: E2EWrapper<AppiumElementDriver> = createAppiumWrapper({...})

// TypeScript ensures correct method calls
await detoxWrapper.getDriver().tap()    // ✅ Detox method
await appiumWrapper.getDriver().click() // ✅ Appium method
```

### Interface Benefits
- **IntelliSense**: Auto-completion in IDEs
- **Compile-time checks**: Catch errors before runtime
- **Refactoring safety**: Rename operations across codebase
- **Documentation**: Types serve as documentation

## Framework Detection

E2E Wrapper can detect which framework is being used:

```typescript
import { TestFramework } from 'e2e-wrapper'

const wrapper = createDetoxWrapper({ testId: 'button' })
const framework = wrapper.getFramework()

switch (framework) {
  case TestFramework.DETOX:
    // Detox-specific optimizations
    break
  case TestFramework.APPIUM:
    // Appium-specific handling
    break
  case TestFramework.CUSTOM:
    // Custom driver handling
    break
}
```

This enables framework-specific optimizations while maintaining the unified interface. 