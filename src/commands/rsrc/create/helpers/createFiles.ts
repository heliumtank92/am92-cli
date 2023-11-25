import fs from 'fs'
import CliCommand from '../../../../lib/CliCommand'
import { logger } from '../../../../lib/logger'
import { CreateFilesParams } from '../TYPES'

export default function createFiles(attrs: CreateFilesParams): void {
  const {
    createParams,
    schemaGenerator,
    modelGenerator,
    controllerGenerator,
    routerGenerator,
    indexGenerator,
    apiRouterGenerator,
    routesIndexEntry
  } = attrs

  const { rsrcName, routerMountPath, rsrcPath, routesFolderPath } = createParams

  // Create Resource Folder
  new CliCommand('Create Resource Folder', `mkdir ${rsrcPath}`).exec(false)

  // Create Resource Schema
  if (schemaGenerator) {
    new CliCommand('Create Resource Schema', 'echo')
      .append(schemaGenerator(rsrcName))
      .append(`> ${rsrcPath}/${rsrcName}.Schema.mjs`)
      .exec(false)
  }

  // Create Resource Model
  if (modelGenerator) {
    new CliCommand('Create Resource Model', 'echo')
      .append(modelGenerator(rsrcName))
      .append(`> ${rsrcPath}/${rsrcName}.Model.mjs`)
      .exec(false)
  }

  // Create Resource Controller
  if (controllerGenerator) {
    new CliCommand('Create Resource Controller', 'echo')
      .append(controllerGenerator(rsrcName))
      .append(`> ${rsrcPath}/${rsrcName}.Controller.mjs`)
      .exec(false)
  }

  // Create Resource Router
  if (routerGenerator) {
    new CliCommand('Create Resource Router', 'echo')
      .append(routerGenerator(rsrcName))
      .append(`> ${rsrcPath}/${rsrcName}.Router.mjs`)
      .exec(false)
  }

  // Create Resource index
  if (indexGenerator) {
    new CliCommand('Create Resource index', 'echo')
      .append(indexGenerator(rsrcName))
      .append(`> ${rsrcPath}/index.mjs`)
      .exec(false)
  }

  // Create API Router
  if (apiRouterGenerator) {
    new CliCommand('Create API Router', 'echo')
      .append(apiRouterGenerator(rsrcName))
      .append(`> ${routesFolderPath}/${rsrcName}.mjs`)
      .exec(false)

    if (routesIndexEntry) {
      // Read Routes Index
      const routesIndexFile = _getRoutesIndexFile(routesFolderPath)
      const newRoutesIndexFile = _buildNewRoutesIndex(
        routesIndexFile,
        rsrcName,
        routerMountPath
      )

      // Rewrite Routes Index
      new CliCommand('Rewrite Routes Index', 'echo')
        .append(`"${newRoutesIndexFile}"`)
        .append(`> ${routesFolderPath}/index.mjs`)
        .exec(false)
    }
  }
}

function _getRoutesIndexFile(routesPath: string): string {
  try {
    const indexRoutesFile = fs
      .readFileSync(`${routesPath}/index.mjs`)
      .toString('utf8')

    if (!indexRoutesFile.length) {
      logger.warn(`[Warn] Router Entry in ${routesPath}/index.mjs failed!`)
      process.exit()
    }

    return indexRoutesFile
  } catch (error) {
    logger.warn(`[Warn] Router Entry in ${routesPath}/index.mjs failed!`)
    logger.fatal(`[Error] Failed to read file: ${routesPath}/index.mjs`)
    process.exit()
  }
}

function _buildNewRoutesIndex(
  routesIndexFile: string,
  rsrcName: string,
  routerMountPath: string
): string {
  let imports = (routesIndexFile.match(
    /((.|\n)+)?import(.|\n)+const Routes = \[/gm
  ) || [''])[0]

  if (!imports) {
    return routesIndexFile
  }

  imports = imports.replace(
    '\n\nconst Routes = [',
    `\nimport ${rsrcName}Router from './${rsrcName}.mjs'`
  )

  let routes = (routesIndexFile.match(
    /const Routes = \[(.|\n?)+{ path(.|\n)+}/gm
  ) || [''])[0].replace('const Routes = [', '')

  if (!routes) {
    return routesIndexFile
  }

  if (routes.indexOf('\n') === 0) {
    routes = routes.replace('\n', '')
  }

  routes = routes.trim()

  return `${imports}

const Routes = [
  ${routes},
  { path: '${routerMountPath}', router: ${rsrcName}Router }
]

export default Routes`
}
