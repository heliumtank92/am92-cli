import fs from 'fs'
import yargs, { Arguments } from 'yargs'

import { colorify, logger } from '../../lib/logger'
import CliCommand from '../../lib/CliCommand'

const COMMAND = 'setup-vscode'

const VSCODE_FOLDER_PATH = `${__dirname}/files/vscode`

yargs.command(
  COMMAND,
  colorify.trace('Setup VSCode Settings'),
  yargs => yargs,
  handler
)

async function handler(argv: Arguments) {
  logger.initiate(`[${COMMAND}] Initiating...`)

  if (!fs.existsSync('./.vscode')) {
    new CliCommand('Create Folder', `mkdir ./.vscode`).exec(false)
  }

  new CliCommand(
    'Copy VSCode Settings',
    `cp -rf ${VSCODE_FOLDER_PATH}/* ./.vscode`
  ).exec(false)

  logger.complete(`[${COMMAND}] Completed!`)
}
