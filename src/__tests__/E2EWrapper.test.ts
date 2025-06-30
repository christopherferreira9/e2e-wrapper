import { ElementSelector, IElementDriver, WaitOptions, TestFramework } from '../types';
import { BaseElementDriver } from '../drivers/BaseElementDriver';
import { E2EWrapper } from '../E2EWrapper';

// Mock driver for testing
class MockElementDriver extends BaseElementDriver {
  private mockStates: { [key: string]: boolean } = {};

  constructor() {
    super(TestFramework.PLAYWRIGHT);
  }

  setMockState(selector: string, isVisible: boolean, isEnabled: boolean, exists: boolean) {
    this.mockStates[selector] = exists;
    this.mockStates[`${selector}_visible`] = isVisible;
    this.mockStates[`${selector}_enabled`] = isEnabled;
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

  private getSelectorKey(selector: ElementSelector): string {
    return selector.testId || selector.id || selector.text || 'default';
  }
}

describe('E2EWrapper', () => {
  let mockDriver: MockElementDriver;
  let wrapper: E2EWrapper;
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

      expect(result).toBe(true);
    });

    it('should chain wait conditions - enabled then visible', async () => {
      mockDriver.setMockState('test-button', true, true, true);
      
      const result = await wrapper
        .wait()
        .forEnabled()
        .forVisible()
        .execute();

      expect(result).toBe(true);
    });

    it('should fail when condition is not met', async () => {
      mockDriver.setMockState('test-button', false, true, true);
      
      const result = await wrapper
        .wait()
        .forVisible({ timeout: 1000 })
        .execute();

      expect(result).toBe(false);
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
}); 