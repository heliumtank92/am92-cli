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
      type: 'string',
      required: false
    })
    .option('api-folder-path', {
      description: 'API Folder Path',
      type: 'string',
      required: false
    })
    .option('router-mount-path', {
      description: 'Router Mount Path',
      type: 'string',
      required: false
    })
}

async function handler(argv: Arguments) {
  logger.initiate(`[${COMMAND}] Initiating...`)

  let rsrcName = (argv.rsrcName as string) || ''
  let apiFolderPath = (argv.apiFolderPath as string) || ''
  let routerMountPath = (argv.routerMountPath as string) || ''

  if (!rsrcName) {
    const RSRC_NAME = 'Sample'
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
  const rsrcPath = `${rsrcFolderPath}/${rsrcName}`

  if (!fs.existsSync(rsrcFolderPath)) {
    logger.fatal(
      `[Error] Resource Folder does not exist at the location: ${apiFolderPath}/`
    )
    process.exit()
  }

  if (fs.existsSync(rsrcPath)) {
    logger.fatal(
      `[Error] Resource already exists at the location: ${rsrcFolderPath}/`
    )
    process.exit()
  }

  const routesPath = `${apiFolderPath}/routes`
  if (!fs.existsSync(routesPath)) {
    logger.fatal(
      `[Error] Routes Folder does not exist at the location: ${apiFolderPath}/`
    )
    process.exit()
  }

  if (!routerMountPath) {
    const ROUTER_MOUNT_PATH = '/samples'
    routerMountPath = inputReader('Router Mount Path', ROUTER_MOUNT_PATH, true)
  }

  // Create Resource Folder
  new CliCommand('Create Resource Folder', `mkdir ${rsrcPath}`).exec(false)

  // Create Resource Model
  new CliCommand('Create Resource Model', 'echo')
    .append(_getModelFile(rsrcName))
    .append(`> ${rsrcPath}/${rsrcName}.Model.mjs`)
    .exec(false)

  // Create Resource Controller
  new CliCommand('Create Resource Controller', 'echo')
    .append(_getControllerFile(rsrcName))
    .append(`> ${rsrcPath}/${rsrcName}.Controller.mjs`)
    .exec(false)

  // Create Resource Router
  new CliCommand('Create Resource Router', 'echo')
    .append(_getRouterFile(rsrcName))
    .append(`> ${rsrcPath}/${rsrcName}.Router.mjs`)
    .exec(false)

  // Create Resource index
  new CliCommand('Create Resource index', 'echo')
    .append(_getIndexFile(rsrcName))
    .append(`> ${rsrcPath}/index.mjs`)
    .exec(false)

  // Create API Router
  new CliCommand('Create API Router', 'echo')
    .append(_getApiRouterFile(rsrcName))
    .append(`> ${routesPath}/${rsrcName}.mjs`)
    .exec(false)

  // Read Routes Index
  const routesIndexFile = _getRoutesIndexFile(routesPath)
  const newRoutesIndexFile = _buildNewRoutesIndex(
    routesIndexFile,
    rsrcName,
    routerMountPath
  )

  // Rewrite Routes Index
  new CliCommand('Rewrite Routes Index', 'echo')
    .append(`"${newRoutesIndexFile}"`)
    .append(`> ${routesPath}/index.mjs`)
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

function _getApiRouterFile(rsrcName: string): string {
  return `"import Express from 'express'
import { ${rsrcName}Router as RouterClass } from '../resources/${rsrcName}/index.mjs'

const config = {
  routesConfig: {
    route: { enabled: true }
  }
}

const Router = new Express.Router()
const ${rsrcName}Router = new RouterClass(Router, config)

export default ${rsrcName}Router"`
}

function _getRoutesIndexFile(routesPath: string): string {
  try {
    const indexRoutesFile = fs
      .readFileSync(`${routesPath}/index.mjs`)
      .toString('utf8')

    if (!indexRoutesFile.length) {
      logger.warn(`[Warn] Router Entry in ${routesPath}/index.mjs failed!`)
      process.exit()
    }

    return indexRoutesFile
  } catch (error) {
    logger.warn(`[Warn] Router Entry in ${routesPath}/index.mjs failed!`)
    logger.fatal(`[Error] Failed to read file: ${routesPath}/index.mjs`)
    process.exit()
  }
}

function _buildNewRoutesIndex(
  routesIndexFile: string,
  rsrcName: string,
  routerMountPath: string
): string {
  const imports: string[] = routesIndexFile.match(/(\/\/.*?)?import.+/g) || []
  imports.push(`import ${rsrcName}Router from './${rsrcName}.mjs'`)
  const importsString = imports.join('\n')

  const paths: string[] = routesIndexFile.match(/(\/\/.*?)?{ path:.*}/g) || []
  paths.push(`{ path: '${routerMountPath}', router: ${rsrcName}Router }`)
  const pathsString = paths.map(path => '  ' + path).join(',\n')

  return `${importsString}

const Routes = [
${pathsString}
]

export default Routes`
}
