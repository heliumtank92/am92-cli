import { Arguments } from 'yargs'
import fs from 'fs'
import inputReader from '../../../lib/inputReader'
import { logger } from '../../../lib/logger'
import { CreateParams } from '../TYPES'

export default function getCreateParams(argv: Arguments): CreateParams {
  let projectRootPath = (argv.projectRootPath as string) || ''
  let rsrcName = (argv.rsrcName as string) || ''
  let routerMountPath = (argv.routerMountPath as string) || ''

  if (!projectRootPath) {
    const ROOT_FOLDER_PATH: string = '.'
    projectRootPath = inputReader('Project Root Path', ROOT_FOLDER_PATH, true)
  }

  if (!fs.existsSync(projectRootPath)) {
    logger.fatal(
      `[Error] Project does not exist at the location: ${projectRootPath}`
    )
    process.exit()
  }

  const apiFolderPath = `${projectRootPath}/api`
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
  }

  const rsrcPath = `${rsrcFolderPath}/${rsrcName}`
  if (fs.existsSync(rsrcPath)) {
    logger.fatal(
      `[Error] Resource already exists at the location: ${rsrcFolderPath}/`
    )
    process.exit()
  }

  const routesFolderPath = `${apiFolderPath}/routes`
  if (!fs.existsSync(routesFolderPath)) {
    logger.fatal(
      `[Error] Routes Folder does not exist at the location: ${apiFolderPath}/`
    )
    process.exit()
  }

  if (!routerMountPath) {
    const ROUTER_MOUNT_PATH = '/samples'
    routerMountPath = inputReader('Router Mount Path', ROUTER_MOUNT_PATH, true)
  }

  const createParams: CreateParams = {
    rsrcName,
    routerMountPath,
    rsrcPath,
    routesFolderPath
  }

  return createParams
}
