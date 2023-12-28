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
  "plugins": ["unused-imports"],
  "settings": {
    "n": {
      "allowModules": ["#api", "#config", "#polyfill"]
    }
  },
  "rules": {
    "no-unreachable-loop": "error",
    "no-unneeded-ternary": "error",
    "no-unused-vars": "off",
    "unused-imports/no-unused-vars": ["error", { "ignoreRestSiblings": true }],
    "unused-imports/no-unused-imports": "error",
    "max-depth": 2,
    "no-var": "error",
    "n/no-process-exit": "off"
  }
}`

export default ESLINTRCBASE
