import fs from 'fs'

import { getFile } from '../../../../lib/file'
import { logger } from '../../../../lib/logger'

import { AddEsIndicesParams, ValidParams } from './TYPES'

export default function validateParams(
  params: AddEsIndicesParams
): ValidParams {
  const { rsrcName, rsrcPath, folderStruct, routesFolderPath } = params
  let modelFolderPath = ''
  let controllerFolderPath = ''
  let routerFolderPath = ''
  let modelIndexPath = ''
  let controllerIndexPath = ''
  let routerIndexPath = ''
  let modelPath = ''
  let controllerPath = ''
  let routerPath = ''

  const apiRouterPath = `${routesFolderPath}/${rsrcName}.mjs`

  if (folderStruct) {
    modelFolderPath = `${rsrcPath}/${rsrcName}.Model`
    controllerFolderPath = `${rsrcPath}/${rsrcName}.Controller`
    routerFolderPath = `${rsrcPath}/${rsrcName}.Router`

    modelIndexPath = `${rsrcPath}/${rsrcName}.Model/index.mjs`
    controllerIndexPath = `${rsrcPath}/${rsrcName}.Controller/index.mjs`
    routerIndexPath = `${rsrcPath}/${rsrcName}.Router/index.mjs`

    modelPath = `${rsrcPath}/${rsrcName}.Model/Indices.Model.mjs`
    controllerPath = `${rsrcPath}/${rsrcName}.Controller/Indices.Controller.mjs`
    routerPath = `${rsrcPath}/${rsrcName}.Router/Indices.Routes.mjs`

    if (
      !fs.existsSync(modelFolderPath) ||
      !fs.existsSync(controllerFolderPath) ||
      !fs.existsSync(routerFolderPath)
    ) {
      logger.fatal(`[Error] Resource must be in Folder Structure!`)
      process.exit()
    }

    if (
      fs.existsSync(modelPath) ||
      fs.existsSync(controllerPath) ||
      fs.existsSync(routerPath)
    ) {
      logger.fatal(`[Error] Resource Partial Indices already exists!`)
      process.exit()
    }

    if (!fs.existsSync(apiRouterPath)) {
      logger.fatal(`[Error] Resource API Router does not exist!`)
      process.exit()
    }
  } else {
    modelPath = `${rsrcPath}/${rsrcName}.Model.mjs`
    controllerPath = `${rsrcPath}/${rsrcName}.Controller.mjs`
    routerPath = `${rsrcPath}/${rsrcName}.Router.mjs`

    if (
      !fs.existsSync(modelPath) ||
      !fs.existsSync(controllerPath) ||
      !fs.existsSync(routerPath)
    ) {
      logger.fatal(`[Error] Resource files does not exist!`)
      process.exit()
    }

    const currentController = getFile(controllerPath)
    const hasRouteRegexStr = `function createIndices( | \\()`
    const hasRouteRegex = new RegExp(hasRouteRegexStr, 'gm')
    if (currentController.match(hasRouteRegex)) {
      logger.fatal(`[Error] Resource Indices already exists already exists!`)
      process.exit()
    }

    if (!fs.existsSync(apiRouterPath)) {
      logger.fatal(`[Error] Resource API Router does not exist!`)
      process.exit()
    }
  }

  const validParams: ValidParams = {
    modelFolderPath,
    controllerFolderPath,
    routerFolderPath,
    modelIndexPath,
    controllerIndexPath,
    routerIndexPath,
    modelPath,
    controllerPath,
    routerPath,
    apiRouterPath
  }

  return validParams
}
