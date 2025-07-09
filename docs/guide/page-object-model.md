# Page Object Model with E2E Wrapper

The Page Object Model (POM) is a design pattern that creates an abstraction layer between your test code and the application under test. When combined with the E2E Wrapper, it provides a powerful, maintainable approach to structuring your end-to-end tests.

## What is Page Object Model?

The Page Object Model pattern involves creating classes that represent pages or components in your application. Each page object encapsulates:

- **Element selectors** for that page
- **Actions** that can be performed on the page
- **Assertions** specific to that page's behavior

This separation makes tests more readable, maintainable, and reduces code duplication.

## Basic Page Object Structure

Here's how to structure a page object using the E2E Wrapper:

### Login Page Example

```typescript
import { E2EWrapper, ElementSelector } from 'e2e-wrapper';

export class LoginPage {
  private wrapper: E2EWrapper;

  // Define element selectors
  private selectors = {
    usernameInput: new ElementSelector('username-input', 'id'),
    passwordInput: new ElementSelector('password-input', 'id'),
    loginButton: new ElementSelector('login-button', 'id'),
    errorMessage: new ElementSelector('.error-message', 'css'),
    loadingSpinner: new ElementSelector('loading-spinner', 'testId')
  };

  constructor(wrapper: E2EWrapper) {
    this.wrapper = wrapper;
  }

  // Page actions
  async enterUsername(username: string): Promise<void> {
    await this.wrapper
      .select(this.selectors.usernameInput)
      .waitFor()
      .visible()
      .enabled()
      .execute();
    
    await this.wrapper.type(username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.wrapper
      .select(this.selectors.passwordInput)
      .waitFor()
      .visible()
      .enabled()
      .execute();
    
    await this.wrapper.type(password);
  }

  async clickLogin(): Promise<void> {
    await this.wrapper
      .select(this.selectors.loginButton)
      .waitFor()
      .visible()
      .enabled()
      .execute();
    
    await this.wrapper.tap();
  }

  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  // Page assertions
  async isErrorVisible(): Promise<boolean> {
    return await this.wrapper
      .select(this.selectors.errorMessage)
      .isVisible();
  }

  async getErrorMessage(): Promise<string> {
    await this.wrapper
      .select(this.selectors.errorMessage)
      .waitFor()
      .visible()
      .execute();
    
    return await this.wrapper.getText();
  }

  async waitForLoginComplete(): Promise<void> {
    // Wait for loading spinner to appear and then disappear
    await this.wrapper
      .select(this.selectors.loadingSpinner)
      .waitFor()
      .visible()
      .execute();

    await this.wrapper
      .select(this.selectors.loadingSpinner)
      .waitFor()
      .notVisible()
      .withTimeout(10000)
      .execute();
  }

  // Navigation helpers
  async isOnLoginPage(): Promise<boolean> {
    return await this.wrapper
      .select(this.selectors.loginButton)
      .isVisible();
  }
}
```

### Dashboard Page Example

```typescript
import { E2EWrapper, ElementSelector } from 'e2e-wrapper';

export class DashboardPage {
  private wrapper: E2EWrapper;

  private selectors = {
    welcomeMessage: new ElementSelector('welcome-message', 'testId'),
    userProfileButton: new ElementSelector('.profile-button', 'css'),
    navigationMenu: new ElementSelector('nav-menu', 'id'),
    logoutButton: new ElementSelector('logout-btn', 'testId'),
    statsContainer: new ElementSelector('.stats-container', 'css')
  };

  constructor(wrapper: E2EWrapper) {
    this.wrapper = wrapper;
  }

  async waitForPageLoad(): Promise<void> {
    await this.wrapper
      .select(this.selectors.welcomeMessage)
      .waitFor()
      .visible()
      .withTimeout(15000)
      .execute();
  }

  async getWelcomeMessage(): Promise<string> {
    await this.waitForPageLoad();
    return await this.wrapper
      .select(this.selectors.welcomeMessage)
      .getText();
  }

  async openUserProfile(): Promise<void> {
    await this.wrapper
      .select(this.selectors.userProfileButton)
      .waitFor()
      .visible()
      .enabled()
      .execute();
    
    await this.wrapper.tap();
  }

  async logout(): Promise<void> {
    await this.wrapper
      .select(this.selectors.logoutButton)
      .waitFor()
      .visible()
      .enabled()
      .execute();
    
    await this.wrapper.tap();
  }

  async isStatsVisible(): Promise<boolean> {
    return await this.wrapper
      .select(this.selectors.statsContainer)
      .isVisible();
  }
}
```

## Advanced Page Object Patterns

### Base Page Class

Create a base page class to share common functionality:

```typescript
import { E2EWrapper, ElementSelector } from 'e2e-wrapper';

export abstract class BasePage {
  protected wrapper: E2EWrapper;

  constructor(wrapper: E2EWrapper) {
    this.wrapper = wrapper;
  }

  // Common elements that appear on most pages
  protected commonSelectors = {
    loadingSpinner: new ElementSelector('loading', 'testId'),
    errorToast: new ElementSelector('.toast-error', 'css'),
    successToast: new ElementSelector('.toast-success', 'css')
  };

  // Common actions
  async waitForPageLoad(): Promise<void> {
    await this.wrapper
      .select(this.commonSelectors.loadingSpinner)
      .waitFor()
      .notVisible()
      .withTimeout(10000)
      .execute();
  }

  async dismissErrorToast(): Promise<void> {
    const isVisible = await this.wrapper
      .select(this.commonSelectors.errorToast)
      .isVisible();
    
    if (isVisible) {
      await this.wrapper.tap();
    }
  }

  async getSuccessMessage(): Promise<string> {
    await this.wrapper
      .select(this.commonSelectors.successToast)
      .waitFor()
      .visible()
      .execute();
    
    return await this.wrapper.getText();
  }

  // Abstract method that each page must implement
  abstract isOnPage(): Promise<boolean>;
}
```

### Extended Page Objects

```typescript
export class LoginPage extends BasePage {
  private selectors = {
    usernameInput: new ElementSelector('username', 'testId'),
    passwordInput: new ElementSelector('password', 'testId'),
    loginButton: new ElementSelector('login-btn', 'testId')
  };

  async isOnPage(): Promise<boolean> {
    return await this.wrapper
      .select(this.selectors.loginButton)
      .isVisible();
  }

  async login(username: string, password: string): Promise<void> {
    await this.waitForPageLoad();
    
    await this.wrapper
      .select(this.selectors.usernameInput)
      .waitFor()
      .visible()
      .enabled()
      .execute();
    await this.wrapper.type(username);

    await this.wrapper
      .select(this.selectors.passwordInput)
      .waitFor()
      .visible()
      .enabled()
      .execute();
    await this.wrapper.type(password);

    await this.wrapper
      .select(this.selectors.loginButton)
      .waitFor()
      .visible()
      .enabled()
      .execute();
    await this.wrapper.tap();
  }
}
```

## Page Factory Pattern

Create a page factory to manage page object instances:

```typescript
import { E2EWrapper } from 'e2e-wrapper';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';

export class PageFactory {
  private wrapper: E2EWrapper;
  private pages: Map<string, any> = new Map();

  constructor(wrapper: E2EWrapper) {
    this.wrapper = wrapper;
  }

  getLoginPage(): LoginPage {
    if (!this.pages.has('login')) {
      this.pages.set('login', new LoginPage(this.wrapper));
    }
    return this.pages.get('login');
  }

  getDashboardPage(): DashboardPage {
    if (!this.pages.has('dashboard')) {
      this.pages.set('dashboard', new DashboardPage(this.wrapper));
    }
    return this.pages.get('dashboard');
  }

  getProfilePage(): ProfilePage {
    if (!this.pages.has('profile')) {
      this.pages.set('profile', new ProfilePage(this.wrapper));
    }
    return this.pages.get('profile');
  }
}
```

## Using Page Objects in Tests

### Jest/Detox Example

```typescript
import { E2EWrapper } from 'e2e-wrapper';
import { PageFactory } from '../pageObjects/PageFactory';

describe('User Authentication Flow', () => {
  let wrapper: E2EWrapper;
  let pageFactory: PageFactory;

  beforeAll(async () => {
    wrapper = E2EWrapper.forDetox();
    pageFactory = new PageFactory(wrapper);
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  test('should login successfully with valid credentials', async () => {
    const loginPage = pageFactory.getLoginPage();
    const dashboardPage = pageFactory.getDashboardPage();

    // Verify we're on the login page
    expect(await loginPage.isOnPage()).toBe(true);

    // Perform login
    await loginPage.login('testuser@example.com', 'password123');

    // Wait for navigation to dashboard
    await dashboardPage.waitForPageLoad();

    // Verify successful login
    expect(await dashboardPage.isOnPage()).toBe(true);
    const welcomeMessage = await dashboardPage.getWelcomeMessage();
    expect(welcomeMessage).toContain('Welcome');
  });

  test('should show error for invalid credentials', async () => {
    const loginPage = pageFactory.getLoginPage();

    await loginPage.login('invalid@example.com', 'wrongpassword');

    // Check for error message
    expect(await loginPage.isErrorVisible()).toBe(true);
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Invalid credentials');
  });
});
```

### Mocha/Appium Example

```typescript
import { E2EWrapper } from 'e2e-wrapper';
import { PageFactory } from '../pageObjects/PageFactory';
import { expect } from 'chai';

describe('Mobile App Navigation', () => {
  let wrapper: E2EWrapper;
  let pageFactory: PageFactory;

  before(async () => {
    // Initialize with Appium driver
    wrapper = E2EWrapper.forAppium(driver);
    pageFactory = new PageFactory(wrapper);
  });

  it('should navigate through the app successfully', async () => {
    const loginPage = pageFactory.getLoginPage();
    const dashboardPage = pageFactory.getDashboardPage();
    const profilePage = pageFactory.getProfilePage();

    // Login flow
    await loginPage.login('user@test.com', 'password');
    await dashboardPage.waitForPageLoad();

    // Navigate to profile
    await dashboardPage.openUserProfile();
    expect(await profilePage.isOnPage()).to.be.true;

    // Verify profile data loaded
    expect(await profilePage.isProfileDataVisible()).to.be.true;
  });
});
```

## Best Practices

### 1. Keep Page Objects Focused

Each page object should represent a single page or logical component:

```typescript
// Good: Focused on login functionality
class LoginPage {
  async login(username: string, password: string) { /* ... */ }
  async forgotPassword() { /* ... */ }
  async createAccount() { /* ... */ }
}

// Avoid: Too many responsibilities
class AuthPage {
  async login() { /* ... */ }
  async register() { /* ... */ }
  async resetPassword() { /* ... */ }
  async updateProfile() { /* ... */ } // This belongs elsewhere
}
```

### 2. Use Meaningful Method Names

```typescript
// Good: Clear intent
async clickLoginButton(): Promise<void>
async enterUserCredentials(username: string, password: string): Promise<void>
async verifyWelcomeMessageDisplayed(): Promise<boolean>

// Avoid: Generic names
async click(): Promise<void>
async type(): Promise<void>
async check(): Promise<boolean>
```

### 3. Handle Async Operations Properly

```typescript
class ProductPage {
  async addToCart(): Promise<void> {
    await this.wrapper
      .select(this.selectors.addToCartButton)
      .waitFor()
      .visible()
      .enabled()
      .execute();
    
    await this.wrapper.tap();
    
    // Wait for the action to complete
    await this.waitForCartUpdate();
  }

  private async waitForCartUpdate(): Promise<void> {
    await this.wrapper
      .select(this.selectors.cartBadge)
      .waitFor()
      .visible()
      .execute();
  }
}
```

### 4. Implement Proper Error Handling

```typescript
class CheckoutPage {
  async completeOrder(): Promise<void> {
    try {
      await this.wrapper
        .select(this.selectors.placeOrderButton)
        .waitFor()
        .visible()
        .enabled()
        .withTimeout(5000)
        .execute();
      
      await this.wrapper.tap();
      await this.waitForOrderConfirmation();
    } catch (error) {
      // Check if there are validation errors
      const hasErrors = await this.hasValidationErrors();
      if (hasErrors) {
        throw new Error(`Order completion failed: ${await this.getValidationError()}`);
      }
      throw error;
    }
  }

  private async hasValidationErrors(): Promise<boolean> {
    return await this.wrapper
      .select(this.selectors.validationError)
      .isVisible();
  }
}
```

### 5. Use Data-Driven Approaches

```typescript
interface UserCredentials {
  username: string;
  password: string;
  expectedResult: 'success' | 'error';
  errorMessage?: string;
}

class LoginPage {
  async performLogin(credentials: UserCredentials): Promise<void> {
    await this.login(credentials.username, credentials.password);
    
    if (credentials.expectedResult === 'success') {
      await this.waitForLoginSuccess();
    } else {
      expect(await this.isErrorVisible()).toBe(true);
      if (credentials.errorMessage) {
        const actualError = await this.getErrorMessage();
        expect(actualError).toContain(credentials.errorMessage);
      }
    }
  }
}

// In tests
const testCases: UserCredentials[] = [
  { username: 'valid@email.com', password: 'correctpass', expectedResult: 'success' },
  { username: 'invalid@email.com', password: 'wrongpass', expectedResult: 'error', errorMessage: 'Invalid credentials' },
  { username: '', password: 'pass', expectedResult: 'error', errorMessage: 'Username required' }
];

testCases.forEach(testCase => {
  test(`Login with ${testCase.username}`, async () => {
    await loginPage.performLogin(testCase);
  });
});
```

## Component-Based Page Objects

For complex applications, consider creating component objects for reusable UI elements:

```typescript
// Reusable modal component
class ModalComponent {
  private wrapper: E2EWrapper;
  private selectors = {
    modal: new ElementSelector('.modal', 'css'),
    closeButton: new ElementSelector('.modal-close', 'css'),
    confirmButton: new ElementSelector('.modal-confirm', 'css'),
    title: new ElementSelector('.modal-title', 'css')
  };

  constructor(wrapper: E2EWrapper) {
    this.wrapper = wrapper;
  }

  async waitForModal(): Promise<void> {
    await this.wrapper
      .select(this.selectors.modal)
      .waitFor()
      .visible()
      .execute();
  }

  async close(): Promise<void> {
    await this.wrapper
      .select(this.selectors.closeButton)
      .waitFor()
      .visible()
      .enabled()
      .execute();
    await this.wrapper.tap();
  }

  async confirm(): Promise<void> {
    await this.wrapper
      .select(this.selectors.confirmButton)
      .waitFor()
      .visible()
      .enabled()
      .execute();
    await this.wrapper.tap();
  }

  async getTitle(): Promise<string> {
    return await this.wrapper
      .select(this.selectors.title)
      .getText();
  }
}

// Use in page objects
class DeleteUserPage {
  private modal: ModalComponent;

  constructor(wrapper: E2EWrapper) {
    this.modal = new ModalComponent(wrapper);
  }

  async confirmDeletion(): Promise<void> {
    await this.modal.waitForModal();
    expect(await this.modal.getTitle()).toContain('Delete User');
    await this.modal.confirm();
  }
}
```

The Page Object Model with E2E Wrapper provides a robust foundation for building maintainable, scalable end-to-end tests. By following these patterns and best practices, you can create test suites that are easy to understand, modify, and extend as your application evolves. 