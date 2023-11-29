const API_ROUTER = `import Express from 'express'
import { {rsrcName}Router as RouterClass } from '../resources/{rsrcName}/index.mjs'

const config = {
  routesConfig: {}
}

const Router = new Express.Router()
const {rsrcName}Router = new RouterClass(Router, config)

export default {rsrcName}Router`

export default API_ROUTER
