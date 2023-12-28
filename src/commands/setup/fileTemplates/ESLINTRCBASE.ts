const ESLINTRCBASE = `{
  "env": {
    "node": true
  },
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "extends": [
    "eslint:recommended",
    "plugin:n/recommended",
    "plugin:prettier/recommended"
  ],
  "plugins": ["unused-imports", "import"],
  "settings": {
    "n": {
      "allowModules": ["#api", "#config", "#polyfill"]
    }
  },
  "rules": {
    "no-var": "error",
    "max-depth": 2,
    "no-case-declarations": "off",
    "no-unreachable-loop": "error",
    "no-unneeded-ternary": "error",
    "no-unused-vars": "off",
    "unused-imports/no-unused-vars": ["error", { "ignoreRestSiblings": true }],
    "unused-imports/no-unused-imports": "error",
    "import/no-duplicates": "error",
    "import/first": "error"
  }
}`

export default ESLINTRCBASE
