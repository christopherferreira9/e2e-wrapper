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
  forEnabled(options?: WaitOptions): IWaitBuilder;
  forExists(options?: WaitOptions): IWaitBuilder;
  forCustom(conditionOptions: CustomConditionOptions, options?: WaitOptions): IWaitBuilder;
  execute(): Promise<boolean>;
  getConditionDescriptions(): string[];
  clearConditions(): IWaitBuilder;
}

/**
 * Main wrapper interface
 */
export interface IE2EWrapper {
  wait(): IWaitBuilder;
  getDriver(): IElementDriver;
} 