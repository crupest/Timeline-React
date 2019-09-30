const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = {
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
        vendors: {
          name: "venders"
        }
      }
    }
  },
  output: {
    path: path.resolve(__dirname, "dist/"),
    filename: "[name].[hash].js"
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      inject: false,
      template: require("html-webpack-template"),

      appMountId: "app",
      baseHref: "https://crupest.xyz",
      mobile: true,
      lang: "en-US",
      links: [
        "https://fonts.googleapis.com/icon?family=Material+Icons",
        {
          href: "manifest.json",
          rel: "manifest"
        },
        {
          href: "logo192.png",
          rel: "apple-touch-icon"
        },
        {
          href: "favicon.ico",
          rel: "shortcut icon"
        }
      ],
      title: "Timeline"
    }),
    new ForkTsCheckerWebpackPlugin()
  ]
};
