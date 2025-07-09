# E2EWrapper API

The `E2EWrapper` class is the main entry point for interacting with elements through the framework-agnostic interface.

## Constructor

```typescript
new E2EWrapper(selector: ElementSelector, driver: IElementDriver)
```

Creates a new E2EWrapper instance with the specified selector and driver.

**Parameters:**
- `selector`: Element selector object defining how to find the element
- `driver`: An implementation of `IElementDriver` (e.g., `DetoxElementDriver`)

## Factory Methods

### `E2EWrapper.withDetox()`

```typescript
static withDetox(selector: ElementSelector, detoxElement?: any): E2EWrapper
```

Creates an E2EWrapper instance with a Detox driver.

**Parameters:**
- `selector`: Element selector object
- `detoxElement`: Optional pre-built Detox element instance

**Example:**
```typescript
const button = E2EWrapper.withDetox({ testId: 'login-button' })
```

### `E2EWrapper.withCustomDriver()`

```typescript
static withCustomDriver(selector: ElementSelector, driver: IElementDriver): E2EWrapper
```

Creates an E2EWrapper instance with a custom driver implementation.

**Parameters:**
- `selector`: Element selector object
- `driver`: Custom driver implementing `IElementDriver`

**Example:**
```typescript
const customDriver = new MyCustomDriver()
const wrapper = E2EWrapper.withCustomDriver(selector, customDriver)
```

## Builder Methods

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

### `scrollTo()`

```typescript
scrollTo(options?: ScrollOptions): IScrollBuilder
```

Returns a scroll builder for scrolling to this element.

**Parameters:**
- `options`: Optional scroll configuration

**Returns:** `IScrollBuilder` instance for method chaining

**Example:**
```typescript
await wrapper
  .scrollTo({ direction: ScrollDirection.DOWN, timeout: 10000 })
  .execute()
```

## Direct Element Operations (Proxy Methods)

### `getText()`

```typescript
async getText(options?: WaitOptions): Promise<string>
```

Gets the text content of the element.

**Parameters:**
- `options`: Optional wait configuration

**Returns:** Promise resolving to the element's text content

**Example:**
```typescript
const text = await wrapper.getText()
console.log('Element text:', text)
```

### `getAttribute()`

```typescript
async getAttribute(attributeName: string, options?: WaitOptions): Promise<string | null>
```

Gets the value of a specific attribute.

**Parameters:**
- `attributeName`: Name of the attribute to retrieve
- `options`: Optional wait configuration

**Returns:** Promise resolving to the attribute value or `null` if not found

**Example:**
```typescript
const value = await wrapper.getAttribute('value')
console.log('Input value:', value)
```

### `getProperty()`

```typescript
async getProperty(propertyName: string, options?: WaitOptions): Promise<any>
```

Gets the value of a specific property.

**Parameters:**
- `propertyName`: Name of the property to retrieve
- `options`: Optional wait configuration

**Returns:** Promise resolving to the property value

**Example:**
```typescript
const enabled = await wrapper.getProperty('enabled')
console.log('Element enabled:', enabled)
```

### `getElement()`

```typescript
async getElement(options?: WaitOptions): Promise<any>
```

Gets the underlying framework element.

**Parameters:**
- `options`: Optional wait configuration

**Returns:** Promise resolving to the framework-specific element

**Example:**
```typescript
const element = await wrapper.getElement()
// Use framework-specific methods on the element
```

## State Checking Methods

### `isVisible()`

```typescript
async isVisible(options?: WaitOptions): Promise<boolean>
```

Checks if the element is currently visible.

**Parameters:**
- `options`: Optional wait configuration

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
async isEnabled(options?: WaitOptions): Promise<boolean>
```

Checks if the element is currently enabled/interactable.

**Parameters:**
- `options`: Optional wait configuration

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
async exists(options?: WaitOptions): Promise<boolean>
```

Checks if the element exists in the DOM/view hierarchy.

**Parameters:**
- `options`: Optional wait configuration

**Returns:** Promise resolving to `true` if exists, `false` otherwise

**Example:**
```typescript
const exists = await wrapper.exists()
if (!exists) {
  console.log('Element not found')
}
```

## Interaction Methods

### `tap()`

```typescript
async tap(options?: WaitOptions): Promise<void>
```

Taps/clicks the element.

**Parameters:**
- `options`: Optional wait configuration

**Throws:** Error if tap method is not supported by the driver

**Example:**
```typescript
await wrapper.tap()
```

### `typeText()`

```typescript
async typeText(text: string, options?: WaitOptions): Promise<void>
```

Types text into the element. Automatically dismisses the keyboard unless disabled.

**Parameters:**
- `text`: Text to type
- `options`: Optional wait configuration. Set `dismissKeyboard: false` to prevent automatic keyboard dismissal

**Throws:** Error if typeText method is not supported by the driver

**Example:**
```typescript
await wrapper.typeText('Hello World')
await wrapper.typeText('Hello World', { dismissKeyboard: false })
```

### `clearText()`

```typescript
async clearText(options?: WaitOptions): Promise<void>
```

Clears the text content of the element.

**Parameters:**
- `options`: Optional wait configuration

**Throws:** Error if clearText method is not supported by the driver

**Example:**
```typescript
await wrapper.clearText()
```

### `dismissKeyboard()`

```typescript
async dismissKeyboard(): Promise<void>
```

Dismisses the on-screen keyboard.

**Throws:** Error if dismissKeyboard method is not supported by the driver

**Example:**
```typescript
await wrapper.dismissKeyboard()
```

## Legacy Access Methods

### `getDriver()`

```typescript
getDriver(): IElementDriver
```

Returns the underlying driver instance for framework-specific operations.

**Returns:** The driver instance

**Example:**
```typescript
const driver = wrapper.getDriver()
// Use framework-specific methods if needed
```

### `getSelector()`

```typescript
getSelector(): ElementSelector
```

Returns the current element selector.

**Returns:** The element selector object

**Example:**
```typescript
const selector = wrapper.getSelector()
console.log('Current selector:', selector)
```

### `withSelector()`

```typescript
withSelector(selector: ElementSelector): IE2EWrapper
```

Creates a new wrapper instance with a different selector but same driver.

**Parameters:**
- `selector`: New element selector

**Returns:** New wrapper instance

**Example:**
```typescript
const newWrapper = wrapper.withSelector({ testId: 'different-element' })
```

## Convenience Functions

### `createDetoxWrapper()`

```typescript
function createDetoxWrapper(selector: ElementSelector, detoxElement?: any): E2EWrapper
```

Convenience function equivalent to `E2EWrapper.withDetox()`.

**Parameters:**
- `selector`: Element selector object
- `detoxElement`: Optional pre-built Detox element instance

**Example:**
```typescript
const wrapper = createDetoxWrapper({ testId: 'my-button' })
```

## Usage Examples

### Basic Element Interaction

```typescript
const loginButton = E2EWrapper.withDetox({ testId: 'login-button' })

// Check if button exists and is visible
if (await loginButton.exists() && await loginButton.isVisible()) {
  await loginButton.tap()
}
```

### Text Input with Automatic Keyboard Dismissal

```typescript
const emailInput = E2EWrapper.withDetox({ testId: 'email-input' })

await emailInput.typeText('user@example.com')
// Keyboard is automatically dismissed
```

### Scrolling to Element

```typescript
const submitButton = E2EWrapper.withDetox({ testId: 'submit-button' })

await submitButton
  .scrollTo({ direction: ScrollDirection.DOWN, timeout: 10000 })
  .execute()
```

### Complex Wait Conditions

```typescript
const dynamicElement = E2EWrapper.withDetox({ testId: 'dynamic-element' })

await dynamicElement
  .wait()
  .forExists({ timeout: 5000 })
  .forVisible({ timeout: 3000 })
  .forEnabled({ timeout: 2000 })
  .execute()
``` 