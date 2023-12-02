import fs from 'fs'
import { logger } from '../../../../lib/logger'
import { AddRouteParams, ValidParams } from './TYPES'

export default function validateParams(params: AddRouteParams): ValidParams {
  const { rsrcName, rsrcPath, partialName, routesFolderPath } = params
  let modelPath = ''
  let controllerPath = ''
  let routerPath = ''

  const apiRouterPath = `${routesFolderPath}/${rsrcName}.mjs`

  if (partialName) {
    const modelFolderPath = `${rsrcPath}/${rsrcName}.Model`
    const controllerFolderPath = `${rsrcPath}/${rsrcName}.Controller`
    const routerFolderPath = `${rsrcPath}/${rsrcName}.Router`
    modelPath = `${rsrcPath}/${rsrcName}.Model/${partialName}.Model.mjs`
    controllerPath = `${rsrcPath}/${rsrcName}.Controller/${partialName}.Controller.mjs`
    routerPath = `${rsrcPath}/${rsrcName}.Router/${partialName}.Routes.mjs`

    if (
      !fs.existsSync(modelFolderPath) ||
      !fs.existsSync(controllerFolderPath) ||
      !fs.existsSync(routerFolderPath)
    ) {
      logger.fatal(`[Error] Resource must be of Folder Structure!`)
      process.exit()
    }

    if (
      !fs.existsSync(modelPath) ||
      !fs.existsSync(controllerPath) ||
      !fs.existsSync(routerPath)
    ) {
      logger.fatal(`[Error] Resource Partial does not exist!`)
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

    if (!fs.existsSync(apiRouterPath)) {
      logger.fatal(`[Error] Resource API Router does not exist!`)
      process.exit()
    }
  }

  const validParams: ValidParams = {
    modelPath,
    controllerPath,
    routerPath,
    apiRouterPath
  }

  return validParams
}
