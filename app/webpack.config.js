const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  devServer: {
    compress: true,
    port: 3000,
    historyApiFallback: true,
  },
  entry: __dirname + '/src/index.tsx',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['ts-loader'],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
        ],
      }
    ],
  },
  devtool: 'eval',
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.css'],
  },
  target: 'web',
  output: {
    filename: '[name].[contenthash].js',
    publicPath: '/',
  },
  plugins: [
    new HtmlWebpackPlugin({template: './public/index.html'}),
  ],
};
