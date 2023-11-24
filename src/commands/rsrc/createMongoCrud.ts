import yargs, { Arguments } from 'yargs'
import fs from 'fs'
import CliCommand from '../../lib/CliCommand'
import inputReader from '../../lib/inputReader'
import { colorify, logger } from '../../lib/logger'

const COMMAND = 'rsrc-create-mongo-crud'

yargs.command(
  COMMAND,
  colorify.trace('Create a Backend Resource with MongoOdm CRUD'),
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

  // Create Resource Folder
  new CliCommand('Create Resource Folder', `mkdir ${rsrcPath}`).exec(false)

  // Create Resource Schema
  new CliCommand('Create Resource Schema', 'echo')
    .append(_getSchemaFile(rsrcName))
    .append(`> ${rsrcPath}/${rsrcName}.Schema.mjs`)
    .exec(false)

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

  logger.complete(`[${COMMAND}] Completed!`)
}

function _getSchemaFile(rsrcName: string): string {
  return `"import { buildSchema } from '@am92/mongo-odm'

const ${rsrcName}SchemaObject = {
  // Schema Properties as defined by mongoose Schema Class
}

const schemaOptions = {}

const ${rsrcName}Schema = buildSchema(${rsrcName}SchemaObject, schemaOptions)

export default ${rsrcName}Schema"`
}

function _getModelFile(rsrcName: string): string {
  return `"import { Model } from '@am92/mongo-odm'
import ${rsrcName}Schema from './${rsrcName}Schema.mjs'

const ${rsrcName}Odm = new Model('${rsrcName}', ${rsrcName}Schema)
const { createOne, list, findById, updateById, removeById } = ${rsrcName}Odm

const ${rsrcName}Model = {
  create: createOne,
  list: list,
  findById: findById,
  updateById: updateById,
  removeById: removeById
}

export default ${rsrcName}Model"`
}

function _getControllerFile(rsrcName: string): string {
  return `"import { ResponseBody } from '@am92/express-utils'
import ${rsrcName}Model from './${rsrcName}.Model'

const ${rsrcName}Controller = {
  create,
  list,
  findById,
  updateById,
  removeById
}

async function create(request, response, next) {
  const { body } = request
  const data = await ${rsrcName}Model.create(body)
  const responseBody = new ResponseBody(200, '${rsrcName} Create Successful', data)
  response.body = responseBody
  process.nextTick(next)
}

async function list(request, response, next) {
  const data = await ${rsrcName}Model.list()
  const responseBody = new ResponseBody(200, '${rsrcName} List Successful', data)
  response.body = responseBody
  process.nextTick(next)
}

async function findById(request, response, next) {
  const {
    params: { id }
  } = request
  const data = await ${rsrcName}Model.findById(id)
  const responseBody = new ResponseBody(200, '${rsrcName} Find Successful', data)
  response.body = responseBody
  process.nextTick(next)
}

async function updateById(request, response, next) {
  const {
    params: { id },
    body
  } = request
  const data = await ${rsrcName}Model.updateById(id, body)
  const responseBody = new ResponseBody(200, '${rsrcName} Update Successful', data)
  response.body = responseBody
  process.nextTick(next)
}

async function removeById(request, response, next) {
  const {
    params: { id }
  } = request
  const data = await ${rsrcName}Model.removeById(id)
  const responseBody = new ResponseBody(200, '${rsrcName} Remove Successful', data)
  response.body = responseBody
  process.nextTick(next)
}

export default ${rsrcName}Controller"`
}

function _getRouterFile(rsrcName: string): string {
  return `"import { configureRouter } from '@am92/express-utils'
import ${rsrcName}Controller from './${rsrcName}.Controller'

const { create, list, findById, updateById, removeById } = ${rsrcName}Controller

const masterConfig = {
  routerName: '${rsrcName}',
  routesConfig: {
    create: {
      method: 'post',
      path: '/',
      pipeline: [create]
    },
    list: {
      method: 'get',
      path: '/',
      pipeline: [list]
    },
    findById: {
      method: 'get',
      path: '/:id',
      pipeline: [findById]
    },
    updateById: {
      method: 'put',
      path: '/:id',
      pipeline: [updateById]
    },
    removeById: {
      method: 'delete',
      path: '/:id',
      pipeline: [removeById]
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
  return `"import ${rsrcName}Schema from './${rsrcName}.Schema.mjs'
import ${rsrcName}Model from './${rsrcName}.Model.mjs'
import ${rsrcName}Controller from './${rsrcName}.Controller.mjs'
import ${rsrcName}Router from './${rsrcName}.Router.mjs'

export { ${rsrcName}Schema, ${rsrcName}Model, ${rsrcName}Controller, ${rsrcName}Router }"`
}

function _getApiRouterFile(rsrcName: string): string {
  return `"import Express from 'express'
import { ${rsrcName}Router as RouterClass } from '../resources/${rsrcName}/index.mjs'

const config = {
  routesConfig: {
    create: { enabled: true },
    list: { enabled: true },
    findById: { enabled: true },
    updateById: { enabled: true },
    removeById: { enabled: true }
  }
}

const Router = new Express.Router()
const ${rsrcName}Router = new RouterClass(Router, config)

export default ${rsrcName}Router"`
}
