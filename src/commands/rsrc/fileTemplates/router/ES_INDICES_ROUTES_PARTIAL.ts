const ES_INDICES_ROUTES_PARTIAL = `import IndicesController from '../{rsrcName}.Controller/Indices.Controller.mjs'

const { createIndices, removeIndices, indicesExists } = IndicesController

const IndicesRoutes = {
  createIndices: {
    method: 'POST',
    path: '/create-indices',
    pipeline: [createIndices]
  },
  removeIndices: {
    method: 'POST',
    path: '/remove-indices',
    pipeline: [removeIndices]
  },
  indicesExists: {
    method: 'GET',
    path: '/indices-exists',
    pipeline: [indicesExists]
  }
}

export default IndicesRoutes`

export default ES_INDICES_ROUTES_PARTIAL
