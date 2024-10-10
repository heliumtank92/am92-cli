import ES_CONSTANTS from '../../fileTemplates/constants/ES_CONSTANTS'

import { kebabCase } from '../../../../lib/changeCase'
import CliCommand from '../../../../lib/CliCommand'
import { rewriteFile, writeFile } from '../../../../lib/file'
import routesIndexEditor from '../../rsrcCreate/helpers/routesIndexEditor'

import API_ROUTER from '../../fileTemplates/apiRouter/API_ROUTER'
import CONTROLLER_INDEX from '../../fileTemplates/controller/CONTROLLER_INDEX'
import ODM_INDEX from '../../fileTemplates/index/ODM_INDEX'
import ES_ODM from '../../fileTemplates/model/ES_ODM'
import MODEL_INDEX from '../../fileTemplates/model/MODEL_INDEX'
import ROUTER_INDEX from '../../fileTemplates/router/ROUTER_INDEX'
import ES_SCHEMA from '../../fileTemplates/schema/ES_SCHEMA'
import { CreateParams } from '../../rsrcCreate/TYPES'

export default async function folderStructHandler(createParams: CreateParams) {
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
  writeFile('Constants Index', consts, constsFileLoc)

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
  writeFile('Schema Index', schema, schemaFileLoc)

  // Create Model
  new CliCommand(
    'Create Model Folder',
    `mkdir ${rsrcPath}/${rsrcName}.Model`
  ).exec(false)
  const odm = ES_ODM.replaceAll('{rsrcName}', rsrcName)
  const odmFileLoc = `${rsrcPath}/${rsrcName}.Model/${rsrcName}.Odm.mjs`
  writeFile('Odm', odm, odmFileLoc)
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
  const index = ODM_INDEX.replaceAll('{rsrcName}', rsrcName)
    .replaceAll('{schemaPath}', schemaPath.substring(1))
    .replaceAll('{modelPath}', modelPath.substring(1))
    .replaceAll('{controllerPath}', controllerPath.substring(1))
    .replaceAll('{routerPath}', routerPath.substring(1))
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
