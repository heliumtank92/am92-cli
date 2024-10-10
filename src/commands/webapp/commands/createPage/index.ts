import yargs, { Arguments } from 'yargs'

import CliCommand from '../../../../lib/CliCommand'
import { rewriteFile, writeFile } from '../../../../lib/file'
import { colorify, logger } from '../../../../lib/logger'
import getComponentTemplate from '../../helpers/getComponentTemplate'

import builder from './builder'
import appRouterEditor from './editors/appRouterEditor'
import appRoutesEditor from './editors/appRoutesEditor'
import getParams from './getParams'

const COMMAND = 'webapp-create-page'

yargs.command(
  COMMAND,
  colorify.trace('Create Page in React Webapp (Typescript)'),
  builder,
  handler
)

async function handler(argv: Arguments) {
  logger.initiate(`[${COMMAND}] Initiating...`)

  const params = await getParams(argv)
  const {
    srcFolderPath,
    pageName,
    pagePath,
    pageRoutePath,
    componentType,
    state,
    redux,
    router
  } = params

  // Create Page Folder
  new CliCommand('Create Page Folder', `mkdir ${pagePath}`).exec(false)

  // Create Page File
  const template = getComponentTemplate(componentType, state, redux, router)
  const page = template.replaceAll('{componentName}', `${pageName}Page`)
  const pageLoc = `${pagePath}/${pageName}.Page.tsx`
  writeFile('Page File', page, pageLoc)

  const appRoutesFile = `${srcFolderPath}/Constants/APP_ROUTES.ts`
  rewriteFile(
    'Routes File',
    appRoutesFile,
    appRoutesEditor(pageName, pageRoutePath)
  )

  const appRouterFile = `${srcFolderPath}/Configurations/getAppRouter.tsx`
  rewriteFile('App Router File', appRouterFile, appRouterEditor(pageName))

  logger.complete(`[${COMMAND}] Completed!`)
}
