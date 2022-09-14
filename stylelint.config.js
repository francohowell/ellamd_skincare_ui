module.exports = {
  extends: "stylelint-config-standard",
  rules: {
    "at-rule-no-unknown": null,
    "block-no-empty": null,
    "color-hex-case": "upper",
    "color-hex-length": "long",
    "custom-property-empty-line-before": null,
    "font-family-name-quotes": "always-unless-keyword",
    "font-family-no-missing-generic-family-keyword": null,
    "property-no-unknown": [true, {ignoreProperties: "composes"}],
    "selector-pseudo-class-no-unknown": null,
  },
};
