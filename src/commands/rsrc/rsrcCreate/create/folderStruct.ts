import yargs, { Arguments } from 'yargs'
import { colorify, logger } from '../../../../lib/logger'
import CliCommand from '../../../../lib/CliCommand'

import createBuilder from '../helpers/createBuilder'
import getCreateParams from '../helpers/getCreateParams'
import rewriteFile from '../../../../lib/rewriteFile'
import routesIndexEditor from '../helpers/routesIndexEditor'

import MODEL_INDEX from '../../fileTemplates/model/MODEL_INDEX'
import CONTROLLER_INDEX from '../../fileTemplates/controller/CONTROLLER_INDEX'
import ROUTER_INDEX from '../../fileTemplates/router/ROUTER_INDEX'
import INDEX from '../../fileTemplates/index/INDEX'
import API_ROUTER from '../../fileTemplates/apiRouter/API_ROUTER'

const COMMAND = 'rsrc-create-folder-struct'

yargs.command(
  COMMAND,
  colorify.trace('Create Backend Resource in Folders'),
  createBuilder,
  handler
)

async function handler(argv: Arguments) {
  logger.initiate(`[${COMMAND}] Initiating...`)

  const createParams = getCreateParams(argv)
  const { rsrcName, routerMountPath, rsrcPath, routesFolderPath } = createParams
  const modelPath = `./${rsrcName}.Model/index.mjs`
  const controllerPath = `./${rsrcName}.Controller/index.mjs`
  const routerPath = `./${rsrcName}.Router/index.mjs`

  // Create Resource Folder
  new CliCommand('Create Resource Folder', `mkdir ${rsrcPath}`).exec(false)

  // Create Model
  new CliCommand(
    'Create Model Folder',
    `mkdir ${rsrcPath}/${rsrcName}.Model`
  ).exec(false)
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
  const index = INDEX.replaceAll('{rsrcName}', rsrcName)
    .replaceAll('{modelPath}', modelPath)
    .replaceAll('{controllerPath}', controllerPath)
    .replaceAll('{routerPath}', routerPath)
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
