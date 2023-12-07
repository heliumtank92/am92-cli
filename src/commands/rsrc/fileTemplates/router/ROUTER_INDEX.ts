const ROUTER_INDEX = `import { configureRouter } from '@am92/express-utils'

const masterConfig = {
  routerName: '{rsrcName}',
  preMiddlewares = [],
  postMiddlewares = [],
  routesConfig: {}
}

export default class {rsrcName}Router {
  constructor(Router, customConfig) {
    const resourceRouter = configureRouter(Router, masterConfig, customConfig)
    return resourceRouter
  }
}`

export default ROUTER_INDEX
