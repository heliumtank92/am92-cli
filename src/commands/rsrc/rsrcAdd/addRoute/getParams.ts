import fs from 'fs'
import { Arguments } from 'yargs'
import { camelCase, kebabCase } from '../../../../lib/changeCase'
import { AddRouteParams, METHODS } from './TYPES'
import rootPathBePrompt from '../../../../lib/prompts/rootPathBePrompt'
import beResourcePrompt from '../../../../lib/prompts/beResourcePrompt'
import bePartialPrompt from '../../../../lib/prompts/bePartialPrompt'
import inputPrompt from '../../../../lib/prompts/inputPrompt'
import inputPromptWithOptions from '../../../../lib/prompts/inputPromptWithOptions'
import ynSelectPrompt from '../../../../lib/prompts/ynSelectPrompt'
import selectPrompt from '../../../../lib/prompts/selectPrompt'

export default async function getParams(
  argv: Arguments
): Promise<AddRouteParams> {
  const { apiFolderPath } = await rootPathBePrompt(argv.projectRoot as string)
  const { rsrcName, rsrcPath } = await beResourcePrompt(
    apiFolderPath,
    argv.rsrcName as string
  )

  const folderStruct =
    fs.existsSync(`${rsrcPath}/${rsrcName}.Model`) &&
    fs.existsSync(`${rsrcPath}/${rsrcName}.Controller`) &&
    fs.existsSync(`${rsrcPath}/${rsrcName}.Router`)

  const partialName = folderStruct
    ? await bePartialPrompt(rsrcPath, rsrcName, argv.partialName as string)
    : ''

  const routeName = camelCase(
    await inputPrompt('Route Name:', argv.routeName as string)
  )

  const routeMethod = await selectPrompt(
    'Route Method:',
    METHODS,
    argv.routeMethod as string
  )

  const routePath = await inputPromptWithOptions(
    'Route URL:',
    [`/${kebabCase(routeName)}`],
    argv.routePath as string
  )

  const hasQuery = await ynSelectPrompt(
    'Does Route have query?',
    argv.hasQuery as string
  )

  const routesFolderPath = `${apiFolderPath}/routes`

  const params: AddRouteParams = {
    rsrcName,
    rsrcPath,
    partialName,
    routeName,
    routeMethod,
    routePath,
    routesFolderPath,
    hasQuery
  }

  return params
}
