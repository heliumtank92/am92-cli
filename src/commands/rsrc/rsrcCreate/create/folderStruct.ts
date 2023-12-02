import CliCommand from '../../../../lib/CliCommand'
import { writeFile, rewriteFile } from '../../../../lib/file'

import { CreateParams } from '../TYPES'
import routesIndexEditor from '../helpers/routesIndexEditor'

import MODEL_INDEX from '../../fileTemplates/model/MODEL_INDEX'
import CONTROLLER_INDEX from '../../fileTemplates/controller/CONTROLLER_INDEX'
import ROUTER_INDEX from '../../fileTemplates/router/ROUTER_INDEX'
import INDEX from '../../fileTemplates/index/INDEX'
import API_ROUTER from '../../fileTemplates/apiRouter/API_ROUTER'

export default async function folderStructHandler(createParams: CreateParams) {
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
  writeFile('Model Index', model, modelFileLoc)

  // Create Controller
  new CliCommand(
    'Create Controller Folder',
    `mkdir ${rsrcPath}/${rsrcName}.Controller`
  ).exec(false)
  const controller = CONTROLLER_INDEX.replaceAll('{rsrcName}', rsrcName)
  const controllerFileLoc = `${rsrcPath}/${rsrcName}.Controller/index.mjs`
  writeFile('Controller Index', controller, controllerFileLoc)

  // Create Router
  new CliCommand(
    'Create Router Folder',
    `mkdir ${rsrcPath}/${rsrcName}.Router`
  ).exec(false)
  const router = ROUTER_INDEX.replaceAll('{rsrcName}', rsrcName)
  const routerFileLoc = `${rsrcPath}/${rsrcName}.Router/index.mjs`
  writeFile('Router', router, routerFileLoc)

  // Create Index
  const index = INDEX.replaceAll('{rsrcName}', rsrcName)
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
}
