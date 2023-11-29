const CRUD_ROUTER_PARTIAL = `import {rsrcName}CrudController from '../{rsrcName}.Controller/Crud.Controller.mjs'

const { create, list, findById, updateById, removeById } = {rsrcName}CrudController

const {rsrcName}CrudRoutes = {
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

export default {rsrcName}CrudRoutes`

export default CRUD_ROUTER_PARTIAL
