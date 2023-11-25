import yargs, { Arguments } from 'yargs'
import { colorify, logger } from '../../../lib/logger'
import builder from './helpers/builder'
import getCreateParams from './helpers/getCreateParams'
import createFiles from './helpers/createFiles'
import { CreateFilesParams } from './TYPES'

const COMMAND = 'rsrc-create-mongo-crud'

yargs.command(
  COMMAND,
  colorify.trace('Create a Backend Resource with MongoOdm CRUD'),
  builder,
  handler
)

async function handler(argv: Arguments) {
  logger.initiate(`[${COMMAND}] Initiating...`)

  const createParams = getCreateParams(argv)

  const createFilesParams: CreateFilesParams = {
    createParams,
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

function schemaGenerator(rsrcName: string): string {
  return `"import { buildSchema } from '@am92/mongo-odm'

const schemaObject = {
  // Schema Properties as defined by mongoose Schema Class
}

const schemaOptions = {}

const ${rsrcName}Schema = buildSchema(${rsrcName}SchemaObject, schemaOptions)

export default ${rsrcName}Schema"`
}

function modelGenerator(rsrcName: string): string {
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

function controllerGenerator(rsrcName: string): string {
  return `"import { ResponseBody } from '@am92/express-utils'
import ${rsrcName}Model from './${rsrcName}.Model.mjs'

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

function routerGenerator(rsrcName: string): string {
  return `"import { configureRouter } from '@am92/express-utils'
import ${rsrcName}Controller from './${rsrcName}.Controller.mjs'

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

function indexGenerator(rsrcName: string): string {
  return `"import ${rsrcName}Schema from './${rsrcName}.Schema.mjs'
import ${rsrcName}Model from './${rsrcName}.Model.mjs'
import ${rsrcName}Controller from './${rsrcName}.Controller.mjs'
import ${rsrcName}Router from './${rsrcName}.Router.mjs'

export { ${rsrcName}Schema, ${rsrcName}Model, ${rsrcName}Controller, ${rsrcName}Router }"`
}

function apiRouterGenerator(rsrcName: string): string {
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
