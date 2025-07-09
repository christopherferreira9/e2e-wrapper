/**
 * Core types and interfaces for the e2e-wrapper
 */

export enum TestFramework {
  DETOX = 'detox',
  APPIUM = 'appium',
  PLAYWRIGHT = 'playwright',
  CYPRESS = 'cypress'
}

export interface ElementSelector {
  id?: string;
  testId?: string;
  text?: string;
  xpath?: string;
  className?: string;
  accessibility?: string;
  custom?: Record<string, any>;
}

export interface WaitOptions {
  timeout?: number;
  interval?: number;
  retries?: number;
  dismissKeyboard?: boolean; // Whether to dismiss keyboard after typing (default: true)
}

export enum ScrollDirection {
  UP = 'up',
  DOWN = 'down',
  LEFT = 'left',
  RIGHT = 'right'
}

export interface ScrollOptions {
  direction?: ScrollDirection;
  timeout?: number;
  interval?: number;
  scrollAmount?: number; // How much to scroll each time (percentage of screen)
  containerSelector?: ElementSelector; // Optional container to scroll within
  visibilityThreshold?: number; // Minimum percentage of element that must be visible (0.0-1.0, set to 0 to disable)
  centerInViewport?: boolean; // Whether to center the element in viewport after finding it
  marginFromEdge?: number; // Minimum distance from screen edge (in pixels)
  useBasicVisibility?: boolean; // Force use of basic visibility check instead of enhanced
}

export interface ElementState {
  isVisible?: boolean;
  isEnabled?: boolean;
  exists?: boolean;
}

/**
 * Custom condition predicate function
 */
export type CustomConditionPredicate = (element: any, driver: IElementDriver) => Promise<boolean>;

/**
 * Built-in custom condition types
 */
export interface CustomConditionOptions {
  hasClassName?: string;
  hasAttribute?: { name: string; value?: string };
  hasText?: string;
  hasProperty?: { name: string; value: any };
  custom?: CustomConditionPredicate;
}

/**
 * Core interface that all framework implementations must implement
 */
export interface IElementDriver {
  /**
   * Check if element is visible
   */
  isVisible(selector: ElementSelector, options?: WaitOptions): Promise<boolean>;
  
  /**
   * Check if element is enabled
   */
  isEnabled(selector: ElementSelector, options?: WaitOptions): Promise<boolean>;
  
  /**
   * Check if element exists
   */
  exists(selector: ElementSelector, options?: WaitOptions): Promise<boolean>;
  
  /**
   * Wait for element to reach a specific state
   */
  waitForState(selector: ElementSelector, state: ElementState, options?: WaitOptions): Promise<boolean>;
  
  /**
   * Get element attribute value
   */
  getAttribute(selector: ElementSelector, attributeName: string, options?: WaitOptions): Promise<string | null>;
  
  /**
   * Get element property value
   */
  getProperty(selector: ElementSelector, propertyName: string, options?: WaitOptions): Promise<any>;
  
  /**
   * Get element text content
   */
  getText(selector: ElementSelector, options?: WaitOptions): Promise<string>;
  
  /**
   * Get the actual element for custom checks
   */
  getElement(selector: ElementSelector, options?: WaitOptions): Promise<any>;
  
  /**
   * Get the framework type
   */
  getFramework(): TestFramework;
  
  /**
   * Interaction methods (optional for some frameworks)
   */
  tap?(selector: ElementSelector, options?: WaitOptions): Promise<void>;
  typeText?(selector: ElementSelector, text: string, options?: WaitOptions): Promise<void>;
  clearText?(selector: ElementSelector, options?: WaitOptions): Promise<void>;
  dismissKeyboard?(): Promise<void>;
  
  /**
   * Scroll methods (optional for some frameworks)
   */
  scroll?(direction: ScrollDirection, amount?: number, containerSelector?: ElementSelector): Promise<void>;
  scrollUntilVisible?(targetSelector: ElementSelector, options?: ScrollOptions): Promise<boolean>;
  
  /**
   * Enhanced visibility methods
   */
  isSubstantiallyVisible?(selector: ElementSelector, threshold?: number): Promise<boolean>;
  centerElementInViewport?(selector: ElementSelector): Promise<void>;
}

/**
 * Interface for wait conditions
 */
export interface IWaitCondition {
  execute(): Promise<boolean>;
  getDescription(): string;
}

/**
 * Interface for the wait builder
 */
export interface IWaitBuilder {
  forVisible(options?: WaitOptions): IWaitBuilder;
  forNotVisible(options?: WaitOptions): IWaitBuilder;
  forEnabled(options?: WaitOptions): IWaitBuilder;
  forExists(options?: WaitOptions): IWaitBuilder;
  forCustom(conditionOptions: CustomConditionOptions, options?: WaitOptions): IWaitBuilder;
  execute(): Promise<IE2EWrapper>;
  getConditionDescriptions(): string[];
  clearConditions(): IWaitBuilder;
}

/**
 * Interface for the scroll builder
 */
export interface IScrollBuilder {
  direction(direction: ScrollDirection): IScrollBuilder;
  timeout(timeout: number): IScrollBuilder;
  interval(interval: number): IScrollBuilder;
  scrollAmount(amount: number): IScrollBuilder;
  within(containerSelector: ElementSelector): IScrollBuilder;
  visibilityThreshold(threshold: number): IScrollBuilder;
  centerInViewport(center?: boolean): IScrollBuilder;
  marginFromEdge(margin: number): IScrollBuilder;
  execute(): Promise<IE2EWrapper>;
}

/**
 * Main wrapper interface
 */
export interface IE2EWrapper {
  // Builder pattern
  wait(): IWaitBuilder;
  scrollTo(options?: ScrollOptions): IScrollBuilder;
  
  // Direct element operations (proxy methods)
  getText(options?: WaitOptions): Promise<string>;
  getAttribute(attributeName: string, options?: WaitOptions): Promise<string | null>;
  getProperty(propertyName: string, options?: WaitOptions): Promise<any>;
  getElement(options?: WaitOptions): Promise<any>;
  
  // State checking methods
  isVisible(options?: WaitOptions): Promise<boolean>;
  isEnabled(options?: WaitOptions): Promise<boolean>;
  exists(options?: WaitOptions): Promise<boolean>;
  
  // Interaction methods (to be added by specific drivers)
  tap?(options?: WaitOptions): Promise<void>;
  typeText?(text: string, options?: WaitOptions): Promise<void>;
  clearText?(options?: WaitOptions): Promise<void>;
  dismissKeyboard?(): Promise<void>;
  
  // Legacy access (for advanced use cases)
  getDriver(): IElementDriver;
  getSelector(): ElementSelector;
  withSelector(selector: ElementSelector): IE2EWrapper;
} 