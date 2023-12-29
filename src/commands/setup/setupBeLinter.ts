import fs from 'fs'
import yargs, { Arguments } from 'yargs'

import { colorify, logger } from '../../lib/logger'
import { rewriteFile } from '../../lib/file'
import CliCommand from '../../lib/CliCommand'
import inputReader from '../../lib/inputReader'

const COMMAND = 'setup-be-linter'

const ESLINTRC_BASE_PATH = `${__dirname}/files/.eslintrc.base.json`
const ESLINTRC_PATH = `${__dirname}/files/.eslintrc.json`
const PRETTIERRC_PATH = `${__dirname}/files/.prettierrc.json`
const JSCONFIG_PATH = `${__dirname}/files/jsconfig.json`

yargs.command(
  COMMAND,
  colorify.trace('Setup ESLint, Prettier and Husky in Backend'),
  builder,
  handler
)

function builder(yargs: any): any {
  return yargs.option('package-manager', {
    description: 'Package Manager',
    type: 'string',
    choices: ['npm', 'pnpm'],
    required: false
  })
}

async function handler(argv: Arguments) {
  logger.initiate(`[${COMMAND}] Initiating...`)

  let packageManager = (argv.packageManager as string) || ''
  if (!packageManager) {
    const PACKAGE_MANAGER: string = 'npm'
    packageManager = inputReader('Package Manager', PACKAGE_MANAGER, true)
  }

  const packageJsonFilePath = `./package.json`
  if (!fs.existsSync(packageJsonFilePath)) {
    logger.fatal(`[Error] package.json does not exist at the location: ./`)
    process.exit()
  }

  _installDependencies(packageManager)
  _createLintFiles()
  rewriteFile('package.json', packageJsonFilePath, packageJsonEditor)
  _setupHusky()

  logger.complete(`[${COMMAND}] Completed!`)
}

function _installDependencies(packageManager: string) {
  const installCmd =
    packageManager === 'pnpm' ? 'pnpm add -D' : 'npm i --save-dev'

  new CliCommand('Install Dependencies', installCmd)
    .append('eslint')
    .append('eslint-config-prettier')
    .append('eslint-plugin-import')
    .append('eslint-plugin-jsonc')
    .append('eslint-plugin-n')
    .append('eslint-plugin-prettier')
    .append('eslint-plugin-simple-import-sort')
    .append('eslint-plugin-unused-imports')
    .append('husky')
    .append('prettier')
    .exec(false)
}

function _createLintFiles() {
  new CliCommand('Copy Files', 'cp -rf')
    .append(ESLINTRC_BASE_PATH)
    .append(ESLINTRC_PATH)
    .append(PRETTIERRC_PATH)
    .append(JSCONFIG_PATH)
    .append('.')
    .exec(false)
}

function packageJsonEditor(file: string): string {
  try {
    const packageJson = JSON.parse(file)
    packageJson.engines = packageJson.engines || {}
    packageJson.engines.node = '>=18.16.0'
    packageJson.scripts = packageJson.scripts || {}
    packageJson.scripts.lint =
      'eslint . || echo \'Run "npm run lint:fix" to automatically fix issues.\''
    packageJson.scripts['lint:fix'] = 'eslint --fix .'
    const newPackageJsonFile = JSON.stringify(packageJson, null, 2)
    return newPackageJsonFile
  } catch (error) {
    return file
  }
}

function _setupHusky() {
  new CliCommand('Install Husky', 'npx husky install').exec(false)
  new CliCommand(
    'Prepare Husky',
    'npx husky add .husky/pre-commit "npm run lint --silent"'
  ).exec(false)
}
