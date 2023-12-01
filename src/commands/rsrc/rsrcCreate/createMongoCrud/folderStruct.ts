import yargs, { Arguments } from 'yargs'
import { colorify, logger } from '../../../../lib/logger'
import CliCommand from '../../../../lib/CliCommand'
import { writeFile, rewriteFile } from '../../../../lib/file'

import createBuilder from '../helpers/createBuilder'
import getCreateParams from '../helpers/getCreateParams'
import routesIndexEditor from '../helpers/routesIndexEditor'

import MONGO_SCHEMA from '../../fileTemplates/schema/MONGO_SCHEMA'
import MONGO_ODM from '../../fileTemplates/model/MONGO_ODM'
import CRUD_MODEL_PARTIAL from '../../fileTemplates/model/CRUD_MODEL_PARTIAL'
import CRUD_MODEL_INDEX from '../../fileTemplates/model/CRUD_MODEL_INDEX'
import CRUD_CONTROLLER_PARTIAL from '../../fileTemplates/controller/CRUD_CONTROLLER_PARTIAL'
import CRUD_CONTROLLER_INDEX from '../../fileTemplates/controller/CRUD_CONTROLLER_INDEX'
import CRUD_ROUTER_PARTIAL from '../../fileTemplates/router/CRUD_ROUTER_PARTIAL'
import CRUD_ROUTER_INDEX from '../../fileTemplates/router/CRUD_ROUTER_INDEX'
import ODM_INDEX from '../../fileTemplates/index/ODM_INDEX'
import CRUD_API_ROUTER from '../../fileTemplates/apiRouter/CRUD_API_ROUTER'

const COMMAND = 'rsrc-create-mongo-crud-folder-struct'

yargs.command(
  COMMAND,
  colorify.trace('Create Backend Resource with MongoOdm CRUD in Folders'),
  createBuilder,
  handler
)

async function handler(argv: Arguments) {
  logger.initiate(`[${COMMAND}] Initiating...`)

  const createParams = getCreateParams(argv)
  const { rsrcName, routerMountPath, rsrcPath, routesFolderPath } = createParams
  const schemaPath = `../${rsrcName}.Schema/index.mjs`
  const modelPath = `../${rsrcName}.Model/index.mjs`
  const controllerPath = `../${rsrcName}.Controller/index.mjs`
  const routerPath = `../${rsrcName}.Router/index.mjs`

  // Create Resource Folder
  new CliCommand('Create Resource Folder', `mkdir ${rsrcPath}`).exec(false)

  // Create Schema
  new CliCommand(
    'Create Schema Folder',
    `mkdir ${rsrcPath}/${rsrcName}.Schema`
  ).exec(false)
  const schema = MONGO_SCHEMA.replaceAll('{rsrcName}', rsrcName)
  const schemaFileLoc = `${rsrcPath}/${rsrcName}.Schema/index.mjs`
  writeFile('Schema Index', schema, schemaFileLoc)

  // Create Model
  new CliCommand(
    'Create Model Folder',
    `mkdir ${rsrcPath}/${rsrcName}.Model`
  ).exec(false)
  const odm = MONGO_ODM.replaceAll('{rsrcName}', rsrcName)
  const odmFileLoc = `${rsrcPath}/${rsrcName}.Model/${rsrcName}.Odm.mjs`
  writeFile('Odm', odm, odmFileLoc)
  const crudModel = CRUD_MODEL_PARTIAL.replaceAll('{rsrcName}', rsrcName)
  const crudModelFileLoc = `${rsrcPath}/${rsrcName}.Model/Crud.Model.mjs`
  writeFile('CRUD Model', crudModel, crudModelFileLoc)
  const model = CRUD_MODEL_INDEX.replaceAll('{rsrcName}', rsrcName)
  const modelFileLoc = `${rsrcPath}/${rsrcName}.Model/index.mjs`
  writeFile('Model Index', model, modelFileLoc)

  // Create Controller
  new CliCommand(
    'Create Controller Folder',
    `mkdir ${rsrcPath}/${rsrcName}.Controller`
  ).exec(false)
  const crudController = CRUD_CONTROLLER_PARTIAL.replaceAll(
    '{rsrcName}',
    rsrcName
  )
  const crudControllerFileLoc = `${rsrcPath}/${rsrcName}.Controller/Crud.Controller.mjs`
  writeFile('CRUD Controller', crudController, crudControllerFileLoc)
  const controller = CRUD_CONTROLLER_INDEX.replaceAll('{rsrcName}', rsrcName)
  const controllerFileLoc = `${rsrcPath}/${rsrcName}.Controller/index.mjs`
  writeFile('Controller Index', controller, controllerFileLoc)

  // Create Router
  new CliCommand(
    'Create Router Folder',
    `mkdir ${rsrcPath}/${rsrcName}.Router`
  ).exec(false)
  const routerCrud = CRUD_ROUTER_PARTIAL.replaceAll('{rsrcName}', rsrcName)
  const routerCrudFileLoc = `${rsrcPath}/${rsrcName}.Router/Crud.Routes.mjs`
  writeFile('Router CRUD', routerCrud, routerCrudFileLoc)
  const router = CRUD_ROUTER_INDEX.replaceAll('{rsrcName}', rsrcName)
  const routerFileLoc = `${rsrcPath}/${rsrcName}.Router/index.mjs`
  writeFile('Router Index', router, routerFileLoc)

  // Create Index
  const index = ODM_INDEX.replaceAll('{rsrcName}', rsrcName)
    .replaceAll('{schemaPath}', schemaPath.substring(1))
    .replaceAll('{modelPath}', modelPath.substring(1))
    .replaceAll('{controllerPath}', controllerPath.substring(1))
    .replaceAll('{routerPath}', routerPath.substring(1))
  const indexFileLoc = `${rsrcPath}/index.mjs`
  writeFile('Index', index, indexFileLoc)

  // Create API Router
  const apiRouter = CRUD_API_ROUTER.replaceAll('{rsrcName}', rsrcName)
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
