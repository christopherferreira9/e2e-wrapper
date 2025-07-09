import { DetoxCircusEnvironment } from 'detox/runners/jest';

class CustomDetoxEnvironment extends DetoxCircusEnvironment {
  initTimeout: number;
  
  constructor(config: any, context: any) {
    super(config, context);

    // Can be safely removed, if you are content with the default value (=300000ms)
    this.initTimeout = 300000;

    // This takes care of generating status logs on a per-spec basis. By default, Jest only reports at file-level.
    // This is strictly optional.
    // Note: SpecReporter and WorkerAssignReporter might not be available in all versions
    // this.registerListeners({
    //   SpecReporter,
    //   WorkerAssignReporter,
    // });
  }
}

export default CustomDetoxEnvironment; 