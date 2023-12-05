const CRUD_MODEL_PARTIAL = `import {rsrcName}Odm from './{rsrcName}.Odm.mjs'

const { createOne, list, findById, updateById, removeById } = {rsrcName}Odm

const CrudModel = {
  create: createOne,
  list,
  findById,
  updateById,
  removeById
}

export default CrudModel`

export default CRUD_MODEL_PARTIAL
