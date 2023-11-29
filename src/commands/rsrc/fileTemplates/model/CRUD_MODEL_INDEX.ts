const CRUD_MODEL_INDEX = `import {rsrcName}CrudModel from './Crud.Model.mjs'

const {rsrcName}Model = {
  ...{rsrcName}CrudModel
}

export default {rsrcName}Model`

export default CRUD_MODEL_INDEX
