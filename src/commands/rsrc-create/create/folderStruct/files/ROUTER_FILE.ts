const ROUTER_FILE = `import { configureRouter } from '@am92/express-utils'

const masterConfig = {
  routerName: '{rsrcName}',
  routesConfig: {}
}

export default class {rsrcName}Router {
  constructor(Router, customConfig) {
    const resourceRouter = configureRouter(Router, masterConfig, customConfig)
    return resourceRouter
  }
}`

export default ROUTER_FILE
