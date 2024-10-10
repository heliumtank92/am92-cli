import fs from 'fs'
import yargs, { Arguments } from 'yargs'

import CliCommand from '../../../../lib/CliCommand'
import { writeFile } from '../../../../lib/file'
import { colorify, logger } from '../../../../lib/logger'
import getComponentTemplate from '../../helpers/getComponentTemplate'

import builder from './builder'
import getParams from './getParams'

const COMMAND = 'webapp-create-component'

yargs.command(
  COMMAND,
  colorify.trace('Create Component in React Webapp (Typescript)'),
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
    componentType,
    componentName,
    state,
    redux,
    router
  } = params

  let componentFolder = `${srcFolderPath}/Components`
  if (pageName) {
    componentFolder = `${pagePath}/Components`
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
  const template = getComponentTemplate(componentType, state, redux, router)
  const component = template.replaceAll('{componentName}', componentName)
  writeFile('Component File', component, componentFilePath)

  logger.complete(`[${COMMAND}] Completed!`)
}
