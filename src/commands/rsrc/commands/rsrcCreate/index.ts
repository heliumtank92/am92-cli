import yargs, { Arguments } from 'yargs'

import { colorify, logger } from '../../../../lib/logger'
import createBuilder from '../../rsrcCreate/helpers/createBuilder'
import getCreateParams from '../../rsrcCreate/helpers/getCreateParams'

import fileStructHandler from './fileStruct'
import folderStructHandler from './folderStruct'

const COMMAND = 'rsrc-create'

yargs.command(
  COMMAND,
  colorify.trace('Create Backend Resource'),
  createBuilder,
  handler
)

async function handler(argv: Arguments) {
  logger.initiate(`[${COMMAND}] Initiating...`)

  const createParams = await getCreateParams(argv)
  const { folderStruct } = createParams

  if (folderStruct) {
    folderStructHandler(createParams)
  } else {
    fileStructHandler(createParams)
  }

  logger.complete(`[${COMMAND}] Completed!`)
}
