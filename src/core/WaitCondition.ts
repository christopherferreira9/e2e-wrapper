import { IWaitCondition, ElementSelector, WaitOptions, IElementDriver, CustomConditionOptions } from '../types';

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

export class NotVisibleCondition extends WaitCondition {
  async execute(): Promise<boolean> {
    return this.waitWithRetry(async () => {
      const isVisible = await this.driver.isVisible(this.selector, this.options);
      return !isVisible;
    });
  }

  getDescription(): string {
    return `Wait for element to not be visible`;
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

export class CustomCondition extends WaitCondition {
  private conditionOptions: CustomConditionOptions;

  constructor(selector: ElementSelector, driver: IElementDriver, conditionOptions: CustomConditionOptions, options: WaitOptions = {}) {
    super(selector, driver, options);
    this.conditionOptions = conditionOptions;
  }

  async execute(): Promise<boolean> {
    return this.waitWithRetry(async () => {
      try {
        // Check if element exists first
        const exists = await this.driver.exists(this.selector, this.options);
        if (!exists) {
          return false;
        }

        // Execute the appropriate condition check
        if (this.conditionOptions.hasClassName) {
          return await this.checkHasClassName(this.conditionOptions.hasClassName);
        }
        
        if (this.conditionOptions.hasAttribute) {
          return await this.checkHasAttribute(this.conditionOptions.hasAttribute);
        }
        
        if (this.conditionOptions.hasText) {
          return await this.checkHasText(this.conditionOptions.hasText);
        }
        
        if (this.conditionOptions.hasProperty) {
          return await this.checkHasProperty(this.conditionOptions.hasProperty);
        }
        
        if (this.conditionOptions.custom) {
          const element = await this.driver.getElement(this.selector, this.options);
          return await this.conditionOptions.custom(element, this.driver);
        }

        return false;
      } catch (error) {
        console.warn(`Custom condition check failed: ${error}`);
        return false;
      }
    });
  }

  private async checkHasClassName(expectedClassName: string): Promise<boolean> {
    try {
      const classAttribute = await this.driver.getAttribute(this.selector, 'class', this.options);
      if (!classAttribute) return false;
      
      const classNames = classAttribute.split(/\s+/);
      return classNames.includes(expectedClassName);
    } catch (error) {
      return false;
    }
  }

  private async checkHasAttribute(attr: { name: string; value?: string }): Promise<boolean> {
    try {
      const attributeValue = await this.driver.getAttribute(this.selector, attr.name, this.options);
      
      if (attr.value === undefined) {
        // Just check if attribute exists
        return attributeValue !== null;
      }
      
      return attributeValue === attr.value;
    } catch (error) {
      return false;
    }
  }

  private async checkHasText(expectedText: string): Promise<boolean> {
    try {
      const text = await this.driver.getText(this.selector, this.options);
      return text.includes(expectedText);
    } catch (error) {
      return false;
    }
  }

  private async checkHasProperty(prop: { name: string; value: any }): Promise<boolean> {
    try {
      const propertyValue = await this.driver.getProperty(this.selector, prop.name, this.options);
      return propertyValue === prop.value;
    } catch (error) {
      return false;
    }
  }

  getDescription(): string {
    if (this.conditionOptions.hasClassName) {
      return `Wait for element to have class "${this.conditionOptions.hasClassName}"`;
    }
    
    if (this.conditionOptions.hasAttribute) {
      const attr = this.conditionOptions.hasAttribute;
      return `Wait for element to have attribute "${attr.name}"${attr.value ? ` with value "${attr.value}"` : ''}`;
    }
    
    if (this.conditionOptions.hasText) {
      return `Wait for element to contain text "${this.conditionOptions.hasText}"`;
    }
    
    if (this.conditionOptions.hasProperty) {
      const prop = this.conditionOptions.hasProperty;
      return `Wait for element to have property "${prop.name}" with value "${prop.value}"`;
    }
    
    if (this.conditionOptions.custom) {
      return `Wait for custom condition to be met`;
    }

    return `Wait for custom condition`;
  }
} 