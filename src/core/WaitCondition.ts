import { IWaitCondition, ElementSelector, WaitOptions, IElementDriver } from '../types';

export abstract class WaitCondition implements IWaitCondition {
  protected selector: ElementSelector;
  protected options: WaitOptions;
  protected driver: IElementDriver;

  constructor(selector: ElementSelector, driver: IElementDriver, options: WaitOptions = {}) {
    this.selector = selector;
    this.driver = driver;
    this.options = {
      timeout: 5000,
      interval: 100,
      retries: 3,
      ...options
    };
  }

  abstract execute(): Promise<boolean>;
  abstract getDescription(): string;

  protected async waitWithRetry(checkFn: () => Promise<boolean>): Promise<boolean> {
    const startTime = Date.now();
    const { timeout, interval } = this.options;

    while (Date.now() - startTime < timeout!) {
      try {
        const result = await checkFn();
        if (result) {
          return true;
        }
      } catch (error) {
        console.warn(`Wait condition check failed: ${error}`);
      }
      
      await this.sleep(interval!);
    }

    return false;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export class VisibleCondition extends WaitCondition {
  async execute(): Promise<boolean> {
    return this.waitWithRetry(() => this.driver.isVisible(this.selector, this.options));
  }

  getDescription(): string {
    return `Wait for element to be visible`;
  }
}

export class EnabledCondition extends WaitCondition {
  async execute(): Promise<boolean> {
    return this.waitWithRetry(() => this.driver.isEnabled(this.selector, this.options));
  }

  getDescription(): string {
    return `Wait for element to be enabled`;
  }
}

export class ExistsCondition extends WaitCondition {
  async execute(): Promise<boolean> {
    return this.waitWithRetry(() => this.driver.exists(this.selector, this.options));
  }

  getDescription(): string {
    return `Wait for element to exist`;
  }
} 