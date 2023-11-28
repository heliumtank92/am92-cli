import yargs, { Arguments } from 'yargs'
import { colorify, logger } from '../../../lib/logger'
import { kebabCase } from '../../../lib/changeCase'
import builder from './helpers/builder'
import getCreateParams from './helpers/getCreateParams'
import createFiles from './helpers/createFiles'
import { CreateFilesParams } from './TYPES'

const COMMAND = 'rsrc-create-es-crud'

yargs.command(
  COMMAND,
  colorify.trace('Create a Backend CRUD Resource with OpensearchOdm'),
  builder,
  handler
)

async function handler(argv: Arguments) {
  logger.initiate(`[${COMMAND}] Initiating...`)

  const createParams = getCreateParams(argv)

  const createFilesParams: CreateFilesParams = {
    createParams,
    constantsGenerator,
    schemaGenerator,
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

function constantsGenerator(rsrcName: string): string {
  return `export const INDEX = '${kebabCase(rsrcName)}'
export const MODEL_NAME = '${rsrcName}'`
}

function schemaGenerator(rsrcName: string): string {
  return `import { Schema } from '@am92/opensearch-odm'
import { INDEX } from './${rsrcName}.Constants.mjs'

const properties = {
  // Schema Properties
}

const ${rsrcName}Schema = new Schema(INDEX, properties)

export default ${rsrcName}Schema`
}

function modelGenerator(rsrcName: string): string {
  return `import { Model } from '@am92/opensearch-odm'
import ${rsrcName}Schema from './${rsrcName}.Schema.mjs'
import { MODEL_NAME } from './${rsrcName}.Constants.mjs'

const ${rsrcName}Odm = new Model(MODEL_NAME, ${rsrcName}Schema)
const {
  createIndices,
  removeIndices,
  indicesExists,
  createOne,
  list,
  findById,
  updateById,
  removeById
} = ${rsrcName}Odm

const ${rsrcName}Model = {
  createIndices,
  removeIndices,
  indicesExists,
  create: createOne,
  list,
  findById,
  updateById,
  removeById
}

export default ${rsrcName}Model`
}

function controllerGenerator(rsrcName: string): string {
  return `import { ResponseBody } from '@am92/express-utils'
import ${rsrcName}Model from './${rsrcName}.Model.mjs'

const ${rsrcName}Controller = {
  createIndices,
  removeIndices,
  indicesExists,
  create,
  list,
  findById,
  updateById,
  removeById
}

async function createIndices(request, response, next) {
  const data = await ${rsrcName}Model.createIndices()
  const responseBody = new ResponseBody(201, '${rsrcName} Index Create Successful', data)
  response.body = responseBody
  process.nextTick(next)
}

async function removeIndices(request, response, next) {
  const data = await ${rsrcName}Model.removeIndices()
  const responseBody = new ResponseBody(200, '${rsrcName} Index Remove Successful', data)
  response.body = responseBody
  process.nextTick(next)
}

async function indicesExists(request, response, next) {
  const data = await ${rsrcName}Model.indicesExists()
  const responseBody = new ResponseBody(200, '${rsrcName} Index Exists Successful', data)
  response.body = responseBody
  process.nextTick(next)
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

export default ${rsrcName}Controller`
}

function routerGenerator(rsrcName: string): string {
  return `import { configureRouter } from '@am92/express-utils'
import ${rsrcName}Controller from './${rsrcName}.Controller.mjs'

const {
  createIndices,
  removeIndices,
  indicesExists,
  create,
  list,
  findById,
  updateById,
  removeById
} = ${rsrcName}Controller

const masterConfig = {
  routerName: '${rsrcName}',
  routesConfig: {
    createIndices: {
      method: 'post',
      path: '/indices',
      pipeline: [createIndices]
    },
    removeIndices: {
      method: 'delete',
      path: '/indices',
      pipeline: [removeIndices]
    },
    indicesExists: {
      method: 'get',
      path: '/indices',
      pipeline: [indicesExists]
    },
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

export default ${rsrcName}Router`
}

function indexGenerator(rsrcName: string): string {
  return `import ${rsrcName}Schema from './${rsrcName}.Schema.mjs'
import ${rsrcName}Model from './${rsrcName}.Model.mjs'
import ${rsrcName}Controller from './${rsrcName}.Controller.mjs'
import ${rsrcName}Router from './${rsrcName}.Router.mjs'

export { ${rsrcName}Schema, ${rsrcName}Model, ${rsrcName}Controller, ${rsrcName}Router }`
}

function apiRouterGenerator(rsrcName: string): string {
  return `import Express from 'express'
import { ${rsrcName}Router as RouterClass } from '../resources/${rsrcName}/index.mjs'

const config = {
  routesConfig: {
    createIndices: { enabled: true },
    removeIndices: { enabled: true },
    indicesExists: { enabled: true },
    create: { enabled: true },
    list: { enabled: true },
    findById: { enabled: true },
    updateById: { enabled: true },
    removeById: { enabled: true }
  }
}

const Router = new Express.Router()
const ${rsrcName}Router = new RouterClass(Router, config)

export default ${rsrcName}Router`
}
