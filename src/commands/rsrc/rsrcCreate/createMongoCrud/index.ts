import yargs, { Arguments } from 'yargs'
import { colorify, logger } from '../../../../lib/logger'

import createBuilder from '../helpers/createBuilder'
import getCreateParams from '../helpers/getCreateParams'

import fileStructHandler from './fileStruct'
import folderStructHandler from './folderStruct'

const COMMAND = 'rsrc-create-mongo-crud'

yargs.command(
  COMMAND,
  colorify.trace('Create Backend Resource with MongoOdm CRUD'),
  createBuilder,
  handler
)

async function handler(argv: Arguments) {
  logger.initiate(`[${COMMAND}] Initiating...`)

  const createParams = getCreateParams(argv)
  const { folderStruct } = createParams

  if (folderStruct) {
    folderStructHandler(createParams)
  } else {
    fileStructHandler(createParams)
  }

  logger.complete(`[${COMMAND}] Completed!`)
}
