const CRUD_MODEL_PARTIAL = `import {rsrcName}Odm from './{rsrcName}.Odm.mjs'

const { createOne, list, findById, updateById, removeById } = {rsrcName}Odm

const {rsrcName}CrudModel = {
  create: createOne,
  list,
  findById,
  updateById,
  removeById
}

export default {rsrcName}CrudModel`

export default CRUD_MODEL_PARTIAL
