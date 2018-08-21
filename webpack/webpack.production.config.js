/* eslint-disable import/no-extraneous-dependencies */

const webpack = require("webpack");

const ExtractTextPlugin = require("extract-text-webpack-plugin");
const extractCSSPlugin = new ExtractTextPlugin({
  filename: "client.css",
  disable: false,
  allChunks: true,
});

const BUILD_PATH = "build";

const commonProductionConfiguration = options =>
  require("./webpack.base.config")({
    name: options.name,
    entry: options.entry,
    target: options.target,
    shouldObfuscate: true,
    output: {
      hashDigestLength: 32,
      publicPath: `/${BUILD_PATH}/`,
      path: `${__dirname}/../${BUILD_PATH}`,
      filename: options.outputName,
    },
    externals: options.externals,
    devtool: false,
    rules: options.rules,
    plugins: (options.plugins || []).concat([
      new webpack.DefinePlugin({
        "process.env.ALGOLIA_APP_ID": JSON.stringify(process.env.ALGOLIA_APP_ID),
        "process.env.ALGOLIA_SECRET_KEY": JSON.stringify(process.env.ALGOLIA_SECRET_KEY),
        "process.env.API_ENDPOINT_PREFIX": JSON.stringify(process.env.API_ENDPOINT_PREFIX),
        "process.env.GOOGLE_CLIENT_ID": JSON.stringify(process.env.GOOGLE_CLIENT_ID),
        "process.env.GOOGLE_MAPS_API_KEY": JSON.stringify(process.env.GOOGLE_MAPS_API_KEY),
        "process.env.NODE_ENV": JSON.stringify("production"),
        "process.env.SEGMENT_WRITE_KEY": JSON.stringify(process.env.SEGMENT_WRITE_KEY),
        "process.env.SENTRY_CONFIG_URL": JSON.stringify(process.env.SENTRY_CONFIG_URL),
        "process.env.STRIPE_PUBLISHABLE_KEY": JSON.stringify(process.env.STRIPE_PUBLISHABLE_KEY),
      }),
    ]),
    imageOptimizationLoader: {
      loader: "image-webpack-loader",
      options: {
        optipng: {optimizationLevel: 6},
        mozjpeg: {quality: 75},
        svgo: {
          pretty: true,
          indent: 2,
          plugins: [{sortAttr: true}, {removeDimensions: true}],
        },
      },
    },
    performance: {
      hints: false,
    },
  });

module.exports = [
  // Server configuration:
  commonProductionConfiguration({
    name: "server",
    outputName: "server.js",
    entry: "./entries/server",
    target: "node",
    externals: {
      express: "commonjs express",
    },
    rules: [
      {
        test: /\.css$/,
        use: [
          "isomorphic-style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true,
              sourceMap: false,
              importLoaders: 1,
              camelCase: true,
              localIdentName: "[hash:32]",
            },
          },
          "postcss-loader",
        ],
      },
    ],
  }),

  // Client configuration:
  commonProductionConfiguration({
    name: "client",
    outputName: "client.js",
    entry: "./entries/client",
    target: "web",
    rules: [
      {
        test: /\.css$/,
        include: /node_modules/,
        use: extractCSSPlugin.extract({
          fallback: {
            loader: "style-loader",
            options: {
              fixUrls: true,
            },
          },
          use: [
            {
              loader: "css-loader",
              options: {
                modules: false,
                sourceMap: false,
                importLoaders: 1,
                camelCase: true,
                localIdentName: "[hash:32]",
              },
            },
          ],
        }),
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: extractCSSPlugin.extract({
          fallback: {
            loader: "style-loader",
            options: {
              fixUrls: true,
            },
          },
          use: [
            {
              loader: "css-loader",
              options: {
                modules: true,
                sourceMap: false,
                importLoaders: 1,
                camelCase: true,
                localIdentName: "[hash:32]",
              },
            },
            "postcss-loader",
          ],
        }),
      },
    ],
    plugins: [extractCSSPlugin],
  }),
];
