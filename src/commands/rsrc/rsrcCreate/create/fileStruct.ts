import yargs, { Arguments } from 'yargs'
import { colorify, logger } from '../../../../lib/logger'
import CliCommand from '../../../../lib/CliCommand'

import createBuilder from '../helpers/createBuilder'
import getCreateParams from '../helpers/getCreateParams'
import rewriteFile from '../../../../lib/rewriteFile'
import routesIndexEditor from '../helpers/routesIndexEditor'

import MODEL_INDEX from '../helpers/fileTemplates/model/MODEL_INDEX'
import CONTROLLER from '../helpers/fileTemplates/controller/CONTROLLER'
import ROUTER from '../helpers/fileTemplates/router/ROUTER'
import INDEX from '../helpers/fileTemplates/index/INDEX'
import API_ROUTER from '../helpers/fileTemplates/apiRouter/API_ROUTER'

const COMMAND = 'rsrc-create-file-struct'

yargs.command(
  COMMAND,
  colorify.trace('Create Backend Resource in Files'),
  createBuilder,
  handler
)

async function handler(argv: Arguments) {
  logger.initiate(`[${COMMAND}] Initiating...`)

  const createParams = getCreateParams(argv)
  const { rsrcName, routerMountPath, rsrcPath, routesFolderPath } = createParams
  const modelPath = `./${rsrcName}.Model.mjs`
  const controllerPath = `./${rsrcName}.Controller.mjs`
  const routerPath = `./${rsrcName}.Router.mjs`

  // Create Resource Folder
  new CliCommand('Create Resource Folder', `mkdir ${rsrcPath}`).exec(false)

  // Create Model
  const model = MODEL_INDEX.replaceAll('{rsrcPrefix}', rsrcName)
  const modelFileLoc = `${rsrcPath}/${rsrcName}.Model.mjs`
  new CliCommand('Create Model', 'echo')
    .append(`"${model}"`)
    .append(`> ${modelFileLoc}`)
    .exec(false)

  // Create Controller
  const controller = CONTROLLER.replaceAll('{rsrcPrefix}', rsrcName).replaceAll(
    '{modelPath}',
    modelPath
  )
  const controllerFileLoc = `${rsrcPath}/${rsrcName}.Controller.mjs`
  new CliCommand('Create Controller', 'echo')
    .append(`"${controller}"`)
    .append(`> ${controllerFileLoc}`)
    .exec(false)

  // Create Router
  const router = ROUTER.replaceAll('{rsrcName}', rsrcName)
  const routerFileLoc = `${rsrcPath}/${rsrcName}.Router.mjs`
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
