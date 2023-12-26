const ES_INDICES_CONTROLLER_PARTIAL = `import { ResponseBody } from '@am92/express-utils'
import IndicesModel from '../{rsrcName}.Model/Indices.Model.mjs'

const IndicesController = {
  createIndices,
  removeIndices,
  indicesExists
}

export default IndicesController

async function createIndices(request, response, next) {
  const data = await IndicesModel.createIndices()
  const responseBody = new ResponseBody(200, '{rsrcName} Create Indices Successful', data)
  response.body = responseBody
  process.nextTick(next)
}

async function removeIndices(request, response, next) {
  const data = await IndicesModel.removeIndices()
  const responseBody = new ResponseBody(200, '{rsrcName} Remove Indices Successful', data)
  response.body = responseBody
  process.nextTick(next)
}

async function indicesExists(request, response, next) {
  const data = await IndicesModel.indicesExists()
  const responseBody = new ResponseBody(200, '{rsrcName} Indices Exists Successful', data)
  response.body = responseBody
  process.nextTick(next)
}`

export default ES_INDICES_CONTROLLER_PARTIAL
