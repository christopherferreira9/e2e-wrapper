import { IElementDriver, ElementSelector, WaitOptions, ElementState, TestFramework } from '../types';

export abstract class BaseElementDriver implements IElementDriver {
  protected framework: TestFramework;

  constructor(framework: TestFramework) {
    this.framework = framework;
  }

  abstract isVisible(selector: ElementSelector, options?: WaitOptions): Promise<boolean>;
  abstract isEnabled(selector: ElementSelector, options?: WaitOptions): Promise<boolean>;
  abstract exists(selector: ElementSelector, options?: WaitOptions): Promise<boolean>;

  async waitForState(selector: ElementSelector, state: ElementState, options: WaitOptions = {}): Promise<boolean> {
    const { timeout = 5000, interval = 100 } = options;
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      try {
        const currentState = await this.getCurrentState(selector, options);
        
        if (this.stateMatches(currentState, state)) {
          return true;
        }
      } catch (error) {
        console.warn(`Error checking element state: ${error}`);
      }

      await this.sleep(interval);
    }

    return false;
  }

  protected async getCurrentState(selector: ElementSelector, options?: WaitOptions): Promise<ElementState> {
    const [isVisible, isEnabled, exists] = await Promise.all([
      this.isVisible(selector, options).catch(() => false),
      this.isEnabled(selector, options).catch(() => false),
      this.exists(selector, options).catch(() => false)
    ]);

    return { isVisible, isEnabled, exists };
  }

  protected stateMatches(current: ElementState, expected: ElementState): boolean {
    return Object.entries(expected).every(([key, value]) => {
      if (value === undefined) return true;
      return current[key as keyof ElementState] === value;
    });
  }

  protected sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  protected buildSelectorString(selector: ElementSelector): string {
    if (selector.id) return `#${selector.id}`;
    if (selector.testId) return `[data-testid="${selector.testId}"]`;
    if (selector.className) return `.${selector.className}`;
    if (selector.xpath) return selector.xpath;
    if (selector.text) return `text="${selector.text}"`;
    if (selector.accessibility) return `[aria-label="${selector.accessibility}"]`;
    
    throw new Error('Invalid selector: at least one selector property must be provided');
  }

  getFramework(): TestFramework {
    return this.framework;
  }
} 