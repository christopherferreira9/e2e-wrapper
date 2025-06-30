# Appium Integration

Learn how to integrate E2E Wrapper with Appium for cross-platform mobile automation.

## Overview

Appium is an open-source automation framework for mobile, web, and desktop applications. E2E Wrapper provides a unified interface that works with Appium's WebDriver-based approach.

## Prerequisites

Before using E2E Wrapper with Appium, ensure you have:

1. **Appium Server** installed and running
2. **Appium drivers** installed (UIAutomator2 for Android, XCUITest for iOS)
3. **WebDriver client** library configured
4. **E2E Wrapper** installed as a dependency

## Installation

Install the required packages:

```bash
# Install E2E Wrapper
pnpm add e2e-wrapper

# Install Appium and WebDriver client
pnpm add -D appium webdriverio
```

## Basic Setup

### 1. Start Appium Server

```bash
# Install Appium globally
npm install -g appium

# Install drivers
appium driver install uiautomator2  # For Android
appium driver install xcuitest      # For iOS

# Start Appium server
appium
```

### 2. Configure WebDriver

```typescript
import { remote } from 'webdriverio'

const capabilities = {
  platformName: 'Android',
  deviceName: 'Android Emulator',
  app: '/path/to/your/app.apk',
  automationName: 'UiAutomator2'
}

const driver = await remote({
  hostname: 'localhost',
  port: 4723,
  path: '/wd/hub',
  capabilities
})
```

### 3. Create Element Wrappers

```typescript
import { createAppiumWrapper, E2EWrapper } from 'e2e-wrapper'

describe('Mobile App Tests', () => {
  let driver: any
  
  beforeAll(async () => {
    driver = await remote({ /* capabilities */ })
  })
  
  it('should interact with elements', async () => {
    // Using the convenience function
    const loginButton = createAppiumWrapper(
      { xpath: '//android.widget.Button[@text="Login"]' },
      driver
    )
    
    // Or using the class constructor
    const loginButton2 = E2EWrapper.withAppium(
      { xpath: '//android.widget.Button[@text="Login"]' },
      driver
    )
    
    // Wait for element to be ready
    await loginButton
      .wait()
      .forExists()
      .forVisible()
      .forEnabled()
      .execute()
    
    // Use WebDriver methods directly
    await loginButton.getDriver().click()
  })
})
```

## Selector Support

E2E Wrapper supports all common Appium/WebDriver selector strategies:

### XPath (Most Flexible)

```typescript
const element = createAppiumWrapper(
  { xpath: '//android.widget.Button[@text="Login"]' },
  driver
)
```

### Resource ID (Android) / Accessibility ID (iOS)

```typescript
// Android
const element = createAppiumWrapper(
  { id: 'com.myapp:id/login_button' },
  driver
)

// iOS
const element = createAppiumWrapper(
  { accessibility: 'login-button' },
  driver
)
```

### Class Name

```typescript
const element = createAppiumWrapper(
  { className: 'android.widget.Button' },
  driver
)
```

### Text Content

```typescript
const element = createAppiumWrapper(
  { text: 'Login' },
  driver
)
```

## Platform-Specific Examples

### Android Setup

```typescript
const androidCapabilities = {
  platformName: 'Android',
  deviceName: 'Android Emulator',
  app: '/path/to/app.apk',
  automationName: 'UiAutomator2',
  appPackage: 'com.example.app',
  appActivity: '.MainActivity'
}

const driver = await remote({
  hostname: 'localhost',
  port: 4723,
  capabilities: androidCapabilities
})

// Android-specific selectors
const submitButton = createAppiumWrapper(
  { id: 'com.example.app:id/submit_btn' },
  driver
)
```

### iOS Setup

```typescript
const iOSCapabilities = {
  platformName: 'iOS',
  deviceName: 'iPhone 14',
  app: '/path/to/app.app',
  automationName: 'XCUITest',
  bundleId: 'com.example.app'
}

const driver = await remote({
  hostname: 'localhost',
  port: 4723,
  capabilities: iOSCapabilities
})

// iOS-specific selectors
const submitButton = createAppiumWrapper(
  { accessibility: 'submit-button' },
  driver
)
```

## Available Methods

### Wait Methods

```typescript
const button = createAppiumWrapper(
  { xpath: '//button[@text="Submit"]' },
  driver
)

// Chain multiple conditions
await button
  .wait()
  .forExists({ timeout: 10000 })
  .forVisible({ timeout: 5000 })
  .forEnabled({ timeout: 3000 })
  .execute()
```

### Direct Check Methods

```typescript
// Quick checks without waiting
const exists = await button.exists()
const isVisible = await button.isVisible()
const isEnabled = await button.isEnabled()
```

### Framework Access

```typescript
// Get the underlying WebDriver element
const webDriverElement = button.getDriver()

// Use any WebDriver method
await webDriverElement.click()
await webDriverElement.sendKeys('Hello World')
await webDriverElement.getText()
```

## Common Patterns

### Login Flow

```typescript
describe('Login Flow', () => {
  it('should handle user authentication', async () => {
    const emailInput = createAppiumWrapper(
      { id: 'email-input' },
      driver
    )
    const passwordInput = createAppiumWrapper(
      { id: 'password-input' },
      driver
    )
    const loginButton = createAppiumWrapper(
      { xpath: '//button[@text="Login"]' },
      driver
    )
    
    // Wait for login form
    await emailInput.wait().forVisible().execute()
    await passwordInput.wait().forVisible().execute()
    
    // Fill credentials
    await emailInput.getDriver().sendKeys('user@example.com')
    await passwordInput.getDriver().sendKeys('password123')
    
    // Submit
    await loginButton.wait().forEnabled().execute()
    await loginButton.getDriver().click()
  })
})
```

### List Interactions

```typescript
describe('List Operations', () => {
  it('should interact with list items', async () => {
    const listView = createAppiumWrapper(
      { className: 'android.widget.ListView' },
      driver
    )
    const firstItem = createAppiumWrapper(
      { xpath: '//android.widget.ListView/android.widget.LinearLayout[1]' },
      driver
    )
    
    // Wait for list to load
    await listView.wait().forVisible().execute()
    
    // Scroll if needed
    const itemVisible = await firstItem.isVisible()
    if (!itemVisible) {
      await driver.scroll(0, 500)
    }
    
    // Interact with item
    await firstItem.wait().forVisible().execute()
    await firstItem.getDriver().click()
  })
})
```

### Cross-Platform Testing

```typescript
describe('Cross-Platform Tests', () => {
  it('should work on both platforms', async () => {
    const platform = await driver.getPlatform()
    
    let submitButton
    if (platform === 'Android') {
      submitButton = createAppiumWrapper(
        { id: 'com.example.app:id/submit' },
        driver
      )
    } else if (platform === 'iOS') {
      submitButton = createAppiumWrapper(
        { accessibility: 'submit-button' },
        driver
      )
    }
    
    await submitButton.wait().forVisible().forEnabled().execute()
    await submitButton.getDriver().click()
  })
})
```

## Advanced Features

### Custom Wait Conditions

```typescript
// Wait for element to contain specific text
const textElement = createAppiumWrapper(
  { id: 'status-text' },
  driver
)

await textElement.wait().forVisible().execute()

// Check text content using WebDriver
const text = await textElement.getDriver().getText()
expect(text).toContain('Success')
```

### Gesture Interactions

```typescript
const element = createAppiumWrapper(
  { id: 'swipeable-element' },
  driver
)

// Wait for element first
await element.wait().forVisible().execute()

// Perform gestures using WebDriver
const webElement = element.getDriver()
await driver.performActions([
  {
    type: 'pointer',
    id: 'finger1',
    parameters: { pointerType: 'touch' },
    actions: [
      { type: 'pointerMove', duration: 0, x: 100, y: 100 },
      { type: 'pointerDown', button: 0 },
      { type: 'pointerMove', duration: 1000, x: 300, y: 100 },
      { type: 'pointerUp', button: 0 }
    ]
  }
])
```

### Context Switching

```typescript
// Switch to web view context
await driver.switchContext('WEBVIEW_com.example.app')

const webElement = createAppiumWrapper(
  { xpath: '//input[@type="text"]' },
  driver
)

await webElement.wait().forVisible().execute()
await webElement.getDriver().sendKeys('Web input text')

// Switch back to native context
await driver.switchContext('NATIVE_APP')
```

## Best Practices

### 1. Use Explicit Waits

```typescript
// Good - explicit waits
await element
  .wait()
  .forExists({ timeout: 10000 })
  .forVisible({ timeout: 5000 })
  .execute()

// Avoid - implicit waits or no waits
await driver.implicitWait(5000) // Less reliable
```

### 2. Prefer Stable Selectors

```typescript
// Good - stable identifiers
const element = createAppiumWrapper(
  { id: 'unique-resource-id' },
  driver
)

// Avoid - brittle selectors
const element = createAppiumWrapper(
  { xpath: '//*[contains(@text, "Click")]' },
  driver
)
```

### 3. Handle Platform Differences

```typescript
async function createPlatformElement(driver: any) {
  const platform = await driver.getPlatform()
  
  if (platform === 'Android') {
    return createAppiumWrapper(
      { id: 'com.app:id/button' },
      driver
    )
  } else {
    return createAppiumWrapper(
      { accessibility: 'button' },
      driver
    )
  }
}
```

### 4. Implement Proper Cleanup

```typescript
describe('Test Suite', () => {
  let driver: any
  
  beforeAll(async () => {
    driver = await remote({ /* capabilities */ })
  })
  
  afterAll(async () => {
    if (driver) {
      await driver.deleteSession()
    }
  })
  
  beforeEach(async () => {
    // Reset app state if needed
    await driver.reset()
  })
})
```

## Troubleshooting

### Common Issues

1. **Element not found**: Check if the app is in the correct state and selector is accurate
2. **Timeout errors**: Increase timeout values or check if element actually appears
3. **StaleElementReferenceException**: Re-find elements after page changes

### Debugging Tips

```typescript
// Log element information
const element = createAppiumWrapper({ id: 'my-element' }, driver)
const exists = await element.exists()
console.log('Element exists:', exists)

// Get page source for debugging
const pageSource = await driver.getPageSource()
console.log('Current page source:', pageSource)

// Take screenshot for visual debugging
await driver.saveScreenshot('./debug-screenshot.png')
```

### Performance Optimization

```typescript
// Reduce unnecessary waits
const element = createAppiumWrapper({ id: 'fast-element' }, driver)

// Check if element is already visible before waiting
if (await element.isVisible()) {
  await element.getDriver().click()
} else {
  await element.wait().forVisible().execute()
  await element.getDriver().click()
}
```

## Migration from Pure WebDriver

### Before (Pure WebDriver)
```typescript
const element = await driver.$('//button[@text="Submit"]')
await element.waitForDisplayed({ timeout: 10000 })
await element.waitForEnabled({ timeout: 5000 })
await element.click()
```

### After (E2E Wrapper)
```typescript
const element = createAppiumWrapper(
  { xpath: '//button[@text="Submit"]' },
  driver
)
await element
  .wait()
  .forVisible({ timeout: 10000 })
  .forEnabled({ timeout: 5000 })
  .execute()
await element.getDriver().click()
```

The E2E Wrapper approach provides consistent API across different frameworks and better chaining capabilities. 