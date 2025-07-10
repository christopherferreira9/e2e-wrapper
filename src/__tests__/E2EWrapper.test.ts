import { ElementSelector, TestFramework, IE2EWrapper } from '../types';
import { E2EWrapper } from '../E2EWrapper';
import { MockElementDriver } from '../test-utils/MockElementDriver';

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

  describe('Framework-Agnostic API', () => {
    let originalEnv: string | undefined;
    let mockAppiumDriver: any;

    beforeAll(() => {
      // Save original environment
      originalEnv = process.env.E2E_FRAMEWORK;
      
      // Create mock Appium driver
      mockAppiumDriver = {
        findElement: jest.fn(),
        getWindowSize: jest.fn(),
        hideKeyboard: jest.fn()
      };
    });

    afterAll(() => {
      // Restore original environment
      if (originalEnv !== undefined) {
        process.env.E2E_FRAMEWORK = originalEnv;
      } else {
        delete process.env.E2E_FRAMEWORK;
      }
    });

    beforeEach(() => {
      // Reset configuration before each test
      E2EWrapper.configure({ framework: TestFramework.DETOX });
      delete process.env.E2E_FRAMEWORK;
    });

    describe('Configuration Management', () => {
      it('should configure default framework', () => {
        E2EWrapper.configure({
          framework: TestFramework.DETOX
        });

        const config = E2EWrapper.getFrameworkConfig();
        expect(config.framework).toBe(TestFramework.DETOX);
      });

      it('should configure Appium framework with driver', () => {
        E2EWrapper.configure({
          framework: TestFramework.APPIUM,
          appiumDriver: mockAppiumDriver
        });

        const config = E2EWrapper.getFrameworkConfig();
        expect(config.framework).toBe(TestFramework.APPIUM);
        expect(config.appiumDriver).toBe(mockAppiumDriver);
      });

      it('should set framework using setFramework method', () => {
        E2EWrapper.setFramework(TestFramework.DETOX);
        
        const config = E2EWrapper.getFrameworkConfig();
        expect(config.framework).toBe(TestFramework.DETOX);
      });

      it('should set framework with driver using setFramework method', () => {
        E2EWrapper.setFramework(TestFramework.APPIUM, mockAppiumDriver);
        
        const config = E2EWrapper.getFrameworkConfig();
        expect(config.framework).toBe(TestFramework.APPIUM);
        expect(config.appiumDriver).toBe(mockAppiumDriver);
      });
    });

    describe('Environment Configuration', () => {
      it('should configure from environment variable - detox', () => {
        process.env.E2E_FRAMEWORK = 'detox';
        
        E2EWrapper.configureFromEnvironment();
        
        const config = E2EWrapper.getFrameworkConfig();
        expect(config.framework).toBe(TestFramework.DETOX);
      });

      it('should configure from environment variable - appium', () => {
        process.env.E2E_FRAMEWORK = 'appium';
        
        E2EWrapper.configureFromEnvironment();
        
        const config = E2EWrapper.getFrameworkConfig();
        expect(config.framework).toBe(TestFramework.APPIUM);
      });

      it('should handle uppercase environment variable', () => {
        process.env.E2E_FRAMEWORK = 'DETOX';
        
        E2EWrapper.configureFromEnvironment();
        
        const config = E2EWrapper.getFrameworkConfig();
        expect(config.framework).toBe(TestFramework.DETOX);
      });

      it('should keep current configuration when environment variable is not set', () => {
        E2EWrapper.configure({ framework: TestFramework.APPIUM, appiumDriver: mockAppiumDriver });
        delete process.env.E2E_FRAMEWORK;
        
        E2EWrapper.configureFromEnvironment();
        
        const config = E2EWrapper.getFrameworkConfig();
        expect(config.framework).toBe(TestFramework.APPIUM);
      });

      it('should keep current configuration when environment variable is invalid', () => {
        E2EWrapper.configure({ framework: TestFramework.DETOX });
        process.env.E2E_FRAMEWORK = 'invalid-framework';
        
        E2EWrapper.configureFromEnvironment();
        
        const config = E2EWrapper.getFrameworkConfig();
        expect(config.framework).toBe(TestFramework.DETOX);
      });
    });

    describe('Framework-Agnostic Element Creation', () => {
      it('should create Detox element when framework is configured as Detox', () => {
        E2EWrapper.configure({ framework: TestFramework.DETOX });
        
        const element = E2EWrapper.create({ testId: 'test-element' });
        
        expect(element).toBeInstanceOf(E2EWrapper);
        expect(element.getDriver().getFramework()).toBe(TestFramework.DETOX);
      });

      it('should create Appium element when framework is configured as Appium', () => {
        E2EWrapper.configure({ 
          framework: TestFramework.APPIUM, 
          appiumDriver: mockAppiumDriver 
        });
        
        const element = E2EWrapper.create({ testId: 'test-element' });
        
        expect(element).toBeInstanceOf(E2EWrapper);
        expect(element.getDriver().getFramework()).toBe(TestFramework.APPIUM);
      });

      it('should create element using element() alias', () => {
        E2EWrapper.configure({ framework: TestFramework.DETOX });
        
        const element = E2EWrapper.element({ testId: 'test-element' });
        
        expect(element).toBeInstanceOf(E2EWrapper);
        expect(element.getDriver().getFramework()).toBe(TestFramework.DETOX);
      });

      it('should allow per-call framework override', () => {
        E2EWrapper.configure({ framework: TestFramework.DETOX });
        
        const element = E2EWrapper.create(
          { testId: 'test-element' },
          { framework: TestFramework.APPIUM, driver: mockAppiumDriver }
        );
        
        expect(element.getDriver().getFramework()).toBe(TestFramework.APPIUM);
      });

      it('should throw error when Appium driver is not provided', () => {
        E2EWrapper.configure({ framework: TestFramework.APPIUM });
        
        expect(() => {
          E2EWrapper.create({ testId: 'test-element' });
        }).toThrow('Appium driver must be provided either in configure() or create() options');
      });

      it('should throw error for unsupported framework', () => {
        E2EWrapper.configure({ framework: 'unsupported' as any });
        
        expect(() => {
          E2EWrapper.create({ testId: 'test-element' });
        }).toThrow('Unsupported framework: unsupported');
      });
    });

    describe('Framework Switching', () => {
      it('should switch from Detox to Appium', () => {
        // Start with Detox
        E2EWrapper.configure({ framework: TestFramework.DETOX });
        let element = E2EWrapper.create({ testId: 'test' });
        expect(element.getDriver().getFramework()).toBe(TestFramework.DETOX);
        
        // Switch to Appium
        E2EWrapper.configure({ 
          framework: TestFramework.APPIUM, 
          appiumDriver: mockAppiumDriver 
        });
        element = E2EWrapper.create({ testId: 'test' });
        expect(element.getDriver().getFramework()).toBe(TestFramework.APPIUM);
      });

      it('should switch from Appium to Detox', () => {
        // Start with Appium
        E2EWrapper.configure({ 
          framework: TestFramework.APPIUM, 
          appiumDriver: mockAppiumDriver 
        });
        let element = E2EWrapper.create({ testId: 'test' });
        expect(element.getDriver().getFramework()).toBe(TestFramework.APPIUM);
        
        // Switch to Detox
        E2EWrapper.configure({ framework: TestFramework.DETOX });
        element = E2EWrapper.create({ testId: 'test' });
        expect(element.getDriver().getFramework()).toBe(TestFramework.DETOX);
      });
    });

    describe('Backward Compatibility', () => {
      it('should maintain existing withDetox() method', () => {
        const element = E2EWrapper.withDetox({ testId: 'test' });
        expect(element).toBeInstanceOf(E2EWrapper);
        expect(element.getDriver().getFramework()).toBe(TestFramework.DETOX);
      });

      it('should maintain existing withAppium() method', () => {
        const element = E2EWrapper.withAppium({ testId: 'test' }, mockAppiumDriver);
        expect(element).toBeInstanceOf(E2EWrapper);
        expect(element.getDriver().getFramework()).toBe(TestFramework.APPIUM);
      });

      it('should maintain existing withCustomDriver() method', () => {
        const customDriver = new MockElementDriver();
        const element = E2EWrapper.withCustomDriver({ testId: 'test' }, customDriver);
        expect(element).toBeInstanceOf(E2EWrapper);
        expect(element.getDriver()).toBe(customDriver);
      });
    });

    describe('Configuration Isolation', () => {
      it('should not affect configuration between different E2EWrapper calls', () => {
        E2EWrapper.configure({ framework: TestFramework.DETOX });
        
        const detoxElement = E2EWrapper.create({ testId: 'detox-test' });
        const appiumElement = E2EWrapper.create(
          { testId: 'appium-test' },
          { framework: TestFramework.APPIUM, driver: mockAppiumDriver }
        );
        
        expect(detoxElement.getDriver().getFramework()).toBe(TestFramework.DETOX);
        expect(appiumElement.getDriver().getFramework()).toBe(TestFramework.APPIUM);
        
        // Global config should remain unchanged
        const config = E2EWrapper.getFrameworkConfig();
        expect(config.framework).toBe(TestFramework.DETOX);
      });
    });

    describe('Error Handling', () => {
      it('should provide clear error message for missing Appium driver in configuration', () => {
        expect(() => {
          E2EWrapper.configure({ framework: TestFramework.APPIUM });
          E2EWrapper.create({ testId: 'test' });
        }).toThrow('Appium driver must be provided either in configure() or create() options');
      });

      it('should provide clear error message for missing Appium driver in create options', () => {
        E2EWrapper.configure({ framework: TestFramework.DETOX });
        
        expect(() => {
          E2EWrapper.create(
            { testId: 'test' },
            { framework: TestFramework.APPIUM }
          );
        }).toThrow('Appium driver must be provided either in configure() or create() options');
      });
    });
  });
}); 