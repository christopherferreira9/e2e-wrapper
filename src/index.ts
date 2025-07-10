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
  IE2EWrapper,
  FrameworkConfig
} from './types';

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
import { ElementSelector, IElementDriver, TestFramework, FrameworkConfig } from './types';

// Legacy convenience factory functions (backward compatible)
export const createDetoxWrapper = (selector: ElementSelector, detoxElement?: any) => 
  E2EWrapper.withDetox(selector, detoxElement);

export const createAppiumWrapper = (selector: ElementSelector, driver: any) => 
  E2EWrapper.withAppium(selector, driver);

// New framework-agnostic convenience functions
export const createElement = (selector: ElementSelector, options?: { framework?: TestFramework; driver?: any; detoxElement?: any }) => 
  E2EWrapper.create(selector, options);

export const element = (selector: ElementSelector, options?: { framework?: TestFramework; driver?: any; detoxElement?: any }) => 
  E2EWrapper.element(selector, options);

// Framework configuration utilities
export const configureFramework = (framework: TestFramework, driver?: any) => 
  E2EWrapper.setFramework(framework, driver);

export const configureFromEnvironment = () => 
  E2EWrapper.configureFromEnvironment();

// Advanced configuration
export const configure = (config: FrameworkConfig) =>
  E2EWrapper.configure(config);

export const getFrameworkConfig = (): FrameworkConfig =>
  E2EWrapper.getFrameworkConfig(); 