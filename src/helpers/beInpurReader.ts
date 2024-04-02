import fs from 'fs'
import { Arguments } from 'yargs'
import inputReader from '../lib/inputReader'
import { logger } from '../lib/logger'

export function getBERootPaths(argv: Arguments) {
  let projectRoot = (argv.projectRoot as string) || ''
  let apiFolderPath = ``

  if (!projectRoot && fs.existsSync('.') && fs.existsSync('./api')) {
    projectRoot = '.'
    apiFolderPath = './api'
  } else {
    projectRoot = inputReader('Project Root Path', '', true)

    if (!fs.existsSync(projectRoot)) {
      logger.fatal(
        `[Error] Project does not exist at the location: ${projectRoot}`
      )
      process.exit()
    }

    apiFolderPath = `${projectRoot}/api`
    if (!fs.existsSync(apiFolderPath)) {
      logger.fatal(
        `[Error] Project API Folder does not exist at the location: ${apiFolderPath}`
      )
      process.exit()
    }
  }

  return { projectRoot, apiFolderPath }
}
