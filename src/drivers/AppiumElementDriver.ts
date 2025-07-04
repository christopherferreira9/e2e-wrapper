import { BaseElementDriver } from './BaseElementDriver';
import { ElementSelector, WaitOptions, TestFramework } from '../types';

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
} 