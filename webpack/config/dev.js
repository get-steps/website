const { DefinePlugin } = require('webpack');
const merge = require('webpack-merge');
const core = require('./core');

module.exports = merge([
  core,
  {
    mode: 'development',
    watch: true,

    devtool: 'cheap-module-eval-source-map',

    plugins: [
      new DefinePlugin({
        __DEV__: true,
        __PROD__: false
      })
    ]
  }
]);
