# ScrollBuilder API

The `ScrollBuilder` class implements the builder pattern for scrolling to elements. It's returned by the `scrollTo()` method of `E2EWrapper` and provides a fluent interface for configuring scroll behavior.

## Interface

```typescript
interface IScrollBuilder {
  withDirection(direction: ScrollDirection): IScrollBuilder
  withTimeout(timeout: number): IScrollBuilder
  withInterval(interval: number): IScrollBuilder
  withScrollAmount(amount: number): IScrollBuilder
  withVisibilityThreshold(threshold: number): IScrollBuilder
  withCenterInViewport(center: boolean): IScrollBuilder
  withMarginFromEdge(margin: number): IScrollBuilder
  withContainer(containerSelector: ElementSelector): IScrollBuilder
  execute(): Promise<IE2EWrapper>
}
```

## Methods

### `withDirection()`

```typescript
withDirection(direction: ScrollDirection): IScrollBuilder
```

Sets the scroll direction.

**Parameters:**
- `direction`: Direction to scroll (`ScrollDirection.UP`, `ScrollDirection.DOWN`, `ScrollDirection.LEFT`, `ScrollDirection.RIGHT`)

**Returns:** `IScrollBuilder` for method chaining

**Example:**
```typescript
await wrapper
  .scrollTo()
  .withDirection(ScrollDirection.DOWN)
  .execute()
```

### `withTimeout()`

```typescript
withTimeout(timeout: number): IScrollBuilder
```

Sets the maximum time to spend scrolling before giving up.

**Parameters:**
- `timeout`: Timeout in milliseconds (default: 10000)

**Returns:** `IScrollBuilder` for method chaining

**Example:**
```typescript
await wrapper
  .scrollTo()
  .withTimeout(15000) // 15 seconds
  .execute()
```

### `withInterval()`

```typescript
withInterval(interval: number): IScrollBuilder
```

Sets the interval between scroll attempts.

**Parameters:**
- `interval`: Interval in milliseconds (default: 500)

**Returns:** `IScrollBuilder` for method chaining

**Example:**
```typescript
await wrapper
  .scrollTo()
  .withInterval(300) // Check every 300ms
  .execute()
```

### `withScrollAmount()`

```typescript
withScrollAmount(amount: number): IScrollBuilder
```

Sets the amount to scroll on each attempt as a percentage of screen height/width.

**Parameters:**
- `amount`: Scroll amount as decimal (0.0 to 1.0). Default: 0.3 (30% of screen)

**Returns:** `IScrollBuilder` for method chaining

**Example:**
```typescript
await wrapper
  .scrollTo()
  .withScrollAmount(0.5) // Scroll 50% of screen
  .execute()
```

### `withVisibilityThreshold()`

```typescript
withVisibilityThreshold(threshold: number): IScrollBuilder
```

Sets the minimum visibility percentage required for the element to be considered found.

**Parameters:**
- `threshold`: Visibility threshold as decimal (0.0 to 1.0). Default: 0 (basic visibility)

**Returns:** `IScrollBuilder` for method chaining

**Example:**
```typescript
await wrapper
  .scrollTo()
  .withVisibilityThreshold(0.8) // Element must be 80% visible
  .execute()
```

### `withCenterInViewport()`

```typescript
withCenterInViewport(center: boolean): IScrollBuilder
```

Sets whether to center the element in the viewport after finding it.

**Parameters:**
- `center`: Whether to center the element (default: false)

**Returns:** `IScrollBuilder` for method chaining

**Example:**
```typescript
await wrapper
  .scrollTo()
  .withCenterInViewport(true)
  .execute()
```

### `withMarginFromEdge()`

```typescript
withMarginFromEdge(margin: number): IScrollBuilder
```

Sets the margin from screen edges when centering elements.

**Parameters:**
- `margin`: Margin in pixels (default: 50)

**Returns:** `IScrollBuilder` for method chaining

**Example:**
```typescript
await wrapper
  .scrollTo()
  .withCenterInViewport(true)
  .withMarginFromEdge(100)
  .execute()
```

### `withContainer()`

```typescript
withContainer(containerSelector: ElementSelector): IScrollBuilder
```

Sets the scrollable container element. If not specified, scrolls the entire screen.

**Parameters:**
- `containerSelector`: Element selector for the scrollable container

**Returns:** `IScrollBuilder` for method chaining

**Example:**
```typescript
await wrapper
  .scrollTo()
  .withContainer({ testId: 'scrollable-list' })
  .execute()
```

### `execute()`

```typescript
execute(): Promise<IE2EWrapper>
```

Executes the scroll operation with the configured options.

**Returns:** Promise resolving to the wrapper instance for method chaining

**Throws:** Error if element is not found within the timeout period

**Example:**
```typescript
const wrapper = await submitButton
  .scrollTo()
  .withDirection(ScrollDirection.DOWN)
  .withTimeout(10000)
  .execute()

// Can now use the wrapper for further operations
await wrapper.tap()
```

## Usage Patterns

### Basic Scrolling

```typescript
// Simple scroll down to find element
await wrapper
  .scrollTo()
  .execute()
```

### Scroll with Custom Direction

```typescript
// Scroll up to find element
await wrapper
  .scrollTo()
  .withDirection(ScrollDirection.UP)
  .execute()
```

### Scroll with Visibility Requirements

```typescript
// Require element to be 75% visible
await wrapper
  .scrollTo()
  .withVisibilityThreshold(0.75)
  .execute()
```

### Scroll within Container

```typescript
// Scroll within a specific scrollable container
await wrapper
  .scrollTo()
  .withContainer({ testId: 'product-list' })
  .execute()
```

### Scroll with Centering

```typescript
// Find element and center it in viewport
await wrapper
  .scrollTo()
  .withCenterInViewport(true)
  .withMarginFromEdge(80)
  .execute()
```

### Complex Scroll Configuration

```typescript
// Full configuration example
await wrapper
  .scrollTo()
  .withDirection(ScrollDirection.DOWN)
  .withTimeout(15000)
  .withInterval(300)
  .withScrollAmount(0.4)
  .withVisibilityThreshold(0.8)
  .withCenterInViewport(true)
  .withMarginFromEdge(100)
  .withContainer({ testId: 'main-content' })
  .execute()
```

## Scroll Behavior

### End-of-Scroll Detection

The ScrollBuilder automatically detects when it reaches the end of scrollable content:

- If scrolling fails due to reaching content boundaries, it falls back to basic visibility checking
- If the element is at least basically visible, it accepts the current position
- If the element is not visible and cannot scroll further, it throws an error

### Adaptive Visibility

When using visibility thresholds:

- First attempts to find element with the specified threshold
- If timeout occurs, reduces threshold and tries again
- Falls back to basic visibility if needed

### Smart Scrolling

The ScrollBuilder implements several optimizations:

- Calculates scroll distance as percentage of screen size
- Prevents infinite scrolling with end-of-content detection
- Handles scroll errors gracefully
- Provides detailed error messages for debugging

## Configuration Options

### Default Values

```typescript
const defaultOptions: ScrollOptions = {
  direction: ScrollDirection.DOWN,
  timeout: 10000,           // 10 seconds
  interval: 500,            // 500ms between attempts
  scrollAmount: 0.3,        // 30% of screen
  visibilityThreshold: 0,   // Basic visibility
  centerInViewport: false,
  marginFromEdge: 50,       // 50px margin
  useBasicVisibility: false
}
```

### ScrollDirection Enum

```typescript
enum ScrollDirection {
  UP = 'up',
  DOWN = 'down',
  LEFT = 'left',
  RIGHT = 'right'
}
```

## Error Handling

### Timeout Errors

If the element is not found within the timeout period:

```typescript
try {
  await wrapper.scrollTo().execute()
} catch (error) {
  console.error('Scroll timeout:', error.message)
}
```

### Scroll Errors

If scrolling fails due to framework issues:

```typescript
try {
  await wrapper.scrollTo().execute()
} catch (error) {
  if (error.message.includes('scroll')) {
    console.error('Scroll operation failed:', error.message)
  }
}
```

## Advanced Usage

### Conditional Scrolling

```typescript
// Only scroll if element is not already visible
const isVisible = await wrapper.isVisible()
if (!isVisible) {
  await wrapper.scrollTo().execute()
}
```

### Reusable Scroll Patterns

```typescript
const createDownScroll = (timeout: number) => (wrapper: IE2EWrapper) =>
  wrapper.scrollTo()
    .withDirection(ScrollDirection.DOWN)
    .withTimeout(timeout)
    .withVisibilityThreshold(0.8)

// Use across multiple elements
await createDownScroll(10000)(submitButton).execute()
await createDownScroll(5000)(cancelButton).execute()
```

### Scroll and Interact Pattern

```typescript
// Scroll to element and immediately interact
const element = await wrapper
  .scrollTo()
  .withCenterInViewport(true)
  .execute()

await element.tap()
```

## Framework Support

### Detox

- Supports all scroll directions
- Implements percentage-based scrolling
- Handles substantial visibility checking
- Provides accurate end-of-scroll detection

### Future Frameworks

The ScrollBuilder is designed to work with any framework that implements the required scroll methods in the element driver. 