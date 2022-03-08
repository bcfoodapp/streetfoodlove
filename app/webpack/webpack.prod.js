const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  output: {
    publicPath: "/streetfoodlove/",
  },
  module: {
    rules: [
      {
        test: /.tsx?$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              ["@babel/react", { runtime: "automatic" }],
              "@babel/preset-typescript",
              ["@babel/preset-env", { targets: "last 2 years" }],
            ],
          },
        },
      },
    ],
  },
  devtool: "inline-source-map",
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: "public",
          to: "/",
          globOptions: {
            ignore: ["**/index.html"],
          },
        },
      ],
    }),
  ],
});
