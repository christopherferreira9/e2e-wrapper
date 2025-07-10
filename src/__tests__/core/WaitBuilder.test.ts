import { ElementSelector, IE2EWrapper } from '../../types';
import { E2EWrapper } from '../../E2EWrapper';
import { MockElementDriver } from '../../test-utils/MockElementDriver';

describe('WaitBuilder', () => {
  let mockDriver: MockElementDriver;
  let wrapper: IE2EWrapper;
  let selector: ElementSelector;

  beforeEach(() => {
    mockDriver = new MockElementDriver();
    selector = { testId: 'test-button' };
    wrapper = E2EWrapper.withCustomDriver(selector, mockDriver);
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