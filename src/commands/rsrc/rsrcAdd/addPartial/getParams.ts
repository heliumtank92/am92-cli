import fs from 'fs'
import { Arguments } from 'yargs'
import { logger } from '../../../../lib/logger'
import inputReader from '../../../../lib/inputReader'
import { pascalCase } from '../../../../lib/changeCase'
import { AddPartialParams } from './TYPES'

export default function getParams(argv: Arguments): AddPartialParams {
  let projectRootPath = (argv.projectRootPath as string) || ''
  let rsrcName = (argv.rsrcName as string) || ''
  let partialName = (argv.partialName as string) || ''

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
    rsrcName = pascalCase(rsrcName)
  }

  const rsrcPath = `${rsrcFolderPath}/${rsrcName}`
  if (!fs.existsSync(rsrcPath)) {
    logger.fatal(
      `[Error] Resource does not exist at the location: ${rsrcFolderPath}/`
    )
    process.exit()
  }

  if (!partialName) {
    partialName = inputReader('Resource Partial Name', '', true)
    partialName = pascalCase(partialName)
  }

  const params: AddPartialParams = {
    rsrcName,
    rsrcPath,
    partialName
  }

  return params
}
