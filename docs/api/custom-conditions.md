# Custom Conditions API Reference

The custom conditions API provides flexible and extensible waiting mechanisms for complex element states.

## Overview

Custom conditions allow you to wait for specific element states beyond the basic visibility, enabled, and existence checks. They are designed to be chainable and work seamlessly with the existing wait builder pattern.

## API Methods

### forCustom()

```typescript
forCustom(conditionOptions: CustomConditionOptions, options?: WaitOptions): IWaitBuilder
```

Adds a custom condition to the wait builder chain.

**Parameters:**
- `conditionOptions`: Object defining the custom condition
- `options`: Optional wait configuration (timeout, interval, retries)

**Returns:** The wait builder instance for method chaining

## CustomConditionOptions

The `CustomConditionOptions` interface defines the available custom conditions:

```typescript
interface CustomConditionOptions {
  hasClassName?: string;
  hasAttribute?: { name: string; value?: string };
  hasText?: string;
  hasProperty?: { name: string; value: any };
  custom?: CustomConditionPredicate;
}
```

### hasClassName

Wait for an element to have a specific CSS class.

```typescript
await wrapper
  .wait()
  .forCustom({ hasClassName: 'active' })
  .execute();
```

**Implementation Details:**
- Retrieves the element's `class` attribute
- Splits the class string by whitespace
- Checks if the specified class name exists in the array

### hasAttribute

Wait for an element to have a specific attribute, optionally with a specific value.

```typescript
// Wait for attribute to exist (any value)
await wrapper
  .wait()
  .forCustom({ hasAttribute: { name: 'disabled' } })
  .execute();

// Wait for attribute with specific value
await wrapper
  .wait()
  .forCustom({ hasAttribute: { name: 'data-status', value: 'active' } })
  .execute();
```

**Parameters:**
- `name`: The attribute name to check
- `value`: Optional value to match (if omitted, only checks for attribute existence)

### hasText

Wait for an element to contain specific text content.

```typescript
await wrapper
  .wait()
  .forCustom({ hasText: 'Click me' })
  .execute();
```

**Implementation Details:**
- Retrieves the element's text content
- Performs a substring match (case-sensitive)
- Returns true if the text contains the specified string

### hasProperty

Wait for an element to have a specific property with a given value.

```typescript
await wrapper
  .wait()
  .forCustom({ hasProperty: { name: 'checked', value: true } })
  .execute();
```

**Parameters:**
- `name`: The property name to check
- `value`: The expected property value (strict equality check)

### custom

Wait for a custom predicate function to return true.

```typescript
await wrapper
  .wait()
  .forCustom({ 
    custom: async (element, driver) => {
      // Custom logic
      const count = await driver.getAttribute(selector, 'data-count');
      return parseInt(count || '0') > 5;
    }
  })
  .execute();
```

**Predicate Function Signature:**
```typescript
type CustomConditionPredicate = (element: any, driver: IElementDriver) => Promise<boolean>;
```

**Parameters:**
- `element`: The actual DOM/native element
- `driver`: The element driver instance for additional operations

## Driver Methods

Custom conditions rely on additional driver methods that provide access to element properties and attributes:

### getAttribute()

```typescript
getAttribute(selector: ElementSelector, attributeName: string, options?: WaitOptions): Promise<string | null>
```

Retrieves the value of a specific attribute from an element.

### getProperty()

```typescript
getProperty(selector: ElementSelector, propertyName: string, options?: WaitOptions): Promise<any>
```

Retrieves the value of a specific property from an element.

### getText()

```typescript
getText(selector: ElementSelector, options?: WaitOptions): Promise<string>
```

Retrieves the text content of an element.

### getElement()

```typescript
getElement(selector: ElementSelector, options?: WaitOptions): Promise<any>
```

Returns the actual element instance for use in custom predicates.

## Framework-Specific Implementations

### Detox

For Detox, custom conditions use the `getAttributes()` method:

```typescript
// getAttribute implementation
const attributes = await element.getAttributes();
return attributes[attributeName] || null;

// getText implementation  
const attributes = await element.getAttributes();
return attributes.text || attributes.label || '';
```

### Appium

For Appium, custom conditions use standard WebDriver methods:

```typescript
// getAttribute implementation
const element = await this.findElement(selector);
return await element.getAttribute(attributeName);

// getText implementation
const element = await this.findElement(selector);
return await element.getText();
```

## Error Handling

Custom conditions include robust error handling:

1. **Element Existence**: All conditions first check if the element exists
2. **Graceful Failures**: Attribute/property access failures return null/false
3. **Exception Handling**: Network timeouts and framework errors are caught
4. **Logging**: Failed conditions are logged with descriptive messages

## Examples

### Complex Chaining

```typescript
// Wait for element to be visible, have specific class, and contain text
await wrapper
  .wait()
  .forVisible()
  .forCustom({ hasClassName: 'loaded' })
  .forCustom({ hasText: 'Ready' })
  .forEnabled()
  .execute();
```

### Custom Predicate with Multiple Checks

```typescript
await wrapper
  .wait()
  .forCustom({
    custom: async (element, driver) => {
      // Multiple attribute checks
      const status = await driver.getAttribute(selector, 'data-status');
      const classes = await driver.getAttribute(selector, 'class');
      const text = await driver.getText(selector);
      
      return status === 'active' && 
             classes?.includes('ready') && 
             text.includes('Success');
    }
  })
  .execute();
```

### Form Validation

```typescript
// Wait for form field to be valid
await wrapper
  .wait()
  .forCustom({ hasAttribute: { name: 'aria-invalid', value: 'false' } })
  .forCustom({ hasClassName: 'valid' })
  .forCustom({ hasProperty: { name: 'validationMessage', value: '' } })
  .execute();
```

## Configuration

Custom conditions support all standard wait options:

```typescript
await wrapper
  .wait()
  .forCustom(
    { hasClassName: 'loaded' },
    { 
      timeout: 10000,   // 10 seconds
      interval: 500,    // Check every 500ms
      retries: 3        // 3 retry attempts
    }
  )
  .execute();
```

## Best Practices

1. **Element Existence**: Always ensure elements exist before checking attributes
2. **Error Handling**: Use try-catch blocks in custom predicates
3. **Performance**: Avoid complex DOM operations in custom predicates
4. **Readability**: Use descriptive condition names and comments
5. **Chaining**: Order conditions from most to least likely to fail quickly

## Migration Guide

### From Direct Framework APIs

```typescript
// Before (Detox)
await element(by.id('button')).waitFor().toHaveText('Click me');

// After (e2e-wrapper)
await wrapper
  .wait()
  .forCustom({ hasText: 'Click me' })
  .execute();
```

### From Custom Wait Functions

```typescript
// Before (Custom implementation)
const waitForClass = async (selector, className) => {
  // Custom polling logic
};

// After (e2e-wrapper)
await wrapper
  .wait()
  .forCustom({ hasClassName: className })
  .execute();
``` 