const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {
    sourceExts: ['js', 'jsx', 'ts', 'tsx', 'json'],
  },
  transformer: {
    babelTransformerPath: require.resolve('@react-native/metro-babel-transformer'),
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  // Add experimental support for better TypeScript handling
  serializer: {
    getModulesRunBeforeMainModule: () => [
      require.resolve('@react-native/polyfills/console'),
      require.resolve('@react-native/polyfills/error-guard'),
      require.resolve('@react-native/polyfills/Object.es6'),
    ],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
