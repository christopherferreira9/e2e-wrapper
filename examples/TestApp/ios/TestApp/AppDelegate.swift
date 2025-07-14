import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    factory.startReactNative(
      withModuleName: "TestApp",
      in: window,
      launchOptions: launchOptions
    )

    return true
  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
    // First try to find the bundle in the app bundle
    if let bundleURL = Bundle.main.url(forResource: "main", withExtension: "jsbundle") {
      print("Loading JS bundle from app bundle: \(bundleURL)")
      return bundleURL
    }
    
    // If we're in CI, check for a specific file in the app's directory
    let bundlePath = Bundle.main.bundlePath + "/main.jsbundle"
    let fileManager = FileManager.default
    if fileManager.fileExists(atPath: bundlePath) {
      let url = URL(fileURLWithPath: bundlePath)
      print("Loading JS bundle from: \(url)")
      return url
    }
    
    // Fall back to Metro in debug mode
#if DEBUG
    print("Loading JS bundle from Metro")
    return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    print("No bundle found!")
    return nil
#endif
  }
}
