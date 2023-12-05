import fs from 'fs'
import yargs, { Arguments } from 'yargs'
import { colorify, logger } from '../../../../lib/logger'
import { writeFile, rewriteFile } from '../../../../lib/file'

import builder from './builder'
import getParams from './getParams'
import modelIndexEditor from './editors/modelIndexEditor'
import controllerIndexEditor from './editors/controllerIndexEditor'
import routerIndexEditor from './editors/routerIndexEditor'

import MODEL_INDEX from '../../fileTemplates/model/MODEL_INDEX'
import ODM_MODEL_INDEX from '../../fileTemplates/model/ODM_MODEL_INDEX'
import CONTROLLER from '../../fileTemplates/controller/CONTROLLER'
import ROUTES from '../../fileTemplates/router/ROUTES'

const COMMAND = 'rsrc-add-partial'

yargs.command(
  COMMAND,
  colorify.trace('Add Backend Partial in Existing Resource'),
  builder,
  handler
)

async function handler(argv: Arguments) {
  logger.initiate(`[${COMMAND}] Initiating...`)

  const params = getParams(argv)
  const { rsrcName, rsrcPath, partialName } = params
  const modelPath = `${rsrcPath}/${rsrcName}.Model`
  const modelIndexPath = `${rsrcPath}/${rsrcName}.Model/index.mjs`
  const _modelPath = `${rsrcPath}/${rsrcName}.Model/${partialName}.Model.mjs`
  const controllerPath = `${rsrcPath}/${rsrcName}.Controller`
  const controllerIndexPath = `${rsrcPath}/${rsrcName}.Controller/index.mjs`
  const _controllerPath = `${rsrcPath}/${rsrcName}.Controller/${partialName}.Controller.mjs`
  const routerPath = `${rsrcPath}/${rsrcName}.Router`
  const routerIndexPath = `${rsrcPath}/${rsrcName}.Router/index.mjs`
  const _routesPath = `${rsrcPath}/${rsrcName}.Router/${partialName}.Routes.mjs`

  if (
    !fs.existsSync(modelPath) ||
    !fs.existsSync(controllerPath) ||
    !fs.existsSync(routerPath)
  ) {
    logger.fatal(`[Error] Resource must be of Folder Structure!`)
    process.exit()
  }

  if (
    fs.existsSync(_modelPath) ||
    fs.existsSync(_controllerPath) ||
    fs.existsSync(_routesPath)
  ) {
    logger.fatal(`[Error] Resource Partial already exists!`)
    process.exit()
  }

  const hasOdm = fs.existsSync(`${modelPath}/${rsrcName}.Odm.mjs`)

  // Add Resource Partial Model
  const model = hasOdm
    ? ODM_MODEL_INDEX.replaceAll('{rsrcName}', rsrcName).replaceAll(
        '{partialName}',
        partialName
      )
    : MODEL_INDEX.replaceAll('{rsrcName}', `${partialName}`)
  writeFile('Resource Partial Model', model, _modelPath)
  rewriteFile(
    'Resource Model Index',
    modelIndexPath,
    modelIndexEditor(rsrcName, partialName)
  )

  // Add Resource Partial Controller
  const controller = CONTROLLER.replaceAll(
    '{rsrcPrefix}',
    `${partialName}`
  ).replaceAll('{modelPath}', `../${rsrcName}.Model/${partialName}.Model.mjs`)
  writeFile('Resource Partial Controller', controller, _controllerPath)
  rewriteFile(
    'Resource Controller Index',
    controllerIndexPath,
    controllerIndexEditor(rsrcName, partialName)
  )

  // Add Resource Partial Routes
  const routes = ROUTES.replaceAll('{rsrcName}', rsrcName).replaceAll(
    '{partialName}',
    partialName
  )
  writeFile('Resource Partial Routes', routes, _routesPath)
  rewriteFile(
    'Resource Routes Index',
    routerIndexPath,
    routerIndexEditor(rsrcName, partialName)
  )

  logger.complete(`[${COMMAND}] Completed!`)
}
