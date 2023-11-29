import yargs, { Arguments } from 'yargs'
import { colorify, logger } from '../../../../lib/logger'
import CliCommand from '../../../../lib/CliCommand'

import createBuilder from '../helpers/createBuilder'
import getCreateParams from '../helpers/getCreateParams'
import rewriteFile from '../../../../lib/rewriteFile'
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
  new CliCommand('Create Schema Index', 'echo')
    .append(`"${schema}"`)
    .append(`> ${schemaFileLoc}`)
    .exec(false)

  // Create Model
  new CliCommand(
    'Create Model Folder',
    `mkdir ${rsrcPath}/${rsrcName}.Model`
  ).exec(false)
  const odm = MONGO_ODM.replaceAll('{rsrcName}', rsrcName)
  const odmFileLoc = `${rsrcPath}/${rsrcName}.Model/${rsrcName}.Odm.mjs`
  new CliCommand('Create Odm', 'echo')
    .append(`"${odm}"`)
    .append(`> ${odmFileLoc}`)
    .exec(false)
  const crudModel = CRUD_MODEL_PARTIAL.replaceAll('{rsrcName}', rsrcName)
  const crudModelFileLoc = `${rsrcPath}/${rsrcName}.Model/Crud.Model.mjs`
  new CliCommand('Create CRUD Model', 'echo')
    .append(`"${crudModel}"`)
    .append(`> ${crudModelFileLoc}`)
    .exec(false)
  const model = CRUD_MODEL_INDEX.replaceAll('{rsrcName}', rsrcName)
  const modelFileLoc = `${rsrcPath}/${rsrcName}.Model/index.mjs`
  new CliCommand('Create Model Index', 'echo')
    .append(`"${model}"`)
    .append(`> ${modelFileLoc}`)
    .exec(false)

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
  new CliCommand('Create CRUD Controller', 'echo')
    .append(`"${crudController}"`)
    .append(`> ${crudControllerFileLoc}`)
    .exec(false)
  const controller = CRUD_CONTROLLER_INDEX.replaceAll('{rsrcName}', rsrcName)
  const controllerFileLoc = `${rsrcPath}/${rsrcName}.Controller/index.mjs`
  new CliCommand('Create Controller Index', 'echo')
    .append(`"${controller}"`)
    .append(`> ${controllerFileLoc}`)
    .exec(false)

  // Create Router
  new CliCommand(
    'Create Router Folder',
    `mkdir ${rsrcPath}/${rsrcName}.Router`
  ).exec(false)
  const routerCrud = CRUD_ROUTER_PARTIAL.replaceAll('{rsrcName}', rsrcName)
  const routerCrudFileLoc = `${rsrcPath}/${rsrcName}.Router/Crud.Routes.mjs`
  new CliCommand('Create Router CRUD', 'echo')
    .append(`"${routerCrud}"`)
    .append(`> ${routerCrudFileLoc}`)
    .exec(false)
  const router = CRUD_ROUTER_INDEX.replaceAll('{rsrcName}', rsrcName)
  const routerFileLoc = `${rsrcPath}/${rsrcName}.Router/index.mjs`
  new CliCommand('Create Router Index', 'echo')
    .append(`"${router}"`)
    .append(`> ${routerFileLoc}`)
    .exec(false)

  // Create Index
  const index = ODM_INDEX.replaceAll('{rsrcName}', rsrcName)
    .replaceAll('{schemaPath}', schemaPath.substring(1))
    .replaceAll('{modelPath}', modelPath.substring(1))
    .replaceAll('{controllerPath}', controllerPath.substring(1))
    .replaceAll('{routerPath}', routerPath.substring(1))
  const indexFileLoc = `${rsrcPath}/index.mjs`
  new CliCommand('Create Index', 'echo')
    .append(`"${index}"`)
    .append(`> ${indexFileLoc}`)
    .exec(false)

  // Create API Router
  const apiRouter = CRUD_API_ROUTER.replaceAll('{rsrcName}', rsrcName)
  const apiRouterFileLoc = `${routesFolderPath}/${rsrcName}.mjs`
  new CliCommand('Create API Router', 'echo')
    .append(`"${apiRouter}"`)
    .append(`> ${apiRouterFileLoc}`)
    .exec(false)

  // Rewrite Routes Index
  const routesIndexFileLoc = `${routesFolderPath}/index.mjs`
  rewriteFile(
    'Routes Index',
    routesIndexFileLoc,
    routesIndexEditor(rsrcName, routerMountPath)
  )

  logger.complete(`[${COMMAND}] Completed!`)
}