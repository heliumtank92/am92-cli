import yargs, { Arguments } from 'yargs'
import { colorify, logger } from '../../../../lib/logger'
import CliCommand from '../../../../lib/CliCommand'

import createBuilder from '../helpers/createBuilder'
import getCreateParams from '../helpers/getCreateParams'
import rewriteFile from '../../../../lib/rewriteFile'
import routesIndexEditor from '../helpers/routesIndexEditor'
import { kebabCase } from '../../../../lib/changeCase'

import ES_CONSTANTS from '../../fileTemplates/constants/ES_CONSTANTS'
import ES_SCHEMA from '../../fileTemplates/schema/ES_SCHEMA'
import ES_ODM from '../../fileTemplates/model/ES_ODM'
import MODEL_INDEX from '../../fileTemplates/model/MODEL_INDEX'
import CONTROLLER_INDEX from '../../fileTemplates/controller/CONTROLLER_INDEX'
import ROUTER_INDEX from '../../fileTemplates/router/ROUTER_INDEX'
import ODM_INDEX from '../../fileTemplates/index/ODM_INDEX'
import API_ROUTER from '../../fileTemplates/apiRouter/API_ROUTER'

const COMMAND = 'rsrc-create-es-folder-struct'

yargs.command(
  COMMAND,
  colorify.trace('Create Backend Resource with OpensearchOdm in Folders'),
  createBuilder,
  handler
)

async function handler(argv: Arguments) {
  logger.initiate(`[${COMMAND}] Initiating...`)

  const createParams = getCreateParams(argv)
  const { rsrcName, routerMountPath, rsrcPath, routesFolderPath } = createParams
  const constantsPath = `../${rsrcName}.Constants/index.mjs`
  const schemaPath = `../${rsrcName}.Schema/index.mjs`
  const modelPath = `../${rsrcName}.Model/index.mjs`
  const controllerPath = `../${rsrcName}.Controller/index.mjs`
  const routerPath = `../${rsrcName}.Router/index.mjs`

  // Create Resource Folder
  new CliCommand('Create Resource Folder', `mkdir ${rsrcPath}`).exec(false)

  // Create Constants
  new CliCommand(
    'Create Constants Folder',
    `mkdir ${rsrcPath}/${rsrcName}.Constants`
  ).exec(false)
  const consts = ES_CONSTANTS.replaceAll('{rsrcName}', rsrcName).replaceAll(
    '{kebabCase(rsrcName)}',
    kebabCase(rsrcName)
  )
  const constsFileLoc = `${rsrcPath}/${rsrcName}.Constants/index.mjs`
  new CliCommand('Create Constants Index', 'echo')
    .append(`"${consts}"`)
    .append(`> ${constsFileLoc}`)
    .exec(false)

  // Create Schema
  new CliCommand(
    'Create Schema Folder',
    `mkdir ${rsrcPath}/${rsrcName}.Schema`
  ).exec(false)
  const schema = ES_SCHEMA.replaceAll('{rsrcName}', rsrcName).replaceAll(
    '{constantsPath}',
    constantsPath
  )
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
  const odm = ES_ODM.replaceAll('{rsrcName}', rsrcName)
  const odmFileLoc = `${rsrcPath}/${rsrcName}.Model/${rsrcName}.Odm.mjs`
  new CliCommand('Create Odm', 'echo')
    .append(`"${odm}"`)
    .append(`> ${odmFileLoc}`)
    .exec(false)
  const model = MODEL_INDEX.replaceAll('{rsrcName}', rsrcName)
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
  const controller = CONTROLLER_INDEX.replaceAll('{rsrcName}', rsrcName)
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
  const router = ROUTER_INDEX.replaceAll('{rsrcName}', rsrcName)
  const routerFileLoc = `${rsrcPath}/${rsrcName}.Router/index.mjs`
  new CliCommand('Create Router', 'echo')
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
  const apiRouter = API_ROUTER.replaceAll('{rsrcName}', rsrcName)
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
