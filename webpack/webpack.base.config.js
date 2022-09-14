/* eslint-disable import/no-extraneous-dependencies */

const path = require("path");

const fileLoader = options => ({
  loader: "file-loader",
  options: {
    name: options.shouldObfuscate ? "[hash:32].[ext]" : "[name].[hash:8].[ext]",
  },
});

module.exports = options => ({
  entry: options.entry,
  target: options.target,
  output: options.output,
  devServer: options.devServer,
  devtool: options.devtool,
  plugins: options.plugins,
  performance: options.performance,
  externals: options.externals,
  resolve: {
    modules: [path.resolve("./"), "node_modules"],
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  module: {
    rules: (options.rules || []).concat([
      {
        enforce: "pre",
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: ["tslint-loader"],
      },
      {
        test: /\.ts$/,
        exclude: /(node_modules|\.d\.ts$)/,
        use: ["ts-loader"],
      },
      {
        test: /\.tsx$/,
        exclude: /node_modules/,
        use: ["react-hot-loader", "ts-loader"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        include: /node_modules/,
        use: ["file-loader"],
      },
      {
        test: /\.ejs$/,
        exclude: /node_modules/,
        use: ["ejs-compiled-loader"],
      },
      {
        test: /icons\/.*\.svg$/,
        use: ["@svgr/webpack"],
      },
      {
        test: /(^|\/)assets\//,
        exclude: /node_modules/,
        oneOf: [
          {
            test: /\.(eot|svg|ttf|woff|woff2)$/,
            use: ["file-loader"],
          },
          {
            // Load the icons as SVG strings:
            test: /\/icons\//,
            use: ["raw-loader"],
          },
          {
            // Optimize images before passing them into the file loader:
            test: /\.(jpe?g|png|gif|svg)$/,
            use: [fileLoader(options), options.imageOptimizationLoader].filter(
              loader => loader !== undefined && loader !== null
            ),
          },
          {
            // For everything else, just load the file:
            use: [fileLoader(options)],
          },
        ],
      },
    ]),
  },
});
