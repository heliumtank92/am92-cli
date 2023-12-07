const ROUTER = `import { configureRouter } from '@am92/express-utils'
import {rsrcName}Controller from './{rsrcName}.Controller.mjs'

const { create, list, findById, updateById, removeById } = {rsrcName}Controller

const masterConfig = {
  routerName: '{rsrcName}',
  preMiddlewares = [],
  postMiddlewares = [],
  routesConfig: {
    create: {
      method: 'post',
      path: '/',
      pipeline: [create]
    },
    list: {
      method: 'get',
      path: '/',
      pipeline: [list]
    },
    findById: {
      method: 'get',
      path: '/:id',
      pipeline: [findById]
    },
    updateById: {
      method: 'patch',
      path: '/:id',
      pipeline: [updateById]
    },
    removeById: {
      method: 'delete',
      path: '/:id',
      pipeline: [removeById]
    }
  }
}

export default class {rsrcName}Router {
  constructor(Router, customConfig) {
    const resourceRouter = configureRouter(Router, masterConfig, customConfig)
    return resourceRouter
  }
}`

export default ROUTER
