const path = require('path');
const defaults = require('@wordpress/scripts/config/webpack.config');
const isProduction = process.env.NODE_ENV === 'production';
const mode = isProduction ? 'production' : 'development';

const babelConfig = require('./babel.config.json')

module.exports = {
  ...defaults,
  mode,
  externals: {
    'wp': 'wp',
    'react': 'React',
    'react-dom': 'ReactDOM'
  },
  resolve: {
    extensions: ['.ts', '.js', '.jsx', '.tsx']
  },
  module: {
    rules: [
      {
        test: /\.((t|j)s(x?))$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: babelConfig
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(ttf|eot|woff|woff2|svg)$/,
        exclude: [/assets/, /node_modules/],
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'fonts/'
          }
        }
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack']
      }
    ]
  },
  output: {
		...defaults.output,
		filename: 'index.js',
		path: path.resolve(__dirname, 'build'),
	}
};
