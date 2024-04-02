import fs from 'fs'
import { Arguments } from 'yargs'
import { logger } from '../../../../lib/logger'
import inputReader from '../../../../lib/inputReader'
import { pascalCase } from '../../../../lib/changeCase'
import { AddEsIndicesParams } from './TYPES'
import { getBERootPaths } from '../../../../helpers/beInpurReader'

export default function getParams(argv: Arguments): AddEsIndicesParams {
  const { apiFolderPath } = getBERootPaths(argv)
  let rsrcName = pascalCase((argv.rsrcName as string) || '')

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

  const folderStruct =
    fs.existsSync(`${rsrcPath}/${rsrcName}.Model`) &&
    fs.existsSync(`${rsrcPath}/${rsrcName}.Controller`) &&
    fs.existsSync(`${rsrcPath}/${rsrcName}.Router`)

  const routesFolderPath = `${apiFolderPath}/routes`

  const params: AddEsIndicesParams = {
    rsrcName,
    rsrcPath,
    folderStruct,
    routesFolderPath
  }

  return params
}
