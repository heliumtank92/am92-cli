import yargs, { Arguments } from 'yargs'
import fs from 'fs'
import { colorify, logger } from '../../lib/logger'
import inputReader from '../../lib/inputReader'
import CliCommand from '../../lib/CliCommand'
import { pascalCase } from '../../lib/changeCase'

const COMMAND = 'webapp-create-service'
const PATH_CHOICES = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD']

yargs.command(
  COMMAND,
  colorify.trace('Create a Service in React Webapp using Typescript'),
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

  const serviceActions = _buildServiceActions(reducerName, serviceName)

  // Append Action File
  new CliCommand('Append Action File', 'echo')
    .append(`"${serviceActions}"`)
    .append(`>> ${reducerFolderPath}/Actions.ts`)
    .exec(false)

  const serviceFileFunc =
    serviceMethod === 'GET' || serviceMethod === 'GET'
      ? _buildGetServiceFile
      : _buildPostServiceFile
  const serviceFile = serviceFileFunc(serviceName, serviceUrl, serviceMethod)

  // Write Service File
  new CliCommand('Write Service File', 'echo')
    .append(`"${serviceFile}"`)
    .append(`> ${serviceFilePath}`)
    .exec(false)

  logger.complete(`[${COMMAND}] Completed!`)
}

function _buildServiceActions(
  reducerName: string,
  serviceName: string
): string {
  return `
export const ${serviceName}ServiceName = '${reducerName}/${serviceName}'
export const ${serviceName}TraceActions = traceActionsCreator(
  ${serviceName}ServiceName
)`
}

function _buildPostServiceFile(
  serviceName: string,
  serviceUrl: string,
  serviceMethod: string
): string {
  return `import { WebHttpRequestOptions } from '@am92/web-http'
import { asHttp } from '~/src/Configurations/WebHttp'
import serviceActionCreatorWithTokenRotation from '~/src/Redux/serviceActionCreatorWithTokenRotation'
import { ${serviceName}TraceActions, ${serviceName}ServiceName } from '../Actions'

export type ${pascalCase(serviceName)}RequestData = {}

async function ${serviceName}(reqData: ${pascalCase(serviceName)}RequestData) {
  const options: WebHttpRequestOptions = {
    url: '${serviceUrl}',
    method: '${serviceMethod}'
    data: reqData
  }

  const response = await asHttp.request(options)
  const { data: body } = response
  const { data } = body
  return data
}

const ${serviceName}Service = serviceActionCreatorWithTokenRotation(
  ${serviceName}TraceActions,
  ${serviceName}
)

export default ${serviceName}Service
export { ${serviceName}ServiceName }
`
}

function _buildGetServiceFile(
  serviceName: string,
  serviceUrl: string,
  serviceMethod: string
): string {
  return `import { WebHttpRequestOptions } from '@am92/web-http'
import { asHttp } from '~/src/Configurations/WebHttp'
import serviceActionCreatorWithTokenRotation from '~/src/Redux/serviceActionCreatorWithTokenRotation'
import { ${serviceName}TraceActions, ${serviceName}ServiceName } from '../Actions'

async function ${serviceName}() {
  const options: WebHttpRequestOptions = {
    url: '${serviceUrl}',
    method: '${serviceMethod}'
  }

  const response = await asHttp.request(options)
  const { data: body } = response
  const { data } = body
  return data
}

const ${serviceName}Service = serviceActionCreatorWithTokenRotation(
  ${serviceName}TraceActions,
  ${serviceName}
)

export default ${serviceName}Service
export { ${serviceName}ServiceName }
`
}
