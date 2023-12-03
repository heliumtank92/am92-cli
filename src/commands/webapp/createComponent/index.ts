import fs from 'fs'
import yargs, { Arguments } from 'yargs'

import { colorify, logger } from '../../../lib/logger'
import CliCommand from '../../../lib/CliCommand'
import { writeFile } from '../../../lib/file'

import builder from './builder'
import getParams from './getParams'
import getComponentTemplate from '../helpers/getComponentTemplate'

const COMMAND = 'webapp-create-component'

yargs.command(
  COMMAND,
  colorify.trace('Create Component in React Webapp (Typescript)'),
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
    componentName,
    state,
    redux,
    router
  } = params

  let componentRootFolder = srcFolderPath
  let componentFolder = `${srcFolderPath}/Components`
  if (pageName) {
    componentRootFolder = pageFolderPath
    componentFolder = `${pageFolderPath}/Components`
  }

  if (!fs.existsSync(componentFolder)) {
    new CliCommand('Create Components Folder', 'mkdir')
      .append(componentFolder)
      .exec(false)
  }

  const componentFilePath = `${componentFolder}/${componentName}.tsx`
  if (fs.existsSync(componentFilePath)) {
    logger.fatal(
      `[Error] Component already exists at location: ${componentFilePath}`
    )
    process.exit()
  }

  // Create Component File
  const template = getComponentTemplate(state, redux, router)
  const component = template.replaceAll('{componentName}', componentName)
  writeFile('Component File', component, componentFilePath)

  logger.complete(`[${COMMAND}] Completed!`)
}
