# Detox Examples

This page shows practical examples of using E2E Wrapper with Detox for React Native testing.

## Basic Setup

First, ensure you have Detox installed and configured:

```bash
npm install -D detox
```

## Simple Element Interaction

```typescript
import { createDetoxWrapper } from 'e2e-wrapper'

describe('Basic Interactions', () => {
  it('should interact with a button', async () => {
    const loginButton = createDetoxWrapper({ testId: 'login-button' })
    
    // Wait for element to be ready
    await loginButton
      .wait()
      .forVisible()
      .forEnabled()
      .execute()
    
    // Use Detox methods directly
    await loginButton.getDriver().tap()
  })
})
```

## Login Flow Example

```typescript
import { createDetoxWrapper } from 'e2e-wrapper'

describe('Login Flow', () => {
  beforeEach(async () => {
    await device.reloadReactNative()
  })

  it('should complete login flow', async () => {
    // Create wrappers for form elements
    const emailInput = createDetoxWrapper({ testId: 'email-input' })
    const passwordInput = createDetoxWrapper({ testId: 'password-input' })
    const loginButton = createDetoxWrapper({ testId: 'login-button' })
    const welcomeMessage = createDetoxWrapper({ testId: 'welcome-message' })

    // Wait for login form to be ready
    await emailInput.wait().forVisible().execute()
    await passwordInput.wait().forVisible().execute()
    
    // Fill in credentials
    await emailInput.getDriver().typeText('user@example.com')
    await passwordInput.getDriver().typeText('password123')
    
    // Submit form
    await loginButton
      .wait()
      .forVisible()
      .forEnabled()
      .execute()
    
    await loginButton.getDriver().tap()
    
    // Verify successful login
    await welcomeMessage
      .wait()
      .forVisible({ timeout: 10000 })
      .execute()
    
    const welcomeText = await welcomeMessage.getDriver().getText()
    expect(welcomeText).toContain('Welcome')
  })
})
```

## Form Validation Example

```typescript
import { createDetoxWrapper } from 'e2e-wrapper'

describe('Form Validation', () => {
  it('should show validation errors', async () => {
    const emailInput = createDetoxWrapper({ testId: 'email-input' })
    const submitButton = createDetoxWrapper({ testId: 'submit-button' })
    const errorMessage = createDetoxWrapper({ testId: 'email-error' })

    // Enter invalid email
    await emailInput.wait().forVisible().execute()
    await emailInput.getDriver().typeText('invalid-email')
    
    // Try to submit
    await submitButton.wait().forEnabled().execute()
    await submitButton.getDriver().tap()
    
    // Check for error message
    await errorMessage
      .wait()
      .forVisible({ timeout: 5000 })
      .execute()
    
    const errorText = await errorMessage.getDriver().getText()
    expect(errorText).toContain('Please enter a valid email')
  })
})
```

## List Item Interaction

```typescript
import { createDetoxWrapper } from 'e2e-wrapper'

describe('List Interactions', () => {
  it('should interact with list items', async () => {
    const todoList = createDetoxWrapper({ testId: 'todo-list' })
    const firstItem = createDetoxWrapper({ testId: 'todo-item-0' })
    const itemText = createDetoxWrapper({ testId: 'todo-text-0' })
    const completeButton = createDetoxWrapper({ testId: 'complete-button-0' })

    // Wait for list to load
    await todoList.wait().forVisible().execute()
    
    // Interact with first item
    await firstItem.wait().forVisible().execute()
    
    // Check item text
    const text = await itemText.getDriver().getText()
    expect(text).toBeTruthy()
    
    // Mark as complete
    await completeButton
      .wait()
      .forVisible()
      .forEnabled()
      .execute()
    
    await completeButton.getDriver().tap()
  })
})
```

## Navigation Testing

```typescript
import { createDetoxWrapper } from 'e2e-wrapper'

describe('Navigation', () => {
  it('should navigate between screens', async () => {
    const homeButton = createDetoxWrapper({ testId: 'home-tab' })
    const profileButton = createDetoxWrapper({ testId: 'profile-tab' })
    const profileScreen = createDetoxWrapper({ testId: 'profile-screen' })
    const backButton = createDetoxWrapper({ testId: 'back-button' })

    // Navigate to profile
    await profileButton.wait().forVisible().execute()
    await profileButton.getDriver().tap()
    
    // Verify on profile screen
    await profileScreen
      .wait()
      .forVisible({ timeout: 5000 })
      .execute()
    
    // Go back
    await backButton.wait().forVisible().execute()
    await backButton.getDriver().tap()
    
    // Verify back on home
    await homeButton.wait().forVisible().execute()
  })
})
```

## Scrolling and Finding Elements

```typescript
import { createDetoxWrapper } from 'e2e-wrapper'

describe('Scrolling', () => {
  it('should scroll to find elements', async () => {
    const scrollView = createDetoxWrapper({ testId: 'scroll-view' })
    const bottomButton = createDetoxWrapper({ testId: 'bottom-button' })

    // Check if element is visible first
    const isVisible = await bottomButton.isVisible()
    
    if (!isVisible) {
      // Scroll to find the element
      await scrollView.getDriver().scroll(200, 'down')
    }
    
    // Now wait for it to be visible
    await bottomButton
      .wait()
      .forVisible({ timeout: 3000 })
      .execute()
    
    await bottomButton.getDriver().tap()
  })
})
```

## Conditional Logic

```typescript
import { createDetoxWrapper } from 'e2e-wrapper'

describe('Conditional Logic', () => {
  it('should handle conditional elements', async () => {
    const loginButton = createDetoxWrapper({ testId: 'login-button' })
    const logoutButton = createDetoxWrapper({ testId: 'logout-button' })
    const welcomeMessage = createDetoxWrapper({ testId: 'welcome-message' })

    // Check if user is already logged in
    const isLoggedIn = await welcomeMessage.exists()
    
    if (isLoggedIn) {
      console.log('User already logged in')
      
      // Logout first
      await logoutButton.wait().forVisible().execute()
      await logoutButton.getDriver().tap()
    }
    
    // Now proceed with login
    await loginButton
      .wait()
      .forVisible()
      .forEnabled()
      .execute()
    
    await loginButton.getDriver().tap()
  })
})
```

## Complex Wait Conditions

```typescript
import { createDetoxWrapper } from 'e2e-wrapper'

describe('Complex Waits', () => {
  it('should handle complex wait scenarios', async () => {
    const loadingSpinner = createDetoxWrapper({ testId: 'loading-spinner' })
    const contentView = createDetoxWrapper({ testId: 'content-view' })
    const errorMessage = createDetoxWrapper({ testId: 'error-message' })

    // Wait for loading to complete (spinner to disappear)
    // Note: You might need to implement custom wait logic for "not visible"
    let isLoading = true
    let attempts = 0
    const maxAttempts = 30 // 15 seconds with 500ms intervals
    
    while (isLoading && attempts < maxAttempts) {
      isLoading = await loadingSpinner.isVisible()
      if (isLoading) {
        await new Promise(resolve => setTimeout(resolve, 500))
        attempts++
      }
    }
    
    // Check if content loaded or error occurred
    const hasContent = await contentView.exists()
    const hasError = await errorMessage.exists()
    
    if (hasError) {
      const errorText = await errorMessage.getDriver().getText()
      throw new Error(`Loading failed: ${errorText}`)
    }
    
    expect(hasContent).toBe(true)
    
    // Proceed with content interaction
    await contentView.wait().forVisible().execute()
  })
})
```

## Tips for Detox Usage

### 1. Use TestIDs Consistently
```typescript
// Good - testId is the most reliable selector in Detox
const button = createDetoxWrapper({ testId: 'my-button' })

// Less reliable - text might change
const button = createDetoxWrapper({ text: 'Submit' })
```

### 2. Leverage Framework Detection
```typescript
import { TestFramework } from 'e2e-wrapper'

const wrapper = createDetoxWrapper({ testId: 'button' })

if (wrapper.getFramework() === TestFramework.DETOX) {
  // Detox-specific optimizations
  await wrapper.getDriver().tap({ x: 100, y: 100 })
}
```

### 3. Combine with Detox Matchers
```typescript
const wrapper = createDetoxWrapper({ testId: 'button' })

// Wait using E2E Wrapper
await wrapper.wait().forVisible().forEnabled().execute()

// Use Detox matchers for complex assertions
await expect(wrapper.getDriver()).toHaveText('Expected Text')
``` 