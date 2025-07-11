module.exports = {
  testRunner: {
    args: {
      '$0': 'jest',
      config: 'e2e/jest.config.js'
    },
    jest: {
      setupFilesAfterEnv: ['<rootDir>/e2e/init.ts']
    }
  },
  apps: {
    'ios.debug': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/TestApp.app',
      build: 'xcodebuild -workspace ios/TestApp.xcworkspace -scheme TestApp -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build'
    },
    'ios.release': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Release-iphonesimulator/TestApp.app',
      build: 'xcodebuild -workspace ios/TestApp.xcworkspace -scheme TestApp -configuration Release -sdk iphonesimulator -derivedDataPath ios/build'
    },
    'android.debug': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
      build: 'cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug',
      reversePorts: [8081]
    },
    'android.release': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/release/app-release.apk',
      build: 'cd android && ./gradlew assembleRelease assembleAndroidTest -DtestBuildType=release',
      reversePorts: [8081]
    }
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: {
        type: 'iPhone 16 Pro'
      }
    },
    attached: {
      type: 'android.attached',
      device: {
        adbName: '.*'
      }
    },
    emulator: {
      type: 'android.emulator',
      device: {
        avdName: 'Pixel_3a_API_30_x86'
      }
    }
  },
  configurations: {
    'ios.sim.debug': {
      device: 'simulator',
      app: 'ios.debug',
      behavior: {
        launchApp: 'auto',
        init: {
          exposeGlobals: true,
        },
      },
      artifacts: {
        rootDir: './artifacts',
        plugins: {
          log: { enabled: true },
          screenshot: {
            enabled: true,
            shouldTakeAutomaticSnapshots: true,
            keepOnlyFailedTestsArtifacts: true,
            takeWhen: {
              testStart: false,
              testDone: true,
            },
          },
          video: {
            enabled: true,
            keepOnlyFailedTestsArtifacts: true,
          }
        }
      }
    },
    'ios.sim.release': {
      device: 'simulator',
      app: 'ios.release',
      artifacts: {
        rootDir: './artifacts',
        plugins: {
          log: { enabled: true },
          screenshot: {
            enabled: true,
            shouldTakeAutomaticSnapshots: true,
            keepOnlyFailedTestsArtifacts: true,
            takeWhen: {
              testStart: false,
              testDone: true,
            },
          },
          video: {
            enabled: true,
            keepOnlyFailedTestsArtifacts: true,
          }
        }
      }
    },
    'android.att.debug': {
      device: 'attached',
      app: 'android.debug',
      behavior: {
        launchApp: 'auto',
        init: {
          exposeGlobals: true,
        },
      },
      artifacts: {
        rootDir: './artifacts',
        plugins: {
          log: { enabled: true },
          screenshot: {
            enabled: true,
            shouldTakeAutomaticSnapshots: true,
            keepOnlyFailedTestsArtifacts: true,
            takeWhen: {
              testStart: false,
              testDone: true,
            },
          },
          video: {
            enabled: true,
            keepOnlyFailedTestsArtifacts: true,
          }
        }
      }
    },
    'android.att.release': {
      device: 'attached',
      app: 'android.release',
      artifacts: {
        rootDir: './artifacts',
        plugins: {
          log: { enabled: true },
          screenshot: {
            enabled: true,
            shouldTakeAutomaticSnapshots: true,
            keepOnlyFailedTestsArtifacts: true,
            takeWhen: {
              testStart: false,
              testDone: true,
            },
          },
          video: {
            enabled: true,
            keepOnlyFailedTestsArtifacts: true,
          }
        }
      }
    },
    'android.emu.debug': {
      device: 'emulator',
      app: 'android.debug',
      behavior: {
        launchApp: 'auto',
        init: {
          exposeGlobals: true,
        },
      },
      artifacts: {
        rootDir: './artifacts',
        plugins: {
          log: { enabled: true },
          screenshot: {
            enabled: true,
            shouldTakeAutomaticSnapshots: true,
            keepOnlyFailedTestsArtifacts: true,
            takeWhen: {
              testStart: false,
              testDone: true,
            },
          },
          video: {
            enabled: true,
            keepOnlyFailedTestsArtifacts: true,
          }
        }
      }
    },
    'android.emu.release': {
      device: 'emulator',
      app: 'android.release',
      artifacts: {
        rootDir: './artifacts',
        plugins: {
          log: { enabled: true },
          screenshot: {
            enabled: true,
            shouldTakeAutomaticSnapshots: true,
            keepOnlyFailedTestsArtifacts: true,
            takeWhen: {
              testStart: false,
              testDone: true,
            },
          },
          video: {
            enabled: true,
            keepOnlyFailedTestsArtifacts: true,
          }
        }
      }
    }
  }
}; 