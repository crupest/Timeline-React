import webpack from 'webpack';

import baseConfig from './webpack.config.prod';

const config: webpack.Configuration = {
  ...baseConfig,
  plugins: [
    ...baseConfig.plugins,
    new webpack.DefinePlugin({
      'process.env.TIMELINE_USEDEVAPI': true,
    }),
  ],
};

export default config;
