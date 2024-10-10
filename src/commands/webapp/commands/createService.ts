import fs from 'fs'
import yargs, { Arguments } from 'yargs'

import { camelCase, kebabCase, pascalCase } from '../../../lib/changeCase'
import CliCommand from '../../../lib/CliCommand'
import { writeFile } from '../../../lib/file'
import { colorify, logger } from '../../../lib/logger'
import inputPrompt from '../../../lib/prompts/inputPrompt'
import inputPromptWithOptions from '../../../lib/prompts/inputPromptWithOptions'
import selectPrompt from '../../../lib/prompts/selectPrompt'
import feReducerPrompt from '../../../lib/prompts/webapp/feReducerPrompt'
import feRootPathPrompt from '../../../lib/prompts/webapp/feRootPathPrompt'

import GET_SERVICE_FILE from '../fileTemplates/redux/GET_SERVICE_FILE'
import POST_SERVICE_FILE from '../fileTemplates/redux/POST_SERVICE_FILE'
import SERVICE_ACTIONS from '../fileTemplates/redux/SERVICE_ACTIONS'

const COMMAND = 'webapp-create-service'
const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD']

yargs.command(
  COMMAND,
  colorify.trace('Create Service in React Webapp (Typescript)'),
  builder,
  handler
)

function builder(yargs: any): any {
  return yargs
    .option('project-root', {
      description: 'Project Root Path',
      type: 'string',
      required: false
    })
    .option('reducer-name', {
      description: 'Reducer Name',
      type: 'string',
      required: false
    })
    .option('service-name', {
      description: 'Service Name',
      type: 'string',
      required: false
    })
    .option('service-method', {
      description: 'Service Method',
      type: 'string',
      choices: METHODS,
      required: false
    })
    .option('service-url', {
      description: 'Service URL',
      type: 'string',
      required: false
    })
}

async function handler(argv: Arguments) {
  logger.initiate(`[${COMMAND}] Initiating...`)

  const { srcFolderPath } = await feRootPathPrompt(argv.projectRoot as string)
  const { reducerName, reducerPath } = await feReducerPrompt(
    srcFolderPath,
    argv.reducerName as string
  )

  const serviceName = camelCase(
    await inputPrompt('Service Name', argv.serviceName as string)
  )
  const serviceMethod = await selectPrompt(
    'Service Method',
    METHODS,
    argv.serviceMethod as string
  )

  let serviceUrl = await inputPromptWithOptions(
    'Service URL',
    [`/${kebabCase(serviceName)}`],
    argv.serviceUrl as string
  )

  const servicesFolder = `${reducerPath}/Services`
  if (!fs.existsSync(servicesFolder)) {
    // Create Services Folder
    new CliCommand('Create Services Folder', `mkdir ${servicesFolder}`).exec(
      false
    )
  }

  const serviceFilePath = `${servicesFolder}/${serviceName}.Service.ts`
  if (fs.existsSync(serviceFilePath)) {
    logger.fatal(
      `[Error] Service already exist at the location: ${servicesFolder}`
    )
    process.exit()
  }

  // Append Action File
  const serviceActions = SERVICE_ACTIONS.replaceAll(
    '{reducerName}',
    reducerName
  ).replaceAll('{serviceName}', serviceName)
  const serviceFileLoc = `${reducerPath}/Actions.ts`
  writeFile('Action File', serviceActions, serviceFileLoc, true)

  const serviceFileTemplate =
    serviceMethod === 'GET' || serviceMethod === 'GET'
      ? GET_SERVICE_FILE
      : POST_SERVICE_FILE

  if (serviceUrl.includes('/:')) {
    serviceUrl = `\`${serviceUrl}\``
  } else {
    serviceUrl = `'${serviceUrl}'`
  }

  const serviceFile = serviceFileTemplate
    .replaceAll('{serviceName}', serviceName)
    .replaceAll('{pascalCase(serviceName)}', pascalCase(serviceName))
    .replaceAll('{serviceUrl}', serviceUrl)
    .replaceAll('{serviceMethod}', serviceMethod)

  // Write Service File
  writeFile('Service File', serviceFile, serviceFilePath)

  logger.complete(`[${COMMAND}] Completed!`)
}
