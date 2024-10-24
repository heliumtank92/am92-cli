import fs from 'fs'
import path from 'path'
import yargs, { Arguments } from 'yargs'

import CliCommand from '../../../lib/CliCommand'
import { rewriteFile, writeFile } from '../../../lib/file'
import { colorify, logger } from '../../../lib/logger'
import packageManagerPrompt from '../../../lib/prompts/packageManagerPrompt'

const COMMAND = 'setup-be-linter'

const ESLINTRC_BASE_PATH = path.join(__dirname, '../files/.eslintrc.base.json')
const ESLINTRC_PATH = path.join(__dirname, '../files/.eslintrc.json')
const PRETTIERRC_PATH = path.join(__dirname, '../files/.prettierrc.json')
const JSCONFIG_PATH = path.join(__dirname, '../files/jsconfig.json')

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

  const packageManager = await packageManagerPrompt(
    argv.packageManager as string
  )

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
    .append('eslint@^8.56.0')
    .append('eslint-config-prettier@^9.1.0')
    .append('eslint-plugin-import@^2.29.1')
    .append('eslint-plugin-jsonc@^2.13.0')
    .append('eslint-plugin-n@^16.6.2')
    .append('eslint-plugin-prettier@^5.1.3')
    .append('eslint-plugin-simple-import-sort@^10.0.0')
    .append('eslint-plugin-unused-imports@^3.0.0')
    .append('husky@^9.0.7')
    .append('prettier@^3.2.4')
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
    packageJson.imports = packageJson.engines || {}
    packageJson.imports['#*'] = './*'
    packageJson.engines = packageJson.engines || {}
    packageJson.engines.node = '>=18.16.0'
    packageJson.scripts = packageJson.scripts || {}
    packageJson.scripts.lint = 'eslint .'
    packageJson.scripts['lint:fix'] = 'eslint --fix .'
    packageJson.scripts['prepare'] = 'npx husky'
    const newPackageJsonFile = JSON.stringify(packageJson, null, 2)
    return newPackageJsonFile
  } catch (error) {
    return file
  }
}

function _setupHusky() {
  new CliCommand('Initialize Husky', 'npx husky init').exec(false)
  writeFile(
    'Husky Pre-commit',
    'npm test --silent\nnpm run lint --silent',
    '.husky/pre-commit'
  )
}
