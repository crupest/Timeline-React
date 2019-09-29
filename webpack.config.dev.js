const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = {
  entry: ["react-hot-loader/patch", "./src/index.tsx"],
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          plugins: ["react-hot-loader/babel"]
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: "file-loader"
          },
          {
            loader: "image-webpack-loader"
          }
        ]
      }
    ]
  },
  resolve: {
    alias: {
      "react-dom": "@hot-loader/react-dom"
    },
    extensions: ["*", ".js", ".jsx", ".ts", ".tsx"]
  },
  output: {
    path: path.resolve(__dirname, "dist/"),
    filename: "bundle.js"
  },
  devServer: {
    contentBase: path.join(__dirname, "public/"),
    host: '0.0.0.0',
    port: 3000,
    publicPath: "http://localhost:3000/",
    historyApiFallback: true,
    hotOnly: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: false,
      template: require('html-webpack-template'),

      appMountId: 'app',
      devServer: 'http://localhost:3000',
      mobile: true,
      lang: 'en-US',
      links: [
        'https://fonts.googleapis.com/icon?family=Material+Icons',
        {
          href: '/manifest.json',
          rel: 'manifest',
        },
        {
          href: '/logo192.png',
          rel: 'apple-touch-icon',
        },
        {
          href: '/favicon.ico',
          rel: 'shortcut icon',
        }
      ],
      title: 'Timeline',
    }),
    new ForkTsCheckerWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
};
