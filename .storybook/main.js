const path = require('path');
module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/storybook/components/**/*.stories.@(js|jsx|ts|tsx)'],

  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/preset-create-react-app'
  ],

  features: {
    storyStoreV7: false
  },

  framework: { name: '@storybook/react-webpack5' , options:{}},

  webpackFinal: async config => {
    // 👈 and add this here
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '../src'),
      '@presentation': path.resolve(__dirname, '../src/presentation'),
      '@common': path.resolve(__dirname, '../src/common'),
      '@modules': path.resolve(__dirname, '../src/modules'),
      '@design': path.resolve(__dirname, '../src/design'),
      '@routes': path.resolve(__dirname, '../src/routes'),
      '@global': path.resolve(__dirname, '../src/global'),
      '@atomic': path.resolve(__dirname, '../src/common/ui/components/atomic'),
      '@assets': path.resolve(__dirname, '../src/assets'),
      '@hooks': path.resolve(__dirname, '../src/hooks'),
      '@configs': path.resolve(__dirname, '../src/configs'),
      '@utilities': path.resolve(__dirname, '../src/utilities'),
      '@components': path.resolve(__dirname, '../src/components')
    };
    return config;
  },
};
