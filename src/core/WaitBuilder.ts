import { IWaitBuilder, ElementSelector, WaitOptions, IElementDriver, IWaitCondition, CustomConditionOptions, IE2EWrapper } from '../types';
import { VisibleCondition, NotVisibleCondition, EnabledCondition, ExistsCondition, CustomCondition } from './WaitCondition';

export class WaitBuilder implements IWaitBuilder {
  private conditions: IWaitCondition[] = [];
  private selector: ElementSelector;
  private driver: IElementDriver;
  private wrapper: IE2EWrapper;

  constructor(selector: ElementSelector, driver: IElementDriver, wrapper: IE2EWrapper) {
    this.selector = selector;
    this.driver = driver;
    this.wrapper = wrapper;
  }

  forVisible(options?: WaitOptions): IWaitBuilder {
    const condition = new VisibleCondition(this.selector, this.driver, options);
    this.conditions.push(condition);
    return this;
  }

  forNotVisible(options?: WaitOptions): IWaitBuilder {
    const condition = new NotVisibleCondition(this.selector, this.driver, options);
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

  async execute(): Promise<IE2EWrapper> {
    if (this.conditions.length === 0) {
      throw new Error('No wait conditions specified. Use forVisible(), forEnabled(), or forExists() before executing.');
    }

    // Execute conditions in the order they were added (chained)
    for (const condition of this.conditions) {
      const result = await condition.execute();
      if (!result) {
        console.warn(`Wait condition failed: ${condition.getDescription()}`);
        throw new Error(`Wait condition failed: ${condition.getDescription()}`);
      }
    }

    return this.wrapper;
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