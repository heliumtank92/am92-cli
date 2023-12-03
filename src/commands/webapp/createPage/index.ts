import fs from 'fs'
import yargs, { Arguments } from 'yargs'

import { colorify, logger } from '../../../lib/logger'
import CliCommand from '../../../lib/CliCommand'
import { writeFile, rewriteFile } from '../../../lib/file'

import builder from './builder'
import getParams from './getParams'
import appRoutesEditor from './editors/appRoutesEditor'
import appRouterEditor from './editors/appRouterEditor'
import getComponentTemplate from '../helpers/getComponentTemplate'

const COMMAND = 'webapp-create-page'

yargs.command(
  COMMAND,
  colorify.trace('Create Page in React Webapp (Typescript)'),
  builder,
  handler
)

async function handler(argv: Arguments) {
  logger.initiate(`[${COMMAND}] Initiating...`)

  const params = getParams(argv)
  const {
    srcFolderPath,
    pageFolderPath,
    pageName,
    pagePath,
    state,
    redux,
    router
  } = params

  // Create Page Folder
  new CliCommand('Create Page Folder', `mkdir ${pageFolderPath}`).exec(false)

  // Create Page File
  const template = getComponentTemplate(state, redux, router)
  const page = template.replaceAll('{componentName}', `${pageName}Page`)
  const pageLoc = `${pageFolderPath}/${pageName}.Page.tsx`
  writeFile('Page File', page, pageLoc)

  const appRoutesFile = `${srcFolderPath}/Constants/APP_ROUTES.ts`
  rewriteFile('Routes File', appRoutesFile, appRoutesEditor(pageName, pagePath))

  const appRouterFile = `${srcFolderPath}/Configurations/getAppRouter.tsx`
  rewriteFile('App Router File', appRouterFile, appRouterEditor(pageName))

  logger.complete(`[${COMMAND}] Completed!`)
}
