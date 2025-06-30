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
  execute(): Promise<boolean>;
}

/**
 * Main wrapper interface
 */
export interface IE2EWrapper {
  wait(): IWaitBuilder;
  getDriver(): IElementDriver;
} 