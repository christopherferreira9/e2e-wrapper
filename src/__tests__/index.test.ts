import { 
  createElement, 
  element, 
  configure, 
  configureFromEnvironment,
  TestFramework,
  E2EWrapper
} from '../index';

describe('Convenience Exports', () => {
  let mockAppiumDriver: any;

  beforeAll(() => {
    // Create mock Appium driver
    mockAppiumDriver = {
      findElement: jest.fn(),
      getWindowSize: jest.fn(),
      hideKeyboard: jest.fn()
    };
  });

  beforeEach(() => {
    // Reset configuration before each test
    E2EWrapper.configure({ framework: TestFramework.DETOX });
    delete process.env.E2E_FRAMEWORK;
  });

  describe('createElement function', () => {
    it('should create element with Detox framework', () => {
      configure({ framework: TestFramework.DETOX });
      
      const wrapper = createElement({ testId: 'test-element' });
      
      expect(wrapper).toBeInstanceOf(E2EWrapper);
      expect(wrapper.getDriver().getFramework()).toBe(TestFramework.DETOX);
    });

    it('should create element with Appium framework', () => {
      configure({ 
        framework: TestFramework.APPIUM, 
        appiumDriver: mockAppiumDriver 
      });
      
      const wrapper = createElement({ testId: 'test-element' });
      
      expect(wrapper).toBeInstanceOf(E2EWrapper);
      expect(wrapper.getDriver().getFramework()).toBe(TestFramework.APPIUM);
    });

    it('should support per-call framework override', () => {
      configure({ framework: TestFramework.DETOX });
      
      const wrapper = createElement(
        { testId: 'test-element' },
        { framework: TestFramework.APPIUM, driver: mockAppiumDriver }
      );
      
      expect(wrapper.getDriver().getFramework()).toBe(TestFramework.APPIUM);
    });
  });

  describe('element function', () => {
    it('should create element with configured framework', () => {
      configure({ framework: TestFramework.DETOX });
      
      const wrapper = element({ testId: 'test-element' });
      
      expect(wrapper).toBeInstanceOf(E2EWrapper);
      expect(wrapper.getDriver().getFramework()).toBe(TestFramework.DETOX);
    });

    it('should be equivalent to createElement', () => {
      configure({ framework: TestFramework.DETOX });
      
      const wrapper1 = element({ testId: 'test' });
      const wrapper2 = createElement({ testId: 'test' });
      
      expect(wrapper1.getDriver().getFramework()).toBe(wrapper2.getDriver().getFramework());
    });
  });

  describe('configure function', () => {
    it('should configure framework globally', () => {
      configure({ framework: TestFramework.APPIUM, appiumDriver: mockAppiumDriver });
      
      const config = E2EWrapper.getFrameworkConfig();
      expect(config.framework).toBe(TestFramework.APPIUM);
      expect(config.appiumDriver).toBe(mockAppiumDriver);
    });

    it('should affect subsequent element creation', () => {
      configure({ framework: TestFramework.DETOX });
      let wrapper = element({ testId: 'test' });
      expect(wrapper.getDriver().getFramework()).toBe(TestFramework.DETOX);
      
      configure({ framework: TestFramework.APPIUM, appiumDriver: mockAppiumDriver });
      wrapper = element({ testId: 'test' });
      expect(wrapper.getDriver().getFramework()).toBe(TestFramework.APPIUM);
    });
  });

  describe('configureFromEnvironment function', () => {
    it('should configure from environment variable', () => {
      process.env.E2E_FRAMEWORK = 'detox';
      
      configureFromEnvironment();
      
      const config = E2EWrapper.getFrameworkConfig();
      expect(config.framework).toBe(TestFramework.DETOX);
    });

    it('should handle case insensitive environment variable', () => {
      process.env.E2E_FRAMEWORK = 'APPIUM';
      
      configureFromEnvironment();
      
      const config = E2EWrapper.getFrameworkConfig();
      expect(config.framework).toBe(TestFramework.APPIUM);
    });

    it('should ignore invalid environment values', () => {
      configure({ framework: TestFramework.DETOX });
      process.env.E2E_FRAMEWORK = 'invalid-framework';
      
      configureFromEnvironment();
      
      const config = E2EWrapper.getFrameworkConfig();
      expect(config.framework).toBe(TestFramework.DETOX);
    });
  });

  describe('Integration with existing API', () => {
    it('should work alongside withDetox method', () => {
      configure({ framework: TestFramework.APPIUM, appiumDriver: mockAppiumDriver });
      
      const appiumElement = element({ testId: 'appium-test' });
      const detoxElement = E2EWrapper.withDetox({ testId: 'detox-test' });
      
      expect(appiumElement.getDriver().getFramework()).toBe(TestFramework.APPIUM);
      expect(detoxElement.getDriver().getFramework()).toBe(TestFramework.DETOX);
    });

    it('should work alongside withAppium method', () => {
      configure({ framework: TestFramework.DETOX });
      
      const detoxElement = element({ testId: 'detox-test' });
      const appiumElement = E2EWrapper.withAppium({ testId: 'appium-test' }, mockAppiumDriver);
      
      expect(detoxElement.getDriver().getFramework()).toBe(TestFramework.DETOX);
      expect(appiumElement.getDriver().getFramework()).toBe(TestFramework.APPIUM);
    });
  });

  describe('Error Handling', () => {
    it('should throw error when Appium driver is not provided via configure', () => {
      configure({ framework: TestFramework.APPIUM });
      
      expect(() => {
        element({ testId: 'test' });
      }).toThrow('Appium driver must be provided either in configure() or create() options');
    });

    it('should throw error when using unsupported framework', () => {
      configure({ framework: 'unsupported' as any });
      
      expect(() => {
        element({ testId: 'test' });
      }).toThrow('Unsupported framework: unsupported');
    });
  });
}); 