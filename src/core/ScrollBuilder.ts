import { IScrollBuilder, IElementDriver, ElementSelector, ScrollDirection, ScrollOptions } from '../types';
import { logger } from '../utils/logger';

export class ScrollBuilder implements IScrollBuilder {
  private driver: IElementDriver;
  private targetSelector: ElementSelector;
  private options: ScrollOptions;

  constructor(driver: IElementDriver, targetSelector: ElementSelector, options: ScrollOptions = {}) {
    this.driver = driver;
    this.targetSelector = targetSelector;
    this.options = {
      direction: ScrollDirection.DOWN,
      timeout: 10000,
      interval: 500,
      scrollAmount: 0.3, // 30% of screen
      visibilityThreshold: 0, // Disabled by default, use basic visibility
      centerInViewport: false,
      marginFromEdge: 50, // 50px from edge
      useBasicVisibility: false, // Use enhanced when threshold > 0
      ...options
    };
  }

  direction(direction: ScrollDirection): IScrollBuilder {
    this.options.direction = direction;
    return this;
  }

  timeout(timeout: number): IScrollBuilder {
    this.options.timeout = timeout;
    return this;
  }

  interval(interval: number): IScrollBuilder {
    this.options.interval = interval;
    return this;
  }

  scrollAmount(amount: number): IScrollBuilder {
    this.options.scrollAmount = amount;
    return this;
  }

  within(containerSelector: ElementSelector): IScrollBuilder {
    this.options.containerSelector = containerSelector;
    return this;
  }

  visibilityThreshold(threshold: number): IScrollBuilder {
    this.options.visibilityThreshold = threshold;
    return this;
  }

  centerInViewport(center: boolean = true): IScrollBuilder {
    this.options.centerInViewport = center;
    return this;
  }

  marginFromEdge(margin: number): IScrollBuilder {
    this.options.marginFromEdge = margin;
    return this;
  }

  async execute(): Promise<any> {
    const startTime = Date.now();
    const timeout = this.options.timeout || 10000;
    const interval = this.options.interval || 500;
    
    logger.debug('Starting scroll to element with options:', this.options);
    
    while (Date.now() - startTime < timeout) {
      logger.debug(`--- Scroll attempt at ${Date.now() - startTime}ms ---`);
      
      // Check if target element is visible
      let isVisible = false;
      
      const shouldUseEnhanced = !this.options.useBasicVisibility && 
                               this.options.visibilityThreshold && 
                               this.options.visibilityThreshold > 0 && 
                               typeof this.driver.isSubstantiallyVisible === 'function';
      
      if (shouldUseEnhanced) {
        logger.debug(`Using enhanced visibility check with threshold ${this.options.visibilityThreshold}`);
        
        // Use enhanced visibility check with threshold
        isVisible = await this.driver.isSubstantiallyVisible!(
          this.targetSelector, 
          this.options.visibilityThreshold!
        );
        
        // If element is not meeting the high threshold but is basically visible,
        // and we've been scrolling for a while, consider using a lower threshold
        if (!isVisible && Date.now() - startTime > timeout * 0.5) {
          logger.debug('Halfway through timeout, checking with lower threshold');
          const lowerThreshold = Math.max(0.5, this.options.visibilityThreshold! * 0.7);
          const isVisibleWithLowerThreshold = await this.driver.isSubstantiallyVisible!(
            this.targetSelector, 
            lowerThreshold
          );
          
          if (isVisibleWithLowerThreshold) {
            logger.debug(`Element meets lower threshold ${lowerThreshold}, accepting position`);
            isVisible = true;
          }
        }
      } else {
        logger.debug('Using basic visibility check');
        // Fallback to basic visibility check  
        isVisible = await this.driver.isVisible(this.targetSelector);
      }
      
      logger.debug(`Element visibility result: ${isVisible}`);
      
      if (isVisible) {
        logger.debug('Element is visible! Checking if we should center it');
        
        // Optionally center the element in viewport
        if (this.options.centerInViewport && this.driver.centerElementInViewport) {
          logger.debug('Centering element in viewport');
          await this.driver.centerElementInViewport(this.targetSelector);
        }
        
        logger.success('Scroll to element completed successfully!');
        
        // Import the wrapper to return the correct type
        const { E2EWrapper } = await import('../E2EWrapper');
        return new E2EWrapper(this.targetSelector, this.driver);
      }
      
            logger.debug(`Element not visible, scrolling ${this.options.direction} with amount ${this.options.scrollAmount}`);
      
      // Scroll if element is not visible
      if (this.driver.scroll) {
        try {
          await this.driver.scroll(
            this.options.direction!,
            this.options.scrollAmount,
            this.options.containerSelector
          );
        } catch (scrollError: any) {
          logger.warn(`Scroll failed: ${scrollError.message}`);
          
          // If scroll fails, we might be at the end - check if element is at least basically visible
          if (scrollError.message?.includes('Unable to scroll') || scrollError.message?.includes('scroll')) {
            logger.info('Reached end of scroll area, checking if element is at least basically visible');
            const isBasicallyVisible = await this.driver.isVisible(this.targetSelector);
            
            if (isBasicallyVisible) {
              logger.success('Element is basically visible, accepting current position');
              const { E2EWrapper } = await import('../E2EWrapper');
              return new E2EWrapper(this.targetSelector, this.driver);
            } else {
              logger.error('Element not visible and cannot scroll further');
              throw new Error(`Element not found: reached end of scrollable area and element is still not visible`);
            }
          } else {
            // Re-throw other scroll errors
            throw scrollError;
          }
        }
      } else {
        throw new Error(`Scroll functionality not implemented for ${this.driver.getFramework()} driver`);
      }

      // Wait before next attempt
      await new Promise(resolve => setTimeout(resolve, interval));
    }
    
    logger.error(`Scroll to element timed out after ${timeout}ms`);
    throw new Error(
      `Scroll to element failed: Target element not found within ${timeout}ms. ` +
      `Scrolling ${this.options.direction} with ${this.options.scrollAmount} scroll amount.`
    );
  }
} 