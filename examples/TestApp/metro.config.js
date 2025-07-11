const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  server: {
    // Allow connections from all addresses in CI environment
    host: process.env.CI ? '0.0.0.0' : 'localhost',
  },
  // Disable the Metro banner to reduce noise in logs
  reporter: {
    update: () => {},
  }
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
