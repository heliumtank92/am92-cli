const ROUTER_INDEX_FILE = `import { configureRouter } from '@am92/express-utils'
import CrudRoutes from './Crud.Routes.mjs'

const masterConfig = {
  routerName: '{rsrcName}',
  routesConfig: {
    ...CrudRoutes
  }
}

export default class {rsrcName}Router {
  constructor(Router, customConfig) {
    const resourceRouter = configureRouter(Router, masterConfig, customConfig)
    return resourceRouter
  }
}`

export default ROUTER_INDEX_FILE
