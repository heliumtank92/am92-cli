import fs from 'fs'
import { Arguments } from 'yargs'
import { AddEsIndicesParams } from './TYPES'
import rootPathBePrompt from '../../../../lib/prompts/rootPathBePrompt'
import beResourcePrompt from '../../../../lib/prompts/beResourcePrompt'

export default async function getParams(
  argv: Arguments
): Promise<AddEsIndicesParams> {
  const { apiFolderPath } = await rootPathBePrompt(argv.projectRoot as string)
  const { rsrcName, rsrcPath } = await beResourcePrompt(
    apiFolderPath,
    argv.rsrcName as string
  )

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
