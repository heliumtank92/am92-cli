import fs from 'fs'
import { Arguments } from 'yargs'
import inputReader from '../lib/inputReader'
import { logger } from '../lib/logger'

export function getWebappRootPaths(argv: Arguments) {
  let projectRoot = (argv.projectRoot as string) || ''
  let srcFolderPath = ``

  if (!projectRoot && fs.existsSync('.') && fs.existsSync('./src')) {
    projectRoot = '.'
    srcFolderPath = './src'
  } else {
    projectRoot = inputReader('Project Root Path', '', true)

    if (!fs.existsSync(projectRoot)) {
      logger.fatal(
        `[Error] Project does not exist at the location: ${projectRoot}`
      )
      process.exit()
    }

    srcFolderPath = `${projectRoot}/src`
    if (!fs.existsSync(srcFolderPath)) {
      logger.fatal(
        `[Error] Project Source Folder does not exist at the location: ${srcFolderPath}`
      )
      process.exit()
    }
  }

  return { projectRoot, srcFolderPath }
}
