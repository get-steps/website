const { DefinePlugin } = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const merge = require('webpack-merge');
const core = require('./core');

module.exports = merge([
  core,
  {
    mode: 'production',

    devtool: 'source-map',

    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            parallel: true,
            sourceMap: true,
            mangle: true,
            compress: true
          }
        })
      ]
    },

    plugins: [
      new DefinePlugin({
        __DEV__: false,
        __PROD__: true,
      }),
    ]
  }
]);
