# E2E Wrapper Usage Examples

This document shows how to use the e2e-wrapper package with different testing frameworks.

## Installation

```bash
pnpm add e2e-wrapper
```

## Basic Usage

### With Detox

```typescript
import { createDetoxWrapper, ElementSelector } from 'e2e-wrapper';

describe('Detox Example', () => {
  it('should wait for element to be visible then enabled', async () => {
    const selector: ElementSelector = { testId: 'login-button' };
    const wrapper = createDetoxWrapper(selector);

    // Chain wait conditions - will wait for visible first, then enabled
    const result = await wrapper
      .wait()
      .forVisible({ timeout: 10000 })
      .forEnabled({ timeout: 5000 })
      .execute();

    expect(result).toBe(true);
  });

  it('should wait for element in different order', async () => {
    const selector: ElementSelector = { id: 'submit-btn' };
    const wrapper = createDetoxWrapper(selector);

    // Different order - will wait for enabled first, then visible
    const result = await wrapper
      .wait()
      .forEnabled()
      .forVisible()
      .execute();

    expect(result).toBe(true);
  });
});
```

### With Appium

```typescript
import { createAppiumWrapper, ElementSelector } from 'e2e-wrapper';

describe('Appium Example', () => {
  let driver: any; // Your Appium WebDriver instance

  beforeAll(async () => {
    // Initialize your Appium driver here
    // driver = await wdio.remote(capabilities);
  });

  it('should work with Appium driver', async () => {
    const selector: ElementSelector = { 
      xpath: '//android.widget.Button[@text="Login"]' 
    };
    const wrapper = createAppiumWrapper(selector, driver);

    const result = await wrapper
      .wait()
      .forExists()
      .forVisible()
      .forEnabled()
      .execute();

    expect(result).toBe(true);
  });

  it('should support different selector types', async () => {
    const selector: ElementSelector = { 
      accessibility: 'login-button',
      testId: 'login-btn' // fallback
    };
    const wrapper = createAppiumWrapper(selector, driver);

    const isVisible = await wrapper.isVisible();
    const isEnabled = await wrapper.isEnabled();

    expect(isVisible).toBe(true);
    expect(isEnabled).toBe(true);
  });
});
```

### Custom Driver Implementation

```typescript
import { 
  BaseElementDriver, 
  ElementSelector, 
  WaitOptions, 
  TestFramework,
  createCustomWrapper 
} from 'e2e-wrapper';

class PlaywrightElementDriver extends BaseElementDriver {
  private page: any; // Playwright Page instance

  constructor(page: any) {
    super(TestFramework.PLAYWRIGHT);
    this.page = page;
  }

  async isVisible(selector: ElementSelector, options?: WaitOptions): Promise<boolean> {
    try {
      const locator = this.buildPlaywrightLocator(selector);
      await locator.waitFor({ 
        state: 'visible', 
        timeout: options?.timeout || 5000 
      });
      return true;
    } catch {
      return false;
    }
  }

  async isEnabled(selector: ElementSelector, options?: WaitOptions): Promise<boolean> {
    try {
      const locator = this.buildPlaywrightLocator(selector);
      return await locator.isEnabled();
    } catch {
      return false;
    }
  }

  async exists(selector: ElementSelector, options?: WaitOptions): Promise<boolean> {
    try {
      const locator = this.buildPlaywrightLocator(selector);
      return await locator.count() > 0;
    } catch {
      return false;
    }
  }

  private buildPlaywrightLocator(selector: ElementSelector) {
    if (selector.testId) {
      return this.page.getByTestId(selector.testId);
    }
    if (selector.id) {
      return this.page.locator(`#${selector.id}`);
    }
    if (selector.text) {
      return this.page.getByText(selector.text);
    }
    if (selector.xpath) {
      return this.page.locator(selector.xpath);
    }
    throw new Error('Unsupported selector for Playwright');
  }
}

// Usage
describe('Custom Playwright Driver', () => {
  let page: any; // Your Playwright page instance

  it('should work with custom driver', async () => {
    const driver = new PlaywrightElementDriver(page);
    const selector: ElementSelector = { testId: 'my-button' };
    const wrapper = createCustomWrapper(selector, driver);

    const result = await wrapper
      .wait()
      .forVisible({ timeout: 10000 })
      .forEnabled()
      .execute();

    expect(result).toBe(true);
  });
});
```

## API Reference

### ElementSelector

```typescript
interface ElementSelector {
  id?: string;
  testId?: string;
  text?: string;
  xpath?: string;
  className?: string;
  accessibility?: string;
  custom?: Record<string, any>;
}
```

### WaitOptions

```typescript
interface WaitOptions {
  timeout?: number;    // Default: 5000ms
  interval?: number;   // Default: 100ms
  retries?: number;    // Default: 3
}
```

### Chaining Wait Conditions

The builder pattern allows you to chain multiple wait conditions:

```typescript
// All conditions must pass in the specified order
await wrapper
  .wait()
  .forExists()      // First, wait for element to exist
  .forVisible()     // Then, wait for it to be visible
  .forEnabled()     // Finally, wait for it to be enabled
  .execute();
```

### Quick Access Methods

For simple checks without the builder pattern:

```typescript
const wrapper = createDetoxWrapper(selector);

const isVisible = await wrapper.isVisible();
const isEnabled = await wrapper.isEnabled();
const exists = await wrapper.exists();
``` 