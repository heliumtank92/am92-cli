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
  "plugins": ["unused-imports", "import", "simple-import-sort"],
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
    "import/first": "error",
    "simple-import-sort/imports": [
      "error",
      {
        "groups": [
          ["^\\u0000"],
          [
            "^node:",
            "^(assert|buffer|child_process|cluster|console|constants|crypto|dgram|dns|domain|events|fs|http|https|module|net|os|path|punycode|querystring|readline|repl|stream|string_decoder|sys|timers|tls|tty|url|util|vm|zlib|freelist|v8|process|async_hooks|http2|perf_hooks)((\\/.*)|$)",
            "^@?\\w"
          ],
          [
            "(\\.|\\/|#)(c|C)onfigs?(\\.|\\/)",
            "(\\.|\\/|#)(s|S)dks?(\\.|\\/)",
            "(\\.|\\/|#)(l|L)ib(rary?)?(ies)?(\\.|\\/)",
            "(\\.|\\/|#)(u|U)tils?(\\.|\\/)",
            "(\\.|\\/|#)(h|H)elpers?(\\.|\\/)"
          ],
          [
            "(\\.|\\/)(o|O)dms?(\\.|\\/)",
            "(\\.|\\/)(m|M)odels?(\\.|\\/)",
            "(\\.|\\/)(c|C)ontrollers?(\\.|\\/)",
            "(\\.|\\/)(v|V)alidators?(\\.|\\/)",
            "(\\.|\\/)(r|R)outer?s?(\\.|\\/)"
          ],
          [
            "(\\.|\\/)(m|M)appers?(\\.|\\/)",
            "(\\.|\\/)(c|C)onstants?(\\.|\\/)"
          ],
          [
            "(^[\\.\\/])|(^[\\.\\.\\/])"
          ]
        ]
      }
    ]
  }
}`

export default ESLINTRCBASE
