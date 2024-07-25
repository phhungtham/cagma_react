const cracoAlias = require('craco-alias');

module.exports = {
  eslint: {
    enable: true,
    mode: 'extends' || 'file',

    configure: (eslintConfig, { env, paths }) => {
      return eslintConfig;
    }
  },
  plugins: [
    {
      plugin: cracoAlias,
      options: {
        baseUrl: './src',
        source: 'jsconfig'
      }
    }
  ]
};
