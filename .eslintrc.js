module.exports = {
  parser: "babel-eslint",
  extends: ["plugin:prettier/recommended"],
  plugins: ["import", "prettier"],
  env: {
    jest: true,
    node: true
  },
  globals: {},
  rules: {
    "arrow-body-style": [
      "error",
      "as-needed",
      {
        requireReturnForObjectLiteral: false
      }
    ],
    "class-methods-use-this": 0,
    "comma-dangle": [
      "error",
      {
        arrays: "always-multiline",
        objects: "always-multiline",
        imports: "always-multiline",
        exports: "always-multiline",
        functions: "never"
      }
    ],
    "default-case": 0,
    "import/no-unresolved": 2,
    "import/prefer-default-export": 0,
    "import/no-named-as-default": 0,
    "no-confusing-arrow": ["error"],
    "no-param-reassign": [
      "error",
      {
        props: true,
        ignorePropertyModificationsFor: ["draft"]
      }
    ],
    "no-warning-comments": 0,
    "prefer-arrow-callback": [
      "error",
      {
        allowNamedFunctions: false,
        allowUnboundThis: true
      }
    ],
    "require-jsdoc": "off"
  }
};
