import { DetoxCircusEnvironment } from 'detox/runners/jest';
import * as fs from 'fs';
import * as path from 'path';

class CustomDetoxEnvironment extends DetoxCircusEnvironment {
  initTimeout: number;
  artifactsDirectory: string;
  
  constructor(config: any, context: any) {
    super(config, context);

    // Increase timeout for CI environments
    this.initTimeout = 600000; // 10 minutes
    
    // Setup artifacts directory
    this.artifactsDirectory = path.join(__dirname, '../artifacts');
    
    // Ensure artifacts directory exists
    if (!fs.existsSync(this.artifactsDirectory)) {
      fs.mkdirSync(this.artifactsDirectory, { recursive: true });
    }

    // This takes care of generating status logs on a per-spec basis. By default, Jest only reports at file-level.
    // This is strictly optional.
    // Note: SpecReporter and WorkerAssignReporter might not be available in all versions
    // this.registerListeners({
    //   SpecReporter,
    //   WorkerAssignReporter,
    // });
  }

  async setup() {
    await super.setup();

    // Add a delay to ensure the app is fully initialized
    console.log('Waiting for app to initialize...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    console.log('App initialization delay complete');
  }

  async setupDetoxConfig() {
    try {
      // Configure Detox to save screenshots and videos on test failure
      await device.setURLBlacklist([]);
      
      // Launch app with more resilient settings
      await device.launchApp({
        newInstance: true,
        delete: true,
        launchArgs: { 
          detoxSessionId: Date.now().toString(),
          detoxPrintBusyIdleResources: 'YES',
        },
        permissions: { notifications: 'YES', camera: 'YES' }
      });
      
      // Add a delay after launching the app
      await new Promise(resolve => setTimeout(resolve, 3000));
      console.log('App launched successfully');
    } catch (error) {
      console.error('Error during app launch:', error);
      // Try one more time if it fails
      try {
        await device.launchApp({ newInstance: true });
        await new Promise(resolve => setTimeout(resolve, 3000));
        console.log('App launched successfully on second attempt');
      } catch (retryError) {
        console.error('Failed to launch app on retry:', retryError);
      }
    }
  }

  async handleTestEvent(event: any, state: any) {
    await super.handleTestEvent(event, state);
    
    if (event.name === 'test_start') {
      try {
        // Relaunch app before each test to ensure clean state
        await device.reloadReactNative();
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.log('Error reloading React Native:', error);
      }
    }
    
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