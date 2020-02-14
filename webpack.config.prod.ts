import path from 'path';
import webpack from 'webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';

import { commonRules, htmlCommonConfig } from './webpack.common';

const config: webpack.Configuration = {
  entry: ['./src/index.tsx'],
  mode: 'production',
  devtool: 'source-map',
  module: {
    rules: [
      ...commonRules,
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.ts', '.tsx']
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },
  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: '[name].[hash].js',
    chunkFilename: '[name].[hash].js',
    publicPath: '/'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin(htmlCommonConfig),
    new ForkTsCheckerWebpackPlugin(),
    new CopyPlugin([
      {
        from: path.resolve(__dirname, 'public/'),
        to: path.resolve(__dirname, 'dist/')
      }
    ])
  ]
};

export default config;
