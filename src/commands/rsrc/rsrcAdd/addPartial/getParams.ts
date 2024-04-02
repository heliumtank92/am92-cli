import fs from 'fs'
import { Arguments } from 'yargs'
import { logger } from '../../../../lib/logger'
import inputReader from '../../../../lib/inputReader'
import { pascalCase } from '../../../../lib/changeCase'
import { AddPartialParams } from './TYPES'
import { getBERootPaths } from '../../../../helpers/beInpurReader'

export default function getParams(argv: Arguments): AddPartialParams {
  const { apiFolderPath } = getBERootPaths(argv)
  let rsrcName = pascalCase((argv.rsrcName as string) || '')
  let partialName = pascalCase((argv.partialName as string) || '')

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
