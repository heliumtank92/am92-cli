import yargs, { Arguments } from 'yargs'

import CliCommand from '../../../../lib/CliCommand'
import { colorify, logger } from '../../../../lib/logger'
import rewriteFile from '../../../../lib/rewriteFile'
import createBuilder from '../../helpers/createBuilder'
import getCreateParams from '../../helpers/getCreateParams'
import routesIndexEditor from '../../helpers/routesIndexEditor'

import MODEL_FILE from './files/MODEL_FILE'
import CONTROLLER_FILE from './files/CONTROLLER_FILE'
import ROUTER_FILE from './files/ROUTER_FILE'
import INDEX_FILE from './files/INDEX_FILE'
import API_ROUTER_FILE from '../files/API_ROUTER_FILE'

const COMMAND = 'rsrc-create-file-struct'

yargs.command(
  COMMAND,
  colorify.trace('Create Empty Backend Resource in Files'),
  createBuilder,
  handler
)

async function handler(argv: Arguments) {
  logger.initiate(`[${COMMAND}] Initiating...`)

  const createParams = getCreateParams(argv)
  const { rsrcName, routerMountPath, rsrcPath, routesFolderPath } = createParams

  // Create Resource Folder
  new CliCommand('Create Resource Folder', `mkdir ${rsrcPath}`).exec(false)

  // Create Resource Model
  const model = MODEL_FILE.replaceAll('{rsrcName}', rsrcName)
  const modelPath = `${rsrcPath}/${rsrcName}.Model.mjs`
  new CliCommand('Create Resource Model', 'echo')
    .append(`"${model}"`)
    .append(`> ${modelPath}`)
    .exec(false)

  // Create Resource Controller
  const controller = CONTROLLER_FILE.replaceAll('{rsrcName}', rsrcName)
  const controllerPath = `${rsrcPath}/${rsrcName}.Controller.mjs`
  new CliCommand('Create Resource Controller', 'echo')
    .append(`"${controller}"`)
    .append(`> ${controllerPath}`)
    .exec(false)

  // Create Resource Router
  const router = ROUTER_FILE.replaceAll('{rsrcName}', rsrcName)
  const routerPath = `${rsrcPath}/${rsrcName}.Router.mjs`
  new CliCommand('Create Resource Router', 'echo')
    .append(`"${router}"`)
    .append(`> ${routerPath}`)
    .exec(false)

  // Create Resource Index
  const index = INDEX_FILE.replaceAll('{rsrcName}', rsrcName)
  const rsrcIndexPath = `${rsrcPath}/index.mjs`
  new CliCommand('Create Resource Index', 'echo')
    .append(`"${index}"`)
    .append(`> ${rsrcIndexPath}`)
    .exec(false)

  // Create API Router
  const apiRouter = API_ROUTER_FILE.replaceAll('{rsrcName}', rsrcName)
  const apiRouterPath = `${routesFolderPath}/${rsrcName}.mjs`
  new CliCommand('Create API Router', 'echo')
    .append(`"${apiRouter}"`)
    .append(`> ${apiRouterPath}`)
    .exec(false)

  // Rewrite Routes Index
  const routesIndexPath = `${routesFolderPath}/index.mjs`
  rewriteFile(
    'Routes Index',
    routesIndexPath,
    routesIndexEditor(rsrcName, routerMountPath)
  )

  logger.complete(`[${COMMAND}] Completed!`)
}
