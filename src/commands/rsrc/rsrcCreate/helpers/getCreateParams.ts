import fs from 'fs'
import pluralize from 'pluralize'
import { Arguments } from 'yargs'

import { kebabCase } from '../../../../lib/changeCase'
import { logger } from '../../../../lib/logger'
import beResourcePrompt from '../../../../lib/prompts/be/beResourcePrompt'
import beRootPathPrompt from '../../../../lib/prompts/be/beRootPathPrompt'
import inputPromptWithOptions from '../../../../lib/prompts/inputPromptWithOptions'
import ynSelectPrompt from '../../../../lib/prompts/ynSelectPrompt'

import { CreateParams } from '../TYPES'

export default async function getCreateParams(
  argv: Arguments
): Promise<CreateParams> {
  const { apiFolderPath } = await beRootPathPrompt(argv.projectRoot as string)
  const { rsrcName, rsrcPath } = await beResourcePrompt(
    apiFolderPath,
    argv.rsrcName as string,
    true
  )

  const routerMountPath = await inputPromptWithOptions(
    'Router Mount Path',
    [`/${kebabCase(pluralize(rsrcName))}`],
    argv.routerMountPath as string
  )

  const folderStruct = await ynSelectPrompt(
    'Resource in Folder Structure?',
    argv.folderStruct as string
  )

  const routesFolderPath = `${apiFolderPath}/routes`
  if (!fs.existsSync(routesFolderPath)) {
    logger.fatal(
      `[Error] Routes Folder does not exist at the location: ${apiFolderPath}/`
    )
    process.exit()
  }

  const createParams: CreateParams = {
    rsrcName,
    routerMountPath,
    rsrcPath,
    routesFolderPath,
    folderStruct
  }

  return createParams
}
