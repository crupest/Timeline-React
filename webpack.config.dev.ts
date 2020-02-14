import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

import { commonRules, htmlCommonConfig } from './webpack.common';

const config: webpack.Configuration = {
  entry: ['react-hot-loader/patch', './src/index.tsx'],
  mode: 'development',
  devtool: 'eval-source-map',
  module: {
    rules: [
      ...commonRules,
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          plugins: ['react-hot-loader/babel']
        }
      }
    ]
  },
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom'
    },
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
  devServer: {
    contentBase: path.join(__dirname, 'public/'),
    host: '0.0.0.0',
    port: 3000,
    publicPath: 'http://localhost:3000/',
    historyApiFallback: true,
    hotOnly: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      ...htmlCommonConfig,
      devServer: 'http://localhost:3000'
    }),
    new ForkTsCheckerWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
};

export default config;
