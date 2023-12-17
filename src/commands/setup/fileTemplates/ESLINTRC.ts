const ESLINTRC = `{
  "env": {
    "node": true,
    "es2022": true
  },
  "extends": [
    "plugin:node/recommended",
    "eslint:recommended",
    "plugin:prettier/recommended"
  ],
  "plugins": [
    "unused-imports"
  ],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    "no-unexpected-multiline": "error",
    "max-len": [
      "error",
      {
        "code": 120,
        "ignoreUrls": true
      }
    ],
    "no-tabs": [
      "error",
      {
        "allowIndentationTabs": true
      }
    ],
    "no-trailing-spaces": "error",
    "eqeqeq": "error",
    "complexity": [
      "error",
      8
    ],
    "max-depth": [
      "error",
      3
    ],
    "space-infix-ops": "error",
    "no-unreachable-loop": "error",
    "no-unneeded-ternary": "error",
    "no-shadow": "error",
    "no-mixed-operators": "error",
    "no-process-exit": "off",
    "no-unused-vars": "off",
    "prettier/prettier": "off",
    "prefer-const": "error",
    "node/no-unsupported-features/es-syntax": "off",
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "error",
      {
        "vars": "all",
        "varsIgnorePattern": "^_",
        "args": "after-used",
        "argsIgnorePattern": "^_",
        "ignoreRestSiblings": true
      }
    ],
    "no-multiple-empty-lines": "error",
    "quotes": [
      "error",
      "single",
      {
        "avoidEscape": true,
        "allowTemplateLiterals": true
      }
    ],
    "node/no-missing-import": [
      "error",
      {
        "allowModules": []
      }
    ],
    "node/no-extraneous-require": [
      "error",
      {
        "allowModules": []
      }
    ]
  }
}`

export default ESLINTRC
