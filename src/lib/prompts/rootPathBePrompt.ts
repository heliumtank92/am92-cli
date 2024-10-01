import fs from 'fs'
import inputPromptWithOptions from './inputPromptWithOptions'
import { logger } from '../logger'

export default async function rootPathBePrompt(projectRoot: string): Promise<{
  projectRoot: string
  apiFolderPath: string
  startServerFilePath: string
  devEnvFilePath: string
  sdksFolderPath: string
}> {
  let rootPath = projectRoot
  let apiFolderPath = './api'
  let startServerFilePath = `${rootPath}/startServer.mjs`
  let devEnvFilePath = `${rootPath}/.env.development`
  let sdksFolderPath = `${apiFolderPath}/sdks`

  if (!projectRoot) {
    rootPath = await inputPromptWithOptions('Project Root Path:', ['.'])
    apiFolderPath = `${rootPath}/api`
    startServerFilePath = `${rootPath}/startServer.mjs`
    devEnvFilePath = `${rootPath}/.env.development`
    sdksFolderPath = `${apiFolderPath}/sdks`
  }

  if (!fs.existsSync(rootPath)) {
    logger.fatal(
      `[Error] BE Project does not exist at the location: ${rootPath}`
    )
    process.exit()
  }

  if (!fs.existsSync(apiFolderPath)) {
    logger.fatal(
      `[Error] Project API Folder does not exist at the location: ${apiFolderPath}`
    )
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
