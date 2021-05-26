const path = require('path');
const { DefinePlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { name, version } = require('../../package.json');
const getEntryPoints = require('../utils/getEntryPoints');

const SRC_PATH = path.resolve('./src');
const PUBLIC_PATH = path.resolve('./shop/');

module.exports = {
  cache: true,

  entry: {
    main: `${SRC_PATH}/js/main`,
    checkout: `${SRC_PATH}/js/checkout`,
    ...getEntryPoints(`${SRC_PATH}/js/pages`)
  },

  output: {
    path: `${PUBLIC_PATH}/assets`,
    filename: '[name].min.js',
    chunkFilename: '[name].bundle.js'
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        vendorMain: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor-main',
          chunks: ({ name }) => name !== 'checkout'
        },
        vendorCheckout: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor-checkout',
          chunks: ({ name }) => name === 'checkout'
        }
      }
    }
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: [
          'babel-loader',
          {
            loader: 'eslint-loader',
            options: {
              failOnError: true,
              failOnWarning: true
            }
          }
        ]
      }
    ]
  },

  plugins: [
    new DefinePlugin({
      __VERSION__: JSON.stringify(version),
      __NAME__: JSON.stringify(name),
      __TEST__: false
    }),

    new HtmlWebpackPlugin({
      inject: false,
      filename: `${PUBLIC_PATH}/snippets/pxl_scripts.liquid`,
      template: path.resolve(__dirname, '../templates/pxl_scripts.js'),
      excludeChunks: ['checkout', 'vendor-checkout']
    }),

    new HtmlWebpackPlugin({
      inject: false,
      filename: `${PUBLIC_PATH}/snippets/pxl_checkout_scripts.liquid`,
      template: path.resolve(__dirname, '../templates/pxl_checkout_scripts.js')
    })
  ],

  resolve: {
    alias: {
      waypoints: 'waypoints/lib/noframework.waypoints.js'
    }
  }
};
