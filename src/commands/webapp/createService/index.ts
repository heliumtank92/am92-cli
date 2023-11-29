import yargs, { Arguments } from 'yargs'
import fs from 'fs'
import { colorify, logger } from '../../../lib/logger'
import inputReader from '../../../lib/inputReader'
import CliCommand from '../../../lib/CliCommand'
import { pascalCase } from '../../../lib/changeCase'
import SERVICE_ACTIONS from './SERVICE_ACTIONS'
import GET_SERVICE_FILE from './GET_SERVICE_FILE'
import POST_SERVICE_FILE from './POST_SERVICE_FILE'

const COMMAND = 'webapp-create-service'
const PATH_CHOICES = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD']

yargs.command(
  COMMAND,
  colorify.trace('Create Service in React Webapp using Typescript'),
  builder,
  handler
)

function builder(yargs: any): any {
  return yargs
    .option('project-root-folder-path', {
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
      choices: PATH_CHOICES,
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

  let projectRootPath = (argv.projectRootPath as string) || ''
  let reducerName = (argv.reducerName as string) || ''
  let serviceName = (argv.serviceName as string) || ''
  let serviceMethod = (argv.serviceMethod as string) || ''
  let serviceUrl = (argv.serviceUrl as string) || ''

  if (!projectRootPath) {
    const API_FOLDER_PATH: string = '.'
    projectRootPath = inputReader('Project Root Path', API_FOLDER_PATH, true)
  }

  if (!fs.existsSync(projectRootPath)) {
    logger.fatal(
      `[Error] Project does not exist at the location: ${projectRootPath}`
    )
    process.exit()
  }

  const srcFolderPath = `${projectRootPath}/src`
  if (!fs.existsSync(srcFolderPath)) {
    logger.fatal(
      `[Error] Project Source Folder does not exist at the location: ${srcFolderPath}`
    )
    process.exit()
  }

  const reduxFolderPath = `${srcFolderPath}/Redux`
  if (!fs.existsSync(reduxFolderPath)) {
    logger.fatal(
      `[Error] Redux Folder does not exist at the location: ${reduxFolderPath}`
    )
    process.exit()
  }

  if (!reducerName) {
    const REDUCER_NAME = 'Sample'
    reducerName = inputReader('Reducer Name', REDUCER_NAME, true)
  }

  const reducerFolderPath = `${reduxFolderPath}/${reducerName}`
  if (!fs.existsSync(reducerFolderPath)) {
    logger.fatal(
      `[Error] Reducer does not exist at the location: ${reducerFolderPath}`
    )
    process.exit()
  }

  if (!serviceName) {
    const SERVICE_NAME = 'serviceName'
    serviceName = inputReader('Service Name', SERVICE_NAME, true)
  }

  const servicesFolder = `${reducerFolderPath}/Services`
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

  if (!serviceMethod) {
    const SERVICE_NAME = 'POST'
    serviceMethod = inputReader('Service Method', SERVICE_NAME, true)
  }

  if (!PATH_CHOICES.includes(serviceMethod)) {
    logger.fatal(
      `[Error] Invalid Service Method. It must be one of: ${PATH_CHOICES.join(
        ', '
      )}`
    )
    process.exit()
  }

  if (!serviceUrl) {
    const SERVICE_URL = '/service/url'
    serviceUrl = inputReader('Service URL', SERVICE_URL, true)
  }

  // Append Action File
  const serviceActions = SERVICE_ACTIONS.replaceAll(
    '{reducerName}',
    reducerName
  ).replaceAll('{serviceName}', serviceName)
  new CliCommand('Append Action File', 'echo')
    .append(`"${serviceActions}"`)
    .append(`>> ${reducerFolderPath}/Actions.ts`)
    .exec(false)

  const serviceFileTemplate =
    serviceMethod === 'GET' || serviceMethod === 'GET'
      ? GET_SERVICE_FILE
      : POST_SERVICE_FILE
  const serviceFile = serviceFileTemplate
    .replaceAll('{serviceName}', serviceName)
    .replaceAll('{pascalCase(serviceName)}', pascalCase(serviceName))
    .replaceAll('{serviceUrl}', serviceUrl)
    .replaceAll('{serviceMethod}', serviceMethod)

  // Write Service File
  new CliCommand('Write Service File', 'echo')
    .append(`"${serviceFile}"`)
    .append(`> ${serviceFilePath}`)
    .exec(false)

  logger.complete(`[${COMMAND}] Completed!`)
}