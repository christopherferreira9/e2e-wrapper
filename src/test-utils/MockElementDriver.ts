import { ElementSelector, IElementDriver, WaitOptions, TestFramework, ElementState } from '../types';
import { BaseElementDriver } from '../drivers/BaseElementDriver';

/**
 * Mock driver for testing - provides controllable mock behavior
 */
export class MockElementDriver extends BaseElementDriver {
  private mockStates: { [key: string]: boolean } = {};
  private mockAttributes: { [key: string]: { [attr: string]: string } } = {};
  private mockProperties: { [key: string]: { [prop: string]: any } } = {};
  private mockTexts: { [key: string]: string } = {};

  constructor() {
    super(TestFramework.DETOX);
  }

  setMockState(selector: string, isVisible: boolean, isEnabled: boolean, exists: boolean) {
    this.mockStates[selector] = exists;
    this.mockStates[`${selector}_visible`] = isVisible;
    this.mockStates[`${selector}_enabled`] = isEnabled;
  }

  setMockAttribute(selector: string, attributeName: string, value: string) {
    const key = this.getSelectorKey({ testId: selector });
    if (!this.mockAttributes[key]) {
      this.mockAttributes[key] = {};
    }
    this.mockAttributes[key][attributeName] = value;
  }

  setMockProperty(selector: string, propertyName: string, value: any) {
    const key = this.getSelectorKey({ testId: selector });
    if (!this.mockProperties[key]) {
      this.mockProperties[key] = {};
    }
    this.mockProperties[key][propertyName] = value;
  }

  setMockText(selector: string, text: string) {
    const key = this.getSelectorKey({ testId: selector });
    this.mockTexts[key] = text;
  }

  async isVisible(selector: ElementSelector, options?: WaitOptions): Promise<boolean> {
    const key = this.getSelectorKey(selector);
    return this.mockStates[`${key}_visible`] || false;
  }

  async isEnabled(selector: ElementSelector, options?: WaitOptions): Promise<boolean> {
    const key = this.getSelectorKey(selector);
    return this.mockStates[`${key}_enabled`] || false;
  }

  async exists(selector: ElementSelector, options?: WaitOptions): Promise<boolean> {
    const key = this.getSelectorKey(selector);
    return this.mockStates[key] || false;
  }

  async waitForState(selector: ElementSelector, state: ElementState, options?: WaitOptions): Promise<boolean> {
    const key = this.getSelectorKey(selector);
    const exists = this.mockStates[key] || false;
    const isVisible = this.mockStates[`${key}_visible`] || false;
    const isEnabled = this.mockStates[`${key}_enabled`] || false;

    if (state.exists !== undefined && state.exists !== exists) return false;
    if (state.isVisible !== undefined && state.isVisible !== isVisible) return false;
    if (state.isEnabled !== undefined && state.isEnabled !== isEnabled) return false;

    return true;
  }

  getFramework(): TestFramework {
    return TestFramework.DETOX;
  }

  async getAttribute(selector: ElementSelector, attributeName: string, options?: WaitOptions): Promise<string | null> {
    const key = this.getSelectorKey(selector);
    return this.mockAttributes[key]?.[attributeName] || null;
  }

  async getProperty(selector: ElementSelector, propertyName: string, options?: WaitOptions): Promise<any> {
    const key = this.getSelectorKey(selector);
    return this.mockProperties[key]?.[propertyName] || null;
  }

  async getText(selector: ElementSelector, options?: WaitOptions): Promise<string> {
    const key = this.getSelectorKey(selector);
    return this.mockTexts[key] || '';
  }

  async getElement(selector: ElementSelector, options?: WaitOptions): Promise<any> {
    const key = this.getSelectorKey(selector);
    const exists = this.mockStates[key] || false;
    return exists ? { mockElement: key } : null;
  }

  private getSelectorKey(selector: ElementSelector): string {
    return selector.testId || selector.id || selector.text || 'default';
  }
} 