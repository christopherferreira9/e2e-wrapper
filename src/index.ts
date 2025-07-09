// Main exports
export { E2EWrapper } from './E2EWrapper';

// Core types and interfaces
export {
  TestFramework,
  ElementSelector,
  WaitOptions,
  ScrollOptions,
  ScrollDirection,
  ElementState,
  IElementDriver,
  IWaitCondition,
  IWaitBuilder,
  IScrollBuilder,
  IE2EWrapper
} from './types';

// Framework-specific drivers
export { DetoxElementDriver } from './drivers/DetoxElementDriver';
export { AppiumElementDriver } from './drivers/AppiumElementDriver';
export { BaseElementDriver } from './drivers/BaseElementDriver';

// Core builder classes
export { WaitBuilder } from './core/WaitBuilder';
export { ScrollBuilder } from './core/ScrollBuilder';
export { 
  WaitCondition, 
  VisibleCondition, 
  NotVisibleCondition,
  EnabledCondition, 
  ExistsCondition 
} from './core/WaitCondition';

// Logger utilities
export { logger, createLogger, Logger, LogLevel } from './utils/logger';

// Import for convenience functions
import { E2EWrapper } from './E2EWrapper';
import { ElementSelector, IElementDriver } from './types';

// Convenience factory functions
export const createDetoxWrapper = (selector: ElementSelector, detoxElement?: any) => 
  E2EWrapper.withDetox(selector, detoxElement);

export const createAppiumWrapper = (selector: ElementSelector, appiumDriver: any) => 
  E2EWrapper.withAppium(selector, appiumDriver);

export const createCustomWrapper = (selector: ElementSelector, driver: IElementDriver) => 
  E2EWrapper.withCustomDriver(selector, driver); 