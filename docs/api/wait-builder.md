# WaitBuilder API

The `WaitBuilder` class implements the builder pattern for chaining wait conditions. It's returned by the `wait()` method of `E2EWrapper` and allows you to compose multiple wait conditions before execution.

## Interface

```typescript
interface IWaitBuilder {
  forVisible(options?: WaitOptions): IWaitBuilder
  forEnabled(options?: WaitOptions): IWaitBuilder  
  forExists(options?: WaitOptions): IWaitBuilder
  execute(): Promise<boolean>
}
```

## Methods

### `forVisible()`

```typescript
forVisible(options?: WaitOptions): IWaitBuilder
```

Adds a visibility condition to the wait chain.

**Parameters:**
- `options`: Optional wait configuration

**Returns:** `IWaitBuilder` for method chaining

**Example:**
```typescript
await wrapper
  .wait()
  .forVisible({ timeout: 10000 })
  .execute()
```

### `forEnabled()`

```typescript
forEnabled(options?: WaitOptions): IWaitBuilder
```

Adds an enabled/interactable condition to the wait chain.

**Parameters:**
- `options`: Optional wait configuration

**Returns:** `IWaitBuilder` for method chaining

**Example:**
```typescript
await wrapper
  .wait()
  .forEnabled({ timeout: 5000 })
  .execute()
```

### `forExists()`

```typescript
forExists(options?: WaitOptions): IWaitBuilder
```

Adds an existence condition to the wait chain.

**Parameters:**
- `options`: Optional wait configuration

**Returns:** `IWaitBuilder` for method chaining

**Example:**
```typescript
await wrapper
  .wait()
  .forExists({ timeout: 3000 })
  .execute()
```

### `execute()`

```typescript
execute(): Promise<boolean>
```

Executes all chained wait conditions in the order they were added.

**Returns:** Promise resolving to:
- `true` if all conditions are satisfied within their timeouts
- `false` if any condition times out

**Throws:** May throw framework-specific errors

**Example:**
```typescript
const success = await wrapper
  .wait()
  .forVisible()
  .forEnabled()
  .execute()

if (!success) {
  console.log('Wait conditions were not met')
}
```

## Usage Patterns

### Single Condition

```typescript
// Wait for element to be visible
const isVisible = await wrapper
  .wait()
  .forVisible()
  .execute()
```

### Multiple Conditions (Ordered)

```typescript
// Wait for element to exist, then be visible, then be enabled
const isReady = await wrapper
  .wait()
  .forExists()
  .forVisible()
  .forEnabled()
  .execute()
```

### Multiple Conditions (Any Order)

The beauty of the builder pattern is that conditions can be chained in any order:

```typescript
// All of these are equivalent
await wrapper.wait().forVisible().forEnabled().execute()
await wrapper.wait().forEnabled().forVisible().execute()
await wrapper.wait().forExists().forVisible().forEnabled().execute()
await wrapper.wait().forEnabled().forExists().forVisible().execute()
```

### Custom Timeouts

Each condition can have its own timeout:

```typescript
await wrapper
  .wait()
  .forExists({ timeout: 2000 })      // 2 seconds to exist
  .forVisible({ timeout: 5000 })     // 5 seconds to be visible
  .forEnabled({ timeout: 1000 })     // 1 second to be enabled
  .execute()
```

### Custom Intervals

Adjust how frequently conditions are checked:

```typescript
await wrapper
  .wait()
  .forVisible({ 
    timeout: 10000,  // 10 seconds total
    interval: 500    // Check every 500ms
  })
  .execute()
```

## Execution Behavior

### Sequential Processing

Conditions are checked sequentially in the order they were added:

1. First condition is checked repeatedly until satisfied or timeout
2. Second condition is checked repeatedly until satisfied or timeout
3. Continue for all conditions
4. Return `true` if all conditions pass, `false` if any timeout

### Early Termination

If any condition times out, execution stops immediately and returns `false`:

```typescript
const result = await wrapper
  .wait()
  .forExists({ timeout: 1000 })     // If this times out...
  .forVisible({ timeout: 5000 })    // ...this won't be checked
  .execute()

// result will be false if forExists() times out
```

### Error Handling

The builder handles two types of issues:

#### Timeouts (Normal)
```typescript
const success = await wrapper.wait().forVisible().execute()
if (!success) {
  // Handle timeout - this is expected behavior
  console.log('Element did not become visible in time')
}
```

#### Framework Errors (Exceptions)
```typescript
try {
  await wrapper.wait().forVisible().execute()
} catch (error) {
  // Handle framework-specific errors
  console.error('Framework error:', error.message)
}
```

## Advanced Usage

### Conditional Chaining

Build conditions dynamically:

```typescript
let builder = wrapper.wait().forExists()

if (needsVisibility) {
  builder = builder.forVisible()
}

if (needsInteraction) {
  builder = builder.forEnabled()
}

const success = await builder.execute()
```

### Reusable Builders

Create reusable wait patterns:

```typescript
function createReadyBuilder(wrapper: E2EWrapper<any>) {
  return wrapper
    .wait()
    .forExists({ timeout: 2000 })
    .forVisible({ timeout: 5000 })
    .forEnabled({ timeout: 1000 })
}

// Use across multiple elements
const button1Ready = await createReadyBuilder(button1).execute()
const button2Ready = await createReadyBuilder(button2).execute()
```

### Framework-Specific Optimizations

```typescript
import { TestFramework } from 'e2e-wrapper'

const wrapper = createDetoxWrapper({ testId: 'button' })

if (wrapper.getFramework() === TestFramework.DETOX) {
  // Detox is generally fast, use shorter timeouts
  await wrapper
    .wait()
    .forVisible({ timeout: 3000 })
    .forEnabled({ timeout: 1000 })
    .execute()
} else {
  // Other frameworks might need longer timeouts
  await wrapper
    .wait()
    .forVisible({ timeout: 10000 })
    .forEnabled({ timeout: 5000 })
    .execute()
}
```

## Implementation Details

### Default Values

When no options are provided, the following defaults are used:

```typescript
const defaultOptions: WaitOptions = {
  timeout: 5000,   // 5 seconds
  interval: 100    // 100 milliseconds
}
```

### Memory Efficiency

The builder pattern is implemented efficiently:
- Conditions are stored as lightweight objects
- No unnecessary element queries until `execute()` is called
- Builder instances can be reused (though not recommended)

### Thread Safety

Each builder instance maintains its own state and is safe to use in concurrent scenarios, though individual framework drivers may have their own threading considerations. 