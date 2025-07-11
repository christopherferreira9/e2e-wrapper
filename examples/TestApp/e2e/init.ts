import { DetoxCircusEnvironment } from 'detox/runners/jest';
import * as fs from 'fs';
import * as path from 'path';

class CustomDetoxEnvironment extends DetoxCircusEnvironment {
  initTimeout: number;
  artifactsDirectory: string;
  
  constructor(config: any, context: any) {
    super(config, context);

    // Can be safely removed, if you are content with the default value (=300000ms)
    this.initTimeout = 300000;
    
    // Setup artifacts directory
    this.artifactsDirectory = path.join(__dirname, '../artifacts');
    
    // Ensure artifacts directory exists
    if (!fs.existsSync(this.artifactsDirectory)) {
      fs.mkdirSync(this.artifactsDirectory, { recursive: true });
    }

    // Configure Detox to save artifacts
    this.setupDetoxConfig();

    // This takes care of generating status logs on a per-spec basis. By default, Jest only reports at file-level.
    // This is strictly optional.
    // Note: SpecReporter and WorkerAssignReporter might not be available in all versions
    // this.registerListeners({
    //   SpecReporter,
    //   WorkerAssignReporter,
    // });
  }

  async setupDetoxConfig() {
    // Configure Detox to save screenshots and videos on test failure
    await device.setURLBlacklist([]);
    await device.launchApp({
      newInstance: true,
      launchArgs: { detoxSessionId: Date.now().toString() },
      permissions: { notifications: 'YES', camera: 'YES' }
    });
  }

  async handleTestEvent(event: any, state: any) {
    await super.handleTestEvent(event, state);
    
    if (event.name === 'test_done' && event.test.errors.length > 0) {
      const testName = event.test.name.replace(/\s+/g, '_').toLowerCase();
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const screenshotName = `${testName}_${timestamp}.png`;
      const screenshotPath = path.join(this.artifactsDirectory, screenshotName);
      
      try {
        // Take a screenshot on test failure
        await device.takeScreenshot(screenshotName);
        console.log(`Screenshot saved at: ${screenshotPath}`);
      } catch (error) {
        console.error('Failed to take screenshot:', error);
      }
    }
  }
}

export default CustomDetoxEnvironment; 