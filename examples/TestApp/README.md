# E2E Wrapper Test App

This React Native app is specifically designed to test the `e2e-wrapper` framework in a real-world scenario. It provides a comprehensive set of UI components and interactions that demonstrate the framework's capabilities.

## Purpose

This test app serves as:
- Integration testing platform for the e2e-wrapper framework
- Demonstration of various UI patterns and interactions
- Reference implementation for e2e testing best practices
- Validation that the framework works correctly with Detox and React Native

## Features

The app includes multiple sections, each designed to test different aspects of the e2e-wrapper framework:

### 1. Counter Demo
- Increment/decrement buttons
- Real-time counter display
- Tests: Button interactions, state updates, number validation

### 2. Text Input Demo
- Text input field with placeholder
- Submit button
- Display area for entered text
- Tests: Text input, form submission, text validation

### 3. Loading Demo
- Loading button with state changes
- Loading indicator
- Async operations simulation
- Tests: Loading states, disabled states, timeouts

### 4. Switch Demo
- Toggle switch component
- Dynamic label updates
- Tests: Switch interactions, boolean state changes

### 5. Modal Demo
- Modal open/close functionality
- Modal content validation
- Tests: Modal visibility, overlay interactions

### 6. Todo List Demo
- Add new todo items
- Toggle completion status
- Dynamic list updates
- Tests: List operations, item interactions, state management

## Installation

1. Navigate to the app directory:
```bash
cd examples/TestApp
```

2. Install pnpm if not already installed:
```bash
npm install -g pnpm
```

3. Install dependencies:
```bash
pnpm install
```

4. Install iOS dependencies (iOS only):
```bash
cd ios && pod install && cd ..
```

## Running the App

### iOS
```bash
pnpm run ios
```

### Android
```bash
pnpm run android
```

## E2E Testing

> **⚠️ Important Note**: The e2e tests included in this project are **examples and playground code only**. They are not meant to work out-of-the-box and serve as a reference for testing the e2e-wrapper framework. Use them as a starting point to understand how to structure tests with the framework.

The app includes comprehensive e2e tests that demonstrate the e2e-wrapper framework's capabilities.

### Prerequisites

1. **iOS Simulator**: Ensure you have iOS Simulator installed and running
2. **Android Emulator**: Ensure you have an Android emulator running (for Android tests)
3. **Detox CLI**: Install Detox CLI globally:
```bash
pnpm install -g detox-cli
```

### Running E2E Tests

#### iOS
```bash
# Build the app for testing
pnpm run e2e:build:ios

# Run the tests
pnpm run e2e:test:ios
```

#### Android
```bash
# Build the app for testing
pnpm run e2e:build:android

# Run the tests
pnpm run e2e:test:android
```

### Test Structure

The e2e tests are located in the `e2e/` directory:
- `e2e/sample.test.js` - Main test file with comprehensive test scenarios
- `e2e/jest.config.js` - Jest configuration for e2e tests
- `e2e/init.js` - Detox initialization
- `.detoxrc.js` - Detox configuration

### Test Scenarios

The test suite covers:

1. **App Navigation**: Title and subtitle verification
2. **Counter Operations**: Increment/decrement functionality
3. **Text Input**: Input handling and display
4. **Loading States**: Async operation simulation
5. **Switch Interactions**: Toggle functionality
6. **Modal Operations**: Open/close modal interactions
7. **Todo List**: Add and toggle todo items

## Using with E2E Wrapper

The app demonstrates how to use the e2e-wrapper framework with Detox:

```javascript
const { E2EWrapper } = require('e2e-wrapper');

// Create wrapper for a component
const button = E2EWrapper.withDetox({ testId: 'increment-button' });

// Wait for element and interact
await button
  .wait()
  .forVisible()
  .forEnabled()
  .execute();

await button.getDriver().tap();
```

## Test IDs

All interactive components have `testID` attributes for easy testing:

- `app-title` - Main app title
- `app-subtitle` - App subtitle
- `counter-display` - Counter value display
- `increment-button` - Increment button
- `decrement-button` - Decrement button
- `text-input` - Text input field
- `submit-button` - Submit button
- `display-text` - Display area for entered text
- `loading-button` - Loading demo button
- `loading-indicator` - Loading indicator text
- `feature-switch` - Toggle switch
- `switch-label` - Switch label
- `open-modal-button` - Open modal button
- `test-modal` - Modal container
- `modal-title` - Modal title
- `close-modal-button` - Close modal button
- `todo-input` - Todo input field
- `add-todo-button` - Add todo button
- `todo-list` - Todo list container
- `todo-item-{id}` - Individual todo items
- `toggle-button-{id}` - Todo toggle buttons

## Configuration

### Detox Configuration

The app is configured with Detox for both iOS and Android platforms. See `.detoxrc.js` for configuration details.

### Jest Configuration

E2E tests use a separate Jest configuration (`e2e/jest.config.js`) optimized for Detox testing.

## Troubleshooting

### Common Issues

1. **Metro bundler not starting**: Run `pnpm start` in a separate terminal
2. **iOS build issues**: Clean build folder and rebuild
3. **Android emulator not detected**: Ensure emulator is running and accessible via ADB
4. **Detox tests timing out**: Increase timeout values in test configuration

### Debug Mode

To run tests in debug mode:
```bash
# iOS
detox test --configuration ios.sim.debug --loglevel verbose

# Android
detox test --configuration android.emu.debug --loglevel verbose
```

## Contributing

When adding new features to test the e2e-wrapper framework:

1. Add new UI components with proper `testID` attributes
2. Create corresponding test scenarios in `e2e/sample.test.js`
3. Update this README with new test IDs and features
4. Ensure tests cover both positive and negative scenarios

## Framework Integration

This app demonstrates integration with:
- **Detox**: React Native e2e testing framework
- **Jest**: Test runner and assertions
- **E2E Wrapper**: Abstraction layer for testing frameworks
- **React Native**: Mobile app framework

The combination provides a robust testing environment for validating the e2e-wrapper framework's functionality across different scenarios and use cases.
