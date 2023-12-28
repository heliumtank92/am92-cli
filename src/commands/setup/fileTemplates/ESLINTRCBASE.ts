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
    "plugin:node/recommended",
    "plugin:prettier/recommended"
  ],
  "plugins": ["unused-imports"],
  "settings": {
    "node": {
      "allowModules": ["@am92/api-logger"]
    }
  },
  "rules": {
    "no-unreachable-loop": "error",
    "no-unneeded-ternary": "error",
    "no-unused-vars": "off",
    "unused-imports/no-unused-vars": ["error", { "ignoreRestSiblings": true }],
    "unused-imports/no-unused-imports": "error",
    "max-depth": 2,
    "no-var": "error"
  }
}`

export default ESLINTRCBASE
