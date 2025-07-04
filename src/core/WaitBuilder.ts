import { IWaitBuilder, ElementSelector, WaitOptions, IElementDriver, IWaitCondition, CustomConditionOptions } from '../types';
import { VisibleCondition, EnabledCondition, ExistsCondition, CustomCondition } from './WaitCondition';

export class WaitBuilder implements IWaitBuilder {
  private conditions: IWaitCondition[] = [];
  private selector: ElementSelector;
  private driver: IElementDriver;

  constructor(selector: ElementSelector, driver: IElementDriver) {
    this.selector = selector;
    this.driver = driver;
  }

  forVisible(options?: WaitOptions): IWaitBuilder {
    const condition = new VisibleCondition(this.selector, this.driver, options);
    this.conditions.push(condition);
    return this;
  }

  forEnabled(options?: WaitOptions): IWaitBuilder {
    const condition = new EnabledCondition(this.selector, this.driver, options);
    this.conditions.push(condition);
    return this;
  }

  forExists(options?: WaitOptions): IWaitBuilder {
    const condition = new ExistsCondition(this.selector, this.driver, options);
    this.conditions.push(condition);
    return this;
  }

  forCustom(conditionOptions: CustomConditionOptions, options?: WaitOptions): IWaitBuilder {
    const condition = new CustomCondition(this.selector, this.driver, conditionOptions, options);
    this.conditions.push(condition);
    return this;
  }

  async execute(): Promise<boolean> {
    if (this.conditions.length === 0) {
      throw new Error('No wait conditions specified. Use forVisible(), forEnabled(), or forExists() before executing.');
    }

    // Execute conditions in the order they were added (chained)
    for (const condition of this.conditions) {
      const result = await condition.execute();
      if (!result) {
        console.warn(`Wait condition failed: ${condition.getDescription()}`);
        return false;
      }
    }

    return true;
  }

  /**
   * Get descriptions of all conditions for debugging
   */
  getConditionDescriptions(): string[] {
    return this.conditions.map(condition => condition.getDescription());
  }

  /**
   * Clear all conditions (useful for reusing the builder)
   */
  clearConditions(): IWaitBuilder {
    this.conditions = [];
    return this;
  }
} 