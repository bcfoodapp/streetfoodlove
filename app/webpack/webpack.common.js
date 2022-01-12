const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: __dirname + "/../src/index.tsx",
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx", ".css"],
  },
  target: "web",
  output: {
    filename: "[name].[contenthash].js",
    publicPath: "/",
  },
  plugins: [
    new HtmlWebpackPlugin({ template: "./public/index.html" }),
    new CopyPlugin({
      patterns: [{ from: "public", to: "public" }],
    }),
  ],
};
