import fs from 'fs'
import { Arguments } from 'yargs'
import { camelCase, kebabCase } from '../../../../lib/changeCase'
import { AddRouteParams, METHODS } from './TYPES'
import rootPathBePrompt from '../../../../lib/prompts/rootPathBePrompt'
import beResourcePrompt from '../../../../lib/prompts/beResourcePrompt'
import bePartialPrompt from '../../../../lib/prompts/bePartialPrompt'
import inputPrompt from '../../../../lib/prompts/inputPrompt'
import { select } from '@inquirer/prompts'
import inputPromptWithOptions from '../../../../lib/prompts/inputPromptWithOptions'
import ynSelectPrompt from '../../../../lib/prompts/ynSelectPrompt'

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

  let partialName = (argv.partialName as string) || ''

  let routeName = camelCase((argv.routeName as string) || '')
  let routeMethod = (argv.routeMethod as string) || ''
  let routePath = (argv.routePath as string) || ''
  let hasQuery = ((argv.hasQuery as string) || '').toLowerCase() === 'y'

  if (folderStruct && !partialName) {
    partialName = await bePartialPrompt(
      rsrcPath,
      rsrcName,
      argv.partialName as string
    )
  }

  if (!routeName) {
    routeName = await inputPrompt('Route Name:')
    routeName = camelCase(routeName)
  }

  if (!routeMethod) {
    routeMethod = await select({
      message: 'Route Method:',
      choices: METHODS
    })
  }

  if (!routePath) {
    routePath = await inputPromptWithOptions('Route URL:', [
      `/${kebabCase(routeName)}`
    ])
  }

  if (!hasQuery) {
    hasQuery = await ynSelectPrompt('Does Route have query?')
  }

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
