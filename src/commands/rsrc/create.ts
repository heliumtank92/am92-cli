import yargs, { Arguments } from 'yargs'
import fs from 'fs'
import CliCommand from '../../lib/CliCommand'
import inputReader from '../../lib/inputReader'
import { colorify, logger } from '../../lib/logger'

const COMMAND = 'rsrc-create'

yargs.command(
  COMMAND,
  colorify.trace('Create a Basic Backend Resource'),
  builder,
  handler
)

function builder(yargs: any) {
  return yargs
    .option('rsrc-name', {
      description: 'Resource Name',
      required: false
    })
    .option('api-folder-path', {
      description: 'API Folder Path',
      required: false
    })
}

async function handler(argv: Arguments) {
  logger.initiate(`[${COMMAND}] Initiating...`)

  let rsrcName = (argv.rsrcName as string) || ''
  let apiFolderPath = (argv.apiFolderPath as string) || ''

  if (!rsrcName) {
    const RSRC_NAME = 'Rsrc'
    rsrcName = inputReader('Resource Name', RSRC_NAME, true)
  }

  if (!apiFolderPath) {
    const API_FOLDER_PATH: string = './api'
    apiFolderPath = inputReader('API Folder Path', API_FOLDER_PATH, true)
  }

  if (!fs.existsSync(apiFolderPath)) {
    logger.fatal(
      `[Error] API Folder does not exist at the location: ${apiFolderPath}`
    )
    process.exit()
  }

  const rsrcFolderPath = `${apiFolderPath}/resources`
  if (!fs.existsSync(rsrcFolderPath)) {
    logger.fatal(
      `[Error] Resource Folder does not exist at the location: ${rsrcFolderPath}`
    )
    process.exit()
  }

  const rsrcPath = `${rsrcFolderPath}/${rsrcName}`

  if (fs.existsSync(rsrcPath)) {
    logger.fatal(
      `[Error] Resource already exists at the location: ${rsrcFolderPath}`
    )
    process.exit()
  }

  // Create Resource Folder
  new CliCommand('Create Resource Folder', 'mkdir').append(rsrcPath).exec(false)

  // Create Resource Model
  new CliCommand('Create Resource Model', 'echo')
    .append(_getModelFile(rsrcName))
    .append('>')
    .append(`${rsrcPath}/${rsrcName}.Model.mjs`)
    .exec(false)

  // Create Resource Controller
  new CliCommand('Create Resource Controller', 'echo')
    .append(_getControllerFile(rsrcName))
    .append('>')
    .append(`${rsrcPath}/${rsrcName}.Controller.mjs`)
    .exec(false)

  // Create Resource Router
  new CliCommand('Create Resource Router', 'echo')
    .append(_getRouterFile(rsrcName))
    .append('>')
    .append(`${rsrcPath}/${rsrcName}.Router.mjs`)
    .exec(false)

  // Create Resource index
  new CliCommand('Create Resource index', 'echo')
    .append(_getIndexFile(rsrcName))
    .append('>')
    .append(`${rsrcPath}/index.mjs`)
    .exec(false)

  logger.complete(`[${COMMAND}] Completed!`)
}

function _getModelFile(rsrcName: string): string {
  return `"const ${rsrcName}Model = {
  routeLogic
}

async function routeLogic() {}

export default ${rsrcName}Model"`
}

function _getControllerFile(rsrcName: string): string {
  return `"import { ResponseBody } from '@am92/express-utils'
import ${rsrcName}Model from './${rsrcName}.Model'

const ${rsrcName}Controller = {
  routeHandler
}

async function routeHandler(request, response, next) {
  const data = await ${rsrcName}Model.routeLogic()
  const responseBody = new ResponseBody(200, 'Route Logic Successful', data)
  response.body = responseBody
  process.nextTick(next)
}

export default ${rsrcName}Controller"`
}

function _getRouterFile(rsrcName: string): string {
  return `"import { configureRouter } from '@am92/express-utils'
import ${rsrcName}Controller from './${rsrcName}.Controller'

const { routeHandler } = ${rsrcName}Controller

const masterConfig = {
  routerName: '${rsrcName}',
  routesConfig: {
    route: {
      method: 'get',
      path: '/route',
      pipeline: [routeHandler]
    }
  }
}
  
class ${rsrcName}Router {
  constructor(Router, customConfig) {
    const resourceRouter = configureRouter(Router, masterConfig, customConfig)
    return resourceRouter
  }
}

export default ${rsrcName}Router"`
}

function _getIndexFile(rsrcName: string): string {
  return `"import ${rsrcName}Model from './${rsrcName}.Model.mjs'
import ${rsrcName}Controller from './${rsrcName}.Controller.mjs'
import ${rsrcName}Router from './${rsrcName}.Router.mjs'

export { ${rsrcName}Model, ${rsrcName}Controller, ${rsrcName}Router }"`
}
