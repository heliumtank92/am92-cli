import fs from 'fs'

import { logger } from '../../logger'
import inputPrompt from '../inputPrompt'

export default async function beRootPathPrompt(projectRoot: string): Promise<{
  projectRoot: string
  apiFolderPath: string
  startServerFilePath: string
  devEnvFilePath: string
  sdksFolderPath: string
}> {
  let rootPath = projectRoot || '.'
  let apiFolderPath = `${rootPath}/api`
  let startServerFilePath = `${rootPath}/startServer.mjs`
  let devEnvFilePath = `${rootPath}/.env.development`
  let sdksFolderPath = `${apiFolderPath}/sdks`

  let isValid = _validatePaths(rootPath, apiFolderPath)

  if (!isValid && !projectRoot) {
    rootPath = await inputPrompt('Project Root Path')
    apiFolderPath = `${rootPath}/api`
    startServerFilePath = `${rootPath}/startServer.mjs`
    devEnvFilePath = `${rootPath}/.env.development`
    sdksFolderPath = `${apiFolderPath}/sdks`
    isValid = _validatePaths(rootPath, apiFolderPath)
  }

  if (!isValid) {
    process.exit()
  }

  return {
    projectRoot: rootPath,
    apiFolderPath,
    startServerFilePath,
    devEnvFilePath,
    sdksFolderPath
  }
}

function _validatePaths(rootPath: string, apiFolderPath: string): boolean {
  if (!fs.existsSync(rootPath)) {
    logger.fatal(
      `[Error] BE Project does not exist at the location: ${rootPath}`
    )
    return false
  }

  if (!fs.existsSync(apiFolderPath)) {
    logger.fatal(
      `[Error] Project API Folder does not exist at the location: ${apiFolderPath}`
    )
    return false
  }

  return true
}
