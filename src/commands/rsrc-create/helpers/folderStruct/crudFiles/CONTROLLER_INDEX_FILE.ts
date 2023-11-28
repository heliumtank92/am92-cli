const CONTROLLER_INDEX_FILE = `import CrudController from './Crud.Controller.mjs'

const {rsrcName}Controller = {
  ...CrudController
}
export default {rsrcName}Controller`

export default CONTROLLER_INDEX_FILE
