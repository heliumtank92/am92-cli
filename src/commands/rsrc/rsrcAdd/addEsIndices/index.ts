import yargs, { Arguments } from 'yargs'
import { colorify, logger } from '../../../../lib/logger'

import builder from './builder'
import getParams from './getParams'
import validateParams from './validateParams'
import { folderStructHandler } from './folderStruct'
import { fileStructHandler } from './fileStruct'

const COMMAND = 'rsrc-add-es-indices'

yargs.command(
  COMMAND,
  colorify.trace(
    'Add Backend OpensearchOdm Indices Routes in Existing Resource'
  ),
  builder,
  handler
)

async function handler(argv: Arguments) {
  logger.initiate(`[${COMMAND}] Initiating...`)

  const params = getParams(argv)
  const { folderStruct } = params

  const validParams = validateParams(params)

  if (folderStruct) {
    folderStructHandler(params, validParams)
  } else {
    fileStructHandler(params, validParams)
  }

  logger.complete(`[${COMMAND}] Completed!`)
}
