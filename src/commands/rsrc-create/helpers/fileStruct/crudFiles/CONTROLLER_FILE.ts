const CONTROLLER_FILE = `import { ResponseBody } from '@am92/express-utils'
import {rsrcName}Model from './{rsrcName}.Model.mjs'

const {rsrcName}Controller = {
  create,
  list,
  findById,
  updateById,
  removeById
}

export default {rsrcName}Controller

async function create(request, response, next) {
  const { body } = request
  const data = await {rsrcName}Model.create(body)
  const responseBody = new ResponseBody(200, '{rsrcName} Create Successful', data)
  response.body = responseBody
  process.nextTick(next)
}

async function list(request, response, next) {
  const data = await {rsrcName}Model.list()
  const responseBody = new ResponseBody(200, '{rsrcName} List Successful', data)
  response.body = responseBody
  process.nextTick(next)
}

async function findById(request, response, next) {
  const {
    params: { id }
  } = request
  const data = await {rsrcName}Model.findById(id)
  const responseBody = new ResponseBody(200, '{rsrcName} Find Successful', data)
  response.body = responseBody
  process.nextTick(next)
}

async function updateById(request, response, next) {
  const {
    params: { id },
    body
  } = request
  const data = await {rsrcName}Model.updateById(id, body)
  const responseBody = new ResponseBody(200, '{rsrcName} Update Successful', data)
  response.body = responseBody
  process.nextTick(next)
}

async function removeById(request, response, next) {
  const {
    params: { id }
  } = request
  const data = await {rsrcName}Model.removeById(id)
  const responseBody = new ResponseBody(200, '{rsrcName} Remove Successful', data)
  response.body = responseBody
  process.nextTick(next)
}`

export default CONTROLLER_FILE
