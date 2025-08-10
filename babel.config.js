export default {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'react-native-worklets/plugin', // keep your existing plugin
  ],
  env: {
    production: {
      plugins: ['react-native-paper/babel'], // add paper plugin for production only
    },
  },
};
