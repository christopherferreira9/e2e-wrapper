import { ElementSelector, IElementDriver, WaitOptions, TestFramework, IE2EWrapper } from '../types';
import { BaseElementDriver } from '../drivers/BaseElementDriver';
import { E2EWrapper } from '../E2EWrapper';

// Mock driver for testing
class MockElementDriver extends BaseElementDriver {
  private mockStates: { [key: string]: boolean } = {};
  private mockAttributes: { [key: string]: { [attr: string]: string } } = {};
  private mockProperties: { [key: string]: { [prop: string]: any } } = {};
  private mockTexts: { [key: string]: string } = {};

  constructor() {
    super(TestFramework.PLAYWRIGHT);
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

describe('E2EWrapper', () => {
  let mockDriver: MockElementDriver;
  let wrapper: IE2EWrapper;
  let selector: ElementSelector;

  beforeEach(() => {
    mockDriver = new MockElementDriver();
    selector = { testId: 'test-button' };
    wrapper = E2EWrapper.withCustomDriver(selector, mockDriver);
  });

  describe('Factory Methods', () => {
    it('should create wrapper with Detox driver', () => {
      const detoxWrapper = E2EWrapper.withDetox(selector);
      expect(detoxWrapper).toBeInstanceOf(E2EWrapper);
      expect(detoxWrapper.getDriver().getFramework()).toBe(TestFramework.DETOX);
    });

    it('should create wrapper with custom driver', () => {
      const customWrapper = E2EWrapper.withCustomDriver(selector, mockDriver);
      expect(customWrapper).toBeInstanceOf(E2EWrapper);
      expect(customWrapper.getDriver()).toBe(mockDriver);
    });
  });

  describe('Quick Access Methods', () => {
    it('should check if element is visible', async () => {
      mockDriver.setMockState('test-button', true, false, true);
      const result = await wrapper.isVisible();
      expect(result).toBe(true);
    });

    it('should check if element is enabled', async () => {
      mockDriver.setMockState('test-button', false, true, true);
      const result = await wrapper.isEnabled();
      expect(result).toBe(true);
    });

    it('should check if element exists', async () => {
      mockDriver.setMockState('test-button', false, false, true);
      const result = await wrapper.exists();
      expect(result).toBe(true);
    });
  });

  describe('Wait Builder Pattern', () => {
    it('should create wait builder', () => {
      const waitBuilder = wrapper.wait();
      expect(waitBuilder).toBeDefined();
      expect(typeof waitBuilder.forVisible).toBe('function');
      expect(typeof waitBuilder.forEnabled).toBe('function');
      expect(typeof waitBuilder.execute).toBe('function');
    });

    it('should chain wait conditions - visible then enabled', async () => {
      mockDriver.setMockState('test-button', true, true, true);
      
      const result = await wrapper
        .wait()
        .forVisible()
        .forEnabled()
        .execute();

      expect(result).toBe(wrapper);
    });

    it('should chain wait conditions - enabled then visible', async () => {
      mockDriver.setMockState('test-button', true, true, true);
      
      const result = await wrapper
        .wait()
        .forEnabled()
        .forVisible()
        .execute();

      expect(result).toBe(wrapper);
    });

    it('should fail when condition is not met', async () => {
      mockDriver.setMockState('test-button', false, true, true);
      
      await expect(wrapper
        .wait()
        .forVisible({ timeout: 1000 })
        .execute()
      ).rejects.toThrow('Wait condition failed: Wait for element to be visible');
    }, 10000);

    it('should throw error when no conditions specified', async () => {
      await expect(wrapper.wait().execute()).rejects.toThrow(
        'No wait conditions specified'
      );
    });
  });

  describe('Selector Management', () => {
    it('should return current selector', () => {
      const currentSelector = wrapper.getSelector();
      expect(currentSelector).toEqual(selector);
    });

    it('should create new wrapper with different selector', () => {
      const newSelector: ElementSelector = { id: 'new-button' };
      const newWrapper = wrapper.withSelector(newSelector);
      
      expect(newWrapper).toBeInstanceOf(E2EWrapper);
      expect(newWrapper.getSelector()).toEqual(newSelector);
      expect(newWrapper.getDriver()).toBe(mockDriver); // Same driver
    });
  });

  describe('Driver Access', () => {
    it('should return the underlying driver', () => {
      const driver = wrapper.getDriver();
      expect(driver).toBe(mockDriver);
    });
  });

  describe('Custom Conditions', () => {
    it('should wait for element to have specific className', async () => {
      mockDriver.setMockState('test-button', true, true, true);
      mockDriver.setMockAttribute('test-button', 'class', 'btn primary active');
      
      const result = await wrapper
        .wait()
        .forCustom({ hasClassName: 'primary' })
        .execute();

      expect(result).toBe(wrapper);
    });

    it('should fail when element does not have expected className', async () => {
      mockDriver.setMockState('test-button', true, true, true);
      mockDriver.setMockAttribute('test-button', 'class', 'btn secondary');
      
      await expect(wrapper
        .wait()
        .forCustom({ hasClassName: 'primary' }, { timeout: 1000 })
        .execute()
      ).rejects.toThrow('Wait condition failed: Wait for element to have class "primary"');
    }, 10000);

    it('should wait for element to have specific attribute', async () => {
      mockDriver.setMockState('test-button', true, true, true);
      mockDriver.setMockAttribute('test-button', 'data-status', 'active');
      
      const result = await wrapper
        .wait()
        .forCustom({ hasAttribute: { name: 'data-status', value: 'active' } })
        .execute();

      expect(result).toBe(wrapper);
    });

    it('should wait for element to have attribute (without checking value)', async () => {
      mockDriver.setMockState('test-button', true, true, true);
      mockDriver.setMockAttribute('test-button', 'disabled', 'true');
      
      const result = await wrapper
        .wait()
        .forCustom({ hasAttribute: { name: 'disabled' } })
        .execute();

      expect(result).toBe(wrapper);
    });

    it('should wait for element to contain specific text', async () => {
      mockDriver.setMockState('test-button', true, true, true);
      mockDriver.setMockText('test-button', 'Click me to submit');
      
      const result = await wrapper
        .wait()
        .forCustom({ hasText: 'Click me' })
        .execute();

      expect(result).toBe(wrapper);
    });

    it('should wait for element to have specific property', async () => {
      mockDriver.setMockState('test-button', true, true, true);
      mockDriver.setMockProperty('test-button', 'checked', true);
      
      const result = await wrapper
        .wait()
        .forCustom({ hasProperty: { name: 'checked', value: true } })
        .execute();

      expect(result).toBe(wrapper);
    });

    it('should wait for custom predicate function', async () => {
      mockDriver.setMockState('test-button', true, true, true);
      mockDriver.setMockAttribute('test-button', 'data-count', '5');
      
      const result = await wrapper
        .wait()
        .forCustom({ 
          custom: async (element, driver) => {
            const count = await driver.getAttribute(selector, 'data-count');
            return parseInt(count || '0') > 3;
          }
        })
        .execute();

      expect(result).toBe(wrapper);
    });

    it('should chain custom conditions with regular conditions', async () => {
      mockDriver.setMockState('test-button', true, true, true);
      mockDriver.setMockAttribute('test-button', 'class', 'btn primary');
      
      const result = await wrapper
        .wait()
        .forVisible()
        .forCustom({ hasClassName: 'primary' })
        .forEnabled()
        .execute();

      expect(result).toBe(wrapper);
    });

    it('should fail when element does not exist for custom condition', async () => {
      mockDriver.setMockState('test-button', true, true, false); // element doesn't exist
      
      await expect(wrapper
        .wait()
        .forCustom({ hasClassName: 'primary' }, { timeout: 1000 })
        .execute()
      ).rejects.toThrow('Wait condition failed: Wait for element to have class "primary"');
    }, 10000);

    it('should get condition descriptions for custom conditions', async () => {
      const waitBuilder = wrapper
        .wait()
        .forCustom({ hasClassName: 'primary' })
        .forCustom({ hasAttribute: { name: 'data-status', value: 'active' } })
        .forCustom({ hasText: 'Click me' })
        .forCustom({ hasProperty: { name: 'checked', value: true } });

      const descriptions = waitBuilder.getConditionDescriptions();
      
      expect(descriptions).toEqual([
        'Wait for element to have class "primary"',
        'Wait for element to have attribute "data-status" with value "active"',
        'Wait for element to contain text "Click me"',
        'Wait for element to have property "checked" with value "true"'
      ]);
    });

    it('should handle custom predicate condition description', async () => {
      const waitBuilder = wrapper
        .wait()
        .forCustom({ 
          custom: async (element, driver) => true 
        });

      const descriptions = waitBuilder.getConditionDescriptions();
      
      expect(descriptions).toEqual([
        'Wait for custom condition to be met'
      ]);
    });
  });
}); 