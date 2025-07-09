# WaitBuilder API

The `WaitBuilder` class implements the builder pattern for chaining wait conditions. It's returned by the `wait()` method of `E2EWrapper` and allows you to compose multiple wait conditions before execution.

## Interface

```typescript
interface IWaitBuilder {
  forVisible(options?: WaitOptions): IWaitBuilder
  forNotVisible(options?: WaitOptions): IWaitBuilder
  forEnabled(options?: WaitOptions): IWaitBuilder  
  forExists(options?: WaitOptions): IWaitBuilder
  forCustom(conditionOptions: CustomConditionOptions, options?: WaitOptions): IWaitBuilder
  execute(): Promise<IE2EWrapper>
  getConditionDescriptions(): string[]
  clearConditions(): IWaitBuilder
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

### `forNotVisible()`

```typescript
forNotVisible(options?: WaitOptions): IWaitBuilder
```

Adds a not-visible condition to the wait chain. Waits for the element to become hidden or disappear.

**Parameters:**
- `options`: Optional wait configuration

**Returns:** `IWaitBuilder` for method chaining

**Example:**
```typescript
await wrapper
  .wait()
  .forNotVisible({ timeout: 5000 })
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

### `forCustom()`

```typescript
forCustom(conditionOptions: CustomConditionOptions, options?: WaitOptions): IWaitBuilder
```

Adds a custom condition to the wait chain using a user-defined check function.

**Parameters:**
- `conditionOptions`: Custom condition configuration object
- `options`: Optional wait configuration

**Returns:** `IWaitBuilder` for method chaining

**Example:**
```typescript
await wrapper
  .wait()
  .forCustom({
    checkFunction: async (element) => {
      const text = await element.getText()
      return text.includes('Success')
    },
    description: 'text contains Success'
  })
  .execute()
```

### `execute()`

```typescript
execute(): Promise<IE2EWrapper>
```

Executes all chained wait conditions in the order they were added.

**Returns:** Promise resolving to the wrapper instance for method chaining

**Throws:** Error if any condition times out or fails

**Example:**
```typescript
const wrapper = await button
  .wait()
  .forVisible()
  .forEnabled()
  .execute()

// Can now use the wrapper for further operations
await wrapper.tap()
```

### `getConditionDescriptions()`

```typescript
getConditionDescriptions(): string[]
```

Returns descriptions of all conditions for debugging purposes.

**Returns:** Array of condition description strings

**Example:**
```typescript
const builder = wrapper.wait().forVisible().forEnabled()
const descriptions = builder.getConditionDescriptions()
console.log('Waiting for:', descriptions)
// Output: ['element to be visible', 'element to be enabled']
```

### `clearConditions()`

```typescript
clearConditions(): IWaitBuilder
```

Clears all conditions from the builder, useful for reusing the builder.

**Returns:** `IWaitBuilder` for method chaining

**Example:**
```typescript
const builder = wrapper.wait().forVisible().forEnabled()
builder.clearConditions() // Remove all conditions
builder.forExists() // Add new condition
await builder.execute()
```

## Usage Patterns

### Single Condition

```typescript
// Wait for element to be visible
const elementWrapper = await wrapper
  .wait()
  .forVisible()
  .execute()
```

### Multiple Conditions (Ordered)

```typescript
// Wait for element to exist, then be visible, then be enabled
const elementWrapper = await wrapper
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

### Custom Conditions

Create complex wait conditions with custom logic:

```typescript
await wrapper
  .wait()
  .forCustom({
    checkFunction: async (element) => {
      // Complex validation logic
      const attributes = await element.getElement().then(el => el.getAttributes())
      return attributes.enabled && 
             attributes.visible && 
             attributes.text !== 'Loading...'
    },
    description: 'element is ready for interaction'
  }, { timeout: 15000 })
  .execute()
```

### Waiting for Element to Disappear

```typescript
// Wait for loading spinner to disappear
const loadingSpinner = E2EWrapper.withDetox({ testId: 'loading-spinner' })
await loadingSpinner
  .wait()
  .forNotVisible({ timeout: 10000 })
  .execute()
```

## Execution Behavior

### Sequential Processing

Conditions are checked sequentially in the order they were added:

1. First condition is checked repeatedly until satisfied or timeout
2. Second condition is checked repeatedly until satisfied or timeout
3. Continue for all conditions
4. Return wrapper instance if all conditions pass

### Early Termination

If any condition times out, execution stops immediately and throws an error:

```typescript
try {
  const result = await wrapper
    .wait()
    .forExists({ timeout: 1000 })     // If this times out...
    .forVisible({ timeout: 5000 })    // ...this won't be checked
    .execute()
} catch (error) {
  console.error('Wait condition failed:', error.message)
}
```

### Error Handling

The builder handles two types of issues:

#### Timeouts (Throws Error)
When a condition times out, an error is thrown with details about which condition failed.

#### Framework Errors (Throws Error)
If the underlying framework throws an error during condition checking, it's propagated up to the caller.

## Advanced Usage

### Conditional Waiting

```typescript
// Only wait for enabled if element is visible
const isVisible = await wrapper.isVisible()
const builder = wrapper.wait().forExists()

if (isVisible) {
  builder.forEnabled()
}

await builder.execute()
```

### Reusable Builders

```typescript
// Create a reusable wait pattern
const createReadyWait = (element: IE2EWrapper) => 
  element.wait().forExists().forVisible().forEnabled()

// Use it multiple times
await createReadyWait(submitButton).execute()
await createReadyWait(cancelButton).execute()
```

### Complex Custom Conditions

```typescript
await wrapper
  .wait()
  .forCustom({
    checkFunction: async (element) => {
      // Complex validation logic
      const attributes = await element.getElement().then(el => el.getAttributes())
      return attributes.enabled && 
             attributes.visible && 
             attributes.text !== 'Loading...'
    },
    description: 'element is ready for interaction'
  }, { timeout: 15000 })
  .execute()
``` 