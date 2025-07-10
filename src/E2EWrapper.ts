import { IE2EWrapper, IWaitBuilder, IScrollBuilder, ElementSelector, IElementDriver, TestFramework, WaitOptions, ScrollOptions, FrameworkConfig } from './types';
import { WaitBuilder } from './core/WaitBuilder';
import { ScrollBuilder } from './core/ScrollBuilder';
import { DetoxElementDriver } from './drivers/DetoxElementDriver';
import { AppiumElementDriver } from './drivers/AppiumElementDriver';

export class E2EWrapper implements IE2EWrapper {
  private driver: IElementDriver;
  private selector: ElementSelector;
  
  // Static configuration for framework-agnostic usage
  private static config: FrameworkConfig = {
    framework: TestFramework.DETOX // Default framework
  };

  constructor(selector: ElementSelector, driver: IElementDriver) {
    this.selector = selector;
    this.driver = driver;
  }

  /**
   * Configure the default framework for framework-agnostic usage
   */
  static configure(config: FrameworkConfig): void {
    this.config = { ...config };
  }

  /**
   * Set framework via environment variable or direct call
   */
  static setFramework(framework: TestFramework, driver?: any): void {
    this.config.framework = framework;
    if (framework === TestFramework.APPIUM && driver) {
      this.config.appiumDriver = driver;
    }
  }

  /**
   * Get current framework configuration
   */
  static getFrameworkConfig(): FrameworkConfig {
    return { ...this.config };
  }

  /**
   * Framework-agnostic element creation - uses configured framework
   */
  static create(selector: ElementSelector, options?: { framework?: TestFramework; driver?: any; detoxElement?: any }): IE2EWrapper {
    // Allow per-call override of framework
    const framework = options?.framework || this.config.framework;
    
    switch (framework) {
      case TestFramework.DETOX:
        return this.withDetox(selector, options?.detoxElement || this.config.detoxElement);
      
      case TestFramework.APPIUM:
        const appiumDriver = options?.driver || this.config.appiumDriver;
        if (!appiumDriver) {
          throw new Error('Appium driver must be provided either in configure() or create() options');
        }
        return this.withAppium(selector, appiumDriver);
      
      default:
        throw new Error(`Unsupported framework: ${framework}. Use TestFramework.DETOX or TestFramework.APPIUM`);
    }
  }

  /**
   * Convenience alias for create() - more semantic for element creation
   */
  static element(selector: ElementSelector, options?: { framework?: TestFramework; driver?: any; detoxElement?: any }): IE2EWrapper {
    return this.create(selector, options);
  }

  /**
   * Auto-configure from environment variables
   */
  static configureFromEnvironment(): void {
    const frameworkEnv = process.env.E2E_FRAMEWORK?.toLowerCase();
    
    switch (frameworkEnv) {
      case 'detox':
        this.setFramework(TestFramework.DETOX);
        break;
      case 'appium':
        this.setFramework(TestFramework.APPIUM);
        break;
      default:
        // Keep current configuration if no env var set
        break;
    }
  }

  /**
   * Create a new wait builder for chaining wait conditions
   */
  wait(): IWaitBuilder {
    return new WaitBuilder(this.selector, this.driver, this);
  }

  /**
   * Create a new scroll builder for scrolling to this element
   */
  scrollTo(options: ScrollOptions = {}): IScrollBuilder {
    return new ScrollBuilder(this.driver, this.selector, options);
  }

  /**
   * Get the underlying driver instance
   */
  getDriver(): IElementDriver {
    return this.driver;
  }

  /**
   * Get the element selector
   */
  getSelector(): ElementSelector {
    return this.selector;
  }

  /**
   * Create a new wrapper with a different selector but same driver
   */
  withSelector(selector: ElementSelector): IE2EWrapper {
    return new E2EWrapper(selector, this.driver);
  }

  /**
   * Factory method to create E2EWrapper with Detox driver
   */
  static withDetox(selector: ElementSelector, detoxElement?: any): IE2EWrapper {
    const driver = new DetoxElementDriver(detoxElement);
    return new E2EWrapper(selector, driver);
  }

  /**
   * Factory method to create E2EWrapper with Appium driver
   */
  static withAppium(selector: ElementSelector, appiumDriver: any): IE2EWrapper {
    const driver = new AppiumElementDriver(appiumDriver);
    return new E2EWrapper(selector, driver);
  }

  /**
   * Factory method to create E2EWrapper with custom driver
   */
  static withCustomDriver(selector: ElementSelector, driver: IElementDriver): IE2EWrapper {
    return new E2EWrapper(selector, driver);
  }

  /**
   * Direct element operations (proxy methods)
   */
  async getText(options?: WaitOptions): Promise<string> {
    return this.driver.getText(this.selector, options);
  }

  async getAttribute(attributeName: string, options?: WaitOptions): Promise<string | null> {
    return this.driver.getAttribute(this.selector, attributeName, options);
  }

  async getProperty(propertyName: string, options?: WaitOptions): Promise<any> {
    return this.driver.getProperty(this.selector, propertyName, options);
  }

  async getElement(options?: WaitOptions): Promise<any> {
    return this.driver.getElement(this.selector, options);
  }

  /**
   * State checking methods
   */
  async isVisible(options?: WaitOptions): Promise<boolean> {
    return this.driver.isVisible(this.selector, options);
  }

  async isEnabled(options?: WaitOptions): Promise<boolean> {
    return this.driver.isEnabled(this.selector, options);
  }

  async exists(options?: WaitOptions): Promise<boolean> {
    return this.driver.exists(this.selector, options);
  }

  /**
   * Interaction methods (available if supported by the driver)
   */
  async tap(options?: WaitOptions): Promise<void> {
    if (this.driver.tap) {
      return this.driver.tap(this.selector, options);
    }
    throw new Error('tap() method not supported by this driver');
  }

  async typeText(text: string, options?: WaitOptions): Promise<void> {
    if (this.driver.typeText) {
      return this.driver.typeText(this.selector, text, options);
    }
    throw new Error('typeText() method not supported by this driver');
  }

  async clearText(options?: WaitOptions): Promise<void> {
    if (this.driver.clearText) {
      return this.driver.clearText(this.selector, options);
    }
    throw new Error('clearText() method not supported by this driver');
  }

  async dismissKeyboard(): Promise<void> {
    if (this.driver.dismissKeyboard) {
      return this.driver.dismissKeyboard();
    }
    throw new Error('dismissKeyboard() method not supported by this driver');
  }
} 