import yargs, { Arguments } from 'yargs'
import CliCommand from '../../../../lib/CliCommand'
import { kebabCase } from '../../../../lib/changeCase'
import { colorify, logger } from '../../../../lib/logger'
import rewriteFile from '../../../../lib/rewriteFile'
import createBuilder from '../../helpers/createBuilder'
import getCreateParams from '../../helpers/getCreateParams'

import CONSTANTS_FILE from '../files/CONSTANTS_FILE'
import SCHEMA_FILE from '../files/SCHEMA_FILE'
import MODEL_FILE from './files/MODEL_FILE'
import routesIndexEditor from '../../helpers/routesIndexEditor'
import createController from '../../helpers/fileStruct/crudFileCreators/createController'
import createRouter from '../../helpers/fileStruct/crudFileCreators/createRouter'
import createIndex from '../../helpers/fileStruct/crudFileCreators/createIndex'
import createApiRouter from '../../helpers/fileStruct/crudFileCreators/createApiRouter'

const COMMAND = 'rsrc-create-file-struct-es-crud'

yargs.command(
  COMMAND,
  colorify.trace('Create Backend CRUD Resource with OpensearchOdm in Files'),
  createBuilder,
  handler
)

async function handler(argv: Arguments) {
  logger.initiate(`[${COMMAND}] Initiating...`)

  const createParams = getCreateParams(argv)
  const { rsrcName, routerMountPath, rsrcPath, routesFolderPath } = createParams

  // Create Resource Folder
  new CliCommand('Create Resource Folder', `mkdir ${rsrcPath}`).exec(false)

  // Create Resource Constants
  const constants = CONSTANTS_FILE.replaceAll(
    '{rsrcName}',
    rsrcName
  ).replaceAll('{kebabCase(rsrcName)}', kebabCase(rsrcName))
  const constantsPath = `${rsrcPath}/${rsrcName}.Constants.mjs`
  new CliCommand('Create Resource Constants', 'echo')
    .append(`"${constants}"`)
    .append(`> ${constantsPath}`)
    .exec(false)

  // Create Resource Schema
  const schema = SCHEMA_FILE.replaceAll('{rsrcName}', rsrcName)
  const schemaPath = `${rsrcPath}/${rsrcName}.Schema.mjs`
  new CliCommand('Create Resource Schema', 'echo')
    .append(`"${schema}"`)
    .append(`> ${schemaPath}`)
    .exec(false)

  // Create Resource Model
  const model = MODEL_FILE.replaceAll('{rsrcName}', rsrcName)
  const modelPath = `${rsrcPath}/${rsrcName}.Model.mjs`
  new CliCommand('Create Resource Model', 'echo')
    .append(`"${model}"`)
    .append(`> ${modelPath}`)
    .exec(false)

  createController(rsrcName, rsrcPath)
  createRouter(rsrcName, rsrcPath)
  createIndex(rsrcName, rsrcPath)
  createApiRouter(rsrcName, routesFolderPath)

  // Rewrite Routes Index
  const routesIndexPath = `${routesFolderPath}/index.mjs`
  rewriteFile(
    'Routes Index',
    routesIndexPath,
    routesIndexEditor(rsrcName, routerMountPath)
  )

  logger.complete(`[${COMMAND}] Completed!`)
}
