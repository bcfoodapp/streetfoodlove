const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

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
              "@babel/react",
              "@babel/preset-typescript",
              ["@babel/preset-env", { targets: "last 2 years" }],
            ],
          },
        },
      },
    ],
  },
});
