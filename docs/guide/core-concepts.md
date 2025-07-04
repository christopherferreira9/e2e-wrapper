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

## Wait Builder Pattern

The library uses a fluent builder pattern for waiting conditions. This allows you to chain multiple conditions together:

```typescript
await wrapper
  .wait()
  .forVisible()
  .forEnabled()
  .execute();
```

## Basic Wait Conditions

### Standard Conditions

- `forVisible()` - Wait for element to be visible
- `forEnabled()` - Wait for element to be enabled 
- `forExists()` - Wait for element to exist

### Custom Conditions

The library provides powerful custom condition support that allows you to wait for specific element states that go beyond the basic visibility, enabled, and existence checks.

#### Built-in Custom Conditions

##### Wait for Class Name
Wait for an element to have a specific CSS class:

```typescript
await wrapper
  .wait()
  .forCustom({ hasClassName: 'active' })
  .execute();
```

This checks if the element's `class` attribute contains the specified class name.

##### Wait for Attribute
Wait for an element to have a specific attribute, with optional value checking:

```typescript
// Wait for attribute to exist (any value)
await wrapper
  .wait()
  .forCustom({ hasAttribute: { name: 'disabled' } })
  .execute();

// Wait for attribute to have specific value
await wrapper
  .wait()
  .forCustom({ hasAttribute: { name: 'data-status', value: 'active' } })
  .execute();
```

##### Wait for Text Content
Wait for an element to contain specific text:

```typescript
await wrapper
  .wait()
  .forCustom({ hasText: 'Click me' })
  .execute();
```

This checks if the element's text content contains the specified string.

##### Wait for Property
Wait for an element to have a specific property with a given value:

```typescript
await wrapper
  .wait()
  .forCustom({ hasProperty: { name: 'checked', value: true } })
  .execute();
```

This is useful for checking form element states like checkbox checked status.

#### Custom Predicate Functions

For maximum flexibility, you can provide your own custom predicate function:

```typescript
await wrapper
  .wait()
  .forCustom({ 
    custom: async (element, driver) => {
      // Custom logic using the element and driver
      const count = await driver.getAttribute(selector, 'data-count');
      return parseInt(count || '0') > 5;
    }
  })
  .execute();
```

The predicate function receives:
- `element`: The actual DOM/native element
- `driver`: The element driver instance for additional operations

#### Chaining Custom Conditions

Custom conditions can be chained with standard conditions:

```typescript
await wrapper
  .wait()
  .forVisible()
  .forCustom({ hasClassName: 'loaded' })
  .forEnabled()
  .forCustom({ hasAttribute: { name: 'data-ready', value: 'true' } })
  .execute();
```

#### Real-world Examples

##### Wait for Loading State
```typescript
// Wait for loading spinner to disappear
await wrapper
  .wait()
  .forCustom({ hasClassName: 'loading' })
  .execute();

// Then wait for content to be ready
await wrapper
  .wait()
  .forCustom({ hasAttribute: { name: 'data-loaded', value: 'true' } })
  .execute();
```

##### Wait for Form Validation
```typescript
// Wait for form field to be valid
await wrapper
  .wait()
  .forCustom({ hasClassName: 'valid' })
  .forCustom({ hasAttribute: { name: 'aria-invalid', value: 'false' } })
  .execute();
```

##### Wait for Dynamic Content
```typescript
// Wait for element to contain specific text after API call
await wrapper
  .wait()
  .forCustom({ hasText: 'Data loaded successfully' })
  .execute();
```

##### Complex Custom Conditions
```typescript
// Wait for element to have multiple classes and specific data attribute
await wrapper
  .wait()
  .forCustom({
    custom: async (element, driver) => {
      const classes = await driver.getAttribute(selector, 'class');
      const status = await driver.getAttribute(selector, 'data-status');
      
      return classes?.includes('active') && 
             classes?.includes('ready') && 
             status === 'completed';
    }
  })
  .execute();
```

#### Error Handling

Custom conditions include built-in error handling:

- If the element doesn't exist, the condition will fail
- If attribute/property access fails, the condition will fail gracefully
- Network timeouts and other errors are handled automatically

#### Configuration

Custom conditions support the same timeout and retry options as standard conditions:

```typescript
await wrapper
  .wait()
  .forCustom(
    { hasClassName: 'loaded' },
    { timeout: 10000, interval: 500 }
  )
  .execute();
```

## Element Selectors

The library supports various selector types:

- `id` - Element ID
- `testId` - Test ID (data-testid)
- `text` - Text content
- `xpath` - XPath expression
- `className` - CSS class name
- `accessibility` - Accessibility label
- `custom` - Custom selector object

## Framework Support

The library abstracts the underlying testing framework, supporting:

- **Detox** - React Native testing
- **Appium** - Mobile app testing
- **Future**: Playwright, Cypress, and other frameworks

## Configuration Options

### Wait Options

```typescript
interface WaitOptions {
  timeout?: number;    // Maximum wait time (default: 5000ms)
  interval?: number;   // Polling interval (default: 100ms)
  retries?: number;    // Number of retries (default: 3)
}
```

### Usage Examples

```typescript
// Quick timeout
await wrapper.wait().forVisible({ timeout: 2000 }).execute();

// Slower polling
await wrapper.wait().forEnabled({ interval: 500 }).execute();

// More retries
await wrapper.wait().forExists({ retries: 5 }).execute();
``` 