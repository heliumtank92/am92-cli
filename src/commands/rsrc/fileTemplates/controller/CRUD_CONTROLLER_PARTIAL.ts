const CRUD_CONTROLLER_PARTIAL = `import { ResponseBody } from '@am92/express-utils'
import CrudModel from '../{rsrcName}.Model/Crud.Model.mjs'

const CrudController = {
  create,
  list,
  findById,
  updateById,
  removeById
}

export default CrudController

async function create(request, response, next) {
  const { body } = request
  const data = await CrudModel.create(body)
  const responseBody = new ResponseBody(200, '{rsrcName} Create Successful', data)
  response.body = responseBody
  process.nextTick(next)
}

async function list(request, response, next) {
  const data = await CrudModel.list()
  const responseBody = new ResponseBody(200, '{rsrcName} List Successful', data)
  response.body = responseBody
  process.nextTick(next)
}

async function findById(request, response, next) {
  const {
    params: { id }
  } = request
  const data = await CrudModel.findById(id)
  const responseBody = new ResponseBody(200, '{rsrcName} Find Successful', data)
  response.body = responseBody
  process.nextTick(next)
}

async function updateById(request, response, next) {
  const {
    params: { id },
    body
  } = request
  const data = await CrudModel.updateById(id, body)
  const responseBody = new ResponseBody(200, '{rsrcName} Update Successful', data)
  response.body = responseBody
  process.nextTick(next)
}

async function removeById(request, response, next) {
  const {
    params: { id }
  } = request
  const data = await CrudModel.removeById(id)
  const responseBody = new ResponseBody(200, '{rsrcName} Remove Successful', data)
  response.body = responseBody
  process.nextTick(next)
}`

export default CRUD_CONTROLLER_PARTIAL
