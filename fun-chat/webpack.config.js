const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const EslingPlugin = require('eslint-webpack-plugin');

module.exports = {
  entry: './src/index',

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },

  module: {
    rules: [{
      test: /\.(png|jpg|gif|svg|mp3)$/i,
      type: 'asset/resource',
    },
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    },
    { test: /\.ts$/i, use: 'ts-loader' },
    ],
  },
  resolve: {
    extensions: [' ', '.ts', '.js', '.png', '.mp3'],
  },

  plugins: [
    new HtmlWebpackPlugin({
      favicon: './src/favicon.ico',
      template: './src/index.html',
    }),
    new EslingPlugin({ extensions: 'ts' }),
  ],

  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    historyApiFallback: true,
    open: true,
  },

  mode: 'development',
};
