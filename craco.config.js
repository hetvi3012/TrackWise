// craco.config.js
const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@primary-color': '#1DA57A',   // your brand color
              '@link-color':    '#1DA57A',
              '@border-radius-base': '8px'
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
