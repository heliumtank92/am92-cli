const ROUTER_CRUD_FILE = `import {rsrcName}CrudController from '../{rsrcName}.Controller/Crud.Controller.mjs'

const { create, list, findById, updateById, removeById } = {rsrcName}CrudController

const CrudRoutes = {
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
    method: 'put',
    path: '/:id',
    pipeline: [updateById]
  },
  removeById: {
    method: 'delete',
    path: '/:id',
    pipeline: [removeById]
  }
}

export default CrudRoutes`

export default ROUTER_CRUD_FILE
