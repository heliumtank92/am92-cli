const CRUD_ROUTER_INDEX = `import { configureRouter } from '@am92/express-utils'
import {rsrcName}CrudRoutes from './Crud.Routes.mjs'

const masterConfig = {
  routerName: '{rsrcName}',
  routesConfig: {
    ...{rsrcName}CrudRoutes
  }
}

export default class {rsrcName}Router {
  constructor(Router, customConfig) {
    const resourceRouter = configureRouter(Router, masterConfig, customConfig)
    return resourceRouter
  }
}`

export default CRUD_ROUTER_INDEX
