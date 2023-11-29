const CRUD_CONTROLLER_INDEX = `import {rsrcName}CrudController from './Crud.Controller.mjs'

const {rsrcName}Controller = {
  ...{rsrcName}CrudController
}
export default {rsrcName}Controller`

export default CRUD_CONTROLLER_INDEX
