# E2E Wrapper

A generic abstraction layer for end-to-end testing frameworks with builder pattern support. This package provides a unified interface for interacting with different E2E testing frameworks like Detox, Appium, Playwright, and Cypress.

## Features

- 🔗 **Builder Pattern**: Chainable wait conditions for flexible test flows
- 🎯 **Framework Agnostic**: Works with Detox, Appium, Playwright, Cypress, and custom implementations
- 🚀 **TypeScript First**: Full TypeScript support with comprehensive type definitions
- 🔧 **Extensible**: Easy to add support for new frameworks
- ⚡ **Lightweight**: Minimal dependencies, framework libraries are peer dependencies

## Installation

```bash
# Using npm
npm install e2e-wrapper

# Using yarn
yarn add e2e-wrapper

# Using pnpm
pnpm add e2e-wrapper
```

## Quick Start

### Basic Usage

```typescript
import { createDetoxWrapper, ElementSelector } from 'e2e-wrapper';

const selector: ElementSelector = { testId: 'login-button' };
const wrapper = createDetoxWrapper(selector);

// Chain wait conditions in any order
await wrapper
  .wait()
  .forVisible({ timeout: 10000 })
  .forEnabled({ timeout: 5000 })
  .execute();
```

### Different Execution Orders

The beauty of this wrapper is that you can specify wait conditions in any order:

```typescript
// Wait for visible first, then enabled
await wrapper.wait().forVisible().forEnabled().execute();

// Wait for enabled first, then visible
await wrapper.wait().forEnabled().forVisible().execute();

// Wait for existence, then visibility, then enabled state
await wrapper.wait().forExists().forVisible().forEnabled().execute();
```

## Supported Frameworks

### Detox

```typescript
import { createDetoxWrapper } from 'e2e-wrapper';

const wrapper = createDetoxWrapper({ testId: 'my-button' });
const result = await wrapper.wait().forVisible().forEnabled().execute();
```

### Appium

```typescript
import { createAppiumWrapper } from 'e2e-wrapper';

const wrapper = createAppiumWrapper(
  { xpath: '//android.widget.Button[@text="Login"]' },
  appiumDriver
);
const result = await wrapper.wait().forEnabled().forVisible().execute();
```

### Custom Framework Implementation

```typescript
import { BaseElementDriver, TestFramework, createCustomWrapper } from 'e2e-wrapper';

class MyCustomDriver extends BaseElementDriver {
  constructor(frameworkInstance: any) {
    super(TestFramework.PLAYWRIGHT);
    // Your implementation
  }

  async isVisible(selector: ElementSelector): Promise<boolean> {
    // Your framework-specific implementation
  }

  // ... other required methods
}

const driver = new MyCustomDriver(playwrightPage);
const wrapper = createCustomWrapper(selector, driver);
```

## API Reference

### ElementSelector

```typescript
interface ElementSelector {
  id?: string;           // Element ID
  testId?: string;       // Test ID (data-testid, accessibility id)
  text?: string;         // Text content
  xpath?: string;        // XPath selector
  className?: string;    // CSS class name
  accessibility?: string; // Accessibility label
  custom?: Record<string, any>; // Custom selector properties
}
```

### WaitOptions

```typescript
interface WaitOptions {
  timeout?: number;    // Timeout in milliseconds (default: 5000)
  interval?: number;   // Polling interval in milliseconds (default: 100)
  retries?: number;    // Number of retries (default: 3)
}
```

### Builder Methods

- `forVisible(options?)`: Wait for element to be visible
- `forEnabled(options?)`: Wait for element to be enabled
- `forExists(options?)`: Wait for element to exist
- `execute()`: Execute all chained conditions in order

### Quick Access Methods

For simple checks without the builder pattern:

```typescript
const isVisible = await wrapper.isVisible();
const isEnabled = await wrapper.isEnabled();
const exists = await wrapper.exists();
```

## Advanced Usage

### Custom Wait Options

```typescript
await wrapper
  .wait()
  .forVisible({ timeout: 15000, interval: 200 })
  .forEnabled({ timeout: 5000 })
  .execute();
```

### Reusing Wrappers

```typescript
const baseWrapper = createDetoxWrapper({ testId: 'base-element' });

// Create new wrapper with different selector but same driver
const loginButton = baseWrapper.withSelector({ testId: 'login-button' });
const submitButton = baseWrapper.withSelector({ testId: 'submit-button' });
```

### Error Handling

```typescript
try {
  const result = await wrapper
    .wait()
    .forVisible()
    .forEnabled()
    .execute();
  
  if (!result) {
    console.log('Element conditions were not met within timeout');
  }
} catch (error) {
  console.error('Error during wait execution:', error);
}
```

## Framework-Specific Notes

### Detox

- Automatically uses global `element` and `by` from Detox environment
- Supports all standard Detox selectors
- Uses Detox's built-in wait mechanisms

### Appium

- Requires passing the WebDriver instance to the constructor
- Supports both iOS and Android selector strategies
- Handles different locator types automatically

### Custom Frameworks

- Extend `BaseElementDriver` for your framework
- Implement the three required methods: `isVisible`, `isEnabled`, `exists`
- Use `TestFramework` enum to identify your framework

## Development

```bash
# Install dependencies
pnpm install

# Build the package
pnpm build

# Run tests
pnpm test
```

## Contributing

We use conventional commits to ensure consistent commit messages. Please read our [Contributing Guide](./docs/CONTRIBUTING.md) for detailed information.

### Quick Start for Contributors

```bash
# Install dependencies
pnpm install

# Make your changes
# ...

# Use commitizen for conventional commits
pnpm run commit

# Or commit manually following conventional format
git commit -m "feat: add new feature"
```

### Commit Message Format

```
<type>[optional scope]: <description>

# Examples:
feat: add Playwright driver support
fix(detox): handle undefined elements
docs: update API documentation
```

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Roadmap

- [ ] Add Playwright driver implementation
- [ ] Add Cypress driver implementation
- [ ] Add WebDriverIO support
- [ ] Add more wait conditions (e.g., `forText`, `forAttribute`)
- [ ] Add element interaction methods (click, type, etc.)
- [ ] Add screenshot capabilities
- [ ] Add retry strategies and custom wait conditions 