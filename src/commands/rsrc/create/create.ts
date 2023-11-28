import yargs, { Arguments } from 'yargs'
import { colorify, logger } from '../../../lib/logger'
import builder from './helpers/builder'
import getCreateParams from './helpers/getCreateParams'
import createFiles from './helpers/createFiles'
import { CreateFilesParams } from './TYPES'

const COMMAND = 'rsrc-create'

yargs.command(
  COMMAND,
  colorify.trace('Create a Basic Backend Resource'),
  builder,
  handler
)

async function handler(argv: Arguments) {
  logger.initiate(`[${COMMAND}] Initiating...`)

  const createParams = getCreateParams(argv)

  const createFilesParams: CreateFilesParams = {
    createParams,
    modelGenerator,
    controllerGenerator,
    routerGenerator,
    indexGenerator,
    apiRouterGenerator,
    routesIndexEntry: true
  }

  createFiles(createFilesParams)

  logger.complete(`[${COMMAND}] Completed!`)
}

function modelGenerator(rsrcName: string): string {
  return `const ${rsrcName}Model = {
  routeLogic
}

async function routeLogic() {}

export default ${rsrcName}Model`
}

function controllerGenerator(rsrcName: string): string {
  return `import { ResponseBody } from '@am92/express-utils'
import ${rsrcName}Model from './${rsrcName}.Model.mjs'

const ${rsrcName}Controller = {
  routeHandler
}

async function routeHandler(request, response, next) {
  const data = await ${rsrcName}Model.routeLogic()
  const responseBody = new ResponseBody(200, 'Route Logic Successful', data)
  response.body = responseBody
  process.nextTick(next)
}

export default ${rsrcName}Controller`
}

function routerGenerator(rsrcName: string): string {
  return `import { configureRouter } from '@am92/express-utils'
import ${rsrcName}Controller from './${rsrcName}.Controller.mjs'

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

export default ${rsrcName}Router`
}

function indexGenerator(rsrcName: string): string {
  return `import ${rsrcName}Model from './${rsrcName}.Model.mjs'
import ${rsrcName}Controller from './${rsrcName}.Controller.mjs'
import ${rsrcName}Router from './${rsrcName}.Router.mjs'

export { ${rsrcName}Model, ${rsrcName}Controller, ${rsrcName}Router }`
}

function apiRouterGenerator(rsrcName: string): string {
  return `import Express from 'express'
import { ${rsrcName}Router as RouterClass } from '../resources/${rsrcName}/index.mjs'

const config = {
  routesConfig: {
    route: { enabled: true }
  }
}

const Router = new Express.Router()
const ${rsrcName}Router = new RouterClass(Router, config)

export default ${rsrcName}Router`
}
