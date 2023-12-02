import yargs, { Arguments } from 'yargs'
import { colorify, logger } from '../../../../lib/logger'
import { writeFile, rewriteFile, getFile } from '../../../../lib/file'

import builder from './builder'
import getParams from './getParams'
import validateParams from './validateParams'
import {
  buildControllerHandler,
  buildModelHandler
} from './editors/routeHandlers'
import modelEditor from './editors/modelEditor'
import controllerEditor from './editors/controllerEditor'
import routerEditor from './editors/routerEditor'
import routesEditor from './editors/routesEditor'
import apiRouterEditor from './editors/apiRouterEditor'

const COMMAND = 'rsrc-add-route'

yargs.command(
  COMMAND,
  colorify.trace('Add Backend Route in Existing Resource'),
  builder,
  handler
)

async function handler(argv: Arguments) {
  logger.initiate(`[${COMMAND}] Initiating...`)

  const params = getParams(argv)
  const { rsrcName, partialName, routeName, routeMethod, routePath } = params

  const validParams = validateParams(params)
  const { modelPath, controllerPath, routerPath, apiRouterPath } = validParams

  const currentModel = getFile(modelPath)
  if (currentModel.includes(`function ${routeName}`)) {
    logger.fatal(`[Error] Route '${routeName}' already exists!`)
    process.exit()
  }

  // Model Handling
  rewriteFile('Model Export', modelPath, modelEditor(params))

  // Controller Handling
  rewriteFile('Controller Export', controllerPath, controllerEditor(params))

  // Router Handling
  const routeEditor = partialName ? routesEditor : routerEditor
  rewriteFile(
    'Partial Routes',
    routerPath,
    routeEditor(rsrcName, partialName, routeName, routeMethod, routePath)
  )

  // API Router Handling
  rewriteFile('API Router', apiRouterPath, apiRouterEditor(routeName))

  logger.complete(`[${COMMAND}] Completed!`)
}
