const CRUD_ROUTER_PARTIAL = `import CrudController from '../{rsrcName}.Controller/Crud.Controller.mjs'

const { create, list, findById, updateById, removeById } = CrudController

const CrudRoutes = {
  create: {
    method: 'POST',
    path: '/',
    pipeline: [create]
  },
  list: {
    method: 'GET',
    path: '/',
    pipeline: [list]
  },
  findById: {
    method: 'GET',
    path: '/:id',
    pipeline: [findById]
  },
  updateById: {
    method: 'PATCH',
    path: '/:id',
    pipeline: [updateById]
  },
  removeById: {
    method: 'DELETE',
    path: '/:id',
    pipeline: [removeById]
  }
}

export default CrudRoutes`

export default CRUD_ROUTER_PARTIAL
