import { BaseElementDriver } from './BaseElementDriver';
import { ElementSelector, WaitOptions, TestFramework, ScrollDirection, ScrollOptions } from '../types';
import { logger } from '../utils/logger';

export class AppiumElementDriver extends BaseElementDriver {
  private driver: any; // WebDriver instance from Appium

  constructor(driver: any) {
    super(TestFramework.APPIUM);
    this.driver = driver;
  }

  async isVisible(selector: ElementSelector, options: WaitOptions = {}): Promise<boolean> {
    try {
      const element = await this.findElement(selector);
      return await element.isDisplayed();
    } catch (error) {
      return false;
    }
  }

  async isEnabled(selector: ElementSelector, options: WaitOptions = {}): Promise<boolean> {
    try {
      const element = await this.findElement(selector);
      return await element.isEnabled();
    } catch (error) {
      return false;
    }
  }

  async exists(selector: ElementSelector, options: WaitOptions = {}): Promise<boolean> {
    try {
      await this.findElement(selector);
      return true;
    } catch (error) {
      return false;
    }
  }

  async getAttribute(selector: ElementSelector, attributeName: string, options: WaitOptions = {}): Promise<string | null> {
    try {
      const element = await this.findElement(selector);
      return await element.getAttribute(attributeName);
    } catch (error) {
      return null;
    }
  }

  async getProperty(selector: ElementSelector, propertyName: string, options: WaitOptions = {}): Promise<any> {
    try {
      const element = await this.findElement(selector);
      return await element.getProperty(propertyName);
    } catch (error) {
      return null;
    }
  }

  async getText(selector: ElementSelector, options: WaitOptions = {}): Promise<string> {
    try {
      const element = await this.findElement(selector);
      return await element.getText();
    } catch (error) {
      return '';
    }
  }

  async getElement(selector: ElementSelector, options: WaitOptions = {}): Promise<any> {
    try {
      return await this.findElement(selector);
    } catch (error) {
      return null;
    }
  }

  private async findElement(selector: ElementSelector): Promise<any> {
    if (!this.driver) {
      throw new Error('Appium driver not initialized');
    }

    if (selector.id) {
      return await this.driver.findElement('id', selector.id);
    }
    if (selector.testId) {
      // For React Native testID
      return await this.driver.findElement('accessibility id', selector.testId);
    }
    if (selector.xpath) {
      return await this.driver.findElement('xpath', selector.xpath);
    }
    if (selector.className) {
      return await this.driver.findElement('class name', selector.className);
    }
    if (selector.accessibility) {
      return await this.driver.findElement('accessibility id', selector.accessibility);
    }
    if (selector.text) {
      // Try different text-based selectors
      try {
        return await this.driver.findElement('xpath', `//*[@text="${selector.text}"]`);
      } catch {
        return await this.driver.findElement('xpath', `//*[contains(@text, "${selector.text}")]`);
      }
    }

    throw new Error('Unsupported selector for Appium. Use id, testId, xpath, className, accessibility, or text.');
  }

  /**
   * Wait for element with Appium's built-in wait
   */
  async waitForElement(selector: ElementSelector, options: WaitOptions = {}): Promise<any> {
    const timeout = options.timeout || 5000;
    
    if (selector.id) {
      return await this.driver.waitForElementById(selector.id, timeout);
    }
    if (selector.testId || selector.accessibility) {
      return await this.driver.waitForElementByAccessibilityId(selector.testId || selector.accessibility, timeout);
    }
    if (selector.xpath) {
      return await this.driver.waitForElementByXPath(selector.xpath, timeout);
    }
    if (selector.className) {
      return await this.driver.waitForElementByClassName(selector.className, timeout);
    }

    throw new Error('Unsupported selector for Appium wait operations');
  }

  /**
   * Get the underlying Appium driver
   */
  getAppiumDriver(): any {
    return this.driver;
  }

  /**
   * Interaction methods specific to Appium
   */
  async tap(selector: ElementSelector, options: WaitOptions = {}): Promise<void> {
    const element = await this.findElement(selector);
    await element.click();
  }

  async typeText(selector: ElementSelector, text: string, options: WaitOptions = {}): Promise<void> {
    const element = await this.findElement(selector);
    await element.sendKeys(text);
    
    // Auto-dismiss keyboard unless explicitly disabled
    const shouldDismissKeyboard = options.dismissKeyboard !== false; // default to true
    if (shouldDismissKeyboard) {
      await this.dismissKeyboard();
    }
  }

  async clearText(selector: ElementSelector, options: WaitOptions = {}): Promise<void> {
    const element = await this.findElement(selector);
    await element.clear();
  }

  async dismissKeyboard(): Promise<void> {
    try {
      if (this.driver && this.driver.hideKeyboard) {
        await this.driver.hideKeyboard();
      }
    } catch (error) {
      logger.warn('Failed to dismiss keyboard:', error);
    }
  }

  /**
   * Scroll methods for Appium
   */
  async scroll(direction: ScrollDirection, amount: number = 0.3, containerSelector?: ElementSelector): Promise<void> {
    if (!this.driver) {
      throw new Error('Appium driver not available for scrolling');
    }

    // Get screen size for scroll calculations
    const { width, height } = await this.driver.getWindowSize();
    
    // Calculate scroll coordinates based on direction and amount
    let startX: number, startY: number, endX: number, endY: number;
    
    switch (direction) {
      case ScrollDirection.DOWN:
        startX = width / 2;
        startY = height * (1 - amount);
        endX = width / 2;
        endY = height * amount;
        break;
      case ScrollDirection.UP:
        startX = width / 2;
        startY = height * amount;
        endX = width / 2;
        endY = height * (1 - amount);
        break;
      case ScrollDirection.LEFT:
        startX = width * (1 - amount);
        startY = height / 2;
        endX = width * amount;
        endY = height / 2;
        break;
      case ScrollDirection.RIGHT:
        startX = width * amount;
        startY = height / 2;
        endX = width * (1 - amount);
        endY = height / 2;
        break;
      default:
        throw new Error(`Unsupported scroll direction: ${direction}`);
    }

    // Perform scroll action using touch action
    await this.driver.touchAction([
      { action: 'press', x: startX, y: startY },
      { action: 'moveTo', x: endX, y: endY },
      { action: 'release' }
    ]);
  }

  async scrollUntilVisible(targetSelector: ElementSelector, options: ScrollOptions = {}): Promise<boolean> {
    const startTime = Date.now();
    const timeout = options.timeout || 10000;
    const interval = options.interval || 500;
    const direction = options.direction || ScrollDirection.DOWN;
    const scrollAmount = options.scrollAmount || 0.3;
    
    while (Date.now() - startTime < timeout) {
      // Check if target element is visible
      const isVisible = await this.isVisible(targetSelector);
      if (isVisible) {
        return true;
      }
      
      // Scroll if element is not visible
      await this.scroll(direction, scrollAmount, options.containerSelector);
      
      // Wait before next attempt
      await new Promise(resolve => setTimeout(resolve, interval));
    }
    
    return false;
  }

  /**
   * Check if element is substantially visible (fallback to basic visibility for Appium)
   */
  async isSubstantiallyVisible(selector: ElementSelector, threshold: number = 0.75): Promise<boolean> {
    // For Appium, we'll use a simpler approach for now
    // This could be enhanced with getBounds() or similar methods if available
    return await this.isVisible(selector);
  }

  /**
   * Center element in viewport (basic implementation for Appium)
   */
  async centerElementInViewport(selector: ElementSelector): Promise<void> {
    // For Appium, we can try to scroll to the element
    // This is a simplified implementation
    try {
      const element = await this.findElement(selector);
      await element.scrollIntoView();
    } catch (error) {
      logger.warn('Failed to center element in viewport:', error);
    }
  }
} 