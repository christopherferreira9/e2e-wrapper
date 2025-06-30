// Main exports
export { E2EWrapper } from './E2EWrapper';

// Core types and interfaces
export {
  TestFramework,
  ElementSelector,
  WaitOptions,
  ElementState,
  IElementDriver,
  IWaitCondition,
  IWaitBuilder,
  IE2EWrapper
} from './types';

// Framework-specific drivers
export { DetoxElementDriver } from './drivers/DetoxElementDriver';
export { AppiumElementDriver } from './drivers/AppiumElementDriver';
export { BaseElementDriver } from './drivers/BaseElementDriver';

// Core builder classes
export { WaitBuilder } from './core/WaitBuilder';
export { 
  WaitCondition, 
  VisibleCondition, 
  EnabledCondition, 
  ExistsCondition 
} from './core/WaitCondition';

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