import { BaseElementDriver } from './BaseElementDriver';
import { ElementSelector, WaitOptions, TestFramework } from '../types';

export class DetoxElementDriver extends BaseElementDriver {
  private detoxElement: any; // Detox element instance

  constructor(detoxElement?: any) {
    super(TestFramework.DETOX);
    this.detoxElement = detoxElement;
  }

  async isVisible(selector: ElementSelector, options: WaitOptions = {}): Promise<boolean> {
    try {
      const element = this.buildDetoxElement(selector);
      await element.waitFor().toBeVisible().withTimeout(options.timeout || 5000);
      return true;
    } catch (error) {
      return false;
    }
  }

  async isEnabled(selector: ElementSelector, options: WaitOptions = {}): Promise<boolean> {
    try {
      const element = this.buildDetoxElement(selector);
      await element.waitFor().toBeEnabled().withTimeout(options.timeout || 5000);
      return true;
    } catch (error) {
      return false;
    }
  }

  async exists(selector: ElementSelector, options: WaitOptions = {}): Promise<boolean> {
    try {
      const element = this.buildDetoxElement(selector);
      await element.waitFor().toExist().withTimeout(options.timeout || 5000);
      return true;
    } catch (error) {
      return false;
    }
  }

  private buildDetoxElement(selector: ElementSelector): any {
    // If detoxElement is already provided, use it
    if (this.detoxElement) {
      return this.detoxElement;
    }

    // Otherwise, build element from selector
    // Note: This assumes global `element` and `by` are available from Detox
    // These will be available when Detox is properly set up in the test environment
    const globalElement = (globalThis as any).element;
    const globalBy = (globalThis as any).by;
    
    if (!globalElement || !globalBy) {
      throw new Error('Detox element/by not available. Make sure Detox is properly initialized.');
    }

    if (selector.id) {
      return globalElement(globalBy.id(selector.id));
    }
    if (selector.testId) {
      return globalElement(globalBy.id(selector.testId));
    }
    if (selector.text) {
      return globalElement(globalBy.text(selector.text));
    }
    if (selector.accessibility) {
      return globalElement(globalBy.accessibilityLabel(selector.accessibility));
    }
    if (selector.className) {
      return globalElement(globalBy.type(selector.className));
    }

    throw new Error('Unsupported selector for Detox. Use id, testId, text, accessibility, or className.');
  }

  /**
   * Set the detox element instance (useful for chaining with existing detox elements)
   */
  setDetoxElement(detoxElement: any): void {
    this.detoxElement = detoxElement;
  }

  /**
   * Get the underlying detox element
   */
  getDetoxElement(): any {
    return this.detoxElement;
  }
} 