const ES_CRUD_MODEL = `import { Model } from '@am92/opensearch-odm'
import {rsrcName}Schema from './{rsrcName}.Schema.mjs'
import { MODEL_NAME } from './{rsrcName}.Constants.mjs'

const {rsrcName}Odm = new Model(MODEL_NAME, {rsrcName}Schema)
const {
  createIndices,
  removeIndices,
  indicesExists,
  createOne,
  list,
  findById,
  updateById,
  removeById
} = {rsrcName}Odm

const {rsrcName}Model = {
  createIndices,
  removeIndices,
  indicesExists,
  create: createOne,
  list,
  findById,
  updateById,
  removeById
}

export default {rsrcName}Model`

export default ES_CRUD_MODEL
