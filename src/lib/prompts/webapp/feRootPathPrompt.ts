import fs from 'fs'

import { logger } from '../../logger'
import inputPrompt from '../inputPrompt'

export default async function feRootPathPrompt(projectRoot: string): Promise<{
  projectRoot: string
  srcFolderPath: string
}> {
  let rootPath = projectRoot || '.'
  let srcFolderPath = `${rootPath}/src`

  let isValid = _validatePaths(rootPath, srcFolderPath)

  if (!isValid && !projectRoot) {
    rootPath = await inputPrompt('Project Root Path')
    srcFolderPath = `${rootPath}/src`
    isValid = _validatePaths(rootPath, srcFolderPath)
  }

  if (!isValid) {
    process.exit()
  }

  return {
    projectRoot: rootPath,
    srcFolderPath
  }
}

function _validatePaths(rootPath: string, srcFolderPath: string): boolean {
  if (!fs.existsSync(rootPath)) {
    logger.fatal(
      `[Error] FE Project does not exist at the location: ${rootPath}`
    )
    return false
  }

  if (!fs.existsSync(srcFolderPath)) {
    logger.fatal(
      `[Error] Project SRC Folder does not exist at the location: ${srcFolderPath}`
    )
    return false
  }

  return true
}
