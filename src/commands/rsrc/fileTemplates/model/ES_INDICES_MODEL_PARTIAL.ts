const ES_INDICES_MODEL_PARTIAL = `import {rsrcName}Odm from './{rsrcName}.Odm.mjs'

const { createIndices, removeIndices, indicesExists } = {rsrcName}Odm

const IndicesModel = { createIndices, removeIndices, indicesExists }

export default IndicesModel`

export default ES_INDICES_MODEL_PARTIAL
