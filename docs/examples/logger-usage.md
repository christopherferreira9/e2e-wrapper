# Logger Usage

The E2EWrapper includes a powerful colored logger that can be controlled via environment variables.

## Basic Usage

### Setting Log Level

Control the log level using the `E2EWRAPPER_LOG` environment variable:

```bash
# Show only errors and warnings (default)
E2EWRAPPER_LOG=warn npm run test

# Show info, warnings, and errors
E2EWRAPPER_LOG=info npm run test

# Show debug information (recommended for development)
E2EWRAPPER_LOG=debug npm run test

# Show everything including trace information
E2EWRAPPER_LOG=trace npm run test

# Disable all logging
E2EWRAPPER_LOG=error npm run test
```

### Using in Tests

```typescript
import { logger, LogLevel } from 'e2e-wrapper';

describe('My E2E Tests', () => {
  beforeAll(() => {
    // Optionally set log level programmatically
    logger.setLevel(LogLevel.DEBUG);
  });

  it('should demonstrate logging', async () => {
    logger.info('Starting test case');
    
    const element = E2EWrapper.withDetox({ testId: 'my-button' });
    
    // The framework will automatically log debug information when E2EWRAPPER_LOG=debug
    await element.scrollTo({ visibilityThreshold: 0.8 }).execute();
    await element.tap();
    
    logger.success('Test completed successfully!');
  });
});
```

### NPM Script Examples

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "test:e2e": "detox test",
    "test:e2e:debug": "E2EWRAPPER_LOG=debug detox test",
    "test:e2e:info": "E2EWRAPPER_LOG=info detox test",
    "test:e2e:quiet": "E2EWRAPPER_LOG=error detox test"
  }
}
```

## Log Levels

| Level | Description | Color |
|-------|-------------|-------|
| `error` | Critical errors only | 🔴 Red |
| `warn` | Warnings and errors | 🟡 Yellow |
| `info` | General information | 🔵 Blue |
| `debug` | Detailed debugging info | 🟢 Green |
| `trace` | Very detailed trace info | 🟣 Magenta |

## Advanced Usage

### Custom Logger

```typescript
import { createLogger, LogLevel } from 'e2e-wrapper';

// Create a custom logger for your test suite
const testLogger = createLogger({
  prefix: 'MyTestSuite',
  colors: true
});

testLogger.debug('Custom logger message');
```

### Conditional Logging

```typescript
import { logger, LogLevel } from 'e2e-wrapper';

// Check if debug logging is enabled before expensive operations
if (logger.isLevelEnabled(LogLevel.DEBUG)) {
  const expensiveData = generateDetailedReport();
  logger.debug('Detailed report:', expensiveData);
}
```

## Sample Output

When running with `E2EWRAPPER_LOG=debug`, you'll see colorful output like:

```
14:32:15.123 [E2EWrapper] [DEBUG] Starting scroll to element with options: {...}
14:32:15.124 [E2EWrapper] [DEBUG] --- Scroll attempt at 0ms ---
14:32:15.125 [E2EWrapper] [DEBUG] Using enhanced visibility check with threshold 0.8
14:32:15.200 [E2EWrapper] [DEBUG] Element visibility result: true
14:32:15.201 [E2EWrapper] [SUCCESS] Scroll to element completed successfully!
```

The output includes:
- ⏰ **Timestamp** (gray)
- 🏷️ **Component name** (cyan) 
- 📊 **Log level** (colored by level)
- 💬 **Message** (white)

This makes it easy to follow the execution flow and debug issues during test development. 