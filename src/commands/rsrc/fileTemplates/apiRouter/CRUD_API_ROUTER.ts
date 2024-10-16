const CRUD_API_ROUTER = `import Express from 'express'
import { {rsrcName}Router as RouterClass } from '../resources/{rsrcName}/index.mjs'

const config = {
  routesConfig: {
    create: { enabled: true },
    list: { enabled: true },
    findById: { enabled: true },
    updateById: { enabled: true },
    removeById: { enabled: true }
  }
}

const Router = new Express.Router()
const {rsrcName}Router = new RouterClass(Router, config)

export default {rsrcName}Router`

export default CRUD_API_ROUTER
