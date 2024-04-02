import { Arguments } from 'yargs'
import fs from 'fs'
import inputReader from '../../../../lib/inputReader'
import { logger } from '../../../../lib/logger'
import { CreateParams } from '../TYPES'
import { kebabCase, pascalCase } from '../../../../lib/changeCase'
import { getBERootPaths } from '../../../../helpers/beInpurReader'

export default function getCreateParams(argv: Arguments): CreateParams {
  const { apiFolderPath } = getBERootPaths(argv)
  let rsrcName = pascalCase((argv.rsrcName as string) || '')
  let routerMountPath = (argv.routerMountPath as string) || ''
  let folderStruct = ((argv.folderStruct as string) || '').toLowerCase()

  const rsrcFolderPath = `${apiFolderPath}/resources`
  if (!fs.existsSync(rsrcFolderPath)) {
    logger.fatal(
      `[Error] Resource Folder does not exist at the location: ${apiFolderPath}/`
    )
    process.exit()
  }

  if (!folderStruct) {
    folderStruct = inputReader('Resouce in Folder Structure? [y/n]', '', false)
    folderStruct = folderStruct.toLowerCase()
  }

  if (!rsrcName) {
    const RSRC_NAME = 'Sample'
    rsrcName = inputReader('Resource Name', RSRC_NAME, true)
    rsrcName = pascalCase(rsrcName)
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
    const ROUTER_MOUNT_PATH = `/${kebabCase(rsrcName)}`
    routerMountPath = inputReader('Router Mount Path', ROUTER_MOUNT_PATH, true)
  }

  const createParams: CreateParams = {
    rsrcName,
    routerMountPath,
    rsrcPath,
    routesFolderPath,
    folderStruct: folderStruct === 'y'
  }

  return createParams
}
