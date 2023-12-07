import fs from 'fs'
import { Arguments } from 'yargs'
import { logger } from '../../../../lib/logger'
import inputReader from '../../../../lib/inputReader'
import { camelCase, kebabCase, pascalCase } from '../../../../lib/changeCase'
import { AddRouteParams, METHODS } from './TYPES'

export default function getParams(argv: Arguments): AddRouteParams {
  let projectRoot = (argv.projectRoot as string) || ''
  let rsrcName = pascalCase((argv.rsrcName as string) || '')
  let folderStruct = ((argv.folderStruct as string) || '').toLowerCase()
  let partialName = pascalCase((argv.partialName as string) || '')
  let routeName = camelCase((argv.routeName as string) || '')
  let routeMethod = (argv.routeMethod as string) || ''
  let routePath = (argv.routePath as string) || ''
  let hasQuery = ((argv.hasQuery as string) || '').toLowerCase()

  if (!projectRoot) {
    const ROOT_FOLDER_PATH: string = '.'
    projectRoot = inputReader('Project Root Path', ROOT_FOLDER_PATH, true)
  }

  if (!fs.existsSync(projectRoot)) {
    logger.fatal(
      `[Error] Project does not exist at the location: ${projectRoot}`
    )
    process.exit()
  }

  const apiFolderPath = `${projectRoot}/api`
  if (!fs.existsSync(apiFolderPath)) {
    logger.fatal(
      `[Error] API Folder does not exist at the location: ${apiFolderPath}`
    )
    process.exit()
  }

  const rsrcFolderPath = `${apiFolderPath}/resources`
  if (!fs.existsSync(rsrcFolderPath)) {
    logger.fatal(
      `[Error] Resource Folder does not exist at the location: ${apiFolderPath}/`
    )
    process.exit()
  }

  if (!rsrcName) {
    const RSRC_NAME = 'Sample'
    rsrcName = inputReader('Resource Name', RSRC_NAME, true)
    rsrcName = pascalCase(rsrcName)
  }

  const rsrcPath = `${rsrcFolderPath}/${rsrcName}`
  if (!fs.existsSync(rsrcPath)) {
    logger.fatal(
      `[Error] Resource does not exist at the location: ${rsrcFolderPath}/`
    )
    process.exit()
  }

  if (!folderStruct) {
    folderStruct = inputReader('Resouce in Folder Structure? [y/n]', '', false)
    folderStruct = folderStruct.toLowerCase()
  }

  if (folderStruct === 'y' && !partialName) {
    partialName = inputReader('Resource Partial Name', '', false)
    partialName = pascalCase(partialName)
  }

  if (!routeName) {
    routeName = inputReader('Route Name', '', true)
    routeName = camelCase(routeName)
  }

  if (!routeMethod) {
    const ROUTE_METHOUD = 'POST'
    routeMethod = inputReader('Route Method', ROUTE_METHOUD, true)
    routeMethod = routeMethod.toUpperCase()
  }

  if (!METHODS.includes(routeMethod)) {
    logger.fatal(
      `[Error] Invalid Route Method. It must be one of: ${METHODS.join(', ')}`
    )
    process.exit()
  }

  if (!routePath) {
    const ROUTE_URL = `/${kebabCase(routeName)}`
    routePath = inputReader('Route URL', ROUTE_URL, true)
  }

  if (!hasQuery) {
    hasQuery = inputReader('Does Route have query? [y/n]', '', false)
    hasQuery = hasQuery.toLowerCase()
  }

  const routesFolderPath = `${apiFolderPath}/routes`

  const params: AddRouteParams = {
    rsrcName,
    rsrcPath,
    partialName,
    routeName,
    routeMethod,
    routePath,
    routesFolderPath,
    hasQuery: hasQuery === 'y'
  }

  return params
}
