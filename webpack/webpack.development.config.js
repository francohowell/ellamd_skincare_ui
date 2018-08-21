/* eslint-disable import/no-extraneous-dependencies */

const webpack = require("webpack");

const HtmlWebpackPlugin = require("html-webpack-plugin");

// TODO: Eventually, we should resolve our circular dependencies. It's a big undertaking, though,
//   and it works for now:
// const CircularDependencyPlugin = require("circular-dependency-plugin");

module.exports = require("./webpack.base.config")({
  entry: "./entries/client",
  output: {
    filename: "[name].js",
    chunkFilename: "[name].chunk.js",
    publicPath: "/",
  },
  devServer: {
    historyApiFallback: true,
    disableHostCheck: true,
  },
  devtool: "inline-source-map",
  rules: [
    {
      test: /\.css$/,
      include: /node_modules/,
      use: ["style-loader", "css-loader"],
    },
    {
      enforce: "pre",
      test: /\.css$/,
      exclude: /node_modules/,
      use: [
        {
          loader: "typed-css-modules-loader",
          options: {camelCase: true},
        },
      ],
    },
    {
      test: /\.css$/,
      exclude: /node_modules/,
      use: [
        {
          loader: "style-loader",
          options: {
            fixUrls: true,
          },
        },
        {
          loader: "css-loader",
          options: {
            modules: true,
            importLoaders: 1,
            sourceMap: true,
            camelCase: true,
            localIdentName: "[path][name]__[local]",
          },
        },
        {
          loader: "postcss-loader",
          options: {
            sourceMap: true,
          },
        },
      ],
    },
  ],
  plugins: [
    // new CircularDependencyPlugin({
    //   exlude: /node_modules/,
    //   failOnError: false,
    // }),
    new webpack.WatchIgnorePlugin([/\.d\.ts$/]),
    new webpack.DefinePlugin({
      "process.env.ALGOLIA_APP_ID": JSON.stringify("X3X8JN0ULR"),
      "process.env.ALGOLIA_SECRET_KEY": JSON.stringify("8acf66d510a6541b475700b97ad5de45"),
      "process.env.API_ENDPOINT_PREFIX": JSON.stringify("http://localhost:3000/"),
      "process.env.GOOGLE_CLIENT_ID": JSON.stringify(
        "40997281822-akhpf6rh9nda6hil29hodm5h7gn12k81.apps.googleusercontent.com"
      ),
      "process.env.GOOGLE_MAPS_API_KEY": JSON.stringify("AIzaSyA0tH7Xkt6ytB6Ju74v1HFdB99SWk2MkiE"),
      "process.env.NODE_ENV": JSON.stringify("development"),
      "process.env.SEGMENT_WRITE_KEY": JSON.stringify("HHJTd6aR7SMUjSVGsmxiTjK8QVpw9rBu"),
      "process.env.SENTRY_CONFIG_URL": JSON.stringify(
        "https://1d5af867c28245d6b8919629fc551c78@sentry.io/195821"
      ),
      "process.env.STRIPE_PUBLISHABLE_KEY": JSON.stringify("pk_test_2Ymj7X10BqlpKJE7hcGCbcTH"),
    }),
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      favicon: "assets/images/favicon.png",
      template: "./entries/html.ejs",
      inject: true,
    })
  ],
});
