const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    devServer: {
        compress: true,
        port: 3000,
    },
    entry: __dirname + '/src/index.js',
    module: {
        rules: [
            {
                test: /\.(js|jsx)/,
                use: {
                    loader: 'babel-loader',
                },
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
        extensions: ['.js', '.jsx', '.css'],
    },
    target: 'web',
    output: {
        filename: '[name].[contenthash].js',
    },
    plugins: [
        new HtmlWebpackPlugin({template: './public/index.html'}),
    ],
};
