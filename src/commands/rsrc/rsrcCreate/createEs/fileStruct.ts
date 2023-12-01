import yargs, { Arguments } from 'yargs'
import { colorify, logger } from '../../../../lib/logger'
import CliCommand from '../../../../lib/CliCommand'
import { writeFile, rewriteFile } from '../../../../lib/file'
import { kebabCase } from '../../../../lib/changeCase'

import createBuilder from '../helpers/createBuilder'
import getCreateParams from '../helpers/getCreateParams'
import routesIndexEditor from '../helpers/routesIndexEditor'

import ES_CONSTANTS from '../../fileTemplates/constants/ES_CONSTANTS'
import ES_SCHEMA from '../../fileTemplates/schema/ES_SCHEMA'
import ES_MODEL from '../../fileTemplates/model/ES_MODEL'
import CONTROLLER from '../../fileTemplates/controller/CONTROLLER'
import ROUTER from '../../fileTemplates/router/ROUTER'
import ODM_INDEX from '../../fileTemplates/index/ODM_INDEX'
import API_ROUTER from '../../fileTemplates/apiRouter/API_ROUTER'

const COMMAND = 'rsrc-create-es-file-struct'

yargs.command(
  COMMAND,
  colorify.trace('Create Backend Resource with OpensearchOdm in Files'),
  createBuilder,
  handler
)

async function handler(argv: Arguments) {
  logger.initiate(`[${COMMAND}] Initiating...`)

  const createParams = getCreateParams(argv)
  const { rsrcName, routerMountPath, rsrcPath, routesFolderPath } = createParams
  const constantsPath = `./${rsrcName}.Constants.mjs`
  const schemaPath = `./${rsrcName}.Schema.mjs`
  const modelPath = `./${rsrcName}.Model.mjs`
  const controllerPath = `./${rsrcName}.Controller.mjs`
  const routerPath = `./${rsrcName}.Router.mjs`

  // Create Resource Folder
  new CliCommand('Create Resource Folder', `mkdir ${rsrcPath}`).exec(false)

  // Create Constants
  const consts = ES_CONSTANTS.replaceAll('{rsrcName}', rsrcName).replaceAll(
    '{kebabCase(rsrcName)}',
    kebabCase(rsrcName)
  )
  const constsFileLoc = `${rsrcPath}/${rsrcName}.Constants.mjs`
  writeFile('Constants', consts, constsFileLoc)

  // Create Schema
  const schema = ES_SCHEMA.replaceAll('{rsrcName}', rsrcName).replaceAll(
    '{constantsPath}',
    constantsPath
  )
  const schemaFileLoc = `${rsrcPath}/${rsrcName}.Schema.mjs`
  writeFile('Schema', schema, schemaFileLoc)

  // Create Model
  const model = ES_MODEL.replaceAll('{rsrcName}', rsrcName)
  const modelFileLoc = `${rsrcPath}/${rsrcName}.Model.mjs`
  writeFile('Model', model, modelFileLoc)

  // Create Controller
  const controller = CONTROLLER.replaceAll('{rsrcPrefix}', rsrcName).replaceAll(
    '{modelPath}',
    modelPath
  )
  const controllerFileLoc = `${rsrcPath}/${rsrcName}.Controller.mjs`
  writeFile('Controller', controller, controllerFileLoc)

  // Create Router
  const router = ROUTER.replaceAll('{rsrcName}', rsrcName)
  const routerFileLoc = `${rsrcPath}/${rsrcName}.Router.mjs`
  writeFile('Router', router, routerFileLoc)

  // Create Index
  const index = ODM_INDEX.replaceAll('{rsrcName}', rsrcName)
    .replaceAll('{schemaPath}', schemaPath)
    .replaceAll('{modelPath}', modelPath)
    .replaceAll('{controllerPath}', controllerPath)
    .replaceAll('{routerPath}', routerPath)
  const indexFileLoc = `${rsrcPath}/index.mjs`
  writeFile('Index', index, indexFileLoc)

  // Create API Router
  const apiRouter = API_ROUTER.replaceAll('{rsrcName}', rsrcName)
  const apiRouterFileLoc = `${routesFolderPath}/${rsrcName}.mjs`
  writeFile('API Router', apiRouter, apiRouterFileLoc)

  // Rewrite Routes Index
  const routesIndexFileLoc = `${routesFolderPath}/index.mjs`
  rewriteFile(
    'Routes Index',
    routesIndexFileLoc,
    routesIndexEditor(rsrcName, routerMountPath)
  )

  logger.complete(`[${COMMAND}] Completed!`)
}
