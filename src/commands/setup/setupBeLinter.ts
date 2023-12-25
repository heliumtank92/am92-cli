import fs from 'fs'
import yargs, { Arguments } from 'yargs'

import { colorify, logger } from '../../lib/logger'
import { rewriteFile, writeFile } from '../../lib/file'
import CliCommand from '../../lib/CliCommand'

import ESLINTIGNORE from './fileTemplates/ESLINTIGNORE'
import ESLINTRC from './fileTemplates/ESLINTRC'
import PRETTIERRC from './fileTemplates/PRETTIERRC'

const COMMAND = 'setup-be-linter'

yargs.command(
  COMMAND,
  colorify.trace('Setup ESLint, Prettier and Husky in Backend'),
  yargs => yargs,
  handler
)

async function handler(argv: Arguments) {
  logger.initiate(`[${COMMAND}] Initiating...`)

  const projectRoot = '.'
  const packageJsonFilePath = `${projectRoot}/package.json`

  if (!fs.existsSync(packageJsonFilePath)) {
    logger.fatal(
      `[Error] package.json does not exist at the location: ${projectRoot}/`
    )
    process.exit()
  }

  _installDependencies()
  _createLintFiles(projectRoot)
  rewriteFile('package.json', packageJsonFilePath, packageJsonEditor)
  _setupHusky(projectRoot)

  logger.complete(`[${COMMAND}] Completed!`)
}

function _installDependencies() {
  new CliCommand('Install Dependencies', 'npm i --save-dev')
    .append('eslint@^8.56.0')
    .append('eslint-config-airbnb@^19.0.4')
    .append('husky@^8.0.3')
    .append('prettier@^2.8.8')
    .exec(false)
}

function _createLintFiles(projectRoot: string) {
  const eslintignorePath = `${projectRoot}/.eslintignore`
  const eslintrcPath = `${projectRoot}/.eslintrc.json`
  const prettierrcPath = `${projectRoot}/.prettierrc.json`

  writeFile('.eslintignore', ESLINTIGNORE, eslintignorePath)
  writeFile('.eslintrc.json', ESLINTRC, eslintrcPath)
  writeFile('.prettierrc.json', PRETTIERRC, prettierrcPath)
}

function packageJsonEditor(file: string): string {
  try {
    const packageJson = JSON.parse(file)
    packageJson.scripts = packageJson.scripts || {}
    packageJson.scripts.lint = 'eslint . --ext .mjs --fix'
    const newPackageJsonFile = JSON.stringify(packageJson, null, 2)
    return newPackageJsonFile
  } catch (error) {
    return file
  }
}

function _setupHusky(projectRoot: string) {
  new CliCommand('Install Husky', 'npx husky install').exec(false)
  new CliCommand(
    'Prepare Husky',
    'npx husky add .husky/pre-commit "npm run lint"'
  ).exec(false)
}
