import { Arguments } from 'yargs'
import fs from 'fs'
import pluralize from 'pluralize'
import { logger } from '../../../../lib/logger'
import { CreateParams } from '../TYPES'
import { kebabCase } from '../../../../lib/changeCase'
import rootPathBePrompt from '../../../../lib/prompts/rootPathBePrompt'
import beResourcePrompt from '../../../../lib/prompts/beResourcePrompt'
import ynSelectPrompt from '../../../../lib/prompts/ynSelectPrompt'
import inputPromptWithOptions from '../../../../lib/prompts/inputPromptWithOptions'

export default async function getCreateParams(
  argv: Arguments
): Promise<CreateParams> {
  const { apiFolderPath } = await rootPathBePrompt(argv.projectRoot as string)
  const { rsrcName, rsrcPath } = await beResourcePrompt(
    apiFolderPath,
    argv.rsrcName as string,
    true
  )

  let routerMountPath = await inputPromptWithOptions(
    'Router Mount Path:',
    [`/${kebabCase(pluralize(rsrcName))}`],
    argv.routerMountPath as string
  )

  let folderStruct = await ynSelectPrompt(
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
