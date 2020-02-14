import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import autoprefixer from 'autoprefixer';

export const commonRules: webpack.RuleSetRule[] = [
  {
    test: /\.css$/,
    use: ['style-loader', 'css-loader']
  },
  {
    test: /\.(scss)$/,
    use: [
      'style-loader',
      'css-loader',
      {
        loader: 'postcss-loader',
        options: {
          plugins: function() {
            return [autoprefixer];
          }
        }
      },
      'sass-loader'
    ]
  },
  {
    test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot)$/i,
    use: [
      {
        loader: 'url-loader',
        options: {
          limit: 8192
        }
      },
      {
        loader: 'image-webpack-loader'
      }
    ]
  }
];

export const htmlCommonConfig: HtmlWebpackPlugin.Options = {
  inject: false,
  template: require('html-webpack-template'),

  appMountId: 'app',
  mobile: true,

  headHtmlSnippet: `
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5">
  <meta name="msapplication-TileColor" content="#2d89ef">
  <meta name="theme-color" content="#ffffff">
  `,
  title: 'Timeline'
};
