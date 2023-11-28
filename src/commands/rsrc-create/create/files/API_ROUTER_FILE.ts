const API_ROUTER_FILE = `import Express from 'express'
import { {rsrcName}Router as RouterClass } from '../resources/{rsrcName}/index.mjs'

const config = {
  routesConfig: {
    route: { enabled: true }
  }
}

const Router = new Express.Router()
const {rsrcName}Router = new RouterClass(Router, config)

export default {rsrcName}Router`

export default API_ROUTER_FILE
