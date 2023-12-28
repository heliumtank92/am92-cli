const VSCODE_SETTINGS = `{
  "git.autofetch": true,

  "explorer.confirmDelete": true,
  "explorer.compactFolders": false,

  "workbench.startupEditor": "none",
  "workbench.statusBar.visible": true,
  "workbench.editor.enablePreview": true,
  "workbench.editor.closeOnFileDelete": true,
  "workbench.editor.highlightModifiedTabs": true,
  "workbench.activityBar.visible": true,
  "workbench.editor.restoreViewState": true,

  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "editor.detectIndentation": true,
  "editor.renderWhitespace": "none",
  "editor.scrollBeyondLastLine": true,
  "editor.lineNumbers": "on",
  "editor.find.seedSearchStringFromSelection": "never",
  "editor.renderLineHighlight": "all",
  "editor.formatOnSave": false,
  "editor.formatOnPaste": true,
  "editor.formatOnType": false,
  "editor.inlineSuggest.enabled": true,
  "editor.suggestSelection": "first",
  "editor.codeActionsOnSave": {
    "source.addMissingImports": "explicit",
    "source.fixAll.eslint": "explicit"
  },

  "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"],
  "prettier.singleQuote": true,
  "prettier.semi": false,
  "prettier.trailingComma": "none",
  "prettier.arrowParens": "avoid",
  "[javascript]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascriptreact]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },

  "diffEditor.ignoreTrimWhitespace": false,

  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  "files.associations": {
    ".env*": "makefile"
  },
  "files.exclude": {
    "**/.classpath": true,
    "**/.project": true,
    "**/.settings": true,
    "**/.factorypath": true
  },

  "markdown.extension.orderedList.autoRenumber": false,
  "markdown.extension.print.theme": "dark",
  "markdown.extension.toc.updateOnSave": false,

  "jsdoc-generator.includeTime": false,
  "jsdoc-generator.includeDate": false,
  "jsdoc-generator.includeTypes": false,
  "jsdoc-generator.includeAsync": true,
  "jsdoc-generator.includeExport": false
}`

export default VSCODE_SETTINGS
