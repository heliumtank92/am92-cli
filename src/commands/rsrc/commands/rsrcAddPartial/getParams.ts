import { Arguments } from 'yargs'

import bePartialPrompt from '../../../../lib/prompts/be/bePartialPrompt'
import beResourcePrompt from '../../../../lib/prompts/be/beResourcePrompt'
import beRootPathPrompt from '../../../../lib/prompts/be/beRootPathPrompt'

import { AddPartialParams } from './TYPES'

export default async function getParams(
  argv: Arguments
): Promise<AddPartialParams> {
  const { apiFolderPath } = await beRootPathPrompt(argv.projectRoot as string)
  const { rsrcName, rsrcPath } = await beResourcePrompt(
    apiFolderPath,
    argv.rsrcName as string
  )

  const partialName = await bePartialPrompt(
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
