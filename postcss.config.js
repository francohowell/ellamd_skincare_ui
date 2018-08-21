/* eslint-disable import/no-extraneous-dependencies, global-require */

module.exports = {
  plugins: [
    require("stylelint")({configFile: "./stylelint.config.js", ignorePath: "./node_modules"}),
    require("postcss-import")({path: "./styles"}),
    require("postcss-sassy-mixins"),
    require("postcss-simple-vars"),
    require("postcss-hexrgba"),
    require("postcss-cssnext"),
  ],
};
