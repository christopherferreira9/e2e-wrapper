import { IE2EWrapper, IWaitBuilder, ElementSelector, IElementDriver, TestFramework } from './types';
import { WaitBuilder } from './core/WaitBuilder';
import { DetoxElementDriver } from './drivers/DetoxElementDriver';
import { AppiumElementDriver } from './drivers/AppiumElementDriver';

export class E2EWrapper implements IE2EWrapper {
  private driver: IElementDriver;
  private selector: ElementSelector;

  constructor(selector: ElementSelector, driver: IElementDriver) {
    this.selector = selector;
    this.driver = driver;
  }

  /**
   * Create a new wait builder for chaining wait conditions
   */
  wait(): IWaitBuilder {
    return new WaitBuilder(this.selector, this.driver);
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
  withSelector(selector: ElementSelector): E2EWrapper {
    return new E2EWrapper(selector, this.driver);
  }

  /**
   * Factory method to create E2EWrapper with Detox driver
   */
  static withDetox(selector: ElementSelector, detoxElement?: any): E2EWrapper {
    const driver = new DetoxElementDriver(detoxElement);
    return new E2EWrapper(selector, driver);
  }

  /**
   * Factory method to create E2EWrapper with Appium driver
   */
  static withAppium(selector: ElementSelector, appiumDriver: any): E2EWrapper {
    const driver = new AppiumElementDriver(appiumDriver);
    return new E2EWrapper(selector, driver);
  }

  /**
   * Factory method to create E2EWrapper with custom driver
   */
  static withCustomDriver(selector: ElementSelector, driver: IElementDriver): E2EWrapper {
    return new E2EWrapper(selector, driver);
  }

  /**
   * Quick access methods for common operations (bypassing the builder pattern when needed)
   */
  async isVisible(): Promise<boolean> {
    return this.driver.isVisible(this.selector);
  }

  async isEnabled(): Promise<boolean> {
    return this.driver.isEnabled(this.selector);
  }

  async exists(): Promise<boolean> {
    return this.driver.exists(this.selector);
  }
} 