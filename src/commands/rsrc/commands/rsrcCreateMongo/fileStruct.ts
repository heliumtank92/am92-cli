import CliCommand from '../../../../lib/CliCommand'
import { rewriteFile, writeFile } from '../../../../lib/file'
import routesIndexEditor from '../../rsrcCreate/helpers/routesIndexEditor'

import API_ROUTER from '../../fileTemplates/apiRouter/API_ROUTER'
import CONTROLLER from '../../fileTemplates/controller/CONTROLLER'
import ODM_INDEX from '../../fileTemplates/index/ODM_INDEX'
import MONGO_MODEL from '../../fileTemplates/model/MONGO_MODEL'
import ROUTER from '../../fileTemplates/router/ROUTER'
import MONGO_SCHEMA from '../../fileTemplates/schema/MONGO_SCHEMA'
import { CreateParams } from '../../rsrcCreate/TYPES'

export default async function fileStructHandler(createParams: CreateParams) {
  const { rsrcName, routerMountPath, rsrcPath, routesFolderPath } = createParams
  const schemaPath = `./${rsrcName}.Schema.mjs`
  const modelPath = `./${rsrcName}.Model.mjs`
  const controllerPath = `./${rsrcName}.Controller.mjs`
  const routerPath = `./${rsrcName}.Router.mjs`

  // Create Resource Folder
  new CliCommand('Create Resource Folder', `mkdir ${rsrcPath}`).exec(false)

  // Create Constants
  const constantsFileLoc = `${rsrcPath}/${rsrcName}.Constants.mjs`
  writeFile('Constants', '', constantsFileLoc)

  // Create Schema
  const schema = MONGO_SCHEMA.replaceAll('{rsrcName}', rsrcName)
  const schemaFileLoc = `${rsrcPath}/${rsrcName}.Schema.mjs`
  writeFile('Schema', schema, schemaFileLoc)

  // Create Model
  const model = MONGO_MODEL.replaceAll('{rsrcName}', rsrcName)
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
}
