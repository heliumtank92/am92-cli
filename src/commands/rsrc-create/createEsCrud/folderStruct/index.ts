import yargs, { Arguments } from 'yargs'
import CliCommand from '../../../../lib/CliCommand'
import { kebabCase } from '../../../../lib/changeCase'
import { colorify, logger } from '../../../../lib/logger'
import rewriteFile from '../../../../lib/rewriteFile'
import createBuilder from '../../helpers/createBuilder'
import getCreateParams from '../../helpers/getCreateParams'

import CONSTANTS_FILE from '../files/CONSTANTS_FILE'
import SCHEMA_FILE from '../files/SCHEMA_FILE'
import MODEL_ODM_FILE from './files/MODEL_ODM_FILE'
import routesIndexEditor from '../../helpers/routesIndexEditor'
import createModelFiles from '../../helpers/folderStruct/crudFileCreators/createModelFiles'
import createControllerFiles from '../../helpers/folderStruct/crudFileCreators/createControllerFiles'
import createRouterFiles from '../../helpers/folderStruct/crudFileCreators/createRouterFiles'
import createIndex from '../../helpers/folderStruct/crudFileCreators/createIndex'
import createApiRouter from '../../helpers/folderStruct/crudFileCreators/createApiRouter'

const COMMAND = 'rsrc-create-folder-struct-es-crud'

yargs.command(
  COMMAND,
  colorify.trace('Create Backend CRUD Resource with OpensearchOdm in Folders'),
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

  // Create Resource Model Folder
  new CliCommand(
    'Create Resource Model Folder',
    `mkdir ${rsrcPath}/${rsrcName}.Model`
  ).exec(false)

  // Create Resource Model Odm
  const modelOdm = MODEL_ODM_FILE.replaceAll('{rsrcName}', rsrcName)
  const modelOdmPath = `${rsrcPath}/${rsrcName}.Model/${rsrcName}Odm.mjs`
  new CliCommand('Create Resource Model Odm', 'echo')
    .append(`"${modelOdm}"`)
    .append(`> ${modelOdmPath}`)
    .exec(false)

  createModelFiles(rsrcName, rsrcPath)
  createControllerFiles(rsrcName, rsrcPath)
  createRouterFiles(rsrcName, rsrcPath)
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
