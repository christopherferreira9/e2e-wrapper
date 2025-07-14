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
    try {
      console.log('Setting up Detox environment...');
      await super.setup();
      
      // Add a delay to ensure the app is fully initialized
      console.log('Waiting for app to initialize...');
      await new Promise(resolve => setTimeout(resolve, 10000));
      console.log('App initialization delay complete');
    } catch (error) {
      console.error('Error during setup:', error);
      throw error;
    }
  }

  async teardown() {
    try {
      console.log('Tearing down Detox environment...');
      await super.teardown();
    } catch (error) {
      console.error('Error during teardown:', error);
    }
  }

  async handleTestEvent(event: any, state: any) {
    try {
      await super.handleTestEvent(event, state);
      
      if (event.name === 'test_start') {
        try {
          console.log(`Starting test: ${event.test.name}`);
          
          // Try to reload React Native before each test
          try {
            await device.reloadReactNative();
            await new Promise(resolve => setTimeout(resolve, 2000));
            console.log('Successfully reloaded React Native');
          } catch (reloadError) {
            console.log('Error reloading React Native, trying to launch app instead:', reloadError);
            
            // If reload fails, try to launch the app
            try {
              await device.launchApp({ newInstance: false });
              await new Promise(resolve => setTimeout(resolve, 2000));
              console.log('Successfully launched app');
            } catch (launchError) {
              console.error('Failed to launch app:', launchError);
            }
          }
        } catch (error) {
          console.error('Error in test_start event handler:', error);
        }
      }
      
      if (event.name === 'test_done') {
        console.log(`Test completed: ${event.test.name} (${event.test.errors.length ? 'FAILED' : 'PASSED'})`);
        
        if (event.test.errors.length > 0) {
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
    } catch (error) {
      console.error('Error in handleTestEvent:', error);
    }
  }
}

export default CustomDetoxEnvironment; 