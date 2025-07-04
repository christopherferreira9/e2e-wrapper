# Custom Conditions Examples

This guide provides practical examples of using custom conditions in real-world testing scenarios.

## Table of Contents

1. [Basic Usage](#basic-usage)
2. [Form Testing](#form-testing)
3. [Loading States](#loading-states)
4. [Dynamic Content](#dynamic-content)
5. [Complex Validation](#complex-validation)
6. [Framework-Specific Examples](#framework-specific-examples)

## Basic Usage

### Wait for Element to Have CSS Class

```typescript
import { E2EWrapper } from 'e2e-wrapper';

const button = E2EWrapper.withDetox({ testId: 'submit-button' });

// Wait for button to have 'active' class
await button
  .wait()
  .forCustom({ hasClassName: 'active' })
  .execute();
```

### Wait for Element with Specific Attribute

```typescript
const form = E2EWrapper.withDetox({ testId: 'user-form' });

// Wait for form to have data-valid="true" attribute
await form
  .wait()
  .forCustom({ hasAttribute: { name: 'data-valid', value: 'true' } })
  .execute();
```

### Wait for Element to Contain Text

```typescript
const statusMessage = E2EWrapper.withDetox({ testId: 'status-message' });

// Wait for success message to appear
await statusMessage
  .wait()
  .forCustom({ hasText: 'Success' })
  .execute();
```

## Form Testing

### Complete Form Validation Flow

```typescript
import { E2EWrapper } from 'e2e-wrapper';

const emailInput = E2EWrapper.withDetox({ testId: 'email-input' });
const submitButton = E2EWrapper.withDetox({ testId: 'submit-button' });

// Type email and wait for validation
await emailInput.type('user@example.com');

// Wait for field to be marked as valid
await emailInput
  .wait()
  .forCustom({ hasClassName: 'valid' })
  .forCustom({ hasAttribute: { name: 'aria-invalid', value: 'false' } })
  .execute();

// Wait for submit button to be enabled
await submitButton
  .wait()
  .forEnabled()
  .forCustom({ hasAttribute: { name: 'disabled' } }) // Should NOT have disabled attribute
  .execute();
```

### Checkbox and Radio Button States

```typescript
const checkbox = E2EWrapper.withDetox({ testId: 'terms-checkbox' });
const submitButton = E2EWrapper.withDetox({ testId: 'submit-button' });

// Check the checkbox
await checkbox.tap();

// Wait for checkbox to be checked
await checkbox
  .wait()
  .forCustom({ hasProperty: { name: 'checked', value: true } })
  .execute();

// Wait for submit button to become available
await submitButton
  .wait()
  .forCustom({ hasClassName: 'enabled' })
  .execute();
```

## Loading States

### Wait for Loading to Complete

```typescript
const loadingSpinner = E2EWrapper.withDetox({ testId: 'loading-spinner' });
const content = E2EWrapper.withDetox({ testId: 'main-content' });

// Wait for spinner to disappear
await loadingSpinner
  .wait()
  .forCustom({ hasClassName: 'hidden' })
  .execute();

// Wait for content to be loaded
await content
  .wait()
  .forCustom({ hasAttribute: { name: 'data-loaded', value: 'true' } })
  .execute();
```

### Progressive Loading with Multiple States

```typescript
const dataList = E2EWrapper.withDetox({ testId: 'data-list' });

// Wait for initial load
await dataList
  .wait()
  .forCustom({ hasClassName: 'loading' })
  .execute();

// Wait for data to be fetched
await dataList
  .wait()
  .forCustom({ hasAttribute: { name: 'data-status', value: 'loaded' } })
  .execute();

// Wait for rendering to complete
await dataList
  .wait()
  .forCustom({ hasClassName: 'rendered' })
  .execute();
```

## Dynamic Content

### Wait for API Response Data

```typescript
const userProfile = E2EWrapper.withDetox({ testId: 'user-profile' });

// Wait for user data to load and display
await userProfile
  .wait()
  .forCustom({ hasText: 'John Doe' }) // Wait for name to appear
  .forCustom({ hasAttribute: { name: 'data-user-id' } }) // Wait for user ID attribute
  .execute();
```

### Wait for Count Updates

```typescript
const cartCounter = E2EWrapper.withDetox({ testId: 'cart-count' });

// Add item to cart
await addToCartButton.tap();

// Wait for cart count to update
await cartCounter
  .wait()
  .forCustom({ hasText: '1' })
  .execute();

// Add another item
await addToCartButton.tap();

// Wait for count to increment
await cartCounter
  .wait()
  .forCustom({ hasText: '2' })
  .execute();
```

## Complex Validation

### Custom Predicate for Complex Logic

```typescript
const complexElement = E2EWrapper.withDetox({ testId: 'complex-element' });

// Wait for element to meet multiple criteria
await complexElement
  .wait()
  .forCustom({
    custom: async (element, driver) => {
      // Check multiple conditions
      const classes = await driver.getAttribute(selector, 'class');
      const status = await driver.getAttribute(selector, 'data-status');
      const count = await driver.getAttribute(selector, 'data-count');
      
      return classes?.includes('active') && 
             classes?.includes('ready') && 
             status === 'completed' &&
             parseInt(count || '0') > 0;
    }
  })
  .execute();
```

### Multi-Step Form Validation

```typescript
const form = E2EWrapper.withDetox({ testId: 'multi-step-form' });

// Step 1: Personal info
await form
  .wait()
  .forCustom({ hasAttribute: { name: 'data-step', value: '1' } })
  .forCustom({ hasClassName: 'step-personal' })
  .execute();

// Fill personal info...
await nextButton.tap();

// Step 2: Address info
await form
  .wait()
  .forCustom({ hasAttribute: { name: 'data-step', value: '2' } })
  .forCustom({ hasClassName: 'step-address' })
  .execute();

// Fill address info...
await nextButton.tap();

// Step 3: Review
await form
  .wait()
  .forCustom({ hasAttribute: { name: 'data-step', value: '3' } })
  .forCustom({ hasClassName: 'step-review' })
  .forCustom({ hasText: 'Review your information' })
  .execute();
```

## Framework-Specific Examples

### Detox Examples

```typescript
// React Native specific attributes
const reactNativeButton = E2EWrapper.withDetox({ testId: 'rn-button' });

await reactNativeButton
  .wait()
  .forCustom({ hasAttribute: { name: 'accessibilityLabel', value: 'Submit' } })
  .forCustom({ hasAttribute: { name: 'accessibilityState' } })
  .execute();
```

### Appium Examples

```typescript
// Mobile app specific properties
const mobileElement = E2EWrapper.withAppium(driver, { id: 'mobile-element' });

await mobileElement
  .wait()
  .forCustom({ hasAttribute: { name: 'content-desc', value: 'Description' } })
  .forCustom({ hasProperty: { name: 'clickable', value: true } })
  .execute();
```

## Error Handling and Debugging

### Graceful Failure Handling

```typescript
const element = E2EWrapper.withDetox({ testId: 'flaky-element' });

try {
  await element
    .wait()
    .forCustom({ hasClassName: 'loaded' }, { timeout: 5000 })
    .execute();
  
  console.log('Element loaded successfully');
} catch (error) {
  console.log('Element failed to load:', error.message);
  // Handle fallback logic
}
```

### Debug with Condition Descriptions

```typescript
const element = E2EWrapper.withDetox({ testId: 'debug-element' });

const waitBuilder = element
  .wait()
  .forVisible()
  .forCustom({ hasClassName: 'ready' })
  .forCustom({ hasText: 'Complete' });

// Get descriptions for debugging
const descriptions = waitBuilder.getConditionDescriptions();
console.log('Waiting for conditions:', descriptions);
// Output: ['Wait for element to be visible', 'Wait for element to have class "ready"', 'Wait for element to contain text "Complete"']

const result = await waitBuilder.execute();
```

## Performance Considerations

### Efficient Condition Ordering

```typescript
// Order conditions from most to least likely to fail quickly
await element
  .wait()
  .forExists()        // Quick check - element exists
  .forVisible()       // Medium check - element visible
  .forCustom({ hasClassName: 'loaded' })  // Slower - attribute check
  .forCustom({        // Slowest - complex custom logic
    custom: async (element, driver) => {
      // Complex validation logic
    }
  })
  .execute();
```

### Using Appropriate Timeouts

```typescript
// Quick checks with short timeouts
await element
  .wait()
  .forCustom({ hasClassName: 'immediate' }, { timeout: 1000 })
  .execute();

// API-dependent checks with longer timeouts
await element
  .wait()
  .forCustom({ hasText: 'Data loaded' }, { timeout: 10000 })
  .execute();
```

## Best Practices

1. **Start Simple**: Begin with basic conditions and add complexity as needed
2. **Chain Logically**: Order conditions from most to least likely to pass
3. **Use Descriptive Names**: Make your test intentions clear
4. **Handle Failures**: Always consider what happens when conditions fail
5. **Test Edge Cases**: Include negative test cases
6. **Monitor Performance**: Use appropriate timeouts and intervals

## Common Patterns

### Modal Dialog Handling

```typescript
const modal = E2EWrapper.withDetox({ testId: 'modal-dialog' });

// Wait for modal to appear and be ready
await modal
  .wait()
  .forVisible()
  .forCustom({ hasClassName: 'modal-open' })
  .forCustom({ hasAttribute: { name: 'aria-modal', value: 'true' } })
  .execute();

// Interact with modal...

// Wait for modal to close
await modal
  .wait()
  .forCustom({ hasClassName: 'modal-closed' })
  .execute();
```

### Navigation State Changes

```typescript
const navItem = E2EWrapper.withDetox({ testId: 'nav-item' });

// Wait for navigation to complete
await navItem
  .wait()
  .forCustom({ hasClassName: 'active' })
  .forCustom({ hasAttribute: { name: 'aria-current', value: 'page' } })
  .execute();
```

These examples demonstrate the power and flexibility of custom conditions in real-world testing scenarios. They can be adapted to your specific application needs and testing framework. 