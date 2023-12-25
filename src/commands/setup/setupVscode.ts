import fs from 'fs'
import yargs, { Arguments } from 'yargs'

import { colorify, logger } from '../../lib/logger'
import { writeFile } from '../../lib/file'
import CliCommand from '../../lib/CliCommand'

import VSCODE_SETTINGS from './fileTemplates/VSCODE_SETTINGS'
import VSCODE_EXTENSIONS from './fileTemplates/VSCODE_EXTENSIONS'

const COMMAND = 'setup-vscode'

yargs.command(
  COMMAND,
  colorify.trace('Setup VSCode Settings'),
  yargs => yargs,
  handler
)

async function handler(argv: Arguments) {
  logger.initiate(`[${COMMAND}] Initiating...`)

  const projectRoot = '.'
  const vscodeFolderPath = `${projectRoot}/.vscode`
  const vscodeSettingsPath = `${projectRoot}/.vscode/settings.json`
  const vscodeExtensionsPath = `${projectRoot}/.vscode/extensions.json`

  if (!fs.existsSync(vscodeFolderPath)) {
    new CliCommand('Create Folder', `mkdir ${vscodeFolderPath}`).exec(false)
  }

  writeFile('VSCode Settings', VSCODE_SETTINGS, vscodeSettingsPath)
  writeFile('VSCode Extensions', VSCODE_EXTENSIONS, vscodeExtensionsPath)

  logger.complete(`[${COMMAND}] Completed!`)
}
