import { Arguments } from 'yargs'
import { AddPartialParams } from './TYPES'
import rootPathBePrompt from '../../../../lib/prompts/rootPathBePrompt'
import beResourcePrompt from '../../../../lib/prompts/beResourcePrompt'
import bePartialPrompt from '../../../../lib/prompts/bePartialPrompt'

export default async function getParams(
  argv: Arguments
): Promise<AddPartialParams> {
  const { apiFolderPath } = await rootPathBePrompt(argv.projectRoot as string)
  const { rsrcName, rsrcPath } = await beResourcePrompt(
    apiFolderPath,
    argv.rsrcName as string
  )

  let partialName = await bePartialPrompt(
    rsrcPath,
    rsrcName,
    argv.partialName as string,
    true
  )

  const params: AddPartialParams = {
    rsrcName,
    rsrcPath,
    partialName
  }

  return params
}
