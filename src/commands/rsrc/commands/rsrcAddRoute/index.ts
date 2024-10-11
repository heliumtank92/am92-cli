import yargs, { Arguments } from 'yargs'

import { getFile, rewriteFile } from '../../../../lib/file'
import { colorify, logger } from '../../../../lib/logger'

import builder from './builder'
import apiRouterEditor from './editors/apiRouterEditor'
import controllerEditor from './editors/controllerEditor'
import modelEditor from './editors/modelEditor'
import routerEditor from './editors/routerEditor'
import routesEditor from './editors/routesEditor'
import getParams from './getParams'
import validateParams from './validateParams'

const COMMAND = 'rsrc-add-route'

yargs.command(
  COMMAND,
  colorify.trace('Add Backend Route in Existing Resource'),
  builder,
  handler
)

async function handler(argv: Arguments) {
  logger.initiate(`[${COMMAND}] Initiating...`)

  const params = await getParams(argv)
  const { rsrcName, partialName, routeName, routeMethod, routePath } = params

  const validParams = validateParams(params)
  const { modelPath, controllerPath, routerPath, apiRouterPath } = validParams

  const currentModel = getFile(modelPath)
  const hasRouteRegexStr = `function ${routeName}( | \\()`
  const hasRouteRegex = new RegExp(hasRouteRegexStr, 'gm')
  if (currentModel.match(hasRouteRegex)) {
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
