const ROUTER_FILE = `import { configureRouter } from '@am92/express-utils'
import {rsrcName}Controller from './{rsrcName}.Controller.mjs'

const {} = {rsrcName}Controller

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
