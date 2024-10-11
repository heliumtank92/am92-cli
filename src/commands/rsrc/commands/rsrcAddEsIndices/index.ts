import yargs, { Arguments } from 'yargs'

import { colorify, logger } from '../../../../lib/logger'

import builder from './builder'
import { fileStructHandler } from './fileStruct'
import { folderStructHandler } from './folderStruct'
import getParams from './getParams'
import validateParams from './validateParams'

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

  const params = await getParams(argv)
  const { folderStruct } = params

  const validParams = validateParams(params)

  if (folderStruct) {
    folderStructHandler(params, validParams)
  } else {
    fileStructHandler(params, validParams)
  }

  logger.complete(`[${COMMAND}] Completed!`)
}
