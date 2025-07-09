import { BaseElementDriver } from './BaseElementDriver';
import { ElementSelector, WaitOptions, TestFramework, ScrollDirection, ScrollOptions } from '../types';
import { logger } from '../utils/logger';

export class DetoxElementDriver extends BaseElementDriver {
  private detoxElement: any; // Detox element instance

  constructor(detoxElement?: any) {
    super(TestFramework.DETOX);
    this.detoxElement = detoxElement;
  }

  async isVisible(selector: ElementSelector, options: WaitOptions = {}): Promise<boolean> {
    try {
      const element = this.buildDetoxElement(selector);
      const expect = (global as any).expect || eval('expect');
      await expect(element).toBeVisible();
      return true;
    } catch (error) {
      return false;
    }
  }

  async isEnabled(selector: ElementSelector, options: WaitOptions = {}): Promise<boolean> {
    try {
      const element = this.buildDetoxElement(selector);
      const expect = (global as any).expect || eval('expect');
      await expect(element).toBeEnabled();
      return true;
    } catch (error) {
      // If toBeEnabled() is not supported for this element type, 
      // we'll assume it's "enabled" since it exists and is visible
      const errorMessage = (error as any)?.message || String(error);
      if (errorMessage.includes('toBeEnabled') || errorMessage.includes('not supported')) {
        return true; // Assume enabled for elements that don't support enabled/disabled
      }
      return false;
    }
  }

  async exists(selector: ElementSelector, options: WaitOptions = {}): Promise<boolean> {
    try {
      const element = this.buildDetoxElement(selector);
      const expect = (global as any).expect || eval('expect');
      await expect(element).toExist();
      return true;
    } catch (error) {
      return false;
    }
  }

  async getAttribute(selector: ElementSelector, attributeName: string, options: WaitOptions = {}): Promise<string | null> {
    try {
      const element = this.buildDetoxElement(selector);
      // Detox doesn't have direct attribute access, so we'll use getAttributes()
      const attributes = await element.getAttributes();
      return attributes[attributeName] || null;
    } catch (error) {
      return null;
    }
  }

  async getProperty(selector: ElementSelector, propertyName: string, options: WaitOptions = {}): Promise<any> {
    try {
      const element = this.buildDetoxElement(selector);
      // Detox properties are typically accessed through getAttributes()
      const attributes = await element.getAttributes();
      return attributes[propertyName];
    } catch (error) {
      return null;
    }
  }

  async getText(selector: ElementSelector, options: WaitOptions = {}): Promise<string> {
    try {
      const element = this.buildDetoxElement(selector);
      const attributes = await element.getAttributes();
      return attributes.text || attributes.label || '';
    } catch (error) {
      return '';
    }
  }

  async getElement(selector: ElementSelector, options: WaitOptions = {}): Promise<any> {
    try {
      const element = this.buildDetoxElement(selector);
      // Ensure element exists first
      const expect = (global as any).expect || eval('expect');
      await expect(element).toExist();
      return element;
    } catch (error) {
      return null;
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
    const globalElement = (global as any).element || (globalThis as any).element || eval('element');
    const globalBy = (global as any).by || (globalThis as any).by || eval('by');
    
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

  /**
   * Interaction methods specific to Detox
   */
  async tap(selector: ElementSelector, options: WaitOptions = {}): Promise<void> {
    const element = this.buildDetoxElement(selector);
    await element.tap();
  }

  async typeText(selector: ElementSelector, text: string, options: WaitOptions = {}): Promise<void> {
    const element = this.buildDetoxElement(selector);
    await element.typeText(text);
    
    // Auto-dismiss keyboard unless explicitly disabled
    const shouldDismissKeyboard = options.dismissKeyboard !== false; // default to true
    if (shouldDismissKeyboard) {
      await this.dismissKeyboard();
    }
  }

  async clearText(selector: ElementSelector, options: WaitOptions = {}): Promise<void> {
    const element = this.buildDetoxElement(selector);
    await element.clearText();
  }

  async dismissKeyboard(): Promise<void> {
    try {
      // Try to use device.disableSynchronization() for more reliable keyboard dismissal
      const globalDevice = (global as any).device;
      
      if (globalDevice) {
        await globalDevice.disableSynchronization();
        
        // Tap on a neutral area of the screen to dismiss keyboard
        // Use coordinates that are likely to be safe (center-top of screen)
        await globalDevice.tap({ x: 200, y: 200 });
        
        // Small delay to ensure keyboard is dismissed
        await new Promise(resolve => setTimeout(resolve, 300));
        
        await globalDevice.enableSynchronization();
      }
    } catch (error) {
      logger.warn('Failed to dismiss keyboard:', error);
      // Fallback: try to tap on a neutral area without disabling synchronization
      try {
        const globalDevice = (global as any).device;
        if (globalDevice) {
          await globalDevice.tap({ x: 200, y: 200 });
        }
      } catch (fallbackError) {
        logger.warn('Fallback keyboard dismissal also failed:', fallbackError);
      }
    }
  }

  /**
   * Scroll methods for Detox
   */
  async scroll(direction: ScrollDirection, amount: number = 0.3, containerSelector?: ElementSelector): Promise<void> {
    const globalElement = (global as any).element || (globalThis as any).element || eval('element');
    const globalBy = (global as any).by || (globalThis as any).by || eval('by');
    
    if (!globalElement || !globalBy) {
      throw new Error('Detox element/by not available for scrolling');
    }

    // Use container if provided, otherwise use the main scroll view
    const scrollContainer = containerSelector 
      ? this.buildDetoxElement(containerSelector)
      : globalElement(globalBy.id('main-scroll-view')); // Default to main scroll view

    // Convert percentage to pixels based on screen dimensions
    const screenHeight = 812; // iPhone X/11/12 base height
    const screenWidth = 375;  // iPhone X/11/12 base width
    
    // Convert direction to Detox scroll direction and calculate pixel distance
    let scrollDirection: string;
    let scrollDistance: number;
    
    switch (direction) {
      case ScrollDirection.DOWN:
        scrollDirection = 'down';
        scrollDistance = Math.round(screenHeight * amount);
        break;
      case ScrollDirection.UP:
        scrollDirection = 'up';
        scrollDistance = Math.round(screenHeight * amount);
        break;
      case ScrollDirection.LEFT:
        scrollDirection = 'left';
        scrollDistance = Math.round(screenWidth * amount);
        break;
      case ScrollDirection.RIGHT:
        scrollDirection = 'right';
        scrollDistance = Math.round(screenWidth * amount);
        break;
      default:
        throw new Error(`Unsupported scroll direction: ${direction}`);
    }

    logger.debug(`Scrolling ${scrollDirection} by ${scrollDistance}px (${amount * 100}% of screen)`);

    // Perform scroll action
    await scrollContainer.scroll(scrollDistance, scrollDirection);
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
   * Check if element is substantially visible (not just technically visible)
   */
  async isSubstantiallyVisible(selector: ElementSelector, threshold: number = 0.75): Promise<boolean> {
    try {
      const element = this.buildDetoxElement(selector);
      
      // First check if element exists and is visible at all
      const isBasicallyVisible = await this.isVisible(selector);
      logger.debug(`Basic visibility check: ${isBasicallyVisible}`);
      
      if (!isBasicallyVisible) {
        return false;
      }

      // Get element attributes to check bounds
      const attributes = await element.getAttributes();
      logger.trace('Element attributes:', JSON.stringify(attributes, null, 2));
      
      // Try to get frame information
      const frame = attributes.frame;
      if (!frame) {
        logger.debug('No frame info available, falling back to basic visibility');
        // If element is basically visible but no frame, assume it's good enough
        return true;
      }

      // For now, let's simplify and use more conservative screen dimensions
      const screenHeight = 812; // iPhone X/11/12 base height
      const screenWidth = 375;  // iPhone X/11/12 base width
      
      logger.debug(`Screen dimensions: ${screenWidth}x${screenHeight}`);
      logger.debug(`Element frame: x=${frame.x}, y=${frame.y}, w=${frame.width}, h=${frame.height}`);

      // Calculate visible area - use simpler logic first
      const elementTop = frame.y;
      const elementBottom = frame.y + frame.height;
      const elementLeft = frame.x;
      const elementRight = frame.x + frame.width;

      // Use more conservative safe areas
      const safeAreaTop = 44; // Status bar
      const safeAreaBottom = 34; // Home indicator
      const screenBottom = screenHeight - safeAreaBottom;
      
      logger.debug(`Safe area: top=${safeAreaTop}, bottom=${screenBottom}`);
      
      // Check if element is completely outside visible area
      if (elementBottom <= safeAreaTop || elementTop >= screenBottom) {
        logger.debug('Element is completely outside visible area');
        return false;
      }
      
      // Calculate intersection with screen bounds 
      const visibleTop = Math.max(elementTop, safeAreaTop);
      const visibleBottom = Math.min(elementBottom, screenBottom);
      const visibleLeft = Math.max(elementLeft, 0);
      const visibleRight = Math.min(elementRight, screenWidth);

      // Check if there's any visible intersection
      if (visibleTop >= visibleBottom || visibleLeft >= visibleRight) {
        logger.debug('No visible intersection');
        return false;
      }

      // Calculate visible area percentage
      const visibleHeight = visibleBottom - visibleTop;
      const visibleWidth = visibleRight - visibleLeft;
      const visibleArea = visibleHeight * visibleWidth;
      const totalArea = frame.height * frame.width;
      
      const visibilityPercentage = totalArea > 0 ? visibleArea / totalArea : 0;
      
      logger.debug('Visible area calculation:');
      logger.debug(`  Visible bounds: top=${visibleTop}, bottom=${visibleBottom}, left=${visibleLeft}, right=${visibleRight}`);
      logger.debug(`  Visible dimensions: ${visibleWidth}x${visibleHeight} = ${visibleArea}`);
      logger.debug(`  Total area: ${totalArea}`);
      logger.debug(`  Visibility percentage: ${visibilityPercentage.toFixed(2)} (threshold: ${threshold})`);

      const result = visibilityPercentage >= threshold;
      logger.debug(`isSubstantiallyVisible result: ${result}`);
      
      return result;
    } catch (error) {
      logger.error('Error in isSubstantiallyVisible:', error);
      // Fallback to basic visibility check
      return await this.isVisible(selector);
    }
  }

  /**
   * Center element in viewport by scrolling
   */
  async centerElementInViewport(selector: ElementSelector): Promise<void> {
    try {
      const element = this.buildDetoxElement(selector);
      const attributes = await element.getAttributes();
      const frame = attributes.frame;
      
      if (!frame) {
        logger.debug('No frame info for centering element');
        return;
      }

      logger.debug('Centering element with frame:', frame);

      // Get the main scroll view
      const globalElement = (global as any).element || (globalThis as any).element || eval('element');
      const globalBy = (global as any).by || (globalThis as any).by || eval('by');
      const scrollContainer = globalElement(globalBy.id('main-scroll-view'));

      // Calculate how much to scroll to center the element
      const screenHeight = 844; // iPhone 12 default
      const safeAreaTop = 50;
      const safeAreaBottom = 100;
      const visibleScreenHeight = screenHeight - safeAreaTop - safeAreaBottom;
      
      const elementCenterY = frame.y + (frame.height / 2);
      const screenCenterY = safeAreaTop + (visibleScreenHeight / 2);
      
      logger.debug(`Element center Y: ${elementCenterY}, Screen center Y: ${screenCenterY}`);
      
      // Calculate scroll offset needed
      const scrollOffset = elementCenterY - screenCenterY;
      
      logger.debug(`Scroll offset needed: ${scrollOffset}`);
      
      if (Math.abs(scrollOffset) > 10) { // Only scroll if significant offset
        // Use whileElement to scroll until element is centered
        if (scrollOffset > 0) {
          // Need to scroll down
          await scrollContainer.scroll(200, 'down');
        } else {
          // Need to scroll up  
          await scrollContainer.scroll(200, 'up');
        }
      }
    } catch (error) {
      logger.warn('Failed to center element in viewport:', error);
    }
  }
} 