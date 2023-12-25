const ESLINTRC = `{
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "env": {
    "node": true
  },
  "extends": [
    "airbnb"
  ],
  "rules": {
    "no-console": "off",
    "no-param-reassign": "off",
    "no-use-before-define": "off",
    "no-underscore-dangle": "off",
    "semi": "off",
    "import/no-relative-packages": "off",
    "import/prefer-default-export": "off",
    "import/extensions": "off",
    "import/no-named-default": "off",
    "comma-dangle": "off",
    "object-curly-newline": "off",
    "no-constructor-return": "off",
    "no-case-declarations": "off",
    "arrow-parens": "off",
    "consistent-return": "off",
    "func-names": "off",
    "default-param-last": "off",
    "no-restricted-syntax": "off",
    "no-await-in-loop": "off",
    "operator-linebreak": "off",
    "implicit-arrow-linebreak": "off",
    "function-paren-newline": "off",
    "no-empty-function": "off",
    "no-unused-vars": [
      "error",
      {
        "vars": "all",
        "varsIgnorePattern": "^_",
        "args": "after-used",
        "argsIgnorePattern": "^_",
        "ignoreRestSiblings": true
      }
    ]
  }
}
`

export default ESLINTRC
