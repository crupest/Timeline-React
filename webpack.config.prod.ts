import path from "path";
import webpack from "webpack";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import { htmlCommonConfig } from "./webpack.common";

const config: webpack.Configuration = {
  entry: ["./src/index.tsx"],
  mode: "production",
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192
            }
          },
          {
            loader: "image-webpack-loader"
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ["*", ".js", ".jsx", ".ts", ".tsx"]
  },
  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all"
        }
      }
    }
  },
  output: {
    path: path.resolve(__dirname, "dist/"),
    filename: "[name].[hash].js",
    chunkFilename: "[name].[hash].js",
    publicPath: "/"
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      ...htmlCommonConfig,
      filename: "index-root.html",
      baseHref: "https://crupest.xyz"
    }),
    new HtmlWebpackPlugin({
      ...htmlCommonConfig,
      filename: "index-www.html",
      baseHref: "https://www.crupest.xyz"
    }),
    new ForkTsCheckerWebpackPlugin()
  ]
};

export default config;
