# E2EWrapper API

The `E2EWrapper` class is the main entry point for interacting with elements through the framework-agnostic interface.

## Constructor

```typescript
new E2EWrapper<T extends IElementDriver>(driver: T)
```

Creates a new E2EWrapper instance with the specified driver.

**Parameters:**
- `driver`: An implementation of `IElementDriver` (e.g., `DetoxElementDriver`, `AppiumElementDriver`)

## Factory Methods

### `E2EWrapper.withDetox()`

```typescript
static withDetox(selector: ElementSelector): E2EWrapper<DetoxElementDriver>
```

Creates an E2EWrapper instance with a Detox driver.

**Parameters:**
- `selector`: Element selector object

**Example:**
```typescript
const button = E2EWrapper.withDetox({ testId: 'login-button' })
```

### `E2EWrapper.withAppium()`

```typescript
static withAppium(selector: ElementSelector, driver: any): E2EWrapper<AppiumElementDriver>
```

Creates an E2EWrapper instance with an Appium driver.

**Parameters:**
- `selector`: Element selector object
- `driver`: Appium WebDriver instance

**Example:**
```typescript
const button = E2EWrapper.withAppium(
  { xpath: '//button[@text="Login"]' },
  webDriver
)
```

### `E2EWrapper.withCustomDriver()`

```typescript
static withCustomDriver<T extends IElementDriver>(driver: T): E2EWrapper<T>
```

Creates an E2EWrapper instance with a custom driver implementation.

**Parameters:**
- `driver`: Custom driver implementing `IElementDriver`

**Example:**
```typescript
const customDriver = new MyCustomDriver(selector)
const wrapper = E2EWrapper.withCustomDriver(customDriver)
```

## Instance Methods

### `wait()`

```typescript
wait(): IWaitBuilder
```

Returns a wait builder for chaining wait conditions.

**Returns:** `IWaitBuilder` instance for method chaining

**Example:**
```typescript
await wrapper
  .wait()
  .forVisible()
  .forEnabled()
  .execute()
```

### `isVisible()`

```typescript
async isVisible(): Promise<boolean>
```

Checks if the element is currently visible.

**Returns:** Promise resolving to `true` if visible, `false` otherwise

**Example:**
```typescript
const visible = await wrapper.isVisible()
if (visible) {
  console.log('Element is visible')
}
```

### `isEnabled()`

```typescript
async isEnabled(): Promise<boolean>
```

Checks if the element is currently enabled/interactable.

**Returns:** Promise resolving to `true` if enabled, `false` otherwise

**Example:**
```typescript
const enabled = await wrapper.isEnabled()
if (enabled) {
  console.log('Element is enabled')
}
```

### `exists()`

```typescript
async exists(): Promise<boolean>
```

Checks if the element exists in the DOM/view hierarchy.

**Returns:** Promise resolving to `true` if exists, `false` otherwise

**Example:**
```typescript
const exists = await wrapper.exists()
if (!exists) {
  console.log('Element not found')
}
```

### `getDriver()`

```typescript
getDriver(): T
```

Returns the underlying driver instance for framework-specific operations.

**Returns:** The driver instance

**Example:**
```typescript
const driver = wrapper.getDriver()
// Use framework-specific methods
await driver.tap() // Detox
await driver.click() // Appium
```

### `getFramework()`

```typescript
getFramework(): TestFramework
```

Returns the framework type being used.

**Returns:** `TestFramework` enum value

**Example:**
```typescript
const framework = wrapper.getFramework()
if (framework === TestFramework.DETOX) {
  console.log('Using Detox framework')
}
```

## Convenience Functions

### `createDetoxWrapper()`

```typescript
function createDetoxWrapper(selector: ElementSelector): E2EWrapper<DetoxElementDriver>
```

Convenience function equivalent to `E2EWrapper.withDetox()`.

### `createAppiumWrapper()`

```typescript
function createAppiumWrapper(selector: ElementSelector, driver: any): E2EWrapper<AppiumElementDriver>
```

Convenience function equivalent to `E2EWrapper.withAppium()`.

## Type Parameters

The `E2EWrapper` class is generic and takes a type parameter `T` that extends `IElementDriver`. This ensures type safety when accessing driver-specific methods through `getDriver()`.

```typescript
// Type-safe access to Detox-specific methods
const detoxWrapper: E2EWrapper<DetoxElementDriver> = createDetoxWrapper({...})
await detoxWrapper.getDriver().tap() // ✓ TypeScript knows this is DetoxElementDriver

// Type-safe access to Appium-specific methods  
const appiumWrapper: E2EWrapper<AppiumElementDriver> = createAppiumWrapper({...}, driver)
await appiumWrapper.getDriver().click() // ✓ TypeScript knows this is AppiumElementDriver
``` 