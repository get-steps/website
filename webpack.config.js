const webpack = require('webpack');
const path = require('path');

module.exports = {
  cache: true,
  devtool: 'source-map',
  entry: {
    app: './src/js/app.js',
    custom_checkout: './src/js/custom_checkout.js',
  },
  output: {
    path: path.resolve(__dirname, './shop/assets/'),
    filename: '[name].min.js'
  },
  stats: {
    errorDetails: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          'babel-loader',
          {
            loader: 'eslint-loader',
            options: {
              failOnError: true,
              failOnWarning: true
            }
          },
        ]
      }
    ]
  },
  plugins: []
};
