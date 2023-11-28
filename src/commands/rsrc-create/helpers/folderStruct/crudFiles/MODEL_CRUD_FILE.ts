const MODEL_CRUD_FILE = `import {rsrcName}Odm from './{rsrcName}Odm.mjs'

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

export default MODEL_CRUD_FILE
