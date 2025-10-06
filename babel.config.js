module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [


      //this one should be last

      'react-native-reanimated/plugin',
    ],
  };
};