const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const { version, description } = require('./package.json');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  context: path.resolve(__dirname, 'src'),

  mode: isProd ? 'production' : 'development',

  entry: {
    background: './background/background.js',
    content: './content/content.js',
    options: './options/options.js',
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]/[name].js',
  },

  devtool: false,

  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: '@(manifest).json',
          transform: content => {
            const manifest = JSON.parse(content.toString());
            return JSON.stringify({ ...manifest, version, description }, null, 2);
          },
        },
        { from: 'icons/*' },
        { from: 'options/@(options).html' },
        { from: 'options/badge.css' },
        {
          from: path.resolve(__dirname, 'node_modules/bulma/css/bulma.min.css'),
          to: path.resolve(__dirname, 'dist/options/bulma.min.css'),
        },
      ],
    }),
  ],

  stats: isProd ? 'normal' : 'errors-only',
};
